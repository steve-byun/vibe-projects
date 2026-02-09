function excavator_kinematic_modeling

clear; close all; clc;

n_dof = 4; % # of degrees of freedom

% % define parameters ----------------------------------------------------
% dh params 
q = sym('q', [n_dof 1], 'real');
dotq = sym('dotq', [n_dof 1], 'real');
param.dh.a = sym('a', [n_dof 1], 'real'); % distance between ziprev and zi along xi
param.dh.d = sym('d', [n_dof 1], 'real'); % distance between xiprev and xi along ziprev
param.dh.alpha = sym('alpha', [n_dof 1], 'real'); % angle between ziprev and zi alignment with xi
param.dh.d(2:n_dof) = sym(zeros(n_dof-1, 1));
param.dh.alpha = sym(zeros(n_dof, 1)); param.dh.alpha(1) = sym(pi*0.5);

syms cyl_swing cyl_boom cyl_arm cyl_bucket real; 
syms vel_cyl_swing vel_cyl_boom vel_cyl_arm vel_cyl_bucket real;
len_cyl = [cyl_swing; cyl_boom; cyl_arm; cyl_bucket];
vel_cyl = [vel_cyl_swing; vel_cyl_boom; vel_cyl_arm; vel_cyl_bucket];

% link 1 lengths & angles
param.len_JM = sym('len_JM', 'real');
param.len_0M = sym('len_0M', 'real');
param.len_01 = sym('len_01', 'real');
param.len_0K = sym('len_0K', 'real');
param.len_0J = sym('len_0K', 'real');
param.P_1_1_Kx = sym('P_1_1_Kx', 'real');
param.P_1_1_Ky = sym('P_1_1_Ky', 'real');
param.P_1_1_Kz = sym('P_1_1_Kz', 'real');
param.ang_10K = sym('ang_10K', 'real');

% link 2 lengths & angles
param.len_1A = sym('len_1A', 'real');
param.len_1B = sym('len_1B', 'real');
param.ang_B12 = sym('ang_B12', 'real');
param.ang_A10 = sym('ang_A10', 'real');

% link 3 lengths & angles
param.len_2C = sym('len_2C', 'real');
param.len_2D = sym('len_2D', 'real');
param.len_CD = sym('len_CD', 'real');
param.ang_12C = sym('ang_12C', 'real');
param.ang_D23 = sym('ang_D23', 'real');

% link 4 lengths & angles
param.len_EF = sym('len_EF', 'real');
param.len_FH = sym('len_FH', 'real');
param.len_3F = sym('len_3F', 'real');
param.len_3G = sym('len_3G', 'real');
param.len_3D = sym('len_3D', 'real');
param.len_23 = sym('len_23', 'real');
param.len_GH = sym('len_GH', 'real');
param.ang_DFE = sym('ang_DFE', 'real');
param.ang_G34 = sym('ang_G34', 'real');

% % support functions ----------------------------------------------------
% SE3 
transformation_fn = @ (theta, a, alpha, d) ...
    ([ cos(theta)   -sin(theta)*cos(alpha)  sin(theta)*sin(alpha)   a*cos(theta); ...
       sin(theta)   cos(theta)*cos(alpha)   -cos(theta)*sin(alpha)  a*sin(theta); ...
       0            sin(alpha)              cos(alpha)              d; ...
       0            0                       0                       1]); 

% SO3 
Rx_fn = @(q) [1 0 0; 0 cos(q) -sin(q); 0 sin(q) cos(q)];
Ry_fn = @(q) [cos(q) 0 sin(q); 0 1 0; -sin(q) 0 cos(q)];
Rz_fn = @(q) [cos(q) -sin(q) 0; sin(q) cos(q) 0; 0 0 1];

% law of cosines
law_of_cosines_angle_fn = @(a, b, c) (acos((a^2+b^2-c^2)/(2*a*b)));
law_of_cosines_length_fn = @(a, b, theta) (sqrt(a^2+b^2-2*a*b*cos(theta)));

% geometric jacobian
Jv_fn = @(ziprev,pe,piprev)(cross(ziprev,(pe-piprev))); % jacobian for linear velocity
Jw_fn = @(ziprev,pe,piprev)(ziprev); % jacobian for angular velocity

% velocity 
velocity_fn = @(y, x, dotx) (diff(y, x))*dotx;

