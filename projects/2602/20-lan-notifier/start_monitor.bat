@echo off
:: PC B (desktop-39phk2u) - Start notification monitor
:: Copy this file to shell:startup for auto-start on boot
cd /d "%~dp0"
pythonw.exe monitor.py
