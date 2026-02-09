
@set arg1=%1

::matlab -nodisplay -nosplash -r "cd('%arg1%');codegen gravityVector -args { zeros(1, 6, 'double'), zeros(1, 6, 'double'), zeros(1, 1, 'double'), zeros(1, 9, 'double'), zeros(1, 9, 'double'), zeros(1, 9, 'double'), zeros(1, 9, 'double'), zeros(1, 9, 'double'), zeros(1, 9, 'double'), zeros(1, 3, 'double'), zeros(1, 3, 'double'), zeros(1, 3, 'double'), zeros(1, 3, 'double'), zeros(1, 3, 'double'), zeros(1, 3, 'double'), zeros(1, 6, 'double'), zeros(1, 6, 'double'), zeros(1, 6, 'double'), zeros(1, 6, 'double'), zeros(1, 6, 'double'), zeros(1, 4, 'double') };quit"
::matlab -nodisplay -nosplash -r "cd('%arg1%');cfg = coder.config('mex');cfg.TargetLang='c++';codegen -config cfg gravityVector -args { zeros(1, 6, 'double'), zeros(1, 6, 'double'), zeros(1, 1, 'double'), zeros(1, 9, 'double'), zeros(1, 9, 'double'), zeros(1, 9, 'double'), zeros(1, 9, 'double'), zeros(1, 9, 'double'), zeros(1, 9, 'double'), zeros(1, 3, 'double'), zeros(1, 3, 'double'), zeros(1, 3, 'double'), zeros(1, 3, 'double'), zeros(1, 3, 'double'), zeros(1, 3, 'double'), zeros(1, 6, 'double'), zeros(1, 6, 'double'), zeros(1, 6, 'double'), zeros(1, 6, 'double'), zeros(1, 6, 'double'), zeros(1, 4, 'double') };quit"
matlab -nodisplay -nosplash -r "cd('%arg1%');cfg = coder.config('lib');cfg.TargetLang='c++';codegen -config cfg gravityVector -args { zeros(1, 6, 'double'), zeros(1, 6, 'double'), zeros(1, 1, 'double'), zeros(1, 9, 'double'), zeros(1, 9, 'double'), zeros(1, 9, 'double'), zeros(1, 9, 'double'), zeros(1, 9, 'double'), zeros(1, 9, 'double'), zeros(1, 3, 'double'), zeros(1, 3, 'double'), zeros(1, 3, 'double'), zeros(1, 3, 'double'), zeros(1, 3, 'double'), zeros(1, 3, 'double'), zeros(1, 6, 'double'), zeros(1, 6, 'double'), zeros(1, 6, 'double'), zeros(1, 6, 'double'), zeros(1, 6, 'double'), zeros(1, 4, 'double') };quit"

:LOOP1
TASKLIST | FIND /I "matlab" >nul 2>&1
IF ERRORLEVEL 1 (
  GOTO CONTINUE1
) ELSE (
  ECHO matlab is still running
  Timeout /T 5 /Nobreak
  GOTO LOOP1
)
:CONTINUE1

matlab -nodisplay -nosplash -r "cd('%arg1%');cfg = coder.config('lib');cfg.TargetLang='c++';codegen -config cfg coriolisMatrix -args { zeros(1, 6, 'double'), zeros(1, 6, 'double'), zeros(1, 1, 'double'), zeros(1, 9, 'double'), zeros(1, 9, 'double'), zeros(1, 9, 'double'), zeros(1, 9, 'double'), zeros(1, 9, 'double'), zeros(1, 9, 'double'), zeros(1, 3, 'double'), zeros(1, 3, 'double'), zeros(1, 3, 'double'), zeros(1, 3, 'double'), zeros(1, 3, 'double'), zeros(1, 3, 'double'), zeros(1, 6, 'double'), zeros(1, 6, 'double'), zeros(1, 6, 'double'), zeros(1, 6, 'double'), zeros(1, 6, 'double'), zeros(1, 4, 'double') };quit"

:LOOP2
TASKLIST | FIND /I "matlab" >nul 2>&1
IF ERRORLEVEL 1 (
  GOTO CONTINUE2
) ELSE (
  ECHO matlab is still running
  Timeout /T 5 /Nobreak
  GOTO LOOP2
)
:CONTINUE2

matlab -nodisplay -nosplash -r "cd('%arg1%');cfg = coder.config('lib');cfg.TargetLang='c++';codegen -config cfg inertiaMatrix -args { zeros(1, 6, 'double'), zeros(1, 6, 'double'), zeros(1, 1, 'double'), zeros(1, 9, 'double'), zeros(1, 9, 'double'), zeros(1, 9, 'double'), zeros(1, 9, 'double'), zeros(1, 9, 'double'), zeros(1, 9, 'double'), zeros(1, 3, 'double'), zeros(1, 3, 'double'), zeros(1, 3, 'double'), zeros(1, 3, 'double'), zeros(1, 3, 'double'), zeros(1, 3, 'double'), zeros(1, 6, 'double'), zeros(1, 6, 'double'), zeros(1, 6, 'double'), zeros(1, 6, 'double'), zeros(1, 6, 'double'), zeros(1, 4, 'double') };quit"

:LOOP3
TASKLIST | FIND /I "matlab" >nul 2>&1
IF ERRORLEVEL 1 (
  GOTO CONTINUE3
) ELSE (
  ECHO matlab is still running
  Timeout /T 5 /Nobreak
  GOTO LOOP3
)
:CONTINUE3
