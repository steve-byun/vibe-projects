
@set arg1=%1

:: Compute_torques_sym.m
matlab -nodisplay -nosplash -r "cd('%arg1%');Compute_torques_sym(1);Compute_torques_sym(2);Compute_torques_sym(3);quit"
::matlab -nodisplay -nosplash -r "cd('%arg1%');Compute_torques_sym(3);quit"

:LOOP
TASKLIST | FIND /I "matlab" >nul 2>&1
IF ERRORLEVEL 1 (
  GOTO CONTINUE
) ELSE (
  ECHO matlab is still running
  Timeout /T 5 /Nobreak
  GOTO LOOP
)
:CONTINUE
