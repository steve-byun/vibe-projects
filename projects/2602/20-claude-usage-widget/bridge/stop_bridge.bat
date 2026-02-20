@echo off
REM Claude Usage Bridge 서버 종료
taskkill /F /IM pythonw.exe /FI "WINDOWTITLE eq *claude_usage_bridge*" 2>nul
FOR /F "tokens=2" %%i IN ('netstat -ano ^| findstr :19283 ^| findstr LISTENING') DO taskkill /F /PID %%i 2>nul
echo Bridge 서버 종료됨
