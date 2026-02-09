function two_estimation_newtontype

clear; close all; clc;

mdl_twolink;

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
tauL_t = torque_with_load(q_t,dotq_t,ddotq_t,param_kin,param_grav,param_dyn_loadest,param_dyn_load,n_dof,fn);

x_0 = param_dyn_load + 1*rand(size(param_dyn_load));
[x, iteration_errors] = tauL_estimation(x_0,tauL_t,q_t,dotq_t,ddotq_t,param_kin,param_grav,param_dyn_loadest,n_dof,fn);

end

%%
function [x, iteration_errors] = tauL_estimation(x_0,tauL,q,dotq,ddotq,param_kin,param_grav,param_dyn_loadest,n_dof,fn)

x = x_0;
e = compute_error(x,tauL,q,dotq,ddotq,param_kin,param_grav,param_dyn_loadest,n_dof,fn);
error_threshold = 1e-6;
iteration_errors = [norm(e)];

% While the error has magnitude larger than some threshold
while (iteration_errors(end) > error_threshold)
    [x, reduction] = tauL_estimation_step(x,tauL,q,dotq,ddotq,param_kin,param_grav,param_dyn_loadest,n_dof,fn);
    e = compute_error(x,tauL,q,dotq,ddotq,param_kin,param_grav,param_dyn_loadest,n_dof,fn);
    iteration_errors(end+1) = norm(e);
    x
end

end

function [x_new, reduction] = tauL_estimation_step(x,tauL,q,dotq,ddotq,param_kin,param_grav,param_dyn_loadest,n_dof,fn)

[e, J] = compute_error(x,tauL,q,dotq,ddotq,param_kin,param_grav,param_dyn_loadest,n_dof,fn);
initial_error = norm(e);

% Algorithm parameters
lambda = 1e-4;                      % Damped-Least Squares Damping
minimum_beta = 1e-15;               % Smallest step allowed
accepted_reduction_percent = 0.01;  % Criteria to accept the step

% Initial test step size
beta = 1;

% Compute ideal step with the damped-least-squares pseduoinverse
delta_x = 

% Candidate for new payload parameters
x_test = x + delta_x * beta;

e = compute_error(x_test,tauL,q,dotq,ddotq,param_kin,param_grav,param_dyn_loadest,n_dof,fn);

% Compute reduction in error for the candidate step
reduction = initial_error - norm(e);

% Compute the expected reduction in error for the candidate step (assumping linearization perfect)
expected_reduction = accepted_reduction_percent*beta*initial_error;

% Perform a backtracking line search over the step size parameter beta
% Accept the step when either
%  a) the reduction in error is at least accepted_reduction_percent * expected_reduction or
%  b) the step size is smaller than the minimum allowed beta
iteration = 0;
max_iteration = 100;
while iteration < max_iteration
%     fprintf(1,'Rejected step with beta = %e, Actual Reduction = %e,  Expected Reduction = %e\n',beta, reduction, expected_reduction);
    beta = beta * .5;                           % Reduce beta
    x_test = x + delta_x * beta;   % Create a new test configuration
    e = compute_error(x_test,tauL,q,dotq,ddotq,param_kin,param_grav,param_dyn_loadest,n_dof,fn);

    reduction = initial_error - norm(e);
    expected_reduction = accepted_reduction_percent*beta*initial_error;

    if reduction >= expected_reduction
        break;
    end

    if beta < minimum_beta
        break;
    end

    iteration = iteration + 1;
end

x_new = x_test;
fprintf(1,'Accepted Step beta = %e, Actual Reduction = %e,  Expected Reduction = %e\n',beta, reduction, expected_reduction);

end

function tauL = torque_with_load(q,dotq,ddotq,param_kin,param_grav,param_dyn_loadest,param_dyn_load,n_dof,fn)

n = size(q,2);

PhiL = ...

tauL = zeros(n_dof, n);
for k = 1:n
    W = ...
    tauL(:,k) = W*PhiL;
end

end

function [e, Je] = compute_error(pL,tau,q,dotq,ddotq,param_kin,param_grav,param_dyn_loadest,n_dof,fn)

n = size(q,2);
e = zeros(n*n_dof, 1); Je = zeros(n*n_dof, length(pL));
for k = 1:n
    e_k = ...
    Je_k = ...

    e( (k-1)*n_dof+1:k*n_dof ) = e_k;
    Je( (k-1)*n_dof+1:k*n_dof,: ) = Je_k;
end

end
