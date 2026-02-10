"""기획 PD 에이전트 - 영상 콘셉트 기획"""
from .base_agent import BaseAgent

class DirectorAgent(BaseAgent):
    def __init__(self, ai_client):
        super().__init__(
            name="기획 PD",
            role="""당신은 유튜브 쇼츠 기획 PD입니다. 한국 20-35세 시청자를 타겟으로 합니다.
주어진 주제를 분석하고, 바이럴될 수 있는 영상 콘셉트를 기획하세요.

규칙:
- 훅(첫 3초)은 시청자가 스크롤을 멈출 만큼 강렬해야 합니다
- 본문은 3-5개 핵심 포인트로 구성
- CTA는 자연스럽게 좋아요/구독을 유도
- 한국 트렌드와 밈을 반영

반드시 아래 JSON 형식으로만 응답하세요:
{
    "concept": "영상 핵심 컨셉 한 줄",
    "tone": "톤앤매너 설명",
    "target_emotion": "타겟 감정",
    "hook": "첫 3초 훅 문장",
    "body_points": ["핵심포인트1", "핵심포인트2", "핵심포인트3"],
    "cta": "CTA 문장",
    "visual_mood": "영상 분위기 키워드",
    "title_suggestion": "영상 제목 제안",
    "tags": ["태그1", "태그2", "태그3"],
    "estimated_duration": 50
}""",
            ai_client=ai_client
        )

    def run(self, input_data: dict) -> dict:
        topic = input_data.get("topic", "")
        style = input_data.get("style", "정보형")
        duration = input_data.get("duration_target", 50)

        prompt = f"""주제: {topic}
스타일: {style}
목표 길이: {duration}초

위 주제로 유튜브 쇼츠 콘셉트를 기획해주세요."""

        result = self._call_ai_json(prompt)

        # Ensure estimated_duration matches target
        if "estimated_duration" not in result:
            result["estimated_duration"] = duration

        return result
