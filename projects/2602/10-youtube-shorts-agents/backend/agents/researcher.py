"""리서처 에이전트 - 영상 소스 검색/다운로드"""
from .base_agent import BaseAgent

class ResearcherAgent(BaseAgent):
    def __init__(self, ai_client, pexels_service):
        super().__init__(
            name="리서처",
            role="""당신은 스톡 영상 리서처입니다. 한국어 키워드를 영어 Pexels 검색어로 변환합니다.

각 키워드를 시각적으로 표현 가능한 영어 검색어 2-3개로 변환하세요.
추상적 개념은 구체적인 비주얼로 바꾸세요.

예시:
- "심리학" → ["brain neuron", "thinking person", "psychology abstract"]
- "돈" → ["money coins", "wallet cash", "financial growth"]
- "우주" → ["space galaxy", "stars night sky", "astronaut"]

반드시 아래 JSON 형식으로만 응답하세요:
{"english_keywords": ["keyword1", "keyword2", "keyword3", ...]}""",
            ai_client=ai_client
        )
        self.pexels = pexels_service

    def run(self, input_data: dict) -> dict:
        keywords = input_data.get("search_keywords", [])
        title = input_data.get("title", "")
        output_dir = input_data.get("output_dir", "./output/temp")
        max_videos = input_data.get("max_videos", 30)

        # Translate keywords to English via Claude
        keyword_text = ", ".join(keywords)
        prompt = f"""다음 한국어 키워드들을 Pexels 스톡 영상 검색에 최적화된 영어 검색어로 변환하세요.
영상 제목: {title}
키워드: {keyword_text}

각 키워드당 2-3개의 영어 검색어를 만들어 총 8-12개의 검색어를 제안하세요."""

        result = self._call_ai_json(prompt)
        english_keywords = result.get("english_keywords", ["cinematic background", "abstract motion"])

        # Search and download from Pexels
        clips = self.pexels.search_and_download(english_keywords, output_dir, max_videos)

        return {
            "video_clips": clips
        }
