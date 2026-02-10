"""작가 에이전트 - 내레이션 스크립트 작성"""
from .base_agent import BaseAgent

class WriterAgent(BaseAgent):
    def __init__(self, ai_client):
        super().__init__(
            name="작가",
            role="""당신은 유튜브 쇼츠 전문 작가입니다. 한국어 내레이션 스크립트를 작성합니다.

규칙:
- TTS로 읽히는 텍스트이므로 자연스러운 구어체 사용
- 문장은 짧고 리듬감 있게 (한 문장 10-25자)
- 한국어 초당 약 5글자 속도 기준
- 특수문자, 이모지 사용 금지 (TTS가 읽지 못함)
- 스크립트를 hook, body, cta 세그먼트로 구분

반드시 아래 JSON 형식으로만 응답하세요:
{
    "title": "영상 제목",
    "script_segments": [
        {"type": "hook", "text": "훅 문장 (첫 3초)", "emphasis": true},
        {"type": "body", "text": "본문 문장 1", "emphasis": false},
        {"type": "body", "text": "본문 문장 2", "emphasis": false},
        {"type": "body", "text": "본문 문장 3", "emphasis": true},
        {"type": "cta", "text": "CTA 문장", "emphasis": false}
    ],
    "full_script": "전체 스크립트 (세그먼트 텍스트를 자연스럽게 연결)",
    "search_keywords": ["키워드1", "키워드2", "키워드3", "키워드4", "키워드5"],
    "hashtags": ["#해시태그1", "#해시태그2", "#해시태그3"]
}""",
            ai_client=ai_client
        )

    def run(self, input_data: dict) -> dict:
        concept = input_data.get("concept", "")
        tone = input_data.get("tone", "")
        hook = input_data.get("hook", "")
        body_points = input_data.get("body_points", [])
        cta = input_data.get("cta", "")
        duration = input_data.get("estimated_duration", 50)
        target_chars = duration * 5  # ~5 chars/sec for Korean

        body_text = "\n".join([f"- {p}" for p in body_points])

        prompt = f"""영상 콘셉트: {concept}
톤앤매너: {tone}
목표 길이: {duration}초 (약 {target_chars}자)

훅 방향: {hook}
핵심 포인트:
{body_text}
CTA 방향: {cta}

위 기획을 바탕으로 내레이션 스크립트를 작성해주세요.
전체 스크립트가 약 {target_chars}자가 되도록 조절해주세요."""

        result = self._call_ai_json(prompt)

        # Ensure full_script exists
        if "full_script" not in result or not result["full_script"]:
            segments = result.get("script_segments", [])
            result["full_script"] = " ".join([s["text"] for s in segments])

        return result
