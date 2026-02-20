"""
LAN Notifier - 모니터 (PC B에서 실행)
======================================
desktop-39phk2u에서 실행하세요.
Windows 알림(Teams, Outlook 등)을 감시하고 메인 PC로 전달합니다.

사용법:
  python monitor.py
"""

import asyncio
import json
import sys
import socket
import urllib.request
import urllib.error
from datetime import datetime

import config


# ── 의존성 체크 ──
HAS_WINSDK = False
HAS_PYWIN32 = False

try:
    import winsdk.windows.ui.notifications.management as mgmt
    import winsdk.windows.ui.notifications as notifs
    HAS_WINSDK = True
except ImportError:
    pass

try:
    import win32com.client
    import pythoncom
    HAS_PYWIN32 = True
except ImportError:
    pass


def send_to_receiver(app_name, title, body, urgency="normal"):
    """메인 PC로 알림 전송"""
    payload = json.dumps({
        "sender": socket.gethostname(),
        "app": app_name,
        "title": title,
        "message": body,
        "urgency": urgency,
        "timestamp": datetime.now().isoformat(),
    }).encode("utf-8")

    url = f"http://{config.TARGET_HOST}:{config.TARGET_PORT}/notify"
    req = urllib.request.Request(
        url,
        data=payload,
        headers={
            "Content-Type": "application/json",
            "X-Auth-Token": config.AUTH_TOKEN,
        },
    )

    try:
        with urllib.request.urlopen(req, timeout=5) as resp:
            if resp.status == 200:
                print(f"  -> 전송 완료")
            else:
                print(f"  -> 전송 실패: HTTP {resp.status}")
    except urllib.error.URLError as e:
        print(f"  -> 연결 실패: {e.reason}")
    except Exception as e:
        print(f"  -> 오류: {e}")


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 방법 1: Windows 알림 리스너 (winsdk)
# Teams + Outlook + 기타 모든 앱 알림을 한번에 잡음
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
class WinNotificationMonitor:
    def __init__(self):
        self.seen_ids = set()
        self.listener = None

    async def start(self):
        self.listener = mgmt.UserNotificationListener.get_current()
        access = await self.listener.request_access_async()

        access_allowed = mgmt.UserNotificationListenerAccessStatus.ALLOWED
        if access != access_allowed:
            print("[오류] 알림 접근이 거부되었습니다.")
            print("")
            print("해결 방법:")
            print("  Windows 설정 > 시스템 > 알림 > ")
            print("  '앱 및 다른 보낸 사람의 알림 받기' 켜기")
            print("")
            return False

        # 시작 시점의 기존 알림 ID 기록 (새 알림만 전달하기 위해)
        try:
            existing = await self.listener.get_notifications_async(
                notifs.NotificationKinds.TOAST
            )
            for n in existing:
                self.seen_ids.add(n.id)
            print(f"[winsdk] 기존 알림 {len(self.seen_ids)}개 스킵")
        except Exception:
            pass

        print("[winsdk] Windows 알림 모니터 시작됨")
        return True

    async def check(self):
        try:
            notifications = await self.listener.get_notifications_async(
                notifs.NotificationKinds.TOAST
            )
        except Exception as e:
            print(f"[오류] 알림 조회 실패: {e}")
            return

        for n in notifications:
            if n.id in self.seen_ids:
                continue

            self.seen_ids.add(n.id)

            # 앱 이름 가져오기
            try:
                app_name = n.app_info.display_info.display_name
            except Exception:
                app_name = "Unknown"

            # 감시 대상 앱인지 확인
            if not any(w.lower() in app_name.lower() for w in config.WATCH_APPS):
                continue

            # 알림 텍스트 추출
            title, body = self._extract_text(n)
            timestamp = datetime.now().strftime("%H:%M:%S")
            print(f"[{timestamp}] [{app_name}] {title}: {body}")
            send_to_receiver(app_name, title, body)

        # 메모리 관리: 너무 많으면 정리
        if len(self.seen_ids) > config.MAX_HISTORY * 2:
            current_ids = {n.id for n in notifications}
            self.seen_ids = current_ids

    def _extract_text(self, notification):
        """알림에서 제목과 본문 추출"""
        try:
            binding = notification.notification.visual.get_binding(
                "ToastGeneric"
            )
            if binding:
                text_elements = binding.get_text_elements()
                texts = [elem.text for elem in text_elements if elem.text]
                title = texts[0] if texts else "새 알림"
                body = " | ".join(texts[1:]) if len(texts) > 1 else ""
                return title, body
        except Exception:
            pass
        return "새 알림", ""


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 방법 2: Outlook COM (폴백 - 메일만)
# winsdk 설치 안 됐을 때 Outlook 메일만이라도 감시
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
class OutlookMonitor:
    def __init__(self):
        self.seen_ids = set()
        self.outlook = None
        self.inbox = None

    def start(self):
        try:
            pythoncom.CoInitialize()
            self.outlook = win32com.client.Dispatch("Outlook.Application")
            namespace = self.outlook.GetNamespace("MAPI")
            self.inbox = namespace.GetDefaultFolder(6)  # 6 = Inbox

            # 기존 메일 ID 기록
            count = min(50, self.inbox.Items.Count)
            for i in range(count):
                try:
                    self.seen_ids.add(self.inbox.Items[i + 1].EntryID)
                except Exception:
                    pass

            print(f"[Outlook] 모니터 시작됨 (기존 메일 {len(self.seen_ids)}개 스킵)")
            return True
        except Exception as e:
            print(f"[오류] Outlook 연결 실패: {e}")
            print("       Outlook이 실행 중인지 확인하세요.")
            return False

    def check(self):
        try:
            pythoncom.CoInitialize()
            count = min(20, self.inbox.Items.Count)
            for i in range(count):
                try:
                    item = self.inbox.Items[i + 1]
                    entry_id = item.EntryID
                    if entry_id in self.seen_ids:
                        continue

                    self.seen_ids.add(entry_id)
                    sender = getattr(item, "SenderName", "알 수 없음")
                    subject = getattr(item, "Subject", "(제목 없음)")

                    timestamp = datetime.now().strftime("%H:%M:%S")
                    print(f"[{timestamp}] [Outlook] {sender}: {subject}")
                    send_to_receiver("Outlook", subject, f"보낸 사람: {sender}")
                except Exception:
                    pass
        except Exception as e:
            print(f"[오류] Outlook 확인 실패: {e}")


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 메인 루프
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
async def main():
    hostname = socket.gethostname()
    try:
        local_ip = socket.gethostbyname(hostname)
    except Exception:
        local_ip = "?"

    print("=" * 50)
    print("  LAN Notifier - Monitor")
    print(f"  이 PC: {hostname} ({local_ip})")
    print(f"  전송 대상: {config.TARGET_HOST}:{config.TARGET_PORT}")
    print("=" * 50)

    if config.TARGET_HOST == "YOUR-MAIN-PC-IP":
        print("\n[오류] config.py에서 TARGET_HOST를 메인 PC의 IP로 변경하세요!")
        print("       메인 PC에서 test_connection.py를 실행하면 IP를 확인할 수 있습니다.")
        sys.exit(1)

    monitors = []

    # winsdk 시도
    if HAS_WINSDK:
        mon = WinNotificationMonitor()
        if await mon.start():
            monitors.append(("winsdk", mon))
        else:
            print("[경고] winsdk 알림 모니터 실패")
    else:
        print("[정보] winsdk 미설치 → pip install winsdk")

    # winsdk 실패 시 Outlook COM 폴백
    if not monitors and HAS_PYWIN32:
        mon = OutlookMonitor()
        if mon.start():
            monitors.append(("outlook", mon))
    elif not monitors:
        print("[정보] pywin32 미설치 → pip install pywin32")

    if not monitors:
        print("\n[오류] 사용 가능한 모니터가 없습니다!")
        print("다음 중 하나를 설치하세요:")
        print("  pip install winsdk    (Teams+Outlook 전체 감시) [추천]")
        print("  pip install pywin32   (Outlook 메일만 감시)")
        sys.exit(1)

    print(f"\n[실행 중] {config.CHECK_INTERVAL}초 간격으로 감시 중...")
    print("Ctrl+C로 종료\n")

    try:
        while True:
            for name, monitor in monitors:
                if name == "winsdk":
                    await monitor.check()
                elif name == "outlook":
                    monitor.check()

            await asyncio.sleep(config.CHECK_INTERVAL)
    except KeyboardInterrupt:
        print("\n[종료] 모니터 중지됨")


if __name__ == "__main__":
    asyncio.run(main())
