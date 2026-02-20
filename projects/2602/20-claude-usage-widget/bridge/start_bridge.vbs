' Claude Usage Bridge - 백그라운드 시작 스크립트
' 이 파일을 시작 프로그램에 바로가기로 등록하면 PC 부팅 시 자동 시작
' 경로: shell:startup 에 바로가기 생성
Set WshShell = CreateObject("WScript.Shell")
WshShell.Run "pythonw """ & Replace(WScript.ScriptFullName, "start_bridge.vbs", "claude_usage_bridge.py") & """", 0, False
