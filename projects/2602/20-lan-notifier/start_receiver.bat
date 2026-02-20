@echo off
:: Main PC (PC A) - Start notification receiver
:: Copy this file to shell:startup for auto-start on boot
cd /d "%~dp0"
pythonw.exe receiver.py
