function hcr_forward_dynamic_test()

clear; close all; clc;

mdl_HCR5;
mdl_puma560;
param.robot = p560; param.Tilt = [0;0]; param.payLoadMass = 0; param.payLoadCOM = [0;0;0];
param.tau = [0;0;0;0;0;0];

q0 = qs;%[0 -pi/2 -pi/2 -pi/2 pi/2 0];
qdot0 = [0 0 0 0 0 0];

time_span = linspace(0,5,1000);
statevar0 = [q0'; qdot0'];

dstatevar0 = hcr_ode_model(time_span,statevar0,param);

options = odeset('reltol',1E-6,'abstol',1E-6);
[t,statevar] = ode45(@hcr_ode_model,time_span,statevar0,options,param);
q = statevar(:,1:param.robot.n);
qdot = statevar(:,param.robot.n+1:param.robot.n*2);

figure; param.robot.plot(q);

end

function dstatevar = hcr_ode_model(t,statevar,param)

q = statevar(1:param.robot.n);
qdot = statevar(param.robot.n+1:2*param.robot.n);
if strcmp(param.robot.name,'HCR5')
    [~,~,~,G,~,~,M,C] = Compute_Torque5_1gen(q, qdot, zeros(param.robot.n,1), param.Tilt, param.payLoadMass, param.payLoadCOM);
    qddot = (M)\(param.tau - C*qdot - G');
else
    M = param.robot.inertia(q');
    C = param.robot.coriolis(q',qdot');
    G = param.robot.gravload(q')';
    F = param.robot.friction(qdot')';
    qddot = (M)\(param.tau - C*qdot - G);
end

dstatevar = [qdot; qddot];

end