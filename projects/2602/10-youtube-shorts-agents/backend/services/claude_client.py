import anthropic
import json
import re
import time


class ClaudeClient:
    def __init__(self, api_key: str, default_model: str = "claude-sonnet-4-20250514"):
        self.client = anthropic.Anthropic(api_key=api_key)
        self.default_model = default_model

    def call(self, system_prompt: str, user_prompt: str, model: str = None, max_tokens: int = 4000) -> str:
        for attempt in range(3):
            try:
                response = self.client.messages.create(
                    model=model or self.default_model,
                    max_tokens=max_tokens,
                    system=system_prompt,
                    messages=[{"role": "user", "content": user_prompt}]
                )
                return response.content[0].text
            except Exception as e:
                if attempt < 2:
                    time.sleep(2 ** attempt)
                    continue
                raise e

    def call_json(self, system_prompt: str, user_prompt: str, model: str = None) -> dict:
        text = self.call(system_prompt, user_prompt, model)
        return self._parse_json(text)

    @staticmethod
    def _parse_json(text: str) -> dict:
        text = text.strip()
        # Strip markdown code fences
        match = re.search(r'```(?:json)?\s*\n?(.*?)\n?\s*```', text, re.DOTALL)
        if match:
            text = match.group(1)
        return json.loads(text)
