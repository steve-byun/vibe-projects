"""
LAN Notifier - 설정 파일
========================
PC A (메인 작업 PC)와 PC B (desktop-39phk2u) 양쪽에서 사용합니다.
사용 전 TARGET_HOST를 반드시 수정하세요!
"""

# ── 수신 PC (PC A - 메인 작업 PC) 서버 설정 ──
RECEIVER_HOST = "0.0.0.0"   # 모든 인터페이스에서 수신
RECEIVER_PORT = 9988

# ── 송신 PC (PC B) → 수신 PC (PC A) 연결 정보 ──
# ★ 여기를 메인 PC의 IP 주소로 변경하세요! ★
# test_connection.py 실행하면 현재 PC의 IP를 알려줍니다.
TARGET_HOST = "YOUR-MAIN-PC-IP"   # 예: "192.168.0.10"
TARGET_PORT = 9988

# ── 보안 ──
AUTH_TOKEN = "lan-notifier-2026"  # 양쪽 동일해야 함

# ── 모니터링 설정 ──
CHECK_INTERVAL = 5   # 알림 확인 주기 (초)

# 감시할 앱 이름 (Windows 알림에 표시되는 이름)
WATCH_APPS = [
    "Microsoft Teams",
    "Teams",
    "Microsoft Outlook",
    "Outlook",
    "Mail",
]

# 알림 이력 최대 보관 수
MAX_HISTORY = 200
