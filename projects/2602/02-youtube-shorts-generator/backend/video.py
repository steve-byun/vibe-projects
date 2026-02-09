"""FFmpeg 영상 합성 모듈"""
import ffmpeg
import os
import subprocess
import json

# config에서 ffmpeg 경로 로드
CONFIG_PATH = os.path.join(os.path.dirname(__file__), "config.json")

# 배경 움직임 효과 설정
ZOOM_SCALE = 1.15  # 확대 비율 (1.15 = 15% 더 크게)
# 움직임 패턴: zoom_in, zoom_out, pan_left, pan_right, pan_up, pan_down
MOTION_PATTERNS = ['zoom_in', 'zoom_out', 'pan_left', 'pan_right']

def get_ffmpeg_path():
    """config.json에서 ffmpeg 경로 가져오기"""
    try:
        with open(CONFIG_PATH, 'r', encoding='utf-8') as f:
            config = json.load(f)
        path = config.get("ffmpeg_path", "ffmpeg")
        # 상대 경로면 절대 경로로 변환
        if not os.path.isabs(path):
            path = os.path.join(os.path.dirname(__file__), path)
        return os.path.normpath(path)
    except:
        return "ffmpeg"

def get_ffprobe_path():
    """ffprobe 경로 (ffmpeg와 같은 폴더)"""
    ffmpeg_path = get_ffmpeg_path()
    # 파일명만 교체 (폴더 경로는 유지)
    folder = os.path.dirname(ffmpeg_path)
    return os.path.join(folder, "ffprobe.exe")

def get_video_duration(video_path: str) -> float:
    """비디오 길이 조회"""
    try:
        probe = ffmpeg.probe(video_path, cmd=get_ffprobe_path())
        return float(probe['format']['duration'])
    except Exception as e:
        print(f"Error probing video: {e}")
        return 0

def get_audio_duration(audio_path: str) -> float:
    """오디오 길이 조회"""
    try:
        probe = ffmpeg.probe(audio_path, cmd=get_ffprobe_path())
        return float(probe['format']['duration'])
    except Exception as e:
        print(f"Error probing audio: {e}")
        return 0

def create_shorts_video(
    background_videos: list,
    audio_path: str,
    subtitle_path: str,
    output_path: str,
    width: int = 1080,
    height: int = 1920
) -> str:
    """쇼츠 영상 합성"""

    audio_duration = get_audio_duration(audio_path)

    if audio_duration == 0:
        raise Exception("Failed to get audio duration")

    # 배경 영상 연결 및 루프 처리
    bg_inputs = []
    total_bg_duration = 0

    for bg in background_videos:
        bg_duration = get_video_duration(bg["path"])
        if bg_duration > 0:
            bg_inputs.append(bg["path"])
            total_bg_duration += bg_duration

    if not bg_inputs:
        raise Exception("No valid background videos")

    # FFmpeg 명령어 구성
    # 1. 배경 영상 연결
    # 2. 9:16 크롭
    # 3. 오디오 오버레이
    # 4. 자막 오버레이

    temp_bg_path = output_path.replace(".mp4", "_temp_bg.mp4")

    # 배경 영상 연결 및 크롭
    inputs = [ffmpeg.input(bg) for bg in bg_inputs]

    if len(inputs) == 1:
        video_stream = inputs[0].video
    else:
        # 여러 영상 연결
        video_stream = ffmpeg.concat(*[i.video for i in inputs], v=1, a=0)

    # 9:16 크롭 및 스케일
    video_stream = (
        video_stream
        .filter('scale', w=f'if(gt(a,{width}/{height}),{height}*a,{width})', h=f'if(gt(a,{width}/{height}),{height},{width}/a)')
        .filter('crop', width, height)
        .filter('setsar', 1)
    )

    # 오디오 길이에 맞춰 루프 또는 트림
    if total_bg_duration < audio_duration:
        # 루프 필요
        video_stream = video_stream.filter('loop', loop=-1, size=32767)

    video_stream = video_stream.filter('trim', duration=audio_duration)
    video_stream = video_stream.filter('setpts', 'PTS-STARTPTS')

    # 오디오 입력
    audio_stream = ffmpeg.input(audio_path).audio

    # 자막 오버레이 (ASS 스타일)
    subtitle_style = "FontName=Arial,FontSize=24,PrimaryColour=&HFFFFFF,OutlineColour=&H000000,Outline=2,Alignment=2"
    video_stream = video_stream.filter('subtitles', subtitle_path, force_style=subtitle_style)

    # 최종 출력
    output = ffmpeg.output(
        video_stream,
        audio_stream,
        output_path,
        vcodec='libx264',
        acodec='aac',
        preset='medium',
        crf=23,
        movflags='faststart',
        **{'shortest': None}
    )

    # 실행
    try:
        output.overwrite_output().run(capture_stdout=True, capture_stderr=True)
    except ffmpeg.Error as e:
        print(f"FFmpeg error: {e.stderr.decode()}")
        raise

    return output_path

