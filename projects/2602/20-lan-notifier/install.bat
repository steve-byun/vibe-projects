@echo off
chcp 65001 >nul 2>&1
echo ============================================
echo   LAN Notifier - Install Dependencies
echo ============================================
echo.

echo [1/4] winsdk (Windows notification listener - for PC B)
pip install winsdk

echo.
echo [2/4] win11toast (Toast notification - for PC A)
pip install win11toast

echo.
echo [3/4] pystray + Pillow (System tray icon - for PC A)
pip install pystray Pillow

echo.
echo [4/4] pywin32 (Outlook COM fallback - optional)
pip install pywin32

echo.
echo ============================================
echo   Done!
echo ============================================
echo.
echo   Next steps:
echo   1. Edit config.py - set TARGET_HOST to your main PC IP
echo   2. Main PC:          python receiver.py
echo   3. desktop-39phk2u:  python monitor.py
echo.
pause
