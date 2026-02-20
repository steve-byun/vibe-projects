"""
LAN Notifier - 수신기 (PC A - 메인 작업 PC에서 실행)
=====================================================
PC B(desktop-39phk2u)에서 보낸 알림을 받아서 Toast로 표시합니다.
시스템 트레이에 아이콘으로 상주합니다.

사용법:
  python receiver.py
"""

import json
import threading
import sys
import socket
from http.server import HTTPServer, BaseHTTPRequestHandler
from datetime import datetime

import config


# ── 의존성 체크 ──
HAS_TOAST = False
HAS_TRAY = False

try:
    from win11toast import notify
    HAS_TOAST = True
except ImportError:
    pass

try:
    import pystray
    from PIL import Image, ImageDraw
    HAS_TRAY = True
except ImportError:
    pass


# ── 전역 상태 ──
notification_log = []
server = None


def show_toast(app_name, title, message):
    """Windows Toast 알림 표시"""
    if HAS_TOAST:
        try:
            full_title = f"[{app_name}] {title}"
            notify(
                title=full_title,
                body=message if message else " ",
                app_id="LAN Notifier",
            )
        except Exception as e:
            print(f"  [Toast 오류] {e}")
    else:
        # Toast 없으면 콘솔 출력
        print(f"\n  *** [{app_name}] {title} ***")
        if message:
            print(f"      {message}")


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# HTTP 서버 핸들러
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
class NotifyHandler(BaseHTTPRequestHandler):
    def do_POST(self):
        if self.path != "/notify":
            self.send_error(404)
            return

        # 인증 확인
        token = self.headers.get("X-Auth-Token", "")
        if token != config.AUTH_TOKEN:
            self.send_error(403)
            return

        # 페이로드 크기 제한 (DoS 방지)
        length = int(self.headers.get("Content-Length", 0))
        if length > 8192:
            self.send_error(413)
            return

        body = self.rfile.read(length)

        try:
            data = json.loads(body)
            app_name = data.get("app", "알림")
            title = data.get("title", "새 알림")
            message = data.get("message", "")
            sender_pc = data.get("sender", "?")
            timestamp = datetime.now().strftime("%H:%M:%S")

            # 로그 저장
            entry = {
                "app": app_name,
                "title": title,
                "message": message,
                "from": sender_pc,
                "time": timestamp,
            }
            notification_log.append(entry)
            if len(notification_log) > config.MAX_HISTORY:
                notification_log.pop(0)

            print(f"[{timestamp}] [{app_name}] {title}: {message}")

            # Toast 알림 (별도 스레드 - 서버 블로킹 방지)
            threading.Thread(
                target=show_toast,
                args=(app_name, title, message),
                daemon=True,
            ).start()

            self.send_response(200)
            self.end_headers()
            self.wfile.write(b'{"status":"ok"}')

        except json.JSONDecodeError:
            self.send_error(400)

    def do_GET(self):
        """상태 확인 엔드포인트"""
        if self.path == "/health":
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            resp = json.dumps({
                "status": "running",
                "total_notifications": len(notification_log),
            })
            self.wfile.write(resp.encode())
        else:
            self.send_error(404)

    def log_message(self, format, *args):
        pass  # 기본 HTTP 로그 억제


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 시스템 트레이
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
def create_icon_image():
    """트레이 아이콘 이미지 동적 생성"""
    img = Image.new("RGBA", (64, 64), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    # 파란 원 배경
    draw.ellipse([2, 2, 62, 62], fill=(52, 120, 246))
    # N 글자
    draw.text((22, 15), "N", fill=(255, 255, 255))
    return img


def on_show_log(icon, item):
    """최근 알림 보기"""
    if not notification_log:
        show_toast("LAN Notifier", "알림 없음", "수신된 알림이 없습니다.")
        return

    recent = notification_log[-5:]
    lines = [f"[{e['app']}] {e['title']}" for e in recent]
    show_toast("LAN Notifier", f"최근 알림 {len(recent)}건", "\n".join(lines))


def on_quit(icon, item):
    """종료"""
    icon.stop()
    if server:
        threading.Thread(target=server.shutdown, daemon=True).start()


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 메인
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
def run_server():
    global server
    server = HTTPServer(
        (config.RECEIVER_HOST, config.RECEIVER_PORT),
        NotifyHandler,
    )
    server.serve_forever()


def main():
    hostname = socket.gethostname()
    try:
        local_ip = socket.gethostbyname(hostname)
    except Exception:
        local_ip = "?"

    print("=" * 50)
    print("  LAN Notifier - Receiver")
    print(f"  이 PC: {hostname} ({local_ip})")
    print(f"  수신 포트: {config.RECEIVER_PORT}")
    print("=" * 50)
    print(f"\n  ★ PC B의 config.py에 TARGET_HOST = \"{local_ip}\" 설정하세요!\n")

    if not HAS_TOAST:
        print("[경고] win11toast 미설치 → pip install win11toast")
        print("       Toast 대신 콘솔 출력으로 대체합니다.\n")

    # 서버 시작
    server_thread = threading.Thread(target=run_server, daemon=True)
    server_thread.start()
    print(f"[서버] 포트 {config.RECEIVER_PORT} 수신 대기 중...\n")

    if HAS_TRAY:
        icon = pystray.Icon(
            name="LAN Notifier",
            icon=create_icon_image(),
            title=f"LAN Notifier ({local_ip}:{config.RECEIVER_PORT})",
            menu=pystray.Menu(
                pystray.MenuItem("최근 알림 보기", on_show_log),
                pystray.MenuItem(f"주소: {local_ip}:{config.RECEIVER_PORT}", None, enabled=False),
                pystray.Menu.SEPARATOR,
                pystray.MenuItem("종료", on_quit),
            ),
        )
        print("[트레이] 시스템 트레이에서 실행 중 (우클릭 메뉴)")
        icon.run()  # 메인 스레드 블로킹
    else:
        print("[정보] pystray 미설치 → 콘솔 모드로 실행")
        print("       Ctrl+C로 종료\n")
        try:
            server_thread.join()
        except KeyboardInterrupt:
            print("\n[종료]")


if __name__ == "__main__":
    main()
