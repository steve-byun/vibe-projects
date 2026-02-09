function root_inverse_dynamics_hcr14

clear; close all; clc;

n_dof = 6;
[link_param, ~, fn, robot, grav, q_home] = HCR_3gen_14_parameters(n_dof);
[param_kin, param_dyn, ~] = pack_robot_param(link_param, n_dof, 4, 10);
param.dh = param_kin; param.dyn = param_dyn; param.grav = grav; param.fn = fn;

% trajectory for inverse dynamics
ts = 5e-4;
t = 0:ts:1.0-ts;

q_i = q_home; dotq_i = zeros(size(q_i)); 
q_f = [0; -2.1014; -0.8666; -1.7443; 1.5708; -0.0000]; dotq_f = zeros(size(q_f));
[q_T, dotq_T, ddotq_T] = jtraj(q_i, q_f, t, dotq_i, dotq_f);
q = q_T'; dotq = dotq_T'; ddotq = ddotq_T';

figure; robot.plot(q_T(1:50:length(t),:));

% inverse dynamics
tau_corke = robot.rne(q_T, dotq_T, ddotq_T)';

mL = 0; IcL = zeros(3,3); rcL = zeros(3,1);
[tau1, tau2] = inverse_dynamics_song(q, dotq, ddotq, [0; 0], [mL; IcL(:); rcL(:)]);
figure_plot(t, tau1, tau2, 'tau_1', 'tau_2');
figure_plot(t, tau1, tau_corke, 'tau_1', 'tau_c');
figure_plot(t, tau2, tau_corke, 'tau_2', 'tau_c');

end

function [tau1, tau2]  = inverse_dynamics_song(q, dotq, ddotq, tilt, payload)

tau1 = zeros(size(q)); tau2 = zeros(size(q));
for k = 1:size(q,2)
    [tau1(:,k), M, C, g]= Compute_Torque_hcr14(q(:,k), dotq(:,k), ddotq(:,k), tilt, payload);
    tau2(:,k) = M*ddotq(:,k) + C*dotq(:,k) + g;
end

end

function figure_plot(t, data1, data2, msg1, msg2)

figure;
for i = 1:6
    subplot(sprintf('23%d', i)); plot(t, data1(i,:),'r-',t, data2(i,:),'b-');
    ylabel(sprintf('torq%d', i)); grid on;
end
xlabel('t'); legend(msg1, msg2);

end