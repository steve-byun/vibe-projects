% deriving dynamic regressor using symbolic toolbox
% version : Matlab : R2023a , Symbolic math toolbox : 9.3
% http://www.dipmat.univpm.it/aimeta2009/Atti%20Congresso/MECCANICA_MACCHINE/Gabiccini_paper07.pdf

clear; close all; clc;

sym_info = ver('symbolic');

%% declare symbolic variables
n_dof = 2; % # of DOFs
n_dyn = 10; % # of dynamic parameter for each link
n_dh  = 4;

% generalized coordinates
q = sym('q', [n_dof 1], 'real'); % joint angle (q1: q of the first link)
dotq = sym('dotq', [n_dof 1], 'real'); % joint angular velocity
ddotq = sym('ddotq', [n_dof 1], 'real'); % joint angular acceleration

% standard DH parameters
a = sym('a', [n_dof 1], 'real'); % distance between ziprev and zi along xi
d = sym('d', [n_dof 1], 'real'); % distance between xiprev and xi along ziprev
alpha = sym('alpha', [n_dof 1], 'real'); % angle between ziprev and zi alignment with xi
theta = sym('theta', [n_dof 1], 'real'); % angle between xiprev and xi alignment with ziprev

% dynamic parameters
m = sym('m', [n_dof 1], 'real');
rcx = sym('rc%dx', [n_dof 1], 'real');
rcy = sym('rc%dy', [n_dof 1], 'real');
rcz = sym('rc%dz', [n_dof 1], 'real');
Icxx = sym('Ic%dxx', [n_dof 1], 'real');
Icyy = sym('Ic%dyy', [n_dof 1], 'real');
Iczz = sym('Ic%dzz', [n_dof 1], 'real');
Icxy = sym('Ic%dxy', [n_dof 1], 'real');
Icxz = sym('Ic%dxz', [n_dof 1], 'real');
Icyz = sym('Ic%dyz', [n_dof 1], 'real');

Ixx = sym('I%dxx', [n_dof 1], 'real');
Iyy = sym('I%dyy', [n_dof 1], 'real');
Izz = sym('I%dzz', [n_dof 1], 'real');
Ixy = sym('I%dxy', [n_dof 1], 'real');
Ixz = sym('I%dxz', [n_dof 1], 'real');
Iyz = sym('I%dyz', [n_dof 1], 'real');
rcmx = sym('rcm%dx', [n_dof 1], 'real');
rcmy = sym('rcm%dy', [n_dof 1], 'real');
rcmz = sym('rcm%dz', [n_dof 1], 'real');

syms gravx gravy gravz real;
grav = [gravx; gravy; gravz];
m = num2cell(m);
c_i = cell(n_dof,1); Ic_i = cell(n_dof,1); mc_i = cell(n_dof,1); I_i = cell(n_dof,1);
for i = 1:n_dof
    c_i{i} = [rcx(i); rcy(i); rcz(i)];
    Ic_i{i} = [Icxx(i) Icxy(i) Icxz(i); Icxy(i) Icyy(i) Icyz(i); Icxz(i) Icyz(i) Iczz(i)];
    mc_i{i} = [rcmx(i); rcmy(i); rcmz(i)];
    I_i{i} = [Ixx(i) Ixy(i) Ixz(i); Ixy(i) Iyy(i) Iyz(i); Ixz(i) Iyz(i) Izz(i)];
end

% payload parameters
syms mL 
syms rcLx rcLy rcLz mrcLx mrcLy mrcLz 
syms IcLxx IcLyy IcLzz IcLxy IcLxz IcLyz ILxx ILyy ILzz ILxy ILxz ILyz real;
cL = [rcLx; rcLy; rcLz];
mcL = [mrcLx; mrcLy; mrcLz];
IcL = [IcLxx IcLxy IcLxz; IcLxy IcLyy IcLyz; IcLxz IcLyz IcLzz];
IL = [ILxx ILxy ILxz; ILxy ILyy ILyz; ILxz ILyz ILzz];

%% functions
H_fn = @(th,d,al,a)([
    cos(th), -cos(al)*sin(th),    sin(al)*sin(th),  a*cos(th);
    sin(th), cos(al)*cos(th),     -sin(al)*cos(th), a*sin(th);
    0,       sin(al),             cos(al),          d;
    0,       0,                   0,                1]); % homogeneous transformation
S_fn = @(x)([0 -x(3) x(2); x(3) 0 -x(1); -x(2) x(1) 0]); % skew
Jv_fn = @(ziprev,pe,piprev)(cross(ziprev,(pe-piprev))); % jacobian for linear velocity
Jw_fn = @(ziprev,pe,piprev)(ziprev); % jacobian for angular velocity
dXdt = @(X)(jacobian(X,q)*dotq + jacobian(X,dotq)*ddotq); %@(X)(jacobian(X, [t ; q ; dotq])*[1 ; dotq; ddotq]);

%% kinematic propagation
% link EE forward position velocity kinematics about {O}
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

% link COM forward position velocity kinematics about {O}
tc_0_i = cell(n_dof,1);
for i = 1:n_dof
    tc_0_i{i} = t_0_i{i} + R_0_i{i}*c_i{i};
