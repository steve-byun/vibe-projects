import sys
import os.path

def get_rid_of_extation(filename):
    tmp_fname = os.path.splitext(filename)
    return tmp_fname[0]

def read_and_modify_file(filename):
    data =''
    f = open(filename, 'r')
    while True:
        line = f.readline()
        
        if not line: break
       
        #print(line)
        if '#include "rtwtypes.h"' in line or '_types.h"' in line or '#include "rt_nonfinite.h"' in line:
            continue
        else:
            #print(line)
            data += line;
    f.close()
    
    #print(data)
    return data
    
    
def save_file(filename, data):
    # write file
    pathname = 'results'
    if not os.path.isdir(pathname):
        os.mkdir(pathname)
        
    f = open(pathname + '/' + filename, 'w')
    f.write(data)
    f.close()

def remove_useless_include_files(filename):
    filename = get_rid_of_extation(filename)
    print (filename)
    newFilename = os.path.basename(filename)
    
    data = read_and_modify_file(filename+'.h')
    save_file(newFilename+'.h', data)

    data = read_and_modify_file(filename+'.cpp')
    save_file(newFilename+'.cpp', data)


def main():
    if len(sys.argv) == 1:
        print("usage: txt_to_m.py filename\n")
        quit()

    filename = sys.argv[1]

    filename = get_rid_of_extation(filename)
    print (filename)
    newFilename = os.path.basename(filename)
    
    data = read_and_modify_file(filename+'.h')
    save_file(newFilename+'.h', data)

    data = read_and_modify_file(filename+'.cpp')
    save_file(newFilename+'.cpp', data)

        

if __name__ == "__main__":
    main()
