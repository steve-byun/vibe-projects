% compare dynamic torque of 6 dof arm: toolbox vs EOM
% EOM in matrix form
% using real robot model

% clc; clear all; close all;
function [Torque, M, C, G] = Compute_Torque_hcr14(act_pos, act_vel, cmd_acc, Tilt, payload)
%length of each links
lengthVector = [
    207.0;
    730.0;
    538.8;
    184.7;
    151.2;
    141.2
    ]*(1e-3);

% mass
massVector = [
    8.94;
    19.08;
    4.89;
    2.44;
    2.44;
    0.50
    ];

% gravity
grav = -9.81;

%MOI
inertiaTensor_1 = [
    33139.77;
    414.44;
    -37.99;
    414.44;
    25811.54;
    2619.39;
    -37.99;
    2619.39;
    30402.93]*(1e-6);

inertiaTensor_2 = [
    64540.99;
    -2445.22;
    -18760.17;
    -2445.22;
    1833275.59;
    -245.43;
    -18760.17;
    -245.43;
    1812754.28]*(1e-6);

inertiaTensor_3 = [
    9136.81;
    8.56;
    -8093.08;
    8.56;
    191424.93;
    0.65;
    -8093.08;
    0.65;
    188244.93]*(1e-6);

inertiaTensor_4 = [
    4438.95;
    3.83;
    3.45;
    3.83;
    3931.36;
    451.11;
    3.45;
    451.11;
    2452.16]*(1e-6);

inertiaTensor_5 = [
    4438.95;
    3.83;
    -3.45;
    3.83;
    3931.36;
    -451.11;
    -3.45;
    -451.11;
    2452.16]*(1e-6);

inertiaTensor_6 = [
    468.88;
    -0.46;
    -0.03;
    -0.46;
    497.92;
    6.03;
    -0.03;
    6.03;
    651.45]*(1e-6);

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%X%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% Using EOM %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% COM
COMVector_1 = [
    0.79;
    -45.58;
    8.93;
    ]*(1e-3);

COMVector_2 = [
    449.94;
    -0.31;
    178.62
    ]*(1e-3);

COMVector_3 = [
    167.67;
    0.00;
    52.77
    ]*(1e-3);

COMVector_4 = [
    -0.04;
    -6.73;
    32.97
    ]*(1e-3);

COMVector_5 = [
    0.04;
    6.73;
    32.97
    ]*(1e-3);

COMVector_6 = [
    -0.11;
    0.78;
    -29.80
    ]*(1e-3);

massVector(6) = massVector(6) + payload(1);
inertiaTensor_6 = inertiaTensor_6 + payload(2:10);
COMVector_6 = COMVector_6 + payload(11:13);

 angleVector(1) = act_pos(1);
    angleVector(2) = act_pos(2);
    angleVector(3) = act_pos(3);
    angleVector(4) = act_pos(4);
    angleVector(5) = act_pos(5);
    angleVector(6) = act_pos(6);

    angleVelocityVector(1) = act_vel(1);
    angleVelocityVector(2) = act_vel(2);
    angleVelocityVector(3) = act_vel(3);
    angleVelocityVector(4) = act_vel(4);
    angleVelocityVector(5) = act_vel(5);
    angleVelocityVector(6) = act_vel(6);

    angularAccelerationVector(1) = cmd_acc(1);
    angularAccelerationVector(2) = cmd_acc(2);
    angularAccelerationVector(3) = cmd_acc(3);
    angularAccelerationVector(4) = cmd_acc(4);
    angularAccelerationVector(5) = cmd_acc(5);
    angularAccelerationVector(6) = cmd_acc(6);
    
    q = [angleVector(1); angleVector(2); angleVector(3); angleVector(4); angleVector(5); angleVector(6)];
    dq = [angleVelocityVector(1); angleVelocityVector(2); angleVelocityVector(3); angleVelocityVector(4); angleVelocityVector(5); angleVelocityVector(6)];
    ddq = [angularAccelerationVector(1); angularAccelerationVector(2); angularAccelerationVector(3); angularAccelerationVector(4); angularAccelerationVector(5); angularAccelerationVector(6)];
        
    sinVector(1) = sin(angleVector(1));
    sinVector(2) = sin(angleVector(2));
    sinVector(3) = sin(angleVector(3));
    sinVector(4) = sin(angleVector(4));
    sinVector(5) = sin(angleVector(5));
    sinVector(6) = sin(angleVector(6));
    
    cosVector(1) = cos(angleVector(1));
    cosVector(2) = cos(angleVector(2));
    cosVector(3) = cos(angleVector(3));
    cosVector(4) = cos(angleVector(4));
    cosVector(5) = cos(angleVector(5));
    cosVector(6) = cos(angleVector(6));
    
    X_axis = Tilt(1);
    Y_axis = Tilt(2);

    tiltVector(1) = sin(X_axis);
    tiltVector(2) = sin(Y_axis);
    tiltVector(3) = cos(X_axis);
    tiltVector(4) = cos(Y_axis);
    
    % enter EQM of Motion here
    %% mass matrix
