"""
Window Cleaner - 사용하지 않는 창 자동 종료 프로그램
설정한 시간 동안 한 번도 활성화되지 않은 프로그램을 자동으로 종료합니다.
"""

import tkinter as tk
from tkinter import ttk, messagebox
import ctypes
from ctypes import wintypes
import threading
import time
from datetime import datetime, timedelta

# Windows API
user32 = ctypes.windll.user32
kernel32 = ctypes.windll.kernel32

# 시스템 프로세스 화이트리스트 (절대 종료하면 안 되는 것들)
SYSTEM_WHITELIST = {
    "explorer.exe", "dwm.exe", "csrss.exe", "wininit.exe", "winlogon.exe",
    "services.exe", "lsass.exe", "svchost.exe", "taskhostw.exe", "sihost.exe",
    "fontdrvhost.exe", "ctfmon.exe", "runtimebroker.exe", "shellexperiencehost.exe",
    "searchhost.exe", "startmenuexperiencehost.exe", "textinputhost.exe",
    "securityhealthservice.exe", "securityhealthsystray.exe", "searchindexer.exe",
    "searchprotocolhost.exe", "dllhost.exe", "conhost.exe", "cmd.exe",
    "powershell.exe", "windowsterminal.exe", "python.exe", "pythonw.exe",
    "code.exe", "devenv.exe", "smartscreen.exe", "searchui.exe",
    "lockapp.exe", "logonui.exe", "taskmgr.exe", "msedgewebview2.exe",
}


class WindowInfo:
    """창 정보를 담는 클래스"""
    def __init__(self, hwnd, pid, process_name, title):
        self.hwnd = hwnd
        self.pid = pid
        self.process_name = process_name.lower() if process_name else ""
        self.title = title
        self.was_active = False
        self.excluded = False  # 사용자가 제외 선택


def get_process_name(pid):
    """PID로 프로세스 이름 가져오기"""
    PROCESS_QUERY_LIMITED_INFORMATION = 0x1000
    MAX_PATH = 260

    handle = kernel32.OpenProcess(PROCESS_QUERY_LIMITED_INFORMATION, False, pid)
    if not handle:
        return None

    try:
        exe_path = ctypes.create_unicode_buffer(MAX_PATH)
        size = wintypes.DWORD(MAX_PATH)
        if kernel32.QueryFullProcessImageNameW(handle, 0, exe_path, ctypes.byref(size)):
            return exe_path.value.split("\\")[-1]
    finally:
        kernel32.CloseHandle(handle)
    return None


def get_all_visible_windows():
    """모든 보이는 창 목록 가져오기 (HWND 포함)"""
    windows = []
    seen_titles = set()  # 중복 제거용

    def enum_callback(hwnd, _):
        if user32.IsWindowVisible(hwnd) and user32.IsWindow(hwnd):
            # 창 제목 가져오기
            length = user32.GetWindowTextLengthW(hwnd) + 1
            if length > 1:
                title = ctypes.create_unicode_buffer(length)
                user32.GetWindowTextW(hwnd, title, length)
                title_str = title.value.strip()

                if title_str and title_str not in seen_titles:
                    # PID 가져오기
                    pid = wintypes.DWORD()
                    user32.GetWindowThreadProcessId(hwnd, ctypes.byref(pid))
                    process_name = get_process_name(pid.value)

                    if process_name:
                        seen_titles.add(title_str)
                        windows.append(WindowInfo(hwnd, pid.value, process_name, title_str))
        return True

    WNDENUMPROC = ctypes.WINFUNCTYPE(ctypes.c_bool, wintypes.HWND, wintypes.LPARAM)
    user32.EnumWindows(WNDENUMPROC(enum_callback), 0)

    return windows


def get_foreground_hwnd():
    """현재 활성 창의 HWND 가져오기"""
    return user32.GetForegroundWindow()


def close_window(hwnd):
    """창에 WM_CLOSE 메시지 보내기 (프로세스 강제 종료보다 안전)"""
    WM_CLOSE = 0x0010
    try:
        user32.PostMessageW(hwnd, WM_CLOSE, 0, 0)
        return True
    except:
        return False


def terminate_process(pid):
    """프로세스 강제 종료 (fallback)"""
    PROCESS_TERMINATE = 0x0001
    handle = kernel32.OpenProcess(PROCESS_TERMINATE, False, pid)
    if handle:
        result = kernel32.TerminateProcess(handle, 0)
        kernel32.CloseHandle(handle)
        return result
    return False


