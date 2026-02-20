@echo off
REM ============================================================
REM  pc_controller (원격 제어기 PC) 설정 - SMB + WinRM 방식
REM  이 파일을 pc_controller에 복사하여 관리자 권한으로 실행
REM ============================================================

REM === 설정 변수 (환경에 맞게 수정) ===
set SHARE_PATH=C:\v3
set SHARE_NAME=v3

echo.
echo ============================================
echo   pc_controller 설정 시작
echo   SMB 공유 + WinRM 활성화
echo ============================================
echo.

REM 관리자 권한 확인
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo [오류] 관리자 권한으로 실행해주세요!
    echo        배치파일 우클릭 - 관리자 권한으로 실행
    pause
    exit /b 1
)

REM 1. SMB 공유 설정
echo [1/4] SMB 공유 설정 중... (%SHARE_PATH% → \\이PC\%SHARE_NAME%)
net share %SHARE_NAME%=%SHARE_PATH% /grant:Everyone,FULL 2>nul
if %errorlevel% equ 0 (
    echo        성공: 공유 생성됨
) else (
    echo        공유가 이미 존재하거나 다른 방법으로 설정됨. 계속 진행...
)

REM 2. SMB 방화벽 규칙
echo [2/4] SMB 방화벽 규칙 활성화 중...
netsh advfirewall firewall set rule group="파일 및 프린터 공유" new enable=yes >nul 2>&1
netsh advfirewall firewall set rule group="File and Printer Sharing" new enable=yes >nul 2>&1
echo        완료

REM 3. WinRM 활성화
echo [3/4] WinRM 활성화 중...
powershell -Command "Enable-PSRemoting -Force -SkipNetworkProfileCheck" >nul 2>&1
echo        완료

REM 4. WinRM 방화벽 규칙
echo [4/4] WinRM 방화벽 규칙 설정 중...
netsh advfirewall firewall add rule name="WinRM-HTTP-In" dir=in localport=5985 protocol=tcp action=allow >nul 2>&1
echo        완료

echo.
echo ============================================
echo   설정 완료!
echo ============================================
echo.
echo   이 PC(pc_controller)의 IP 주소:
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /i "IPv4"') do echo     %%a
echo.
echo   공유 경로: \\이PC의IP\%SHARE_NAME%
echo   WinRM 포트: 5985
echo.
echo   다음 단계: pc_develop에서 setup_develop_winrm.bat 실행
echo.
pause
