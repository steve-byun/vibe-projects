import os
import sys
import subprocess
import time
import shutil
import txt_to_m
import remove_useless_include_files

def ExecAndWaitQuit(command, process_name, sleep_time):
    p = subprocess.Popen(command, shell=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
    command='TASKLIST | FIND /I "'+ process_name +'"'
    is_quit = False
    while True != is_quit:
        process_list = os.popen(command)
        
        for process in process_list:
            print('enter for')
            if process_name in process.lower():
                print(process)
                break
            else:
                print('quit')
                is_quit = True
                break
        else:
            print('nothing in process_list')
            print('quit')
            is_quit = True

        print('wait')
        time.sleep(sleep_time)
        
def ExecuteWithOutputMessage(command, process_name, sleep_time):
    p = subprocess.Popen(command, shell=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
    command='TASKLIST | FIND /I "'+ process_name +'"'
    #stdout, stderr = p.communicate()

    #if p.returncode == 0: # is 0 if success
    #    print(stdout)
    #else:
    #    print(stderr)
    print("OK!!!")
        
def copy_all_file_in_dir(src, dst):
    src_files = os.listdir(src)
    for file_name in src_files:
        full_file_name = os.path.join(src, file_name)
        if (os.path.isfile(full_file_name)):
            shutil.copy(full_file_name, dst)    
    
def main():
    # Start
    current_path = os.getcwd()
    sleep_time=1
    process_name='matlab'


    # # gennerate text file
    command='matlab -nodisplay -nosplash -r "cd(\'' + current_path + '\');Compute_torques_sym(1);Compute_torques_sym(2);Compute_torques_sym(3);quit"'
    # command='matlab -nodisplay -nosplash -r "cd(\'' + current_path + '\');Compute_torques_sym(3);quit"'
    ExecAndWaitQuit(command, process_name, sleep_time)


    # gennerate m file from text file
    command='coriolisMatrix.txt'
    txt_to_m.txt_to_m(command)

    command='gravityVector.txt'
    txt_to_m.txt_to_m(command)

    command='inertiaMatrix.txt'
    txt_to_m.txt_to_m(command)


    # gennerate cpp file
    sleep_time=1
    process_name='matlab'

    command="matlab -nodisplay -nosplash -r \"cd(\'" + current_path + "\');cfg = coder.config('lib');cfg.TargetLang='c++';codegen -config cfg gravityVector -args { zeros(1, 7, 'double'), zeros(1, 6, 'double'), zeros(1, 1, 'double'), zeros(1, 9, 'double'), zeros(1, 9, 'double'), zeros(1, 9, 'double'), zeros(1, 9, 'double'), zeros(1, 9, 'double'), zeros(1, 9, 'double'), zeros(1, 3, 'double'), zeros(1, 3, 'double'), zeros(1, 3, 'double'), zeros(1, 3, 'double'), zeros(1, 3, 'double'), zeros(1, 3, 'double'), zeros(1, 6, 'double'), zeros(1, 6, 'double'), zeros(1, 6, 'double'), zeros(1, 6, 'double'), zeros(1, 6, 'double'), zeros(1, 4, 'double') };quit\""
    ExecAndWaitQuit(command, process_name, sleep_time)

    command="matlab -nodisplay -nosplash -r \"cd(\'" + current_path + "\');cfg = coder.config('lib');cfg.TargetLang='c++';codegen -config cfg coriolisMatrix -args { zeros(1, 7, 'double'), zeros(1, 6, 'double'), zeros(1, 1, 'double'), zeros(1, 9, 'double'), zeros(1, 9, 'double'), zeros(1, 9, 'double'), zeros(1, 9, 'double'), zeros(1, 9, 'double'), zeros(1, 9, 'double'), zeros(1, 3, 'double'), zeros(1, 3, 'double'), zeros(1, 3, 'double'), zeros(1, 3, 'double'), zeros(1, 3, 'double'), zeros(1, 3, 'double'), zeros(1, 6, 'double'), zeros(1, 6, 'double'), zeros(1, 6, 'double'), zeros(1, 6, 'double'), zeros(1, 6, 'double'), zeros(1, 4, 'double') };quit\""
    ExecAndWaitQuit(command, process_name, sleep_time)

    command="matlab -nodisplay -nosplash -r \"cd(\'" + current_path + "\');cfg = coder.config('lib');cfg.TargetLang='c++';codegen -config cfg inertiaMatrix -args { zeros(1, 7, 'double'), zeros(1, 6, 'double'), zeros(1, 1, 'double'), zeros(1, 9, 'double'), zeros(1, 9, 'double'), zeros(1, 9, 'double'), zeros(1, 9, 'double'), zeros(1, 9, 'double'), zeros(1, 9, 'double'), zeros(1, 3, 'double'), zeros(1, 3, 'double'), zeros(1, 3, 'double'), zeros(1, 3, 'double'), zeros(1, 3, 'double'), zeros(1, 3, 'double'), zeros(1, 6, 'double'), zeros(1, 6, 'double'), zeros(1, 6, 'double'), zeros(1, 6, 'double'), zeros(1, 6, 'double'), zeros(1, 4, 'double') };quit\""
    ExecAndWaitQuit(command, process_name, sleep_time)


    # remove_useless_include_files
    sleep_time=1
    process_name='python'

    command = "codegen\lib\gravityVector\gravityVector"
    remove_useless_include_files.remove_useless_include_files(command)

    command = "codegen\lib\coriolisMatrix\coriolisMatrix"
    remove_useless_include_files.remove_useless_include_files(command)

    command = "codegen\lib\inertiaMatrix\inertiaMatrix"
    remove_useless_include_files.remove_useless_include_files(command)

    # copy /y results\* D:\Gate\Work\new
    copy_all_file_in_dir("results", "D:\Gate\Work\source\plugin\zed\plugin_zed_hcr5_direct_teach_safety\hcr5_dynamics")
    #shutil.copyfile("D:/Gate/artzy/Dev_1/results", "D:/Gate/Work/new")

if __name__ == "__main__":
    main()
