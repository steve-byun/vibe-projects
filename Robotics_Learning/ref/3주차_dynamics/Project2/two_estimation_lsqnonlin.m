function two_estimation_lsqnonlin

clear; close all; clc;

% robot define
m1 = 3;   c1x = -0.6; c1y = 0.01; J1zz = 1.3303; a1 = 1;
m2 = 2;   c2x = -0.2; c2y = 0.02; J2zz = 0.1225; a2 = 0.5;
mL = 1.5; cLx = 0.3;  cLy = 0.1;  JLzz = 0.1813;

alpha = [0; 0];
d = [0; 0];
a = [a1; a2];
m = {m1; m2};
rc = {[c1x; c1y; 0]; [c2x; c2y; 0]};
I = {[0 0 0; 0 0 0; 0 0 J1zz]; [0 0 0; 0 0 0; 0 0 J2zz]};
param_grav = [0; 0; 9.8];
S_fn = @(x)([0 -x(3) x(2); x(3) 0 -x(1); -x(2) x(1) 0]); % skew
I2Ic_fn = @(m, rc, I)(I - m*S_fn(rc)'*S_fn(rc));
Ic = {I2Ic_fn(m{1}, rc{1}, I{1}); I2Ic_fn(m{2}, rc{2}, I{2})};

n_dof = 2; n_dyn = 10; n_kin = 3;
param_dyn_load = [mL; mL*cLx; mL*cLy; 0; 0; 0; JLzz; 0; 0; 0];
[param_kin,param_dyn,param_dyn_loadest] = pack_var(alpha,d,a,m,rc,Ic,I,n_dof,n_kin,n_dyn);
[twolink, fn] = robot_define_twolink(param_kin,param_dyn,param_dyn_loadest,param_grav,n_dof,n_kin,n_dyn);

% trajectory generation
ts = 1E-2;
t = 0:ts:5-ts;
q_0 = zeros(n_dof, 1); dotq_0 = zeros(n_dof, 1); 
q_f = pi/4*ones(n_dof, 1); dotq_f = zeros(n_dof, 1); 

[q_t_T, dotq_t_T, ddotq_t_T] = jtraj(q_0, q_f, t, dotq_0, dotq_f);
q_t = q_t_T'; dotq_t = dotq_t_T'; ddotq_t = ddotq_t_T';

options = optimoptions('lsqnonlin','Display','iter');

x_full = estimation_full_horizon(q_t,dotq_t,ddotq_t,param_kin,param_grav,param_dyn_loadest,param_dyn_load,n_dof,fn,options);

disp(x_full(1:4))

end

function x = estimation_full_horizon(q_t,dotq_t,ddotq_t,param_kin,param_grav,param_dyn_loadest,param_dyn_load,n_dof,fn,options)

x0 = param_dyn_load + 1*rand(size(param_dyn_load));
lb = -100*ones(size(x0));
ub = 100*ones(size(x0));
obj_handle = @(x)cost_fn(x,q_t,dotq_t,ddotq_t,param_kin,param_grav,param_dyn_loadest,param_dyn_load,n_dof,fn);

x = lsqnonlin(obj_handle,x0,lb,ub,options);

end

function obj = cost_fn(x,q,dotq,ddotq,param_kin,param_grav,param_dyn_loadest,param_dyn_load,n_dof,fn)

n = size(q,2);

Phi_act = fn.Phi_with_load(param_dyn_loadest,param_dyn_load);
PhiL = fn.Phi_with_load(param_dyn_loadest,x);

delta_tau_list = zeros(n_dof*n, 1);
for k = 1:n
    W = fn.W(q(:,k), dotq(:,k), ddotq(:,k), param_grav, param_kin);
    tau = W*Phi_act;
    tauL = W*PhiL;
    delta_tau = tauL - tau;
    delta_tau_list( (k-1)*n_dof+1:k*n_dof ) = delta_tau;
end

obj = delta_tau_list;

end