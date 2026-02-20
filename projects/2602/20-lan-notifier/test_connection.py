"""
LAN Notifier - 연결 테스트
===========================
1) 현재 PC의 IP 주소를 보여줍니다
2) 수신기(receiver.py)에 테스트 알림을 보냅니다

사용법:
  python test_connection.py          # IP 확인만
  python test_connection.py send     # 테스트 알림 전송
"""

import json
import socket
import sys
import urllib.request
import urllib.error

import config


def show_my_ip():
    """현재 PC의 네트워크 정보 표시"""
    hostname = socket.gethostname()
    print(f"  호스트명: {hostname}")

    # 모든 IP 주소 표시
    try:
        ips = socket.getaddrinfo(hostname, None, socket.AF_INET)
        seen = set()
        for _, _, _, _, addr in ips:
            ip = addr[0]
            if ip not in seen:
                seen.add(ip)
                print(f"  IP 주소: {ip}")
    except Exception:
        try:
            ip = socket.gethostbyname(hostname)
            print(f"  IP 주소: {ip}")
        except Exception:
            print("  IP 주소를 확인할 수 없습니다.")


def send_test():
    """수신기에 테스트 알림 전송"""
    target = f"{config.TARGET_HOST}:{config.TARGET_PORT}"
    print(f"\n  테스트 전송 대상: {target}")

    if config.TARGET_HOST == "YOUR-MAIN-PC-IP":
        print("\n  [오류] config.py에서 TARGET_HOST를 설정하세요!")
        return False

    payload = json.dumps({
        "sender": socket.gethostname(),
        "app": "Test",
        "title": "테스트 알림",
        "message": "LAN Notifier 연결 테스트 성공!",
        "urgency": "normal",
    }).encode("utf-8")

    req = urllib.request.Request(
        f"http://{config.TARGET_HOST}:{config.TARGET_PORT}/notify",
        data=payload,
        headers={
            "Content-Type": "application/json",
            "X-Auth-Token": config.AUTH_TOKEN,
        },
    )

    try:
        with urllib.request.urlopen(req, timeout=5) as resp:
            if resp.status == 200:
                print("  [성공] 테스트 알림이 전송되었습니다!")
                print("         메인 PC에서 Toast 알림을 확인하세요.")
                return True
            else:
                print(f"  [실패] HTTP {resp.status}")
                return False
    except urllib.error.URLError as e:
        print(f"  [실패] 연결 불가: {e.reason}")
        print(f"         메인 PC에서 receiver.py가 실행 중인지 확인하세요.")
        return False
    except Exception as e:
        print(f"  [실패] {e}")
        return False


def check_receiver():
    """수신기 상태 확인"""
    if config.TARGET_HOST == "YOUR-MAIN-PC-IP":
        return

    try:
        url = f"http://{config.TARGET_HOST}:{config.TARGET_PORT}/health"
        req = urllib.request.Request(url)
        with urllib.request.urlopen(req, timeout=3) as resp:
            data = json.loads(resp.read())
            print(f"\n  수신기 상태: {data.get('status', '?')}")
            print(f"  누적 알림: {data.get('total_notifications', 0)}건")
    except Exception:
        print(f"\n  수신기 상태: 응답 없음 (receiver.py가 실행 중인지 확인)")


if __name__ == "__main__":
    print("=" * 50)
    print("  LAN Notifier - 연결 테스트")
    print("=" * 50)
    print()

    print("[이 PC 정보]")
    show_my_ip()

    print(f"\n[설정 정보]")
    print(f"  전송 대상: {config.TARGET_HOST}:{config.TARGET_PORT}")
    print(f"  인증 토큰: {config.AUTH_TOKEN[:8]}...")

    check_receiver()

    if len(sys.argv) > 1 and sys.argv[1] == "send":
        send_test()
    else:
        print(f"\n  테스트 알림을 보내려면: python test_connection.py send")
