"""AI 클라이언트 - Gemini / Claude 듀얼 지원"""
import json
import re
import time


class AIClient:
    """Gemini와 Claude를 통합 지원하는 AI 클라이언트"""

    def __init__(self, config: dict):
        self.provider = config.get("ai_provider", "gemini")

        if self.provider == "claude":
            import anthropic
            self.client = anthropic.Anthropic(api_key=config["anthropic_api_key"])
            self.model = config.get("claude_model", "claude-sonnet-4-20250514")
        else:
            from google import genai
            self.client = genai.Client(api_key=config["gemini_api_key"])
            self.model = config.get("gemini_model", "gemini-2.0-flash")

    def call(self, system_prompt: str, user_prompt: str, max_tokens: int = 4000) -> str:
        for attempt in range(3):
            try:
                if self.provider == "claude":
                    return self._call_claude(system_prompt, user_prompt, max_tokens)
                else:
                    return self._call_gemini(system_prompt, user_prompt, max_tokens)
            except Exception as e:
                if attempt < 2:
                    time.sleep(2 ** attempt)
                    continue
                raise e

    def call_json(self, system_prompt: str, user_prompt: str) -> dict:
        text = self.call(system_prompt, user_prompt)
        return self._parse_json(text)

    def _call_claude(self, system_prompt: str, user_prompt: str, max_tokens: int) -> str:
        response = self.client.messages.create(
            model=self.model,
            max_tokens=max_tokens,
            system=system_prompt,
            messages=[{"role": "user", "content": user_prompt}]
        )
        return response.content[0].text

    def _call_gemini(self, system_prompt: str, user_prompt: str, max_tokens: int) -> str:
        from google import genai
        from google.genai import types

        response = self.client.models.generate_content(
            model=self.model,
            contents=user_prompt,
            config=types.GenerateContentConfig(
                system_instruction=system_prompt,
                max_output_tokens=max_tokens,
                temperature=0.8,
            )
        )
        return response.text

    @staticmethod
    def _parse_json(text: str) -> dict:
        text = text.strip()
        match = re.search(r'```(?:json)?\s*\n?(.*?)\n?\s*```', text, re.DOTALL)
        if match:
            text = match.group(1)
        return json.loads(text)