% % forward kinematics ---------------------------------------------------
% joint to cartesian 
T = joint_to_cartesian(q, param.dh, transformation_fn);
len_cyl_from_joint = ...
    joint_to_cylinder(...
    q, dotq, param, law_of_cosines_angle_fn, law_of_cosines_length_fn, velocity_fn);

% % inverse kinematics ---------------------------------------------------
% cartesian to joint
syms x_EE y_EE z_EE phi real;
pt_EE = [x_EE; y_EE; z_EE];
q_from_cartes = cartesian_to_joint(T, param.dh, pt_EE, phi, Rx_fn, Ry_fn, Rz_fn);

% cylinder to joint
q_from_cyl = ...
    cylinder_to_joint(...
    len_cyl, vel_cyl, param, law_of_cosines_angle_fn, law_of_cosines_length_fn, velocity_fn);

end

function [len_cyl_sol, vel_cyl_sol] = ...
    joint_to_cylinder(...
    q, dotq, param, law_of_cosines_angle, law_of_cosines_length, velocity)

% swig cylinder
len_0J = sqrt(param.len_0M^2 + param.len_JM^2);
ang_Q0J = atan2(param.len_0M, param.len_JM) + q(1);
ang_K0J = ang_Q0J + 0.5*pi - param.ang_10K;
ang_Jhat0Qhat = atan2(param.len_0M, param.len_JM) - q(1);
ang_Jhat0Khat = ang_Jhat0Qhat + 0.5*pi - param.ang_10K;
len_cyl_swing = [
    law_of_cosines_length(len_0J, param.len_0K, ang_K0J); 
    law_of_cosines_length(len_0J, param.len_0K, ang_Jhat0Khat)];

vel_cyl_swing = velocity(len_cyl_swing, q(1), dotq(1));

% boom cylinder
ang_B1A = param.ang_B12 + q(2) + param.ang_A10 - pi;
len_cyl_boom = law_of_cosines_length(param.len_1A, param.len_1B, ang_B1A);

vel_cyl_boom = velocity(len_cyl_boom, q(2), dotq(2));

% arm cylinder
ang_C2D = 3*pi - param.ang_D23 - param.ang_12C - q(3);
len_cyl_arm = law_of_cosines_length(param.len_2C, param.len_2D, ang_C2D);

vel_cyl_arm = velocity(len_cyl_arm, q(3), dotq(3));

% bucket cylinder
ang_x33G = 2*pi - param.ang_G34 - q(4);
ang_23D = law_of_cosines_angle(param.len_23, param.len_3D, param.len_2D);
ang_G3F = pi - ang_x33G + ang_23D;
len_FG = law_of_cosines_length(param.len_3F, param.len_3G, ang_G3F);
ang_3FG = law_of_cosines_angle(param.len_3F, len_FG, param.len_3G);
ang_HFG = law_of_cosines_angle(len_FG, param.len_FH, param.len_GH);
ang_HF3 = [ang_HFG + ang_3FG; ang_HFG - ang_3FG]; % if q4+ang_G34 > 2*pi
ang_EFH = pi - param.ang_DFE - ang_HF3;
len_cyl_bucket = law_of_cosines_length(param.len_EF, param.len_FH, ang_EFH);

vel_cyl_bucket = velocity(len_cyl_bucket, q(4), dotq(4));

len_cyl_sol = simplify([len_cyl_swing; len_cyl_boom; len_cyl_arm; len_cyl_bucket]); 
vel_cyl_sol = simplify([vel_cyl_swing; vel_cyl_boom; vel_cyl_arm; vel_cyl_bucket]);

end

function q_sol = ...
    cylinder_to_joint(...
    len_cyl, vel_cyl, param, law_of_cosines_angle, law_of_cosines_length, velocity)

len_0J = sqrt(param.len_0M^2 + param.len_JM^2);
ang_K0Q = atan2((param.len_01 + param.P_1_1_Kx), param.P_1_1_Kz);
ang_MJ0 = atan2(param.len_0M, param.len_JM);
ang_K0J = law_of_cosines_angle(param.len_0K, len_0J, len_cyl(1));
q1_sol = ang_K0J - ang_K0Q - ang_MJ0;
dotq1_sol = velocity(q1_sol, len_cyl(1), vel_cyl(1));

