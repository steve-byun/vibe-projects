# m_to_cpp.py
import sys
import os.path

def create_file_function_table():
    global function_table
    # "filename", "function_name", "return_name", size_of_array
    function_table = [("gravityVector", "gravityVector", "gravity", 6),("coriolisMatrix", "coriolisMatrix", "coriolis", 36),("inertiaMatrix", "inertiaMatrix", "inertia", 36)]
    for a, b, c, d in function_table:
       print (a, b, c, d)
def get_rid_of_extation(filename):
    tmp_fname = os.path.splitext(filename)
    return tmp_fname[0]

def get_funcion_name(filename):
    #print(filename)
    for a, b, c, d in function_table:
        #print(a, b, c, d)
        if a == filename:
            return b

def get_return_name(filename):
    #print(filename)
    for a, b, c, d in function_table:
        #print(a, b, c, d)
        if a == filename:
            return c

def get_param_convert():
    #param_convert.txt
    f = open("param_convert.txt", 'r')
    param_convert=''
    while True:
        line = f.readline()
        if not line: break
        param_convert += line
    f.close()
    return param_convert

def get_array_size(filename):
    #print(filename)
    for a, b, c, d in function_table:
        #print(a)
        if a == filename:
            return d
    return 0
            
def get_replace_arrayName(count, line):
    #print(line)
    arr = line.split('=')
    newLine = "A{0} = {1}".format(count, arr[1])
    return newLine
    
def read_m_file_functions(filename):
    global funcBody1
    global funcBody2
    funcBody1 = ''
    funcBody2 = ''
    filename_ext = filename+'.txt'
    f = open(filename_ext, 'r')
    count =0;
    while True:
        line = f.readline()
        
        if not line: break
       
        if 'A0[' in line:
            #print(line)
            newline = get_replace_arrayName(count, line)
            print(newline)
            funcBody2+=newline
            count += 1
        else:
            print(line)
            funcBody1 += line;

    #print("count:",count)
    
    MaxArraySize = get_array_size(filename)
    #print("MaxArraySize:", MaxArraySize)
    while True:
        if count < MaxArraySize:
            newline = "A{0} = 0;".format(count)
            print(newline)
            funcBody2 += newline
            count += 1
        else:
            break
            
    f.close()

def get_function_head(filename):
    return_name = get_return_name(filename)
    function_name = get_funcion_name(filename)
    params ="(lengthVector, massVector, g, inertiaTensor_1, inertiaTensor_2, inertiaTensor_3, inertiaTensor_4, inertiaTensor_5, inertiaTensor_6,  COMVector_1, COMVector_2, COMVector_3, COMVector_4, COMVector_5, COMVector_6, angleVector, angleVelocityVector, angularAccelerationVector, sinVector, cosVector, tiltVector)"
    function_head = "function {0} = {1}{2}\n".format(return_name, function_name, params)
    return function_head

def get_function_result(filename):
    return_name = get_return_name(filename)
    MaxArraySize = get_array_size(filename)
    #print (MaxArraySize)
    return_val = ""
    if MaxArraySize == 6:
        return_val="{0} = [A0 A1 A2 A3 A4 A5];".format(return_name)
    elif MaxArraySize == 36:
        return_val="{0} = [A0 A1 A2 A3 A4 A5 A6 A7 A8 A9 A10 A11 A12 A13 A14 A15 A16 A17 A18 A19 A20 A21 A22 A23 A24 A25 A26 A27 A28 A29 A30 A31 A32 A33 A34 A35];\n".format(return_name)
    else:
        return_val="none"
    
    print (return_val)
    return return_val

def save_result(filename, data):
    function_name = get_funcion_name(filename)
    newfilename = function_name+'.m'
    f = open(newfilename, 'w')
    f.write(data)
    f.close()
    
def txt_to_m(filename):
        
    create_file_function_table()

    filename = get_rid_of_extation(filename)

    read_m_file_functions(filename)

    function_head = get_function_head(filename)
    
    param_convert = get_param_convert()

    function_result = get_function_result(filename)

    file_data = function_head + param_convert + funcBody1 + "\n" + funcBody2 + "\n" + function_result + "\nend"

    save_result(filename, file_data)

    
def main():
    #args = sys.argv[1:]
    #for filename in args:

    if len(sys.argv) == 1:
        print("usage: txt_to_m.py filename\n")
        quit()
        
    create_file_function_table()

    filename = sys.argv[1]

    filename = get_rid_of_extation(filename)

    read_m_file_functions(filename)

    function_head = get_function_head(filename)
    
    param_convert = get_param_convert()

    function_result = get_function_result(filename)

    file_data = function_head + param_convert + funcBody1 + "\n" + funcBody2 + "\n" + function_result + "\nend"

    save_result(filename, file_data)

    quit()
    #print (file_conntent)

if __name__ == "__main__":
    main()

