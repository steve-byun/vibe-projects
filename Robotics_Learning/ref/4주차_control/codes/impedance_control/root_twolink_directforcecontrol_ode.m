clear; close all; clc;

% define two link robot
param.n_dof = 2; param.n_dh = 4; param.n_dyn = 10; param.n_car = 6;
[link_param, ~, param.fn, param.robot, param.grav] = twolink_parameters(param.n_dof);
[param.dh, param.dyn, ~] = pack_robot_param(link_param, param.n_dof, param.n_dh, param.n_dyn);

% initial pose
q_i = [pi/2; pi/2]; dotq_i = zeros(param.n_dof, 1);

% simulation time
param.ts = 2*1E-3;
t = 0:param.ts:2-param.ts;
N = length(t);

% PID gains
param.ctrl.Kp = 10; param.ctrl.Ki = 10;

% target
f_d = [-10; 0; 0; 0; 0; 0]; % fx, fy, fz, Mx, My, Mz

% ode
x0 = [q_i; dotq_i; 1; 0; 0; 0; 0; 0];
ctrl_law = @direct_force_control_law;
ode_fn = @(t, x)ode_dynamic_for_direct_force_control(t, x, f_d, zeros(param.n_car), param, ctrl_law);
[t_T_ode45, x_T_ode45] = ode45(ode_fn, t, x0);
t_ode = t_T_ode45'; x_ode = x_T_ode45';
q_ode = x_ode(1:param.n_dof,:); 
dotq_ode = x_ode(param.n_dof+1:2*param.n_dof,:);
interror_ode = x_ode(2*param.n_dof+1:2*param.n_dof+param.n_car);

xyz_ode = transl(param.robot.fkine(q_ode'))';

figure; plot(interror_ode');

figure;
param.robot.plot(q_ode'); hold on; plot3(xyz_ode(1,:), xyz_ode(2,:), xyz_ode(3,:), '.');
