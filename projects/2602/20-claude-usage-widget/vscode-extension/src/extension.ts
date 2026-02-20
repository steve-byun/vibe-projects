import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";

const DATA_FILE = path.join(os.homedir(), ".claude-usage.json");
const REFRESH_MS = 15_000; // 15초마다 파일 확인
const STALE_THRESHOLD_MS = 2 * 60 * 1000; // 2분 이상 업데이트 없으면 stale

interface UsageWindow {
  utilization: number;
  resets_at: string;
}

interface UsageData {
  status: "ok" | "error";
  message?: string;
  five_hour?: UsageWindow;
  seven_day?: UsageWindow;
  updated_at: string;
}

let statusBarItem: vscode.StatusBarItem;
let updateTimer: NodeJS.Timeout | undefined;
let fileWatcher: fs.FSWatcher | undefined;

export function activate(context: vscode.ExtensionContext) {
  // Status Bar 아이템 생성 (왼쪽, 높은 우선순위로 눈에 잘 띄게)
  statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    1000
  );
  statusBarItem.command = "claudeUsage.showDetails";

  // 명령어 등록
  context.subscriptions.push(
    vscode.commands.registerCommand("claudeUsage.refresh", () => {
      updateStatusBar();
      vscode.window.showInformationMessage("Claude Usage: 새로고침 완료");
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("claudeUsage.showDetails", showDetails)
  );

  // 파일 감시 (실시간 반영)
  try {
    const dir = path.dirname(DATA_FILE);
    if (fs.existsSync(dir)) {
      fileWatcher = fs.watch(dir, (_, filename) => {
        if (filename === ".claude-usage.json") {
          updateStatusBar();
        }
      });
    }
  } catch {
    // 파일 감시 실패해도 타이머로 동작
  }

  // 타이머 (백업)
  updateTimer = setInterval(updateStatusBar, REFRESH_MS);

  // 초기 업데이트
  updateStatusBar();
  statusBarItem.show();

  context.subscriptions.push(statusBarItem);
  context.subscriptions.push({
    dispose: () => {
      if (updateTimer) clearInterval(updateTimer);
      if (fileWatcher) fileWatcher.close();
    },
  });
}

function readUsageData(): UsageData | null {
  try {
    if (!fs.existsSync(DATA_FILE)) return null;
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function formatTimeRemaining(resetsAt: string): string {
  const now = Date.now();
  const reset = new Date(resetsAt).getTime();
  const diff = reset - now;

  if (diff <= 0) return "곧 리셋";

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 24) {
    const days = Math.floor(hours / 24);
    const remHours = hours % 24;
    return `${days}d ${remHours}h`;
  }
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

function formatTimeRemaining_reverse(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime();
  if (diff < 60_000) return "방금";
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 60) return `${minutes}분`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}시간 ${minutes % 60}분`;
  const days = Math.floor(hours / 24);
  return `${days}일`;
}

function updateStatusBar() {
  const data = readUsageData();

  if (!data) {
    statusBarItem.text = "$(cloud) Claude: --";
    statusBarItem.tooltip = "Bridge 스크립트가 실행 중이 아닙니다";
    statusBarItem.backgroundColor = undefined;
    statusBarItem.color = "#888888";
    return;
  }

  if (data.status === "error") {
    statusBarItem.text = "$(warning) Claude: ERR";
    statusBarItem.tooltip = data.message || "오류 발생";
    statusBarItem.backgroundColor = new vscode.ThemeColor(
      "statusBarItem.errorBackground"
    );
    statusBarItem.color = undefined;
    return;
  }

  // Chrome 확장에서 데이터가 안 들어오고 있는지 체크
  const isStale =
    data.updated_at &&
    Date.now() - new Date(data.updated_at).getTime() > STALE_THRESHOLD_MS;

  if (isStale) {
    const ago = formatTimeRemaining_reverse(data.updated_at);
    statusBarItem.text = "$(alert) Claude: 연결 끊김";
    statusBarItem.tooltip = new vscode.MarkdownString(
      [
        "**$(alert) Chrome 확장 연결 없음**",
        "",
        `마지막 업데이트: ${ago} 전`,
        "",
        "Chrome에서 claude.ai 탭이 열려있는지 확인하세요.",
      ].join("\n\n")
    );
    statusBarItem.backgroundColor = new vscode.ThemeColor(
      "statusBarItem.warningBackground"
    );
    statusBarItem.color = undefined;
    return;
  }

  const fiveHour = data.five_hour;
  if (!fiveHour) {
    statusBarItem.text = "$(cloud) Claude: --";
    statusBarItem.tooltip = "데이터 없음";
    statusBarItem.backgroundColor = undefined;
    return;
  }

  const pct = Math.round(fiveHour.utilization);
  const timeLeft = fiveHour.resets_at
    ? formatTimeRemaining(fiveHour.resets_at)
    : "";

  // 텍스트: 아이콘 + 퍼센트 + 남은 시간
  const icon = pct >= 90 ? "$(flame)" : pct >= 75 ? "$(warning)" : "$(pulse)";
  statusBarItem.text = `${icon} Claude ${pct}% ${timeLeft ? "| " + timeLeft : ""}`;

  // 색상: 0~74% 초록, 75~89% 노란, 90%+ 빨간
  if (pct >= 90) {
    statusBarItem.backgroundColor = new vscode.ThemeColor(
      "statusBarItem.errorBackground"
    );
    statusBarItem.color = undefined;
  } else if (pct >= 75) {
    statusBarItem.backgroundColor = new vscode.ThemeColor(
      "statusBarItem.warningBackground"
    );
    statusBarItem.color = undefined;
  } else {
    statusBarItem.backgroundColor = undefined;
    statusBarItem.color = "#4A9960";
  }

  // 상세 툴팁
  const sevenDay = data.seven_day;
  const fiveHourLine = fiveHour.resets_at
    ? `**5시간 세션** : ${pct}% 사용 (리셋 : ${formatTimeRemaining(fiveHour.resets_at)} 후)`
    : `**5시간 세션** : ${pct}% 사용`;
  const sevenDayLine = sevenDay
    ? sevenDay.resets_at
      ? `**7일 한도** : ${Math.round(sevenDay.utilization)}% 사용 (리셋 : ${formatTimeRemaining(sevenDay.resets_at)} 후)`
      : `**7일 한도** : ${Math.round(sevenDay.utilization)}% 사용`
    : "";

  const lines = [
    fiveHourLine,
    sevenDayLine,
    "",
    `마지막 업데이트: ${new Date(data.updated_at).toLocaleTimeString("ko-KR")}`,
    "",
    "클릭하면 상세 정보 표시",
  ];

  statusBarItem.tooltip = new vscode.MarkdownString(
    lines.filter(Boolean).join("\n\n")
  );
}

function showDetails() {
  const data = readUsageData();

  if (!data || data.status !== "ok") {
    vscode.window.showWarningMessage(
      "Claude Usage 데이터를 가져올 수 없습니다. Bridge 스크립트가 실행 중인지 확인하세요."
    );
    return;
  }

  const fiveHour = data.five_hour!;
  const sevenDay = data.seven_day;

  const fiveHourItem = fiveHour.resets_at
    ? `5시간 세션 : ${Math.round(fiveHour.utilization)}% 사용 (리셋 : ${formatTimeRemaining(fiveHour.resets_at)} 후)`
    : `5시간 세션 : ${Math.round(fiveHour.utilization)}% 사용`;
  const sevenDayItem = sevenDay
    ? sevenDay.resets_at
      ? `7일 한도 : ${Math.round(sevenDay.utilization)}% 사용 (리셋 : ${formatTimeRemaining(sevenDay.resets_at)} 후)`
      : `7일 한도 : ${Math.round(sevenDay.utilization)}% 사용`
    : "";

  const items: string[] = [fiveHourItem, sevenDayItem].filter(Boolean);

  vscode.window.showQuickPick(items, {
    title: "Claude 사용량 상세",
    placeHolder: "현재 사용량 정보",
  });
}

export function deactivate() {
  if (updateTimer) clearInterval(updateTimer);
  if (fileWatcher) fileWatcher.close();
}
