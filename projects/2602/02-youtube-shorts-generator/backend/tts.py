"""Edge TTS 음성 생성 모듈"""
import asyncio
import edge_tts
import os
import re

async def generate_speech_async(text: str, output_path: str, voice: str = "ko-KR-SunHiNeural") -> dict:
    """텍스트를 음성으로 변환하고 타이밍 정보 반환"""
    communicate = edge_tts.Communicate(text, voice)

    subtitles = []

    # 음성 생성 및 자막 타이밍 수집
    with open(output_path, "wb") as f:
        async for chunk in communicate.stream():
            if chunk["type"] == "audio":
                f.write(chunk["data"])
            elif chunk["type"] == "WordBoundary":
                subtitles.append({
                    "text": chunk["text"],
                    "start": chunk["offset"] / 10000000,  # 100ns -> seconds
                    "duration": chunk["duration"] / 10000000
                })

    return {
        "audio_path": output_path,
        "word_timings": subtitles
    }

def generate_speech(text: str, output_path: str, voice: str = "ko-KR-SunHiNeural") -> dict:
    """동기 래퍼 함수"""
    return asyncio.run(generate_speech_async(text, output_path, voice))

def detect_language(text: str) -> str:
    """텍스트 언어 감지 (간단한 휴리스틱)"""
    korean_chars = len(re.findall(r'[가-힣]', text))
    total_chars = len(re.findall(r'\w', text))

    if total_chars == 0:
        return "ko"

    return "ko" if korean_chars / total_chars > 0.3 else "en"

if __name__ == "__main__":
    # 테스트
    test_text = "안녕하세요. 오늘은 놀라운 우주 사실을 알려드릴게요."
    result = generate_speech(test_text, "test_output.mp3")
    print(f"Audio saved to: {result['audio_path']}")
    print(f"Word timings: {result['word_timings'][:5]}...")
