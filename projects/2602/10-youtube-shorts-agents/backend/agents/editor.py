"""편집자 에이전트 - 영상 합성/렌더링"""
import os
from .base_agent import BaseAgent

class EditorAgent(BaseAgent):
    def __init__(self, video_service, subtitle_service):
        super().__init__(
            name="편집자",
            role="",
            ai_client=None
        )
        self.video = video_service
        self.subtitle = subtitle_service

    def run(self, input_data: dict) -> dict:
        script = input_data.get("script", {})
        media = input_data.get("media", {})
        audio = input_data.get("audio", {})
        output_path = input_data.get("output_path", "./output/shorts.mp4")
        width = input_data.get("width", 1080)
        height = input_data.get("height", 1920)
        clip_duration = input_data.get("clip_duration", 2.5)

        # 1. Generate subtitle file
        subtitle_path = output_path.replace(".mp4", ".ass")

        # Build segment_types for subtitle coloring
        segment_types = []
        segment_timings = audio.get("segment_timings", [])
        segments = script.get("script_segments", [])

        for st in segment_timings:
            idx = st.get("segment_index", 0)
            seg_type = "body"
            if idx < len(segments):
                seg_type = segments[idx].get("type", "body")
            segment_types.append({
                "start": st["start"],
                "end": st["end"],
                "type": seg_type
            })

        word_timings = audio.get("word_timings", [])
        duration = audio.get("duration", 0)

        if word_timings:
            self.subtitle.generate_ass(word_timings, segment_types, duration, subtitle_path)
        else:
            self.subtitle.generate_ass_from_text(
                script.get("full_script", ""), duration, subtitle_path
            )

        # 2. Compose video
        video_clips = media.get("video_clips", [])
        audio_path = audio.get("audio_path", "")

        result = self.video.create_shorts(
            background_videos=video_clips,
            audio_path=audio_path,
            subtitle_path=subtitle_path,
            output_path=output_path,
            width=width,
            height=height,
            clip_duration=clip_duration
        )

        # 3. Return final result
        return {
            "video_path": result["video_path"],
            "title": script.get("title", "Untitled"),
            "duration": result["duration"],
            "file_size": result["file_size"],
            "hashtags": script.get("hashtags", [])
        }
