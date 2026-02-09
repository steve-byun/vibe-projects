clear; close all; clc;

[hcr3params,hcr5params,hcr12params] = HCR_1gen_parameters;
dh = hcr5params.dh;

T = [   -0.0000   -1.0000    0.0000    0.1839
   -1.0000    0.0000   -0.0000    0.2828
    0.0000   -0.0000   -1.0000    0.2000
         0         0         0    1.0000];
     
q0 = [1.5242   -1.3041   -2.5705   -0.8379    1.5708   -1.6174]';

[q_ref,solExist_ref] = HCR3_5_inverse_kinematics_closed(T,q0,uint16([123;0;0;0]),dh);