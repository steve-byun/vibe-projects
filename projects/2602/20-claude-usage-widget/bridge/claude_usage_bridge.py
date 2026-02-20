"""
Claude Usage Bridge - Chrome 확장 → localhost HTTP 서버 → JSON 파일
VSCode 확장이 이 JSON 파일을 읽어서 Status Bar에 표시합니다.

구조:
  Chrome 확장 (매분 API 호출) → POST http://localhost:19283/usage → ~/.claude-usage.json
  VSCode 확장 → 파일 감시 → Status Bar 표시

사용법:
  python claude_usage_bridge.py          # 서버 시작 (포그라운드)
  pythonw claude_usage_bridge.py         # 서버 시작 (백그라운드, 창 없음)
"""

import json
import os
import logging
from datetime import datetime, timezone
from pathlib import Path
from http.server import HTTPServer, BaseHTTPRequestHandler

# ─── 설정 ───────────────────────────────────────────────
PORT = 19283
OUTPUT_FILE = Path.home() / ".claude-usage.json"

logging.basicConfig(
    level=logging.INFO,
    format="[%(asctime)s] %(levelname)s: %(message)s",
    datefmt="%H:%M:%S",
)
log = logging.getLogger("claude-bridge")


# ─── JSON 파일 쓰기 ────────────────────────────────────
def write_output(data):
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)


def make_success_output(usage_data):
    five_hour = usage_data.get("five_hour", {})
    seven_day = usage_data.get("seven_day", {})

    return {
        "status": "ok",
        "five_hour": {
            "utilization": five_hour.get("utilization", 0),
            "resets_at": five_hour.get("resets_at", ""),
        },
        "seven_day": {
            "utilization": seven_day.get("utilization", 0),
            "resets_at": seven_day.get("resets_at", ""),
        },
        "updated_at": datetime.now(timezone.utc).isoformat(),
    }


# ─── HTTP 서버 ──────────────────────────────────────────
class BridgeHandler(BaseHTTPRequestHandler):
    def do_POST(self):
        if self.path == "/usage":
            content_length = int(self.headers.get("Content-Length", 0))
            body = self.rfile.read(content_length)

            try:
                usage_data = json.loads(body)
                output = make_success_output(usage_data)
                write_output(output)

                pct = output["five_hour"]["utilization"]
                log.info("수신: 5h=%.1f%% 7d=%.1f%%", pct, output["seven_day"]["utilization"])

                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                self.wfile.write(json.dumps({"ok": True}).encode())
            except Exception as e:
                log.error("처리 오류: %s", e)
                self.send_response(400)
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                self.wfile.write(json.dumps({"error": str(e)}).encode())
            return

        self.send_response(404)
        self.end_headers()

    def do_GET(self):
        if self.path == "/status":
            # VSCode나 브라우저에서 상태 확인용
            try:
                if OUTPUT_FILE.exists():
                    with open(OUTPUT_FILE, "r", encoding="utf-8") as f:
                        data = json.load(f)
                else:
                    data = {"status": "waiting", "message": "아직 데이터 없음"}
            except Exception:
                data = {"status": "error", "message": "파일 읽기 실패"}

            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(json.dumps(data, ensure_ascii=False).encode())
            return

        if self.path == "/health":
            self.send_response(200)
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(b"ok")
            return

        self.send_response(404)
        self.end_headers()

    def do_OPTIONS(self):
        # CORS preflight
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def log_message(self, format, *args):
        # 기본 로그 억제 (우리 로거 사용)
        pass


def main():
    log.info("Claude Usage Bridge 서버 시작")
    log.info("포트: %d", PORT)
    log.info("출력 파일: %s", OUTPUT_FILE)
    log.info("Chrome 확장에서 POST http://localhost:%d/usage 로 데이터 전송", PORT)

    server = HTTPServer(("127.0.0.1", PORT), BridgeHandler)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        log.info("서버 종료")
        server.shutdown()


if __name__ == "__main__":
    main()
