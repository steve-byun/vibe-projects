@echo off
REM ============================================================
REM  pc_controller (Remote Build PC) Setup - SMB + SSH
REM
REM  Prerequisites:
REM    1. Download OpenSSH-Win64.zip from pc_develop (internet PC)
REM       https://github.com/PowerShell/Win32-OpenSSH/releases
REM    2. Copy this bat file and OpenSSH-Win64.zip to pc_controller
REM    3. Run as Administrator
REM ============================================================

REM === Config (modify as needed) ===
set SHARE_PATH=C:\v3
set SHARE_NAME=v3
set SSH_ZIP=OpenSSH-Win64.zip
set SSH_DIR=C:\OpenSSH
set FAIL=0

echo.
echo ============================================
echo   pc_controller Setup Start
echo   SMB Share + SSH Server Install
echo ============================================
echo.

REM Check admin privileges
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Please run as Administrator!
    pause
    exit /b 1
)

REM 1. SMB Share Setup
echo [1/6] Setting up SMB share... (%SHARE_PATH% -^> \\thisPC\%SHARE_NAME%)
net share %SHARE_NAME%=%SHARE_PATH% /grant:Everyone,FULL 2>nul
echo        Done

REM 2. SMB Firewall
echo [2/6] Enabling SMB firewall rules...
netsh advfirewall firewall set rule group="File and Printer Sharing" new enable=yes >nul 2>&1
echo        Done

REM 3. Install OpenSSH
echo [3/6] Installing OpenSSH Server...
sc query sshd >nul 2>&1
if %errorlevel% equ 0 (
    echo        Already installed, skipping
) else (
    if not exist "%~dp0%SSH_ZIP%" (
        echo        [ERROR] Place %SSH_ZIP% in the same folder as this bat file!
        echo        Download: https://github.com/PowerShell/Win32-OpenSSH/releases
        set FAIL=1
        goto :RESULT
    )
    if not exist "%SSH_DIR%" mkdir "%SSH_DIR%"
    powershell -Command "Expand-Archive -Path '%~dp0%SSH_ZIP%' -DestinationPath '%SSH_DIR%' -Force"
    if exist "%SSH_DIR%\OpenSSH-Win64" (
        xcopy /E /Y "%SSH_DIR%\OpenSSH-Win64\*" "%SSH_DIR%\" >nul
        rmdir /S /Q "%SSH_DIR%\OpenSSH-Win64" >nul 2>&1
    )
    echo        Done: %SSH_DIR%
)

REM 4. Register SSH Service
echo [4/6] Registering SSH service...
sc query sshd >nul 2>&1
if %errorlevel% equ 0 (
    echo        Already registered, skipping
) else (
    powershell -ExecutionPolicy Bypass -File "%SSH_DIR%\install-sshd.ps1"
    echo        Done
)

REM 5. Start SSH Service + Auto-start
echo [5/6] Starting SSH service...
sc config sshd start=auto >nul 2>&1
net start sshd >nul 2>&1
echo        Done

REM 6. SSH Firewall Rule
echo [6/6] Adding SSH firewall rule...
netsh advfirewall firewall add rule name="SSH-In" dir=in localport=22 protocol=tcp action=allow >nul 2>&1
echo        Done

REM Verify sshd is running
sc query sshd | findstr "RUNNING" >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] sshd service is NOT running!
    set FAIL=1
)

:RESULT
echo.
echo ============================================
if %FAIL% equ 0 (
    echo   RESULT: OK - All steps completed
) else (
    echo   RESULT: ERROR - Check messages above
)
echo ============================================
echo.
echo   IP:
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /i "IPv4"') do echo     %%a
echo   SSH Port: 22
echo   Share: \\thisPC_IP\%SHARE_NAME%
echo   Next: Run setup_develop_ssh.bat on pc_develop
echo.
pause
