
call test01.bat

:LOOP
TASKLIST | FIND /I "test01" >nul 2>&1
IF ERRORLEVEL 1 (
  GOTO CONTINUE
) ELSE (
  ECHO test01 is still running
  Timeout /T 5 /Nobreak
  GOTO LOOP
)
:CONTINUE

python txt_to_m.py gravityVector.txt
