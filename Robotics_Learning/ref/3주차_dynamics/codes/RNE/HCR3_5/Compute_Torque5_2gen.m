% compare dynamic torque of 6 dof arm: toolbox vs EOM
% EOM in matrix form
% using real robot model

% clc; clear all; close all;
function [Torque,torque_m,torque_c,torque_g,P,alpha,M,C,g] = Compute_Torque5_2gen(act_pos, act_vel, cmd_acc, Tilt, payLoadMass, payLoadCOM)
loadMass = payLoadMass;

loadCOM(1) = payLoadCOM(1);
loadCOM(2) = payLoadCOM(2);
loadCOM(3) = payLoadCOM(3);

% length of each links
lengthVector(1) = 0.149;
lengthVector(2) = 0.425;
lengthVector(3) = 0.3385;
lengthVector(4) = 0.1705;
lengthVector(5) = 0.1515;
lengthVector(6) = 0.1325 + loadCOM(3) * 2.0;

% mass
massVector(1) = 4.4018;
massVector(2) = 9.9180;
massVector(3) = 2.8375;
massVector(4) = 1.6783;
massVector(5) = 1.6783;
massVector(6) = 0.2580 + loadMass;

% gravity
grav = -9.81;

%MOI
inertiaTensor_1(1) = 1.1252e-2;
inertiaTensor_1(2) = 7.5831e-7;
inertiaTensor_1(3) = -3.6975e-6;
inertiaTensor_1(4) = inertiaTensor_1(2);
inertiaTensor_1(5) = 7.9335e-3;
inertiaTensor_1(6) = -1.1370e-3;
inertiaTensor_1(7) = inertiaTensor_1(3);
inertiaTensor_1(8) = inertiaTensor_1(6);
inertiaTensor_1(9) = 1.0549e-2;

inertiaTensor_2(1) = 2.4747e-2;
inertiaTensor_2(2) = 3.1268e-5;
inertiaTensor_2(3) = 1.0637e-5;
inertiaTensor_2(4) = inertiaTensor_2(2);
inertiaTensor_2(5) = 4.1824e-1;
inertiaTensor_2(6) = -3.9426e-6;
inertiaTensor_2(7) = inertiaTensor_2(3);
inertiaTensor_2(8) = inertiaTensor_2(6);
inertiaTensor_2(9) = 4.0856e-1;

inertiaTensor_3(1) = 5.2121e-3;
inertiaTensor_3(2) = 1.0251e-5;
inertiaTensor_3(3) = 6.4173e-3;
inertiaTensor_3(4) = inertiaTensor_3(2);
inertiaTensor_3(5) = 5.4100e-2;
inertiaTensor_3(6) = -1.9225e-6;
inertiaTensor_3(7) = inertiaTensor_3(3);
inertiaTensor_3(8) = inertiaTensor_3(6);
inertiaTensor_3(9) = 5.1968e-2;

inertiaTensor_4(1) = 2.5961e-3;
inertiaTensor_4(2) = -5.0935e-6;
inertiaTensor_4(3) = -1.9284e-6;
inertiaTensor_4(4) = inertiaTensor_4(2);
inertiaTensor_4(5) = 2.3594e-3;
inertiaTensor_4(6) = -3.0062e-4;
inertiaTensor_4(7) = inertiaTensor_4(3);
inertiaTensor_4(8) = inertiaTensor_4(6);
inertiaTensor_4(9) = 1.5475e-3;

inertiaTensor_5(1) = 2.5961e-3;
inertiaTensor_5(2) = -5.0954e-6;
inertiaTensor_5(3) = 1.9284e-6;
inertiaTensor_5(4) = inertiaTensor_5(2);
inertiaTensor_5(5) = 2.3594e-3;
inertiaTensor_5(6) = 3.0062e-4;
inertiaTensor_5(7) = inertiaTensor_5(3);
inertiaTensor_5(8) = inertiaTensor_5(6);
inertiaTensor_5(9) = 1.5475e-3;

inertiaTensor_6(1) = 2.7436e-4;
inertiaTensor_6(2) = 1.9429e-6;
inertiaTensor_6(3) = 2.0284e-6;
inertiaTensor_6(4) = inertiaTensor_6(2);
inertiaTensor_6(5) = 2.6993e-4;
inertiaTensor_6(6) = -5.9254e-6;
inertiaTensor_6(7) = inertiaTensor_6(3);
inertiaTensor_6(8) = inertiaTensor_6(6);
inertiaTensor_6(9) = 2.8649e-4;

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%X%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% Using EOM %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% COM
COMVector_1(1) = 1.0311e-5;
COMVector_1(2) = -6.3528e-2;
COMVector_1(3) = 4.3604e-3;

COMVector_2(1) = 2.1245e-1;
COMVector_2(2) = 8.0521e-6;
COMVector_2(3) = 1.3925e-1;

COMVector_3(1) = 1.0245e-1;
COMVector_3(2) = 1.9703e-5;
COMVector_3(3) = 4.5600e-2;

COMVector_4(1) = 2.8815e-5;
COMVector_4(2) = -4.4396e-3;
COMVector_4(3) = 4.3041e-2;

COMVector_5(1) = -2.8815e-5;
COMVector_5(2) = 4.4396e-3;
COMVector_5(3) = 4.3041e-2;

COMVector_6(1) = 4.1690e-4 + loadCOM(1);
COMVector_6(2) = -1.1048e-3 + loadCOM(2);
COMVector_6(3) = -1.8884e-2 - loadCOM(3);

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
torque_m = [Tm1 Tm2 Tm3 Tm4 Tm5 Tm6];
torque_c = [Tc1 Tc2 Tc3 Tc4 Tc5 Tc6];
torque_g = [Tg1 Tg2 Tg3 Tg4 Tg5 Tg6];

P = M*dq;
alpha = C'*dq - torque_g';
g = torque_g';

end

