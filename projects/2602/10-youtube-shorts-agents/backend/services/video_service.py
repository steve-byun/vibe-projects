"""FFmpeg 영상 합성 서비스"""
import subprocess
import os
import ffmpeg as ffmpeg_lib

ZOOM_SCALE = 1.15
MOTION_PATTERNS = ['zoom_in', 'zoom_out', 'pan_left', 'pan_right']


class VideoService:
    def __init__(self, ffmpeg_path: str, ffprobe_path: str):
        self.ffmpeg_path = os.path.normpath(ffmpeg_path)
        self.ffprobe_path = os.path.normpath(ffprobe_path)

    def get_audio_duration(self, audio_path: str) -> float:
        try:
            probe = ffmpeg_lib.probe(audio_path, cmd=self.ffprobe_path)
            return float(probe['format']['duration'])
        except:
            return 0

    def get_video_duration(self, video_path: str) -> float:
        try:
            probe = ffmpeg_lib.probe(video_path, cmd=self.ffprobe_path)
            return float(probe['format']['duration'])
        except:
            return 0

    def create_shorts(
        self,
        background_videos: list,
        audio_path: str,
        subtitle_path: str,
        output_path: str,
        width: int = 1080,
        height: int = 1920,
        clip_duration: float = 2.5
    ) -> dict:
        audio_duration = self.get_audio_duration(audio_path)
        if audio_duration == 0:
            raise Exception("Failed to get audio duration")

        if len(background_videos) <= 1:
            self._create_single_clip(
                background_videos[0]["path"] if background_videos else "",
                audio_path, subtitle_path, output_path, width, height
            )
        else:
            self._create_multi_clip(
                background_videos, audio_path, subtitle_path, output_path,
                width, height, clip_duration, audio_duration
            )

        file_size = os.path.getsize(output_path) if os.path.exists(output_path) else 0
        return {
            "video_path": output_path,
            "duration": audio_duration,
            "file_size": file_size
        }

    def _create_single_clip(self, video_path, audio_path, subtitle_path, output_path, width, height):
        sub_escaped = subtitle_path.replace(chr(92), '/').replace(':', chr(92) + ':')
        sub_filter = f"[bg]subtitles='{sub_escaped}'[v]"

        cmd = [
            self.ffmpeg_path, '-y',
            '-stream_loop', '-1',
            '-i', video_path,
            '-i', audio_path,
            '-filter_complex',
            f"[0:v]scale={width}:{height}:force_original_aspect_ratio=increase,crop={width}:{height},setsar=1[bg];{sub_filter}",
            '-map', '[v]', '-map', '1:a',
            '-c:v', 'libx264', '-c:a', 'aac',
            '-preset', 'medium', '-crf', '23',
            '-shortest', '-movflags', 'faststart',
            output_path
        ]

        result = subprocess.run(cmd, capture_output=True, text=True)
        if result.returncode != 0:
            raise Exception(f"FFmpeg failed: {result.stderr[-500:]}")

    def _create_multi_clip(self, videos, audio_path, subtitle_path, output_path,
                           width, height, clip_duration, audio_duration):
        num_clips_needed = int(audio_duration / clip_duration) + 1
        num_videos = len(videos)

        if num_videos < num_clips_needed:
            clip_duration = audio_duration / num_videos
            num_clips = num_videos
        else:
            num_clips = num_clips_needed

        scaled_w = int(width * ZOOM_SCALE)
        scaled_h = int(height * ZOOM_SCALE)

        inputs = []
        filter_parts = []

        for i in range(num_clips):
            inputs.extend(['-i', videos[i]["path"]])
            pattern = MOTION_PATTERNS[i % len(MOTION_PATTERNS)]
            motion = self._get_motion_filter(pattern, clip_duration, width, height)
            filter_parts.append(
                f"[{i}:v]trim=duration={clip_duration},setpts=PTS-STARTPTS,"
                f"scale={scaled_w}:{scaled_h}:force_original_aspect_ratio=increase,"
                f"crop={scaled_w}:{scaled_h},"
                f"{motion},setsar=1[v{i}]"
            )

        audio_idx = num_clips
        inputs.extend(['-i', audio_path])

        concat_in = ''.join([f"[v{i}]" for i in range(num_clips)])
        filter_parts.append(f"{concat_in}concat=n={num_clips}:v=1:a=0[bg]")

        sub_escaped = subtitle_path.replace(chr(92), '/').replace(':', chr(92) + ':')
        filter_parts.append(f"[bg]subtitles='{sub_escaped}'[v]")

        cmd = [
            self.ffmpeg_path, '-y',
            *inputs,
            '-filter_complex', ';'.join(filter_parts),
            '-map', '[v]', '-map', f'{audio_idx}:a',
            '-c:v', 'libx264', '-c:a', 'aac',
            '-preset', 'medium', '-crf', '23',
            '-shortest', '-movflags', 'faststart',
            output_path
        ]

        result = subprocess.run(cmd, capture_output=True, text=True)
        if result.returncode != 0:
            raise Exception(f"FFmpeg failed: {result.stderr[-500:]}")

    @staticmethod
    def _get_motion_filter(pattern, clip_duration, width, height, fps=30):
        scaled_w = int(width * ZOOM_SCALE)
        scaled_h = int(height * ZOOM_SCALE)
        margin_x = scaled_w - width
        margin_y = scaled_h - height
        total_frames = max(1, int(clip_duration * fps))
        half_mx = margin_x // 2
        half_my = margin_y // 2

        if pattern == 'zoom_in':
            return f"crop={width}:{height}:x={half_mx}*n/{total_frames}:y={half_my}*n/{total_frames}"
        elif pattern == 'zoom_out':
            return f"crop={width}:{height}:x={half_mx}-{half_mx}*n/{total_frames}:y={half_my}-{half_my}*n/{total_frames}"
        elif pattern == 'pan_left':
            return f"crop={width}:{height}:x={margin_x}-{margin_x}*n/{total_frames}:y={half_my}"
        elif pattern == 'pan_right':
            return f"crop={width}:{height}:x={margin_x}*n/{total_frames}:y={half_my}"
        else:
            return f"crop={width}:{height}:{half_mx}:{half_my}"
