import os
import sys
import subprocess


# gen_text_file.bat 
## matlab -nodisplay -nosplash -r "cd('D:\Gate\artzy\Dev');Compute_torques_sym(1);Compute_torques_sym(2);Compute_torques_sym(3);quit"
## matlab -nodisplay -nosplash -r "cd('D:\Gate\artzy\Dev');Compute_torques_sym(3);quit"

# python txt_to_m.py gravityVector.txt

# gen_cpp_file.bat
## matlab -nodisplay -nosplash -r "cd('D:\Gate\artzy');codegen gravityVector -args { zeros(1, 6, 'double'), zeros(1, 6, 'double'), zeros(1, 1, 'double'), zeros(1, 9, 'double'), zeros(1, 9, 'double'), zeros(1, 9, 'double'), zeros(1, 9, 'double'), zeros(1, 9, 'double'), zeros(1, 9, 'double'), zeros(1, 3, 'double'), zeros(1, 3, 'double'), zeros(1, 3, 'double'), zeros(1, 3, 'double'), zeros(1, 3, 'double'), zeros(1, 3, 'double'), zeros(1, 6, 'double'), zeros(1, 6, 'double'), zeros(1, 6, 'double'), zeros(1, 6, 'double'), zeros(1, 6, 'double'), zeros(1, 4, 'double') };quit"
## matlab -nodisplay -nosplash -r "cd('D:\Gate\artzy');cfg = coder.config('mex');cfg.TargetLang='c++';codegen -config cfg gravityVector -args { zeros(1, 6, 'double'), zeros(1, 6, 'double'), zeros(1, 1, 'double'), zeros(1, 9, 'double'), zeros(1, 9, 'double'), zeros(1, 9, 'double'), zeros(1, 9, 'double'), zeros(1, 9, 'double'), zeros(1, 9, 'double'), zeros(1, 3, 'double'), zeros(1, 3, 'double'), zeros(1, 3, 'double'), zeros(1, 3, 'double'), zeros(1, 3, 'double'), zeros(1, 3, 'double'), zeros(1, 6, 'double'), zeros(1, 6, 'double'), zeros(1, 6, 'double'), zeros(1, 6, 'double'), zeros(1, 6, 'double'), zeros(1, 4, 'double') };quit"
## matlab -nodisplay -nosplash -r "cd('D:\Gate\artzy\Dev');cfg = coder.config('lib');cfg.TargetLang='c++';codegen -config cfg gravityVector -args { zeros(1, 6, 'double'), zeros(1, 6, 'double'), zeros(1, 1, 'double'), zeros(1, 9, 'double'), zeros(1, 9, 'double'), zeros(1, 9, 'double'), zeros(1, 9, 'double'), zeros(1, 9, 'double'), zeros(1, 9, 'double'), zeros(1, 3, 'double'), zeros(1, 3, 'double'), zeros(1, 3, 'double'), zeros(1, 3, 'double'), zeros(1, 3, 'double'), zeros(1, 3, 'double'), zeros(1, 6, 'double'), zeros(1, 6, 'double'), zeros(1, 6, 'double'), zeros(1, 6, 'double'), zeros(1, 6, 'double'), zeros(1, 4, 'double') };quit"

# command='matlab -nodisplay -nosplash -r "cd(\'D:/Gate/artzy/Dev\');Compute_torques_sym(3);quit"'
command='gen_text_file.bat'
p = subprocess.Popen(command, shell=False, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
p.wait()
stdout, stderr = p.communicate()

if p.returncode == 0: # is 0 if success
    print(stdout)
    
else:
    print(stderr)

command='python txt_to_m.py gravityVector.txt'
p = subprocess.Popen(command, shell=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
p.wait()
stdout, stderr = p.communicate()

if p.returncode == 0: # is 0 if success
    print(stdout)
    
else:
    print(stderr)
