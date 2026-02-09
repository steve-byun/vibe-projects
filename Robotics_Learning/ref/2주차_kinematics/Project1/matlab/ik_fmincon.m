function ik_fmincon

%%forward kinematic
clear; clc;
close all;
%import the model
lbr = importrobot('iiwa14.urdf');
lbr.DataFormat = 'row';
gripper = 'iiwa_link_ee_kuka';

%define the position and dimension of the cup
cupHeight = 0.2;
cupRadius = 0.1;
cupPosition = [0.5, -0.5, .1];

%add target position
body = robotics.RigidBody('cupFrame');
p_desired = cupPosition + [0 0 .2];
R_desired = eul2rotm([0 pi 0]);
T_desired = [R_desired p_desired' ; 0 0 0 1]; % Desired Homogenous Transform

setFixedTransform(body.Joint, T_desired );
addBody(lbr, body, lbr.BaseName);

%forward kinematics
figure(1);
clf

theta_0 = [deg2rad(90), deg2rad(50), deg2rad(20), deg2rad(10), deg2rad(50), deg2rad(15), deg2rad(10)];  %angles of each joint
show(lbr, theta_0 , 'PreservePlot', false); hold on
exampleHelperPlotCupAndTable(cupHeight, cupRadius, cupPosition);

axis([-1.5 1.5 -1.5 1.5 -0 1.5])
view([100 20])
zoom(.5)

global VAR_FNCOUNT; VAR_FNCOUNT = 0;
[theta, optfval, exitflag] = IK_fmoncon(T_desired, theta_0, lbr, gripper, 'true');

optfval
exitflag


end

function [theta, optfval, exitflag] = IK_fmoncon(T_desired, theta_0, robot, end_effector, animate_flag)

% objective function
obj_fn = @(theta)(computeError( T_desired, theta, robot, end_effector, animate_flag));

% nonlinear optimization 
Aineq = []; bineq = []; Aeq =[]; beq = []; % linear constraints
lb = -2*pi*ones(size(theta_0)); ub = 2*pi*ones(size(theta_0)); % minimum, maximum bounds of theta
options = optimset('display','iter','diffmaxchange',1.1E-5,'diffminchange',1E-5,...
    'MaxFunEvals',1E+10,'AlwaysHonorConstraints','bounds','Algorithm','interior-point');

[theta, optfval, exitflag] = fmincon(obj_fn,theta_0,Aineq,bineq,Aeq,beq,lb,ub,[],options);

if animate_flag
    postporcess(robot, theta);
end

end

function postporcess(robot, theta)

show(robot, theta , 'PreservePlot', false);
pause(.5)

end