end

Jvc_0_i = cell(n_dof,1); Jwc_0_i = cell(n_dof,1);
for i = 1:n_dof
    Jvc_0_i{i} = sym(zeros(3,n_dof));
    Jwc_0_i{i} = sym(zeros(3,n_dof));

    Jvc_0_i{i}(:,1) = Jv_fn(z_0, tc_0_i{i} , o_0);
    Jwc_0_i{i}(:,1) = Jw_fn(z_0);
    for ii = 2:i
        Jvc_0_i{i}(:,ii) = Jv_fn(H_0_i{ii-1}(1:3,3), tc_0_i{i} , t_0_i{ii-1});
        Jwc_0_i{i}(:,ii) = Jw_fn(H_0_i{ii-1}(1:3,3));
    end
end

%% dynamic equations from lagrange equations
% from kinetic energy
M_q = sym(zeros(n_dof,n_dof)); % inertia matrix
for i = 1:n_dof
    M_q = M_q + m{i}*Jvc_0_i{i}'*Jvc_0_i{i} + Jwc_0_i{i}'*R_0_i{i}*Ic_i{i}*R_0_i{i}'*Jwc_0_i{i};
end

c_q = cell(n_dof,n_dof,n_dof); % Christoffel matrix
for k = 1:n_dof
    for i = 1:n_dof
        for j = 1:n_dof
            c_q{i,j,k} = ...
                (0.5 *( diff(M_q(k,j),q(i)) + diff(M_q(k,i),q(j)) - diff(M_q(i,j),q(k))));
        end
    end
end

C_q_dotq = sym(zeros(n_dof,n_dof)); % Coriolis and centripetal term
for k = 1:n_dof
    for j = 1:n_dof
        for i = 1:n_dof
            C_q_dotq(k,j)= C_q_dotq(k,j) + c_q{i,j,k}*dotq(i);
        end
    end
end

% from potential energy
P = sym(zeros(1,1));
for i = 1:n_dof
    P = P + m{i}*grav'*tc_0_i{i};
end

g_q = jacobian(P,q)';

%% linear form of dynamic equations : tau = Y * Phi
% Phi
Phi = sym(zeros(n_dof*n_dyn,1));
for i = 1:n_dof
    phi0 = m{i};
    phi1 = m{i}*c_i{i};
    I = Ic_i{i} + m{i}*S_fn(c_i{i})'*S_fn(c_i{i});
    phi2 = [I(1,1); I(1,2); I(1,3); I(2,2); I(2,3); I(3,3)];
    Phi(1+(i-1)*n_dyn:i*n_dyn) = [phi0; phi1; phi2];
end

Phi_without_load = sym(zeros(n_dof*n_dyn,1));
for i = 1:n_dof
    phi0 = m{i};
    phi1 = mc_i{i};
    phi2 = [I_i{i}(1,1); I_i{i}(1,2); I_i{i}(1,3); I_i{i}(2,2); I_i{i}(2,3); I_i{i}(3,3)];
    Phi_without_load(1+(i-1)*n_dyn:i*n_dyn) = [phi0; phi1; phi2];
end

Phi_with_load = sym(zeros(n_dof*n_dyn,1));
for i = 1:n_dof
    phi0 = m{i};
    phi1 = mc_i{i};
    phi2 = [I_i{i}(1,1); I_i{i}(1,2); I_i{i}(1,3); I_i{i}(2,2); I_i{i}(2,3); I_i{i}(3,3)];
    if i == n_dof
        phi0 = phi0 + mL;
        phi1 = phi1 + mcL;
        phi2 = phi2 + [IL(1,1); IL(1,2); IL(1,3); IL(2,2); IL(2,3); IL(3,3)];
    end
    Phi_with_load(1+(i-1)*n_dyn:i*n_dyn) = [phi0; phi1; phi2];
end

pL = [mL; mrcLx; mrcLy; mrcLz; ILxx; ILyy; ILzz; ILxy; ILxz; ILyz];
error_Phi = Phi_with_load - Phi_without_load;
grad_error_Phi = jacobian(error_Phi, pL);

% W
E{1} = [1 0 0; 0 0 0; 0 0 0];
E{2} = [0 1 0; 1 0 0; 0 0 0];
E{3} = [0 0 1; 0 0 0; 1 0 0];
E{4} = [0 0 0; 0 1 0; 0 0 0];
E{5} = [0 0 0; 0 0 1; 0 1 0];
E{6} = [0 0 0; 0 0 0; 0 0 1];
n_E = length(E);

X0 = cell(n_dof,1); X1 = cell(n_dof,1); X2 = cell(n_dof,1);
for i = 1:n_dof
    X0{i} = Jv_0_i{i}'*Jv_0_i{i}*dotq;
    X1{i} = (Jv_0_i{i}'*S_fn(Jw_0_i{i}*dotq)-Jw_0_i{i}'*S_fn(Jv_0_i{i}*dotq))*R_0_i{i};
    X2{i} = sym(zeros(n_dof,n_E));
    for ii = 1:n_E
        X2{i}(:,ii) = Jw_0_i{i}'*R_0_i{i}*E{ii}*R_0_i{i}'*Jw_0_i{i}*dotq;
    end
