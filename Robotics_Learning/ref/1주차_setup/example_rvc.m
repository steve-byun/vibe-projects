clear; close all; clc;

%% add robot
n_dof = 6; n_dh = 4; n_dyn = 10;
[link_param, payload, fn, robot, grav, q_home, q_0, q_max, dotq_max, ddotq_max] = HCR_3gen_14_parameters(n_dof);
[param_kin, param_dyn, ~] = pack_robot_param(link_param, n_dof, n_dh, n_dyn);
param.dh = param_kin; param.dyn = param_dyn; param.fn = fn; param.grav = grav;

%% SE(3) 
T = robot.fkine(q_0')
xyz = transl(T) 
rpy = tr2rpy(T)' % ZYX : rotz(r)-roty(p)-rotx(y) 

%% joint space move : 5th order poly
ts = 500e-6;
fs = 1/ts;
t = 0:ts:0.6-ts;
q_i = q_0; q_f = q_0 + [0; pi/4; 0; 0; 0; 0]; 
dotq_i = zeros(size(q_i)); dotq_f = zeros(size(q_i));
ddotq_i = zeros(size(q_i)); ddotq_f = zeros(size(q_i));
[q_T, dotq_T, ddotq_T] = jtraj(q_i, q_f, t, dotq_i, dotq_f);
q_t = q_T'; dotq_t = dotq_T'; ddotq_t = ddotq_T';
figure;
for i = 1:n_dof
    subplot(sprintf('23%d', i)); plot(t, q_t(i,:),'b-');
    xlabel('t'); ylabel(['q' sprintf('_%d', i)]); grid on;
end

%% inverse dynamics
tau = robot.rne(q_T, dotq_T, ddotq_T)';
figure;
for i = 1:n_dof
    subplot(sprintf('23%d', i)); plot(t, q_t(i,:),'b-');
    xlabel('t'); ylabel(['torq' sprintf('_%d', i)]); grid on;
end

%% simple animation
figure;
skiprate = 10;
robot.plot(q_T(1:skiprate:end, :), 'delay', ts*skiprate);