class ExcludeDialog:
    """시작 전 제외할 프로그램 선택 다이얼로그"""
    def __init__(self, parent, windows):
        self.result = None
        self.windows = windows
        self.checkboxes = {}

        self.dialog = tk.Toplevel(parent)
        self.dialog.title("종료 제외 프로그램 선택")
        self.dialog.geometry("550x400")
        self.dialog.transient(parent)
        self.dialog.grab_set()

        # 안내
        ttk.Label(self.dialog, text="종료하지 않을 프로그램을 체크하세요:",
                  font=("Arial", 10, "bold")).pack(pady=10)

        # 스크롤 가능한 체크박스 목록
        frame = ttk.Frame(self.dialog)
        frame.pack(fill=tk.BOTH, expand=True, padx=10, pady=5)

        canvas = tk.Canvas(frame)
        scrollbar = ttk.Scrollbar(frame, orient="vertical", command=canvas.yview)
        scrollable_frame = ttk.Frame(canvas)

        scrollable_frame.bind(
            "<Configure>",
            lambda e: canvas.configure(scrollregion=canvas.bbox("all"))
        )

        canvas.create_window((0, 0), window=scrollable_frame, anchor="nw")
        canvas.configure(yscrollcommand=scrollbar.set)

        # 체크박스들
        for win in windows:
            if win.process_name not in SYSTEM_WHITELIST:
                var = tk.BooleanVar(value=False)
                display = f"{win.process_name}: {win.title[:50]}"
                cb = ttk.Checkbutton(scrollable_frame, text=display, variable=var)
                cb.pack(anchor="w", pady=2)
                self.checkboxes[win.hwnd] = var

        canvas.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        scrollbar.pack(side=tk.RIGHT, fill=tk.Y)

        # 버튼
        btn_frame = ttk.Frame(self.dialog)
        btn_frame.pack(fill=tk.X, pady=10)

        ttk.Button(btn_frame, text="모두 선택", command=self.select_all).pack(side=tk.LEFT, padx=10)
        ttk.Button(btn_frame, text="모두 해제", command=self.deselect_all).pack(side=tk.LEFT)
        ttk.Button(btn_frame, text="확인", command=self.confirm).pack(side=tk.RIGHT, padx=10)
        ttk.Button(btn_frame, text="취소", command=self.cancel).pack(side=tk.RIGHT)

        # 창 닫기 이벤트
        self.dialog.protocol("WM_DELETE_WINDOW", self.cancel)

    def select_all(self):
        for var in self.checkboxes.values():
            var.set(True)

    def deselect_all(self):
        for var in self.checkboxes.values():
            var.set(False)

    def confirm(self):
        # 선택된 창들의 HWND 반환
        self.result = {hwnd for hwnd, var in self.checkboxes.items() if var.get()}
        self.dialog.destroy()

    def cancel(self):
        self.result = None
        self.dialog.destroy()


class WindowCleanerApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Window Cleaner - 미사용 창 정리")
        self.root.geometry("650x550")
        self.root.resizable(True, True)

        # 상태 변수
        self.is_running = False
        self.monitor_thread = None
        self.tracked_windows = {}  # HWND -> WindowInfo
        self.active_hwnds = set()  # 활성화된 적 있는 HWND
        self.excluded_hwnds = set()  # 제외된 HWND
        self.end_time = None

        self.setup_ui()

    def setup_ui(self):
        # 상단 프레임 - 설정
        top_frame = ttk.Frame(self.root, padding="10")
        top_frame.pack(fill=tk.X)

        ttk.Label(top_frame, text="모니터링 시간(분):").pack(side=tk.LEFT)

        self.minutes_var = tk.StringVar(value="5")
        self.minutes_entry = ttk.Entry(top_frame, textvariable=self.minutes_var, width=5)
        self.minutes_entry.pack(side=tk.LEFT, padx=5)

        self.start_btn = ttk.Button(top_frame, text="▶ 시작", command=self.start_with_exclude_dialog)
        self.start_btn.pack(side=tk.LEFT, padx=10)

        self.stop_btn = ttk.Button(top_frame, text="⏹ 중지", command=self.stop_monitoring, state=tk.DISABLED)
        self.stop_btn.pack(side=tk.LEFT)

        # 남은 시간 표시
        self.time_label = ttk.Label(top_frame, text="대기 중", font=("Arial", 12, "bold"))
        self.time_label.pack(side=tk.RIGHT)

        # 중간 프레임 - 창 목록
        list_frame = ttk.LabelFrame(self.root, text="추적 중인 창 목록", padding="10")
        list_frame.pack(fill=tk.BOTH, expand=True, padx=10, pady=5)

        # 트리뷰
        columns = ("상태", "프로세스", "창 제목")
        self.tree = ttk.Treeview(list_frame, columns=columns, show="headings", height=12)
        self.tree.heading("상태", text="상태")
        self.tree.heading("프로세스", text="프로세스")
        self.tree.heading("창 제목", text="창 제목")

        self.tree.column("상태", width=100, anchor=tk.CENTER)
        self.tree.column("프로세스", width=150)
        self.tree.column("창 제목", width=350)

        scrollbar = ttk.Scrollbar(list_frame, orient=tk.VERTICAL, command=self.tree.yview)
        self.tree.configure(yscrollcommand=scrollbar.set)

        self.tree.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        scrollbar.pack(side=tk.RIGHT, fill=tk.Y)

        # 하단 프레임 - 로그
        log_frame = ttk.LabelFrame(self.root, text="로그", padding="10")
        log_frame.pack(fill=tk.BOTH, expand=True, padx=10, pady=5)

        self.log_text = tk.Text(log_frame, height=6, state=tk.DISABLED)
        log_scroll = ttk.Scrollbar(log_frame, orient=tk.VERTICAL, command=self.log_text.yview)
        self.log_text.configure(yscrollcommand=log_scroll.set)
        self.log_text.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        log_scroll.pack(side=tk.RIGHT, fill=tk.Y)

        # 안내 문구
        info_frame = ttk.Frame(self.root, padding="5")
        info_frame.pack(fill=tk.X)
        ttk.Label(info_frame,
                  text="※ 시작하면 제외할 프로그램을 선택할 수 있습니다. 시스템 프로세스는 자동 제외됩니다.",
                  foreground="gray").pack()

    def log(self, message):
        """로그 메시지 추가"""
        timestamp = datetime.now().strftime("%H:%M:%S")
        self.log_text.config(state=tk.NORMAL)
        self.log_text.insert(tk.END, f"[{timestamp}] {message}\n")
        self.log_text.see(tk.END)
        self.log_text.config(state=tk.DISABLED)

    def start_with_exclude_dialog(self):
        """시작 전 제외 프로그램 선택 다이얼로그 표시"""
        try:
            minutes = int(self.minutes_var.get())
            if minutes <= 0:
                raise ValueError()
        except ValueError:
            messagebox.showerror("오류", "올바른 분 값을 입력하세요.")
            return

        # 현재 열린 창 목록 가져오기
        windows = get_all_visible_windows()

        # 시스템 프로세스 제외
        user_windows = [w for w in windows if w.process_name not in SYSTEM_WHITELIST]

        if not user_windows:
            messagebox.showinfo("알림", "추적할 창이 없습니다.")
            return

        # 제외 선택 다이얼로그
        dialog = ExcludeDialog(self.root, user_windows)
        self.root.wait_window(dialog.dialog)

        if dialog.result is None:
            # 취소됨
            return

        self.excluded_hwnds = dialog.result
        self.log(f"제외된 프로그램: {len(self.excluded_hwnds)}개")

        # 모니터링 시작
        self.start_monitoring(minutes, user_windows)

    def start_monitoring(self, minutes, windows):
        """모니터링 시작"""
        self.is_running = True
        self.start_btn.config(state=tk.DISABLED)
        self.stop_btn.config(state=tk.NORMAL)
        self.minutes_entry.config(state=tk.DISABLED)

        self.tracked_windows.clear()
        self.active_hwnds.clear()
        self.end_time = datetime.now() + timedelta(minutes=minutes)

        # 창 목록 설정
        for win in windows:
            if win.hwnd not in self.excluded_hwnds:
                self.tracked_windows[win.hwnd] = win

        self.log(f"모니터링 시작! {minutes}분 동안 {len(self.tracked_windows)}개의 창을 추적합니다.")

        # 모니터링 스레드 시작
        self.monitor_thread = threading.Thread(target=self.monitor_loop, daemon=True)
        self.monitor_thread.start()

        # UI 업데이트 시작
        self.update_ui()

    def stop_monitoring(self):
        """모니터링 중지"""
        self.is_running = False
        self.start_btn.config(state=tk.NORMAL)
        self.stop_btn.config(state=tk.DISABLED)
        self.minutes_entry.config(state=tk.NORMAL)
        self.time_label.config(text="대기 중")
        self.log("모니터링 중지됨")

    def monitor_loop(self):
        """백그라운드에서 활성 창 추적"""
        while self.is_running:
            if datetime.now() >= self.end_time:
                self.root.after(0, self.finish_monitoring)
                break

            # 현재 활성 창 HWND 확인
            current_hwnd = get_foreground_hwnd()
            if current_hwnd and current_hwnd in self.tracked_windows:
                self.active_hwnds.add(current_hwnd)
                self.tracked_windows[current_hwnd].was_active = True

            time.sleep(0.3)  # 0.3초마다 체크

    def update_ui(self):
        """UI 업데이트"""
        if not self.is_running:
            return

        # 남은 시간 업데이트
        remaining = self.end_time - datetime.now()
        if remaining.total_seconds() > 0:
            mins, secs = divmod(int(remaining.total_seconds()), 60)
            self.time_label.config(text=f"남은 시간: {mins:02d}:{secs:02d}")

        # 트리뷰 업데이트
        self.tree.delete(*self.tree.get_children())

        # 제외된 창 먼저
        for hwnd in self.excluded_hwnds:
            for win in get_all_visible_windows():
                if win.hwnd == hwnd:
                    self.tree.insert("", tk.END, values=("🔒 제외됨", win.process_name, win.title[:50]))
                    break

        # 추적 중인 창
        for hwnd, win in self.tracked_windows.items():
            if hwnd in self.active_hwnds or win.was_active:
                status = "✅ 사용됨"
            else:
                status = "⏳ 대기"
            self.tree.insert("", tk.END, values=(status, win.process_name, win.title[:50]))

        if self.is_running:
            self.root.after(200, self.update_ui)

    def finish_monitoring(self):
        """모니터링 종료 및 정리"""
        self.is_running = False
        self.start_btn.config(state=tk.NORMAL)
        self.stop_btn.config(state=tk.DISABLED)
        self.minutes_entry.config(state=tk.NORMAL)
        self.time_label.config(text="완료!")

        self.log("모니터링 완료! 결과 분석 중...")

        # 종료할 창 찾기
        to_close = []
        for hwnd, win in self.tracked_windows.items():
            if hwnd not in self.active_hwnds and not win.was_active:
                # 창이 아직 존재하는지 확인
                if user32.IsWindow(hwnd):
                    to_close.append(win)

        if not to_close:
            self.log("모든 창이 사용되었습니다. 종료할 창이 없습니다.")
            messagebox.showinfo("완료", "모든 창이 사용되었습니다!\n종료할 창이 없습니다.")
            return

        # 확인 대화상자
        proc_list = "\n".join([f"- {w.process_name}: {w.title[:40]}" for w in to_close])
        result = messagebox.askyesno(
            "창 종료 확인",
            f"다음 {len(to_close)}개의 창이 사용되지 않았습니다:\n\n{proc_list}\n\n종료하시겠습니까?"
        )

        if result:
            closed = 0
            for win in to_close:
                # 먼저 WM_CLOSE로 정상 종료 시도
                if close_window(win.hwnd):
                    self.log(f"종료 요청: {win.process_name} ({win.title[:30]})")
                    closed += 1
                    time.sleep(0.5)  # 창이 닫힐 시간

                    # 아직 살아있으면 강제 종료
                    if user32.IsWindow(win.hwnd):
                        if terminate_process(win.pid):
                            self.log(f"강제 종료: {win.process_name}")
                else:
                    # WM_CLOSE 실패 시 강제 종료
                    if terminate_process(win.pid):
                        self.log(f"강제 종료: {win.process_name}")
                        closed += 1

            messagebox.showinfo("완료", f"{closed}개의 창을 종료했습니다.")
        else:
            self.log("사용자가 종료를 취소했습니다.")


def main():
    root = tk.Tk()
    app = WindowCleanerApp(root)
    root.mainloop()


if __name__ == "__main__":
    main()
