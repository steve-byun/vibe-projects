"""
Work Planner - 월간/주간 업무 계획 작성 도구
자동으로 날짜 형식을 맞춰주는 윈도우 프로그램
"""

import tkinter as tk
from tkinter import ttk, scrolledtext
from datetime import datetime, timedelta
import calendar


class WorkPlanner:
    def __init__(self, root):
        self.root = root
        self.root.title("Work Planner - 업무 계획 작성 도구")
        self.root.geometry("800x600")
        self.root.minsize(700, 500)

        # 스타일 설정
        style = ttk.Style()
        style.configure('TNotebook.Tab', padding=[20, 8], font=('맑은 고딕', 10))
        style.configure('TButton', padding=[10, 5], font=('맑은 고딕', 10))
        style.configure('TLabel', font=('맑은 고딕', 10))

        # 입력 필드들 저장 (탭 설정 전에 초기화)
        self.weekly_entries = []
        self.monthly_entries = []
        self.weekly_date_range = ""

        # 탭 생성
        self.notebook = ttk.Notebook(root)
        self.notebook.pack(fill='both', expand=True, padx=10, pady=10)

        # 월간 탭
        self.monthly_frame = ttk.Frame(self.notebook)
        self.notebook.add(self.monthly_frame, text='  월간 Task  ')
        self.setup_monthly_tab()

        # 주간 탭
        self.weekly_frame = ttk.Frame(self.notebook)
        self.notebook.add(self.weekly_frame, text='  주간 Task  ')
        self.setup_weekly_tab()

    def setup_monthly_tab(self):
        """월간 탭 설정"""
        # 상단 프레임 - 제목 및 연월 선택
        top_frame = ttk.Frame(self.monthly_frame)
        top_frame.pack(fill='x', padx=10, pady=10)

        # 제목 입력
        ttk.Label(top_frame, text="월간 제목:").grid(row=0, column=0, sticky='w', pady=5)
        self.monthly_title = ttk.Entry(top_frame, width=60, font=('맑은 고딕', 10))
        self.monthly_title.grid(row=0, column=1, columnspan=4, sticky='w', padx=5, pady=5)
        self.monthly_title.insert(0, "PV 준비 - 4월 PV 로봇 시료 확보 전까지 DV 로봇과 시뮬레이션으로 알고리즘 코드 검증")

        # 연도/월 선택
        ttk.Label(top_frame, text="연도:").grid(row=1, column=0, sticky='w', pady=5)
        current_year = datetime.now().year
        self.year_var = tk.StringVar(value=str(current_year))
        self.year_combo = ttk.Combobox(top_frame, textvariable=self.year_var,
                                        values=[str(y) for y in range(current_year-1, current_year+3)],
                                        width=8, state='readonly')
        self.year_combo.grid(row=1, column=1, sticky='w', padx=5, pady=5)
        self.year_combo.bind('<<ComboboxSelected>>', lambda e: self.generate_weeks())

        ttk.Label(top_frame, text="월:").grid(row=1, column=2, sticky='w', padx=(20, 0), pady=5)
        self.month_var = tk.StringVar(value=str(datetime.now().month))
        self.month_combo = ttk.Combobox(top_frame, textvariable=self.month_var,
                                         values=[str(m) for m in range(1, 13)],
                                         width=5, state='readonly')
        self.month_combo.grid(row=1, column=3, sticky='w', padx=5, pady=5)
        self.month_combo.bind('<<ComboboxSelected>>', lambda e: self.generate_weeks())

        # 주차별 입력 프레임 (스크롤 가능)
        self.weeks_container = ttk.Frame(self.monthly_frame)
        self.weeks_container.pack(fill='both', expand=True, padx=10, pady=5)

        # 스크롤 캔버스
        self.weeks_canvas = tk.Canvas(self.weeks_container)
        scrollbar = ttk.Scrollbar(self.weeks_container, orient='vertical', command=self.weeks_canvas.yview)
        self.weeks_scrollable = ttk.Frame(self.weeks_canvas)

        self.weeks_scrollable.bind('<Configure>',
            lambda e: self.weeks_canvas.configure(scrollregion=self.weeks_canvas.bbox('all')))

        self.weeks_canvas.create_window((0, 0), window=self.weeks_scrollable, anchor='nw')
        self.weeks_canvas.configure(yscrollcommand=scrollbar.set)

        self.weeks_canvas.pack(side='left', fill='both', expand=True)
        scrollbar.pack(side='right', fill='y')

        # 하단 버튼 프레임
        bottom_frame = ttk.Frame(self.monthly_frame)
        bottom_frame.pack(fill='x', padx=10, pady=10)

        ttk.Button(bottom_frame, text="출력", command=self.output_monthly).pack(side='right', padx=5)
        ttk.Button(bottom_frame, text="초기화", command=self.clear_monthly).pack(side='right', padx=5)

        # 초기 주차 생성
        self.generate_weeks()

    def setup_weekly_tab(self):
        """주간 탭 설정"""
        # 상단 프레임 - 제목 및 날짜 범위
        top_frame = ttk.Frame(self.weekly_frame)
        top_frame.pack(fill='x', padx=10, pady=10)

        # 주간 제목 입력
        ttk.Label(top_frame, text="주간 제목:").grid(row=0, column=0, sticky='w', pady=5)
        self.weekly_title = ttk.Entry(top_frame, width=60, font=('맑은 고딕', 10))
        self.weekly_title.grid(row=0, column=1, columnspan=4, sticky='w', padx=5, pady=5)
        self.weekly_title.insert(0, "로봇 동역학 관련 알고리즘 상세 설계 및 시뮬레이션")

        # 날짜 선택
        ttk.Label(top_frame, text="시작일 (월요일):").grid(row=1, column=0, sticky='w', pady=5)

        # 연도
        current_year = datetime.now().year
        self.weekly_year_var = tk.StringVar(value=str(current_year))
        self.weekly_year_combo = ttk.Combobox(top_frame, textvariable=self.weekly_year_var,
                                               values=[str(y) for y in range(current_year-1, current_year+3)],
                                               width=6, state='readonly')
        self.weekly_year_combo.grid(row=1, column=1, sticky='w', padx=2, pady=5)

        # 월
        self.weekly_month_var = tk.StringVar(value=str(datetime.now().month))
        self.weekly_month_combo = ttk.Combobox(top_frame, textvariable=self.weekly_month_var,
                                                values=[str(m) for m in range(1, 13)],
                                                width=4, state='readonly')
        self.weekly_month_combo.grid(row=1, column=2, sticky='w', padx=2, pady=5)
        self.weekly_month_combo.bind('<<ComboboxSelected>>', self.update_weekly_days)

        # 일
        self.weekly_day_var = tk.StringVar()
        self.weekly_day_combo = ttk.Combobox(top_frame, textvariable=self.weekly_day_var,
                                              width=4, state='readonly')
        self.weekly_day_combo.grid(row=1, column=3, sticky='w', padx=2, pady=5)

        # 날짜 범위 표시
        self.date_range_label = ttk.Label(top_frame, text="", font=('맑은 고딕', 10, 'bold'))
        self.date_range_label.grid(row=1, column=4, sticky='w', padx=20, pady=5)

        # 날짜 범위 계산 버튼
        ttk.Button(top_frame, text="날짜 적용", command=self.apply_weekly_date).grid(row=1, column=5, padx=5, pady=5)

        # 요일별 입력 프레임
        days_frame = ttk.LabelFrame(self.weekly_frame, text="일별 Task 입력", padding=10)
        days_frame.pack(fill='both', expand=True, padx=10, pady=5)

        days = ['월', '화', '수', '목', '금']
        self.weekly_entries = []

        for i, day in enumerate(days):
            ttk.Label(days_frame, text=f"[{day}]", width=5, font=('맑은 고딕', 11, 'bold')).grid(row=i, column=0, sticky='w', pady=8)
            entry = ttk.Entry(days_frame, width=80, font=('맑은 고딕', 10))
            entry.grid(row=i, column=1, sticky='ew', padx=10, pady=8)
            self.weekly_entries.append(entry)

        days_frame.columnconfigure(1, weight=1)

        # 하단 버튼 프레임
        bottom_frame = ttk.Frame(self.weekly_frame)
        bottom_frame.pack(fill='x', padx=10, pady=10)

        ttk.Button(bottom_frame, text="출력", command=self.output_weekly).pack(side='right', padx=5)
        ttk.Button(bottom_frame, text="초기화", command=self.clear_weekly).pack(side='right', padx=5)

        # 초기 날짜 설정
        self.update_weekly_days()
        self.set_current_monday()

    def update_weekly_days(self, event=None):
        """월 변경 시 일 콤보박스 업데이트"""
        try:
            year = int(self.weekly_year_var.get())
            month = int(self.weekly_month_var.get())
            days_in_month = calendar.monthrange(year, month)[1]
            self.weekly_day_combo['values'] = [str(d) for d in range(1, days_in_month + 1)]
            if not self.weekly_day_var.get() or int(self.weekly_day_var.get()) > days_in_month:
                self.weekly_day_var.set('1')
        except ValueError:
            pass

    def set_current_monday(self):
        """현재 주의 월요일로 설정"""
        today = datetime.now()
        monday = today - timedelta(days=today.weekday())
        self.weekly_year_var.set(str(monday.year))
        self.weekly_month_var.set(str(monday.month))
        self.update_weekly_days()
        self.weekly_day_var.set(str(monday.day))
        self.apply_weekly_date()

    def apply_weekly_date(self):
        """주간 날짜 범위 적용"""
        try:
            year = int(self.weekly_year_var.get())
            month = int(self.weekly_month_var.get())
            day = int(self.weekly_day_var.get())

            start_date = datetime(year, month, day)
            end_date = start_date + timedelta(days=4)  # 금요일

            self.weekly_date_range = f"[{start_date.strftime('%m/%d')}~{end_date.strftime('%m/%d')}]"
            self.date_range_label.config(text=f"→ {self.weekly_date_range}")
        except ValueError:
            self.date_range_label.config(text="날짜를 선택하세요")

    def get_weeks_in_month(self, year, month):
        """해당 월의 주차 정보 반환 (월요일~금요일 기준)"""
        weeks = []

        # 해당 월의 첫날과 마지막날
        first_day = datetime(year, month, 1)
        last_day = datetime(year, month, calendar.monthrange(year, month)[1])

        # 첫째 주의 월요일 찾기
        if first_day.weekday() == 0:
            current_monday = first_day
        else:
            # 해당 월 1일이 속한 주의 월요일 (이전 달일 수 있음)
            current_monday = first_day - timedelta(days=first_day.weekday())

        week_num = 1
        while current_monday <= last_day:
            friday = current_monday + timedelta(days=4)

            # 해당 주가 이 달에 하루라도 포함되는지 확인
            week_start = max(current_monday, first_day)
            week_end = min(friday, last_day)

            if week_start.month == month or week_end.month == month:
                # 표시할 날짜 범위 (해당 월 내로 제한)
                display_start = current_monday
                display_end = friday

                weeks.append({
                    'week_num': week_num,
                    'start': display_start,
                    'end': display_end,
                    'range_str': f"[{display_start.strftime('%m/%d')}~{display_end.strftime('%m/%d')}]"
                })
                week_num += 1

            current_monday += timedelta(days=7)

            # 다음 달로 넘어가면 종료
            if current_monday.month != month and current_monday > last_day:
                break

        return weeks

    def generate_weeks(self):
        """선택한 연월의 주차 생성"""
        # 기존 위젯 제거
        for widget in self.weeks_scrollable.winfo_children():
            widget.destroy()
        self.monthly_entries = []

        try:
            year = int(self.year_var.get())
            month = int(self.month_var.get())
        except ValueError:
            return

        weeks = self.get_weeks_in_month(year, month)

        for i, week in enumerate(weeks):
            frame = ttk.Frame(self.weeks_scrollable)
            frame.pack(fill='x', pady=5)

            # 날짜 범위 레이블
            date_label = ttk.Label(frame, text=week['range_str'], width=15,
                                   font=('맑은 고딕', 10, 'bold'))
            date_label.pack(side='left', padx=5)

            # Task 입력
            entry = ttk.Entry(frame, width=70, font=('맑은 고딕', 10))
            entry.pack(side='left', fill='x', expand=True, padx=5)

            self.monthly_entries.append({
                'range': week['range_str'],
                'entry': entry
            })

    def output_monthly(self):
        """월간 계획 출력"""
        title = self.monthly_title.get().strip()

        lines = [f"[월간 Tasks] {title}"]

        for item in self.monthly_entries:
            task = item['entry'].get().strip()
            if task:
                lines.append(f"{task} {item['range']}")

        output_text = '\n'.join(lines)
        self.show_output_window("월간 Task 출력", output_text)

    def output_weekly(self):
        """주간 계획 출력"""
        title = self.weekly_title.get().strip()
        date_range = self.weekly_date_range if self.weekly_date_range else "[MM/DD~MM/DD]"

        days = ['월', '화', '수', '목', '금']
        lines = [f"[주간 Tasks] {title} {date_range}"]

        for i, day in enumerate(days):
            task = self.weekly_entries[i].get().strip()
            if task:
                lines.append(f"[{day}] {task}")
            else:
                lines.append(f"[{day}] ")

        # 빈 줄 사이에 넣기 (가독성)
        formatted_lines = [lines[0]]
        for line in lines[1:]:
            formatted_lines.append(line)
            formatted_lines.append("")

        output_text = '\n'.join(formatted_lines).rstrip()
        self.show_output_window("주간 Task 출력", output_text)

    def show_output_window(self, title, text):
        """출력 창 표시"""
        output_win = tk.Toplevel(self.root)
        output_win.title(title)
        output_win.geometry("700x400")
        output_win.transient(self.root)

        # 텍스트 영역
        text_area = scrolledtext.ScrolledText(output_win, font=('맑은 고딕', 11), wrap=tk.WORD)
        text_area.pack(fill='both', expand=True, padx=10, pady=10)
        text_area.insert('1.0', text)

        # 버튼 프레임
        btn_frame = ttk.Frame(output_win)
        btn_frame.pack(fill='x', padx=10, pady=10)

        def copy_to_clipboard():
            output_win.clipboard_clear()
            output_win.clipboard_append(text_area.get('1.0', 'end-1c'))
            copy_btn.config(text="복사됨!")
            output_win.after(1500, lambda: copy_btn.config(text="복사"))

        copy_btn = ttk.Button(btn_frame, text="복사", command=copy_to_clipboard)
        copy_btn.pack(side='right', padx=5)

        ttk.Button(btn_frame, text="닫기", command=output_win.destroy).pack(side='right', padx=5)

    def clear_monthly(self):
        """월간 탭 초기화"""
        self.monthly_title.delete(0, 'end')
        for item in self.monthly_entries:
            item['entry'].delete(0, 'end')

    def clear_weekly(self):
        """주간 탭 초기화"""
        self.weekly_title.delete(0, 'end')
        for entry in self.weekly_entries:
            entry.delete(0, 'end')


def main():
    root = tk.Tk()
    app = WorkPlanner(root)
    root.mainloop()


if __name__ == "__main__":
    main()
