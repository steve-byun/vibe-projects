
:: Compute_torques_sym.m
::"C:\Program Files\MATLAB\R2013b\bin\matlab" -nodisplay -nosplash -r "cd('D:\Gate\artzy\Dev');Compute_torques_sym;quit"
::"C:\Program Files\MATLAB\R2013b\bin\matlab" -nodisplay -nosplash -r "cd('D:\Gate\artzy\Dev');test;quit"
::matlab -nodisplay -nosplash -r "cd('D:\Gate\artzy\Dev');coder;quit"
:: codegen window_data -args {zeros(512,1)} -o window_data -report 
::"C:\Program Files\MATLAB\R2013b\bin\matlab" -nodisplay -nosplash -r "cd('D:\Gate\artzy\Dev');codegen gravityVector -args { zeros(1, 6, 'double'), zeros(1, 6, 'double'), zeros(1, 1, 'double'), zeros(1, 9, 'double'), zeros(1, 9, 'double'), zeros(1, 9, 'double'), zeros(1, 9, 'double'), zeros(1, 9, 'double'), zeros(1, 9, 'double'), zeros(1, 3, 'double'), zeros(1, 3, 'double'), zeros(1, 3, 'double'), zeros(1, 3, 'double'), zeros(1, 3, 'double'), zeros(1, 3, 'double'), zeros(1, 6, 'double'), zeros(1, 6, 'double'), zeros(1, 6, 'double'), zeros(1, 6, 'double'), zeros(1, 6, 'double'), zeros(1, 4, 'double') };quit"
matlab -nodisplay -nosplash -r "cd('D:\Gate\artzy\Dev'); test01; quit"

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

