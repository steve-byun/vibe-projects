"""Edge TTS 음성 생성 서비스"""
import asyncio
import edge_tts
import os


class TTSService:
    def __init__(self):
        pass

    def generate(self, text: str, output_path: str, voice: str = "ko-KR-SunHiNeural") -> dict:
        """텍스트를 음성으로 변환"""
        result = asyncio.run(self._generate_async(text, output_path, voice))

        # duration 계산 (마지막 단어 끝 시간)
        if result["word_timings"]:
            last = result["word_timings"][-1]
            result["duration"] = last["start"] + last["duration"]
        else:
            result["duration"] = 0

        return result

    async def _generate_async(self, text: str, output_path: str, voice: str) -> dict:
        communicate = edge_tts.Communicate(text, voice)
        word_timings = []

        with open(output_path, "wb") as f:
            async for chunk in communicate.stream():
                if chunk["type"] == "audio":
                    f.write(chunk["data"])
                elif chunk["type"] == "WordBoundary":
                    word_timings.append({
                        "text": chunk["text"],
                        "start": chunk["offset"] / 10000000,
                        "duration": chunk["duration"] / 10000000
                    })

        return {
            "audio_path": output_path,
            "word_timings": word_timings
        }

    @staticmethod
    def compute_segment_timings(word_timings: list, segment_texts: list) -> list:
        """단어 타이밍을 스크립트 세그먼트에 매핑"""
        if not word_timings or not segment_texts:
            return []

        # 전체 스크립트에서 각 세그먼트의 문자 위치 계산
        segment_timings = []
        word_idx = 0

        for seg_idx, seg_text in enumerate(segment_texts):
            # 세그먼트의 각 글자를 단어 타이밍과 매칭
            seg_clean = seg_text.replace(" ", "")
            matched_chars = 0
            seg_start = None
            seg_end = None

            while word_idx < len(word_timings) and matched_chars < len(seg_clean):
                wt = word_timings[word_idx]
                if seg_start is None:
                    seg_start = wt["start"]
                seg_end = wt["start"] + wt["duration"]
                matched_chars += len(wt["text"].replace(" ", ""))
                word_idx += 1

            if seg_start is not None:
                segment_timings.append({
                    "segment_index": seg_idx,
                    "start": seg_start,
                    "end": seg_end or seg_start + 1.0
                })

        return segment_timings
