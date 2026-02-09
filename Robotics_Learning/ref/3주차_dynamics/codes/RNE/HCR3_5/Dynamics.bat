
@set arg1=%cd%

::gen_text_file.bat 
::matlab -nodisplay -nosplash -r "cd('D:\Gate\artzy\Dev');Compute_torques_sym(1);Compute_torques_sym(2);Compute_torques_sym(3);quit"
::matlab -nodisplay -nosplash -r "cd('D:\Gate\artzy\Dev');Compute_torques_sym(3);quit"

@call gen_text_file.bat %arg1%

:LOOP
TASKLIST | FIND /I "gen_text_file" >nul 2>&1
IF ERRORLEVEL 1 (
  GOTO CONTINUE
) ELSE (
  ECHO gen_text_file is still running
  Timeout /T 5 /Nobreak
  GOTO LOOP
)
:CONTINUE

python txt_to_m.py gravityVector.txt
python txt_to_m.py coriolisMatrix.txt
python txt_to_m.py inertiaMatrix.txt

::gen_cpp_file.bat
::matlab -nodisplay -nosplash -r "cd('D:\Gate\artzy');codegen gravityVector -args { zeros(1, 6, 'double'), zeros(1, 6, 'double'), zeros(1, 1, 'double'), zeros(1, 9, 'double'), zeros(1, 9, 'double'), zeros(1, 9, 'double'), zeros(1, 9, 'double'), zeros(1, 9, 'double'), zeros(1, 9, 'double'), zeros(1, 3, 'double'), zeros(1, 3, 'double'), zeros(1, 3, 'double'), zeros(1, 3, 'double'), zeros(1, 3, 'double'), zeros(1, 3, 'double'), zeros(1, 6, 'double'), zeros(1, 6, 'double'), zeros(1, 6, 'double'), zeros(1, 6, 'double'), zeros(1, 6, 'double'), zeros(1, 4, 'double') };quit"
::matlab -nodisplay -nosplash -r "cd('D:\Gate\artzy');cfg = coder.config('mex');cfg.TargetLang='c++';codegen -config cfg gravityVector -args { zeros(1, 6, 'double'), zeros(1, 6, 'double'), zeros(1, 1, 'double'), zeros(1, 9, 'double'), zeros(1, 9, 'double'), zeros(1, 9, 'double'), zeros(1, 9, 'double'), zeros(1, 9, 'double'), zeros(1, 9, 'double'), zeros(1, 3, 'double'), zeros(1, 3, 'double'), zeros(1, 3, 'double'), zeros(1, 3, 'double'), zeros(1, 3, 'double'), zeros(1, 3, 'double'), zeros(1, 6, 'double'), zeros(1, 6, 'double'), zeros(1, 6, 'double'), zeros(1, 6, 'double'), zeros(1, 6, 'double'), zeros(1, 4, 'double') };quit"
::matlab -nodisplay -nosplash -r "cd('D:\Gate\artzy\Dev');cfg = coder.config('lib');cfg.TargetLang='c++';codegen -config cfg gravityVector -args { zeros(1, 6, 'double'), zeros(1, 6, 'double'), zeros(1, 1, 'double'), zeros(1, 9, 'double'), zeros(1, 9, 'double'), zeros(1, 9, 'double'), zeros(1, 9, 'double'), zeros(1, 9, 'double'), zeros(1, 9, 'double'), zeros(1, 3, 'double'), zeros(1, 3, 'double'), zeros(1, 3, 'double'), zeros(1, 3, 'double'), zeros(1, 3, 'double'), zeros(1, 3, 'double'), zeros(1, 6, 'double'), zeros(1, 6, 'double'), zeros(1, 6, 'double'), zeros(1, 6, 'double'), zeros(1, 6, 'double'), zeros(1, 4, 'double') };quit"

@call gen_cpp_file.bat %arg1%

:LOOP1
TASKLIST | FIND /I "gen_cpp_file" >nul 2>&1
IF ERRORLEVEL 1 (
  GOTO CONTINUE1
) ELSE (
  ECHO gen_cpp_file is still running
  Timeout /T 5 /Nobreak
  GOTO LOOP1
)
:CONTINUE1

remove_useless_include_files.py codegen\lib\coriolisMatrix\coriolisMatrix
remove_useless_include_files.py codegen\lib\inertiaMatrix\inertiaMatrix
remove_useless_include_files.py codegen\lib\gravityVector\gravityVector

copy /y results\* D:\Gate\Work\new