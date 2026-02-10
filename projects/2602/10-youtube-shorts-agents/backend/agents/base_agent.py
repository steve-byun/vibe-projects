"""에이전트 베이스 클래스"""


class BaseAgent:
    def __init__(self, name: str, role: str, ai_client):
        self.name = name
        self.role = role
        self.ai = ai_client

    def run(self, input_data: dict) -> dict:
        raise NotImplementedError

    def _call_ai_json(self, user_prompt: str) -> dict:
        return self.ai.call_json(self.role, user_prompt)

    def _call_ai(self, user_prompt: str) -> str:
        return self.ai.call(self.role, user_prompt)
