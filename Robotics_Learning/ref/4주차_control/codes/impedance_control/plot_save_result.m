clear; close all; clc;

direct_0 = load('direct_zero_force.mat');
direct_n= load('direct_ee_force.mat');

% define two link robot
param.n_dof = 2; param.n_dh = 4; param.n_dyn = 10; param.n_car = 6;
[link_param, ~, param.fn, param.robot, param.grav] = twolink_parameters(param.n_dof);
[param.dh, param.dyn, ~] = pack_robot_param(link_param, param.n_dof, param.n_dh, param.n_dyn);


q_ode = direct_n.q_ode;

xyz_ode = transl(param.robot.fkine(q_ode'))';

figure;
param.robot.plot(q_ode'); hold on; plot3(xyz_ode(1,:), xyz_ode(2,:), xyz_ode(3,:), '.');