ang_B1A = law_of_cosines_angle(param.len_1B, param.len_1A, len_cyl(2));
q2_sol = ang_B1A - param.ang_B12 - param.ang_A10 + pi;
dotq2_sol = velocity(q2_sol, len_cyl(2), vel_cyl(2));

ang_C2D = law_of_cosines_angle(param.len_2C, param.len_2D, len_cyl(3));
q3_sol = 3*pi - param.ang_12C - ang_C2D - param.ang_D23;
dotq3_sol = velocity(q3_sol, len_cyl(3), vel_cyl(3));

ang_EFH = law_of_cosines_angle(param.len_EF, param.len_FH, len_cyl(4));
ang_HF3 = pi - param.ang_DFE - ang_EFH;
len_3H = law_of_cosines_length(param.len_3F, param.len_FH, ang_HF3);
ang_F3H = law_of_cosines_angle(param.len_3F, len_3H, param.len_FH);
ang_H3G = law_of_cosines_angle(len_3H, param.len_3G, param.len_GH);
ang_23D = law_of_cosines_angle(param.len_23, param.len_3D, param.len_2D);
q4_sol = 3*pi - ang_F3H - ang_H3G - param.ang_G34 - ang_23D;
dotq4_sol = velocity(q4_sol, len_cyl(4), vel_cyl(4));

q_sol = simplify([q1_sol; q2_sol; q3_sol; q4_sol]);
dotq_sol = simplify([dotq1_sol; dotq2_sol; dotq3_sol; dotq4_sol]);

end

function T = joint_to_cartesian(q, dh, transformation)

n = length(q);
T = sym(zeros(4, 4, n));
for i = 1:n
    T(:,:,i) = transformation(q(i), dh.a(i), dh.alpha(i), dh.d(i));
end

end

function [jacobian_translation, jacobian_rotation] = velocity_joint_to_cartesian(q, T, jacobian_translation, jacobian_rotation)

n = length(q);
o_0 = [0; 0; 0]; % origin of global {0}
z_0 = [0; 0; 1]; % z-axis basis vectors of global {0}
Jv_0_i = sym(zeros(3,n,n)); Jw_0_i = sym(zeros(3,n,n));
for i = 1:n
    Jv_0_i(:,1,i) = jacobian_translation(z_0, T(1:3,4,i) , o_0);
    Jw_0_i(:,1,i) = jacobian_rotation(z_0);
    for ii = 2:i
        Jv_0_i(:,ii,i) = jacobian_translation(T(1:3,3,i-1), T(1:3,4,i) , T(1:3,4,i-1));
        Jw_0_i(:,ii,i) = jacobian_rotation(T(1:3,3,i-1));
    end
end

end

function q_sol = cartesian_to_joint(T, dh, P_0_0_4, phi, Rx, Ry, Rz)

T_0_4 = T(:,:,1)*T(:,:,2)*T(:,:,3)*T(:,:,4);
simplify(T_0_4(2,4)/T_0_4(1,4));
q1_sol = atan2(P_0_0_4(2), P_0_0_4(1));

% O1->O3 about {O1}
R_0_4 = Rx(sym(pi/2))*Rz(sym(pi))*Ry(-q1_sol)*Rz(sym(phi));
R_0_1 = T(1:3, 1:3, 1);
R_1_0 = R_0_1';

P_1_0_1 = [dh.a(1); dh.d(1); 0]; % O0 -> O1 about O1
P_4_3_4 = [dh.a(4); 0; 0]; % O3 -> O4 about O4

P_1_1_4 = R_1_0*P_0_0_4 - P_1_0_1;
P_1_3_4 = R_1_0*R_0_4*P_4_3_4;
P_1_1_3 = P_1_1_4 - P_1_3_4;

r13 = sqrt(P_1_1_3(1:2)'*P_1_1_3(1:2));
theta_31_x1 = atan2(P_1_1_3(2), P_1_1_3(1));
theta321 = acos((dh.a(2)^2 + dh.a(3)^2 - r13^2)/(2*dh.a(2)*dh.a(3)));
theta213 = acos((dh.a(2)^2 + r13^2 - dh.a(3)^2)/(2*dh.a(2)*r13));

q2_sol = theta_31_x1 + theta213;

q3_sol = pi + theta321;

q4_sol = phi - q2_sol - q3_sol + 3*pi;

q_sol = [q1_sol; q2_sol; q3_sol; q4_sol];

end