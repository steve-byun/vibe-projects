% deriving dynamic regressor using symbolic toolbox
% version : Matlab : 2023a , Symbolic math toolbox : 9.3

clear; close all; clc;

sym_info = ver('symbolic');

%% declare symbolic variables
n_dof = 2; % # of DOFs
n_dh  = 4;
n_dyn = 10;

% generalized coordinates
q = sym('q', [n_dof 1], 'real'); % joint angle (q1: q of the first link)
dotq = sym('dotq', [n_dof 1], 'real'); % joint angular velocity
ddotq = sym('ddotq', [n_dof 1], 'real'); % joint angular acceleration

% standard DH parameters
a = sym('a', [n_dof 1], 'real'); % distance between ziprev and zi along xi
d = sym('d', [n_dof 1], 'real'); % distance between xiprev and xi along ziprev
alpha = sym('alpha', [n_dof 1], 'real'); % angle between ziprev and zi alignment with xi
theta = sym('theta', [n_dof 1], 'real'); % angle between xiprev and xi alignment with ziprev

% roll-pitch-yaw angles
rpy_ = sym('rpy_', [3 n_dof], 'real');

%% functions
H_fn = @(th,d,al,a)([
    cos(th), -cos(al)*sin(th),    sin(al)*sin(th),  a*cos(th);
    sin(th), cos(al)*cos(th),     -sin(al)*cos(th), a*sin(th);
    0,       sin(al),             cos(al),          d;
    0,       0,                   0,                1]); % homogeneous transformation
S_fn = @(x)([0 -x(3) x(2); x(3) 0 -x(1); -x(2) x(1) 0]); % skew
Jv_fn = @(ziprev,pe,piprev)(cross(ziprev,(pe-piprev))); % jacobian for linear velocity
Jw_fn = @(ziprev,pe,piprev)(ziprev); % jacobian for angular velocity
dXdt_fn = @(X)(jacobian(X,q)*dotq + jacobian(X,dotq)*ddotq); %@(X)(jacobian(X, [t ; q ; dotq])*[1 ; dotq; ddotq]);

%% position kinematics
% link EE forward position 
H_0_i = cell(n_dof,1); R_0_i = cell(n_dof,1); t_0_i = cell(n_dof,1);
for i = 1:n_dof
    if i == 1
        H_0_i{1} = H_fn(q(1),d(1),alpha(1),a(1));
    else
        H_0_i{i} = H_0_i{i-1} * H_fn(q(i),d(i),alpha(i),a(i));
    end
    R_0_i{i} = H_0_i{i}(1:3,1:3);
    t_0_i{i} = H_0_i{i}(1:3,4);
end

%% velocity kinematics 
% link forward velocity about {O}
o_0 = [0; 0; 0]; % origin of global {0}
z_0 = [0; 0; 1]; % z-axis basis vectors of global {0}
Jv_0_i = cell(n_dof,1); Jw_0_i = cell(n_dof,1);
for i = 1:n_dof
    Jv_0_i{i} = sym(zeros(3,n_dof));
    Jw_0_i{i} = sym(zeros(3,n_dof));

    Jv_0_i{i}(:,1) = Jv_fn(z_0, t_0_i{i} , o_0);
    Jw_0_i{i}(:,1) = Jw_fn(z_0);
    for ii = 2:i
        Jv_0_i{i}(:,ii) = Jv_fn(H_0_i{ii-1}(1:3,3), t_0_i{i} , t_0_i{ii-1});
        Jw_0_i{i}(:,ii) = Jw_fn(H_0_i{ii-1}(1:3,3));
    end
end

Jg_0_i = cell(n_dof, 1); Ja_0_i = cell(n_dof,1); 
for i = 1:n_dof
    Jg_0_i{i} = [Jv_0_i{i}; Jw_0_i{i}];
    rpy_0_i = rpy_(:, i);
    B_rpy = [
        1 0 sin(rpy_0_i(2));
        0 cos(rpy_0_i(1)) -cos(rpy_0_i(2))*sin(rpy_0_i(1));
        0 sin(rpy_0_i(1)) cos(rpy_0_i(2))*cos(rpy_0_i(1))];
    Ja_0_i{i} = blkdiag(eye(3,3), inv(B_rpy))*Jg_0_i{i};
end

% partial derivatives of jacobian matrices
syms q_t(t) [n_dof 1];
dotq_t = diff(q_t, t);

dot_Jg_0_i = cell(n_dof,1); dot_Ja_0_i = cell(n_dof,1);
for i = 1:n_dof
    dot_Jg_0_i_temp = subs(diff(subs(Jg_0_i{i},q,q_t),t), dotq_t, dotq);
    dot_Jg_0_i{i} = subs(dot_Jg_0_i_temp, q_t, q);
    dot_Ja_0_i_temp = subs(diff(subs(Ja_0_i{i},q,q_t),t), dotq_t, dotq);
    dot_Ja_0_i{i} = subs(dot_Ja_0_i_temp, q_t, q);
end

%% save
param_kin = sym(zeros(n_dof*(n_dh-1),1)); param_dyn = sym(zeros(n_dof*n_dyn,1)); 
for i = 1:n_dof
    param_kin((i-1)*(n_dh-1)+1:i*(n_dh-1),1) = [alpha(i); d(i); a(i)];
    % param_dyn((i-1)*n_dyn+1:i*n_dyn,1) = [m{i}; c_i{i}(:); Ic_i{i}(1); Ic_i{i}(5); Ic_i{i}(9); Ic_i{i}(4); Ic_i{i}(8); Ic_i{i}(7)];
end

disp('matlabfunction : ---------------------------------------------------')

name = sprintf('%ddofs',n_dof);

disp('matlabfunction - Jg : ')
matlabFunction(Jg_0_i{end},Jg_0_i{end-1:-1:1},'file',['Jg_' name],'vars',{q , param_kin});
disp('matlabfunction - Ja : ')
matlabFunction(Ja_0_i{end},Ja_0_i{end-1:-1:1},'file',['Ja_' name],'vars',{q , param_kin, rpy_});

disp('matlabfunction - dotJg : ')
matlabFunction(dot_Jg_0_i{end},dot_Jg_0_i{end-1:-1:1},'file',['dotJg_' name],'vars',{q , dotq, param_kin});
disp('matlabfunction - dotJa : ')
matlabFunction(dot_Ja_0_i{end},dot_Ja_0_i{end-1:-1:1},'file',['dotJa_' name],'vars',{q , dotq, param_kin, rpy_});