inertia_Mat = inertiaMatrix(lengthVector, massVector, grav, inertiaTensor_1, inertiaTensor_2, inertiaTensor_3, inertiaTensor_4, inertiaTensor_5, inertiaTensor_6,  COMVector_1, COMVector_2, COMVector_3, COMVector_4, COMVector_5, COMVector_6, angleVector, angleVelocityVector, angularAccelerationVector, sinVector, cosVector, tiltVector);

M = [inertia_Mat(1) inertia_Mat(2) inertia_Mat(3) inertia_Mat(4) inertia_Mat(5) inertia_Mat(6);
    inertia_Mat(7) inertia_Mat(8) inertia_Mat(9) inertia_Mat(10) inertia_Mat(11) inertia_Mat(12);
    inertia_Mat(13) inertia_Mat(14) inertia_Mat(15) inertia_Mat(16) inertia_Mat(17) inertia_Mat(18);
    inertia_Mat(19) inertia_Mat(20) inertia_Mat(21) inertia_Mat(22) inertia_Mat(23) inertia_Mat(24);
    inertia_Mat(25) inertia_Mat(26) inertia_Mat(27) inertia_Mat(28) inertia_Mat(29) inertia_Mat(30);
    inertia_Mat(31) inertia_Mat(32) inertia_Mat(33) inertia_Mat(34) inertia_Mat(35) inertia_Mat(36)];

TTT = M*ddq;

Tm1 = TTT(1);
Tm2 = TTT(2);
Tm3 = TTT(3);
Tm4 = TTT(4);
Tm5 = TTT(5);
Tm6 = TTT(6);

%% coriolis matrix

coriolis_Mat = coriolisMatrix(lengthVector, massVector, grav, inertiaTensor_1, inertiaTensor_2, inertiaTensor_3, inertiaTensor_4, inertiaTensor_5, inertiaTensor_6,  COMVector_1, COMVector_2, COMVector_3, COMVector_4, COMVector_5, COMVector_6, angleVector, angleVelocityVector, angularAccelerationVector, sinVector, cosVector, tiltVector);

C = [coriolis_Mat(1) coriolis_Mat(2) coriolis_Mat(3) coriolis_Mat(4) coriolis_Mat(5) coriolis_Mat(6);
    coriolis_Mat(7) coriolis_Mat(8) coriolis_Mat(9) coriolis_Mat(10) coriolis_Mat(11) coriolis_Mat(12);
    coriolis_Mat(13) coriolis_Mat(14) coriolis_Mat(15) coriolis_Mat(16) coriolis_Mat(17) coriolis_Mat(18);
    coriolis_Mat(19) coriolis_Mat(20) coriolis_Mat(21) coriolis_Mat(22) coriolis_Mat(23) coriolis_Mat(24);
    coriolis_Mat(25) coriolis_Mat(26) coriolis_Mat(27) coriolis_Mat(28) coriolis_Mat(29) coriolis_Mat(30);
    coriolis_Mat(31) coriolis_Mat(32) coriolis_Mat(33) coriolis_Mat(34) coriolis_Mat(35) coriolis_Mat(36)];

TTT = C*dq;

Tc1 = TTT(1);
Tc2 = TTT(2);
Tc3 = TTT(3);
Tc4 = TTT(4);
Tc5 = TTT(5);
Tc6 = TTT(6);

%% gravity matrix
gravity_Vec = gravityVector(lengthVector, massVector, grav, inertiaTensor_1, inertiaTensor_2, inertiaTensor_3, inertiaTensor_4, inertiaTensor_5, inertiaTensor_6,  COMVector_1, COMVector_2, COMVector_3, COMVector_4, COMVector_5, COMVector_6, angleVector, angleVelocityVector, angularAccelerationVector, sinVector, cosVector, tiltVector);

G = [gravity_Vec(1); gravity_Vec(2); gravity_Vec(3); gravity_Vec(4); gravity_Vec(5); gravity_Vec(6)];

TTT = G;

Tg1 = TTT(1);
Tg2 = TTT(2);
Tg3 = TTT(3);
Tg4 = TTT(4);
Tg5 = TTT(5);
Tg6 = TTT(6);

%% tatal torque
Torque11 = Tm1 + Tc1 + Tg1;
Torque21 = Tm2 + Tc2 + Tg2;
Torque31 = Tm3 + Tc3 + Tg3;
Torque41 = Tm4 + Tc4 + Tg4;
Torque51 = Tm5 + Tc5 + Tg5;
Torque61 = Tm6 + Tc6 + Tg6;

Torque = [Torque11 Torque21 Torque31 Torque41 Torque51 Torque61];

end

