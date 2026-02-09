function test_ik_hcr12

clear; close all; clc;

[hcr3params,hcr5params,hcr12params] = HCR_1gen_parameters;
n_dof = 6; n_sol = 8; dh = hcr12params.dh; isHCH12Model1or2 = 'true';

[T,q0,q] = hcr12_degubbing();

T_sol = HCR3_5_12_forward_kinematics(q,dh);
[q1,solExist1] = HCR3_5_12_inverse_kinematics_closed(T,q0,uint16([123;0;0;0]),dh,n_dof,n_sol,isHCH12Model1or2);
[q2,solExist2,xyzError,orientationError,iteration] = HCR3_5_12_inverse_kinematics_iterative(T,q0,uint16([123;0;0;0]),dh,dh,isHCH12Model1or2,1e-10,10);

end

function [T,q0,q] = hcr12_degubbing()

T = [0.995765, 0.049636, -0.077385, 0.000000, 0.021613, -0.944523, -0.327734, 0.00000, -0.089359, 0.324674, -0.941595, 0.000000, 640.131945, 90.001768, -463.767639, 1.000000]';
T = reshape(T,4,4); T(1:3,4) = T(1:3,4)*1e-3;

q0 = [0.026220 , 0.058707, -0.298961, -1.151974, 0.365946, 1.101057]';

q = [0.026410 , 0.059521, -0.299707, -1.151918, 0.365974, 1.101194]';

end