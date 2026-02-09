clear; clc;

%% add robot
n_dof = 6; n_dh = 4; n_dyn = 10;
[link_param, payload, fn, robot, grav, q_home, q_0, q_max, dotq_max, ddotq_max] = HCR_3gen_14_parameters(n_dof);
[param_kin, param_dyn, ~] = pack_robot_param(link_param, n_dof, n_dh, n_dyn);
param.dh = param_kin; param.dyn = param_dyn; param.fn = fn; param.grav = grav;

%% invkin
n_features = 10;
x_range = abs(link_param{2}.a)*[-1 1];
y_range = x_range;
z_range = [abs(link_param{1}.d) abs(link_param{1}.d)+abs(link_param{2}.a)+abs(link_param{2}.a)];
q_targets = cell(n_features,1);
for i=1:n_features 
    % TODO: Keep feasible target pos/ori only
    pos = unifrnd([x_range(1), y_range(1), z_range(1)], [x_range(2), y_range(2), z_range(2)], 1, 3);
    ori = unifrnd(pi*[-1, -1, -1], pi*[1, 1, 1], 1, 3);
    T_target = rt2tr(rpy2r(ori), pos');
    q_targets{i} = robot.ikine(T_target, 'alpha', 0.01, 'ilimit', 100);
end

%% gen traj
ts = 1e-3;
fs = 1/ts;
t = 0:ts:1-ts;
q_traj = [];
for i=2:n_features
    q_traj = [q_traj; jtraj(q_targets{i-1}, q_targets{i}, t, zeros(6,1), zeros(6,1))];
end


%% simple animation
figure(1);
skiprate = 10;
robot.plot(q_traj(1:skiprate:end, :), 'delay', ts*skiprate);