def create_simple_shorts(
    background_video: str,
    audio_path: str,
    subtitle_path: str,
    output_path: str,
    width: int = 1080,
    height: int = 1920,
    background_videos: list = None,
    clip_duration: float = 2.0
) -> str:
    """쇼츠 영상 생성 (여러 배경 영상을 2초씩 전환)"""

    audio_duration = get_audio_duration(audio_path)
    ffmpeg_path = get_ffmpeg_path()
    print(f"Using FFmpeg: {ffmpeg_path}")

    # 여러 영상이 있으면 2초씩 잘라서 연결
    if background_videos and len(background_videos) > 1:
        return create_multi_clip_shorts(
            background_videos=background_videos,
            audio_path=audio_path,
            subtitle_path=subtitle_path,
            output_path=output_path,
            width=width,
            height=height,
            clip_duration=clip_duration
        )

    # 단일 영상인 경우 기존 로직
    subtitle_path_escaped = subtitle_path.replace(chr(92), '/').replace(':', chr(92)+':')

    # ASS 파일이면 force_style 제거 (ASS 자체 스타일 사용)
    if subtitle_path.endswith('.ass'):
        subtitle_filter = f"[bg]subtitles='{subtitle_path_escaped}'[v]"
    else:
        subtitle_filter = f"[bg]subtitles='{subtitle_path_escaped}':force_style='FontName=Arial,FontSize=22,PrimaryColour=&HFFFFFF,OutlineColour=&H000000,Outline=2,Alignment=2,MarginV=80'[v]"

    cmd = [
        ffmpeg_path, '-y',
        '-stream_loop', '-1',
        '-i', background_video,
        '-i', audio_path,
        '-filter_complex',
        f"[0:v]scale={width}:{height}:force_original_aspect_ratio=increase,crop={width}:{height},setsar=1[bg];{subtitle_filter}",
        '-map', '[v]',
        '-map', '1:a',
        '-c:v', 'libx264',
        '-c:a', 'aac',
        '-preset', 'medium',
        '-crf', '23',
        '-shortest',
        '-movflags', 'faststart',
        output_path
    ]

    print(f"Running FFmpeg: {' '.join(cmd)}")
    result = subprocess.run(cmd, capture_output=True, text=True)

    if result.returncode != 0:
        print(f"FFmpeg stderr: {result.stderr}")
        raise Exception(f"FFmpeg failed with code {result.returncode}")

    return output_path


def get_motion_filter(pattern: str, clip_duration: float, width: int, height: int, fps: int = 30) -> str:
    """움직임 패턴에 따른 FFmpeg 필터 생성 (프레임 기반)

    Args:
        pattern: 움직임 패턴 (zoom_in, zoom_out, pan_left, pan_right)
        clip_duration: 클립 길이 (초)
        width: 출력 너비
        height: 출력 높이
        fps: 프레임 레이트

    Returns:
        FFmpeg 필터 문자열
    """
    # 확대된 크기 (15% 더 크게)
    scaled_w = int(width * ZOOM_SCALE)
    scaled_h = int(height * ZOOM_SCALE)
    margin_x = scaled_w - width  # 좌우 여유 공간
    margin_y = scaled_h - height  # 상하 여유 공간

    # 총 프레임 수
    total_frames = max(1, int(clip_duration * fps))
    half_margin_x = margin_x // 2
    half_margin_y = margin_y // 2

    # FFmpeg 표현식에서 나눗셈은 정수로 처리하기 위해 미리 계산
    # n/total_frames 대신 n*margin/total_frames 형태로 사용

    if pattern == 'zoom_in':
        # 줌 인: 가장자리에서 중앙으로
        # x: 0 → half_margin_x, y: 0 → half_margin_y
        crop_expr = f"crop={width}:{height}:x={half_margin_x}*n/{total_frames}:y={half_margin_y}*n/{total_frames}"
    elif pattern == 'zoom_out':
        # 줌 아웃: 중앙에서 가장자리로
        # x: half_margin_x → 0, y: half_margin_y → 0
        crop_expr = f"crop={width}:{height}:x={half_margin_x}-{half_margin_x}*n/{total_frames}:y={half_margin_y}-{half_margin_y}*n/{total_frames}"
    elif pattern == 'pan_left':
        # 왼쪽으로 팬: x가 margin에서 0으로
        crop_expr = f"crop={width}:{height}:x={margin_x}-{margin_x}*n/{total_frames}:y={half_margin_y}"
    elif pattern == 'pan_right':
        # 오른쪽으로 팬: x가 0에서 margin으로
        crop_expr = f"crop={width}:{height}:x={margin_x}*n/{total_frames}:y={half_margin_y}"
    else:
        # 기본: 중앙 고정
        crop_expr = f"crop={width}:{height}:{half_margin_x}:{half_margin_y}"

    return crop_expr


