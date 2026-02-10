"""성우 에이전트 - TTS 나레이션 생성"""
from .base_agent import BaseAgent

class VoiceAgent(BaseAgent):
    def __init__(self, tts_service):
        super().__init__(
            name="성우",
            role="",
            ai_client=None
        )
        self.tts = tts_service

    def run(self, input_data: dict) -> dict:
        full_script = input_data.get("full_script", "")
        output_path = input_data.get("output_path", "./output/narration.mp3")
        voice = input_data.get("voice", "ko-KR-SunHiNeural")
        segment_texts = input_data.get("segment_texts", [])

        # Generate TTS audio
        result = self.tts.generate(full_script, output_path, voice)

        # Compute segment timings
        segment_timings = []
        if segment_texts:
            segment_timings = self.tts.compute_segment_timings(
                result["word_timings"], segment_texts
            )

        return {
            "audio_path": result["audio_path"],
            "duration": result["duration"],
            "word_timings": result["word_timings"],
            "segment_timings": segment_timings
        }
