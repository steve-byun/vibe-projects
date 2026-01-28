"""
PinDirect 데이터 사용량 위젯
- 항상 화면 위에 표시되는 작은 위젯
- 드래그로 위치 이동 가능
- 우클릭으로 메뉴 표시
- 토큰 자동 갱신 기능
- 시스템 트레이 지원 (최소화 시 트레이로 이동)
"""

import tkinter as tk
from tkinter import messagebox
import json
import os
import re
import requests
import threading
from pathlib import Path
from datetime import datetime

# 시스템 트레이 지원
try:
    import pystray
    from PIL import Image, ImageDraw
    TRAY_AVAILABLE = True
except ImportError:
    TRAY_AVAILABLE = False
    print("pystray 또는 pillow가 설치되지 않았습니다. 트레이 기능이 비활성화됩니다.")


class DataUsageWidget:
    def __init__(self):
        self.root = tk.Tk()
        self.config_path = Path(__file__).parent / "config.json"
        self.load_config()
        self.setup_window()
        self.create_ui()
        self.bind_events()

        # 트레이 관련 변수
        self.tray_icon = None
        self.current_percent = 0
        self.is_minimized = False

        # 초기 데이터 로드
        self.refresh_data()

        # 자동 갱신 시작
        self.auto_refresh()

        # 시작 시 바로 트레이로 최소화
        if TRAY_AVAILABLE:
            self.root.after(100, self.minimize_to_tray)

    def load_config(self):
        """설정 파일 로드"""
        default_config = {
            "line_id": "312115",
            "cookies": "",
            "refresh_interval": 300,
            "position": {"x": 100, "y": 100},
            "opacity": 0.9,
            "theme": "dark"
        }

        if self.config_path.exists():
            try:
                with open(self.config_path, "r", encoding="utf-8") as f:
                    loaded = json.load(f)
                    self.config = {**default_config, **loaded}
            except:
                self.config = default_config
        else:
            self.config = default_config
            self.save_config()

    def save_config(self):
        """설정 파일 저장"""
        with open(self.config_path, "w", encoding="utf-8") as f:
            json.dump(self.config, f, indent=2, ensure_ascii=False)

    def setup_window(self):
        """윈도우 기본 설정"""
        self.root.title("PinDirect")
        self.root.overrideredirect(True)
        self.root.attributes("-topmost", True)
        self.root.attributes("-alpha", self.config["opacity"])

        x = self.config["position"]["x"]
        y = self.config["position"]["y"]
        self.root.geometry(f"+{x}+{y}")

        if self.config["theme"] == "dark":
            self.bg_color = "#1a1a2e"
            self.fg_color = "#eef2ff"
            self.accent_color = "#4cc9f0"
            self.bar_bg = "#16213e"
        else:
            self.bg_color = "#ffffff"
            self.fg_color = "#1a1a2e"
            self.accent_color = "#4361ee"
            self.bar_bg = "#e9ecef"

        self.root.configure(bg=self.bg_color)

    def create_ui(self):
        """UI 구성"""
        self.main_frame = tk.Frame(
            self.root,
            bg=self.bg_color,
            padx=12,
            pady=8,
            highlightbackground=self.accent_color,
            highlightthickness=1
        )
        self.main_frame.pack(fill="both", expand=True)

        # 헤더
        header = tk.Frame(self.main_frame, bg=self.bg_color)
        header.pack(fill="x", pady=(0, 5))

        title = tk.Label(
            header,
            text="PinDirect",
            font=("Segoe UI", 9, "bold"),
            bg=self.bg_color,
            fg=self.accent_color
        )
        title.pack(side="left")

        # 닫기 버튼
        self.close_btn = tk.Label(
            header,
            text="×",
            font=("Segoe UI", 12),
            bg=self.bg_color,
            fg=self.fg_color,
            cursor="hand2"
        )
        self.close_btn.pack(side="right")

        # 최소화 버튼 (트레이로)
        self.minimize_btn = tk.Label(
            header,
            text="−",
            font=("Segoe UI", 12),
            bg=self.bg_color,
            fg=self.fg_color,
            cursor="hand2"
        )
        self.minimize_btn.pack(side="right", padx=(0, 5))

        # 새로고침 버튼
        self.refresh_btn = tk.Label(
            header,
            text="↻",
            font=("Segoe UI", 10),
            bg=self.bg_color,
            fg=self.fg_color,
            cursor="hand2"
        )
        self.refresh_btn.pack(side="right", padx=(0, 5))

        # 데이터 사용량 표시
        self.usage_label = tk.Label(
            self.main_frame,
            text="-- / -- GB",
            font=("Segoe UI", 14, "bold"),
            bg=self.bg_color,
            fg=self.fg_color
        )
        self.usage_label.pack(pady=(5, 3))

        # 프로그레스 바
        self.progress_frame = tk.Frame(self.main_frame, bg=self.bar_bg, height=8)
        self.progress_frame.pack(fill="x", pady=(0, 5))
        self.progress_frame.pack_propagate(False)

        self.progress_bar = tk.Frame(self.progress_frame, bg=self.accent_color, height=8)
        self.progress_bar.place(relx=0, rely=0, relwidth=0, relheight=1)

        # 퍼센트 표시
        self.percent_label = tk.Label(
            self.main_frame,
            text="--%",
            font=("Segoe UI", 9),
            bg=self.bg_color,
            fg=self.fg_color
        )
        self.percent_label.pack()

        # 마지막 업데이트 시간
        self.update_time_label = tk.Label(
            self.main_frame,
            text="",
            font=("Segoe UI", 7),
            bg=self.bg_color,
            fg="#888888"
        )
        self.update_time_label.pack(pady=(3, 0))

    def bind_events(self):
        """이벤트 바인딩"""
        # 버튼 제외 목록
        self.exclude_widgets = [self.close_btn, self.refresh_btn, self.minimize_btn]

        # 버튼에 클릭 이벤트 바인딩
        self.close_btn.bind("<Button-1>", lambda e: self.quit_app())
        self.refresh_btn.bind("<Button-1>", lambda e: self.refresh_data())
        self.minimize_btn.bind("<Button-1>", lambda e: self.minimize_to_tray())

        # 모든 위젯에 드래그 이벤트 바인딩 (버튼 제외)
        self.bind_drag_recursive(self.root)

        self.root.bind("<Enter>", lambda e: self.root.attributes("-alpha", 1.0))
        self.root.bind("<Leave>", lambda e: self.root.attributes("-alpha", self.config["opacity"]))

    def bind_drag_recursive(self, widget):
        """모든 자식 위젯에 드래그 이벤트 바인딩 (버튼 제외)"""
        if widget in self.exclude_widgets:
            return

        widget.bind("<Button-1>", self.start_drag)
        widget.bind("<B1-Motion>", self.on_drag)
        widget.bind("<ButtonRelease-1>", self.stop_drag)
        widget.bind("<Button-3>", self.show_menu)

        for child in widget.winfo_children():
            self.bind_drag_recursive(child)

    def start_drag(self, event):
        self.drag_x = event.x
        self.drag_y = event.y

    def on_drag(self, event):
        x = self.root.winfo_x() + event.x - self.drag_x
        y = self.root.winfo_y() + event.y - self.drag_y

        screen_width = self.root.winfo_screenwidth()
        screen_height = self.root.winfo_screenheight()
        widget_width = self.root.winfo_width()
        widget_height = self.root.winfo_height()

        snap_distance = 20

        if x < snap_distance:
            x = 0
        elif x + widget_width > screen_width - snap_distance:
            x = screen_width - widget_width

        if y < snap_distance:
            y = 0
        elif y + widget_height > screen_height - snap_distance - 40:
            y = screen_height - widget_height - 40

        self.root.geometry(f"+{x}+{y}")

    def stop_drag(self, event):
        self.config["position"]["x"] = self.root.winfo_x()
        self.config["position"]["y"] = self.root.winfo_y()
        self.save_config()

    def show_menu(self, event):
        menu = tk.Menu(self.root, tearoff=0)
        menu.add_command(label="새로고침", command=self.refresh_data)
        menu.add_separator()
        if TRAY_AVAILABLE:
            menu.add_command(label="트레이로 최소화", command=self.minimize_to_tray)
        menu.add_command(label="설정 편집", command=self.open_config)
        menu.add_command(label="테마 전환", command=self.toggle_theme)
        menu.add_separator()
        menu.add_command(label="종료", command=self.quit_app)
        menu.tk_popup(event.x_root, event.y_root)

    def open_config(self):
        os.startfile(self.config_path)

    def toggle_theme(self):
        self.config["theme"] = "light" if self.config["theme"] == "dark" else "dark"
        self.save_config()
        messagebox.showinfo("테마 변경", "위젯을 다시 실행해주세요.")

    # ===== 시스템 트레이 기능 =====

    def create_tray_icon(self, percent=0):
        """트레이 아이콘 이미지 생성 (막대바 표시)"""
        # 16x16 아이콘
        size = 16
        image = Image.new('RGBA', (size, size), (0, 0, 0, 0))
        draw = ImageDraw.Draw(image)

        # 배경 (둥근 사각형)
        draw.rounded_rectangle([0, 0, size-1, size-1], radius=2, fill="#1a1a2e", outline="#4cc9f0")

        # 막대바 배경
        bar_x = 2
        bar_y = 4
        bar_width = size - 4
        bar_height = size - 8
        draw.rectangle([bar_x, bar_y, bar_x + bar_width, bar_y + bar_height], fill="#16213e")

        # 막대바 (아래에서 위로 채움)
        if percent > 0:
            fill_height = int(bar_height * min(percent, 100) / 100)
            fill_y = bar_y + bar_height - fill_height

            # 색상 결정
            if percent >= 76:
                bar_color = "#ef476f"  # 빨강
            elif percent >= 50:
                bar_color = "#ffd166"  # 노랑
            else:
                bar_color = "#4cc9f0"  # 초록

            draw.rectangle([bar_x, fill_y, bar_x + bar_width, bar_y + bar_height], fill=bar_color)

        return image

    def minimize_to_tray(self):
        """트레이로 최소화"""
        if not TRAY_AVAILABLE:
            messagebox.showwarning("알림", "트레이 기능을 사용하려면 pystray와 pillow를 설치하세요.\npip install pystray pillow")
            return

        self.is_minimized = True
        self.root.withdraw()  # 윈도우 숨기기

        # 트레이 아이콘 생성
        icon_image = self.create_tray_icon(self.current_percent)

        menu = pystray.Menu(
            pystray.MenuItem("열기", self.restore_from_tray, default=True),
            pystray.MenuItem("새로고침", lambda: self.tray_refresh()),
            pystray.Menu.SEPARATOR,
            pystray.MenuItem(f"{self.current_percent:.1f}% 사용 중", lambda: None, enabled=False),
            pystray.Menu.SEPARATOR,
            pystray.MenuItem("종료", self.quit_from_tray)
        )

        self.tray_icon = pystray.Icon(
            "PinDirect",
            icon_image,
            f"PinDirect - {self.current_percent:.1f}%",
            menu
        )

        # 별도 스레드에서 트레이 아이콘 실행
        tray_thread = threading.Thread(target=self.tray_icon.run, daemon=True)
        tray_thread.start()

    def restore_from_tray(self, icon=None, item=None):
        """트레이에서 복원"""
        self.is_minimized = False

        if self.tray_icon:
            self.tray_icon.stop()
            self.tray_icon = None

        # 메인 스레드에서 윈도우 표시
        self.root.after(0, self.root.deiconify)

    def tray_refresh(self):
        """트레이에서 새로고침"""
        self.root.after(0, self.refresh_data)

    def quit_from_tray(self, icon=None, item=None):
        """트레이에서 종료"""
        if self.tray_icon:
            self.tray_icon.stop()
        self.root.after(0, self.root.quit)

    def quit_app(self):
        """앱 종료"""
        if self.tray_icon:
            self.tray_icon.stop()
        self.root.quit()

    def update_tray_icon(self):
        """트레이 아이콘 업데이트"""
        if self.tray_icon and self.is_minimized:
            new_icon = self.create_tray_icon(self.current_percent)
            self.tray_icon.icon = new_icon
            self.tray_icon.title = f"PinDirect - {self.current_percent:.1f}%"

    # ===== API 관련 =====

    def get_headers(self, cookies=None):
        """공통 헤더 반환"""
        if cookies is None:
            cookies = self.config.get("cookies", "")
        return {
            "accept": "application/json",
            "accept-language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
            "origin": "https://www.pindirectshop.com",
            "referer": "https://www.pindirectshop.com/",
            "sec-ch-ua": '"Not(A:Brand";v="8", "Chromium";v="144", "Google Chrome";v="144"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Windows"',
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36",
            "Cookie": cookies
        }

    def refresh_token(self):
        """Refresh Token으로 Access Token 갱신"""
        try:
            cookies = self.config.get("cookies", "")

            rftk_match = re.search(r'PDS_RFTK=([^;]+)', cookies)
            if not rftk_match:
                print("Refresh token not found")
                return False

            refresh_token = rftk_match.group(1)
            refresh_url = "https://z-api.pindirectshop.com/auth/refresh"

            headers = self.get_headers(cookies)
            headers["Content-Type"] = "application/json"
            headers["Authorization"] = f"Bearer {refresh_token}"

            response = requests.post(refresh_url, headers=headers, timeout=10)

            if response.status_code == 200:
                data = response.json()
                new_access_token = data.get("accessToken") or data.get("access_token") or data.get("token")
                new_refresh_token = data.get("refreshToken") or data.get("refresh_token")

                if new_access_token:
                    new_cookies = re.sub(
                        r'PDS_ACTK=[^;]+',
                        f'PDS_ACTK={new_access_token}',
                        cookies
                    )

                    if new_refresh_token:
                        new_cookies = re.sub(
                            r'PDS_RFTK=[^;]+',
                            f'PDS_RFTK={new_refresh_token}',
                            new_cookies
                        )

                    self.config["cookies"] = new_cookies
                    self.save_config()
                    print("Token refreshed successfully")
                    return True

            print(f"Token refresh failed: {response.status_code}")
            return False

        except Exception as e:
            print(f"Token refresh error: {e}")
            return False

    def refresh_data(self, retry_on_auth_fail=True):
        """데이터 새로고침"""
        try:
            line_id = self.config.get("line_id", "")
            cookies = self.config.get("cookies", "")

            if line_id and cookies:
                api_url = f"https://z-api.pindirectshop.com/lineInfo/{line_id}/usage"
                headers = self.get_headers(cookies)

                response = requests.get(api_url, headers=headers, timeout=10)

                if response.status_code == 200:
                    data = response.json()
                    self.parse_and_display(data)
                elif response.status_code == 401:
                    if retry_on_auth_fail:
                        self.usage_label.config(text="토큰 갱신 중...")
                        self.percent_label.config(text="잠시만 기다려주세요")
                        self.root.update()

                        if self.refresh_token():
                            self.refresh_data(retry_on_auth_fail=False)
                            return

                    self.usage_label.config(text="인증 만료")
                    self.percent_label.config(text="쿠키를 갱신하세요")
                else:
                    self.usage_label.config(text="연결 실패")
                    self.percent_label.config(text=f"상태: {response.status_code}")
            else:
                self.update_display(2.5, 10.0, demo=True)

        except Exception as e:
            print(f"데이터 로드 실패: {e}")
            self.usage_label.config(text="연결 실패")
            self.percent_label.config(text="설정을 확인하세요")

        self.update_time_label.config(text=f"업데이트: {datetime.now().strftime('%H:%M:%S')}")

    def parse_and_display(self, data):
        """API 응답 파싱 및 표시"""
        try:
            used_kb = data.get("usedDataAmount", 0)
            total_kb = data.get("totalDataAmount", 0)

            used_gb = used_kb / 1024 / 1024
            total_gb = total_kb / 1024 / 1024

            self.update_display(used_gb, total_gb)

        except Exception as e:
            print(f"파싱 오류: {e}, 데이터: {data}")
            self.usage_label.config(text="파싱 오류")
            self.percent_label.config(text=str(e)[:20])

    def update_display(self, used, total, demo=False):
        """화면 업데이트"""
        percent = (used / total * 100) if total > 0 else 0
        self.current_percent = percent

        usage_text = f"{used:.1f} / {total:.1f} GB"
        if demo:
            usage_text += " (데모)"
        self.usage_label.config(text=usage_text)

        self.percent_label.config(text=f"{percent:.1f}% 사용")

        if percent >= 76:
            bar_color = "#ef476f"  # 빨강
        elif percent >= 50:
            bar_color = "#ffd166"  # 노랑
        else:
            bar_color = self.accent_color  # 초록

        self.progress_bar.config(bg=bar_color)
        self.progress_bar.place(relwidth=min(percent / 100, 1.0))

        # 트레이 아이콘 업데이트
        self.update_tray_icon()

    def auto_refresh(self):
        """자동 갱신"""
        interval = self.config["refresh_interval"] * 1000
        self.root.after(interval, self.auto_refresh_callback)

    def auto_refresh_callback(self):
        self.refresh_data()
        self.auto_refresh()

    def run(self):
        self.root.mainloop()


if __name__ == "__main__":
    widget = DataUsageWidget()
    widget.run()