end

dotX0 = cell(n_dof,1); dotX1 = cell(n_dof,1); dotX2 = cell(n_dof,1);
for i = 1:n_dof
    dotX0{i} = sym(zeros(size(X0{i})));
    for i0 = 1:size(X0{i},2)
        dotX0{i}(:,i0) = dXdt(X0{i}(:,i0));
    end

    dotX1{i} = sym(zeros(size(X1{i})));
    for i1 = 1:size(X1{i},2)
        dotX1{i}(:,i1) = dXdt(X1{i}(:,i1));
    end

    dotX2{i} = sym(zeros(size(X2{i})));
    for i2 = 1:size(X2{i},2)
        dotX2{i}(:,i2) = dXdt(X2{i}(:,i2));
    end
end

Y0 = cell(n_dof,1); Y1 = cell(n_dof,1); Y2 = cell(n_dof,1);
for i = 1:n_dof
    Y0{i} = sym(zeros(n_dof,1));
    for i0 = 1:n_dof
        Y0{i}(i0) = 0.5*dotq'*diff(Jv_0_i{i}'*Jv_0_i{i},q(i0))*dotq;
    end

    Y1{i} = sym(zeros(n_dof,3));
    for i1 = 1:n_dof
        Y1{i}(i1,:) = 0.5*diff((R_0_i{i}'*S_fn(Jw_0_i{i}*dotq)'*Jv_0_i{i}*dotq - R_0_i{i}'*S_fn(Jv_0_i{i}*dotq)'*Jw_0_i{i}*dotq),q(i1))';
    end

    Y2{i} = sym(zeros(n_dof,n_E));
    for i2 = 1:n_dof
        for i2i = 1:n_E
            Y2{i}(i2,i2i) = 0.5*dotq'*(diff(Jw_0_i{i}'*R_0_i{i}*E{i2i}*R_0_i{i}'*Jw_0_i{i},q(i2)))*dotq;
        end
    end
end

Z0 = cell(n_dof,1); Z1 = cell(n_dof,1);
for i = 1:n_dof
    Z0{i} = Jv_0_i{i}'*grav;
    Z1{i} = sym(zeros(n_dof,3));
    for ii = 1:n_dof
        Z1{i}(ii,:) = diff(R_0_i{i}'*grav,q(ii))';
    end
end

W_q_dotq_ddotq = sym(zeros(n_dof,n_dof*n_dyn));
for i = 1:n_dof
    W0 = dotX0{i} - Y0{i} + Z0{i};
    W1 = dotX1{i} - Y1{i} + Z1{i};
    W2 = dotX2{i} - Y2{i};
    W_q_dotq_ddotq(:,(i-1)*n_dyn+1:i*n_dyn) = [W0 W1 W2];
end

%% optimization payload
tauL = sym('tauL', [n_dof 1], 'real');
error_tauL = tauL - W_q_dotq_ddotq*Phi_with_load;
grad_error_tauL_wrt_pL = jacobian(error_tauL, pL); 


%% save
param_grav = grav;
param_kin = sym(zeros(n_dof*(n_dh-1),1)); param_dyn = sym(zeros(n_dof*n_dyn,1)); 
for i = 1:n_dof
    param_kin((i-1)*(n_dh-1)+1:i*(n_dh-1),1) = [alpha(i); d(i); a(i)];
    param_dyn((i-1)*n_dyn+1:i*n_dyn,1) = [m{i}; c_i{i}(:); Ic_i{i}(1); Ic_i{i}(5); Ic_i{i}(9); Ic_i{i}(4); Ic_i{i}(8); Ic_i{i}(7)];
end

param_dyn_load_est = sym(zeros(n_dof*n_dyn,1));
for i = 1:n_dof
    param_dyn_load_est((i-1)*n_dyn+1:i*n_dyn,1) = [m{i}; mc_i{i}(:); I_i{i}(1); I_i{i}(5); I_i{i}(9); I_i{i}(4); I_i{i}(8); I_i{i}(7)];
end
param_dyn_load = [mL; mcL; IL(1); IL(5); IL(9); IL(4); IL(8); IL(7)];

filename = sprintf('dyn_%ddof.mat',n_dof);
save(filename, 'q', 'dotq', 'ddotq', 'param_grav', 'param_kin', 'param_dyn', 'param_dyn_load_est', 'param_dyn_load', ...
    'W_q_dotq_ddotq', 'Phi', 'Phi_without_load', 'Phi_with_load', 'error_Phi', 'grad_error_Phi', ...
    'tauL', 'error_tauL', 'grad_error_tauL_wrt_pL', ...
    'g_q', 'C_q_dotq', 'M_q', ...
    'Jwc_0_i', 'Jvc_0_i', 'Jw_0_i', 'Jv_0_i', 'tc_0_i', 't_0_i', 'R_0_i', ...
    'n_dof', 'n_dyn', 'n_dh');