def create_multi_clip_shorts(
    background_videos: list,
    audio_path: str,
    subtitle_path: str,
    output_path: str,
    width: int = 1080,
    height: int = 1920,
    clip_duration: float = 2.5
) -> str:
    """여러 배경 영상을 2.5초씩 전환하는 쇼츠 생성 (움직임 효과 포함)"""

    audio_duration = get_audio_duration(audio_path)
    ffmpeg_path = get_ffmpeg_path()

    # 필요한 클립 수 계산
    num_clips_needed = int(audio_duration / clip_duration) + 1
    num_videos = len(background_videos)

    # 돌려쓰기 금지: 영상 수가 부족하면 클립 길이 조정
    if num_videos < num_clips_needed:
        # 영상 수에 맞춰 클립 길이 재계산
        clip_duration = audio_duration / num_videos
        num_clips = num_videos
        print(f"Warning: Not enough videos ({num_videos}), adjusting clip duration to {clip_duration:.1f}s")
    else:
        num_clips = num_clips_needed

    print(f"Audio duration: {audio_duration}s, using {num_clips} clips at {clip_duration:.1f}s each")

    # 확대된 크기 (움직임을 위한 여유 공간)
    scaled_w = int(width * ZOOM_SCALE)
    scaled_h = int(height * ZOOM_SCALE)

    # 입력 파일 목록 구성 (돌려쓰기 없이 순서대로 사용)
    inputs = []
    filter_parts = []

    for i in range(num_clips):
        video_path = background_videos[i]["path"]  # 돌려쓰기 없이 순서대로
        inputs.extend(['-i', video_path])

        # 움직임 패턴 선택 (순환)
        pattern = MOTION_PATTERNS[i % len(MOTION_PATTERNS)]
        motion_filter = get_motion_filter(pattern, clip_duration, width, height)

        # 각 영상: trim → scale(확대) → 중앙크롭 → 움직임크롭 → setsar
        # 1. trim: 클립 길이만큼 자르기
        # 2. scale: 움직임 여유 공간 확보를 위해 확대
        # 3. crop(scaled): 확대된 크기로 중앙 크롭 (비율 맞추기)
        # 4. motion_filter: 움직임 효과 (최종 크기로 동적 크롭)
        filter_parts.append(
            f"[{i}:v]trim=duration={clip_duration},setpts=PTS-STARTPTS,"
            f"scale={scaled_w}:{scaled_h}:force_original_aspect_ratio=increase,"
            f"crop={scaled_w}:{scaled_h},"
            f"{motion_filter},setsar=1[v{i}]"
        )

    # 오디오 입력 추가
    audio_input_idx = num_clips
    inputs.extend(['-i', audio_path])

    # 모든 클립 연결
    concat_inputs = ''.join([f"[v{i}]" for i in range(num_clips)])
    filter_parts.append(f"{concat_inputs}concat=n={num_clips}:v=1:a=0[bg]")

    # 자막 추가 (ASS 파일이면 force_style 제거)
    subtitle_path_escaped = subtitle_path.replace(chr(92), '/').replace(':', chr(92)+':')
    if subtitle_path.endswith('.ass'):
        filter_parts.append(f"[bg]subtitles='{subtitle_path_escaped}'[v]")
    else:
        filter_parts.append(
            f"[bg]subtitles='{subtitle_path_escaped}':"
            f"force_style='FontName=Arial,FontSize=22,PrimaryColour=&HFFFFFF,"
            f"OutlineColour=&H000000,Outline=2,Alignment=2,MarginV=80'[v]"
        )

    filter_complex = ';'.join(filter_parts)

    cmd = [
        ffmpeg_path, '-y',
        *inputs,
        '-filter_complex', filter_complex,
        '-map', '[v]',
        '-map', f'{audio_input_idx}:a',
        '-c:v', 'libx264',
        '-c:a', 'aac',
        '-preset', 'medium',
        '-crf', '23',
        '-shortest',
        '-movflags', 'faststart',
        output_path
    ]

    print(f"Running FFmpeg with {num_clips} clips...")
    result = subprocess.run(cmd, capture_output=True, text=True)

    if result.returncode != 0:
        print(f"FFmpeg stderr: {result.stderr}")
        raise Exception(f"FFmpeg failed with code {result.returncode}")

    return output_path

if __name__ == "__main__":
    print("Video module loaded. Use create_shorts_video() or create_simple_shorts()")
