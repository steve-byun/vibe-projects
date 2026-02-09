function [link_param, payload, fn, HCR14, grav, q_home, q_0, q_max, dotq_max, ddotq_max] =...
    HCR_3gen_14_parameters(n_dof)

massVector = [
    8.94;
    19.08;
    4.89;
    2.44;
    2.44;
    0.50
    ];

inertiaTensor_1 = [
    33139.77;
    414.44;
    -37.99;
    414.44;
    25811.54;
    2619.39;
    -37.99;
    2619.39;
    30402.93]*(1e-6);

inertiaTensor_2 = [
    64540.99;
    -2445.22;
    -18760.17;
    -2445.22;
    1833275.59;
    -245.43;
    -18760.17;
    -245.43;
    1812754.28]*(1e-6);

inertiaTensor_3 = [
    9136.81;
    8.56;
    -8093.08;
    8.56;
    191424.93;
    0.65;
    -8093.08;
    0.65;
    188244.93]*(1e-6);

inertiaTensor_4 = [
    4438.95;
    3.83;
    3.45;
    3.83;
    3931.36;
    451.11;
    3.45;
    451.11;
    2452.16]*(1e-6);

inertiaTensor_5 = [
    4438.95;
    3.83;
    -3.45;
    3.83;
    3931.36;
    -451.11;
    -3.45;
    -451.11;
    2452.16]*(1e-6);

inertiaTensor_6 = [
    468.88;
    -0.46;
    -0.03;
    -0.46;
    497.92;
    6.03;
    -0.03;
    6.03;
    651.45]*(1e-6);

COMVector_1 = [
    0.79;
    -45.58;
    8.93;
    ]*(1e-3);

COMVector_2 = [
    449.94;
    -0.31;
    178.62
    ]*(1e-3);

COMVector_3 = [
    167.67;
    0.00;
    52.77
    ]*(1e-3);

COMVector_4 = [
    -0.04;
    -6.73;
    32.97
    ]*(1e-3);

COMVector_5 = [
    0.04;
    6.73;
    32.97
    ]*(1e-3);

COMVector_6 = [
    -0.11;
    0.78;
    -29.80
    ]*(1e-3);

% HCR14 3rd generation (units - [rad] , [m] , [kg], [kg.m^2] )
fn.M = eval(sprintf('@M_%ddofs_mex', n_dof));
fn.C = eval(sprintf('@C_%ddofs_mex', n_dof));
fn.g = eval(sprintf('@g_%ddofs_mex', n_dof));
fn.W = eval(sprintf('@W_%ddofs_mex', n_dof));
fn.Phi = eval(sprintf('@Phi_%ddofs_mex', n_dof));
fn.Jg = eval(sprintf('@Jg_%ddofs', n_dof));
fn.Ja = eval(sprintf('@Ja_%ddofs', n_dof));
fn.dotJa = eval(sprintf('@dotJa_%ddofs', n_dof));

% link1
link_param{1}.a = 0; link_param{1}.alpha = pi/2; link_param{1}.d = 207.0*(1e-3);
link_param{1}.m = massVector(1);  link_param{1}.rc = COMVector_1;
link_param{1}.Ic = reshape(inertiaTensor_1, 3, 3);
link_param{1}.I = [
    52425.68      92.07      25.20;
    92.07         26530.79   -1021.22;
    25.20         -1021.22   48980.78]*(1e-6);

% link2
link_param{2}.a = -730.0*(1e-3); link_param{2}.alpha = 0; link_param{2}.d = 0;
link_param{2}.m = massVector(2);  link_param{2}.rc = COMVector_2;
link_param{2}.Ic = reshape(inertiaTensor_2, 3, 3);
link_param{2}.I = [
    673345.46      -5110.66     1514833.30;
    -5110.66       6305249.67   -1303.55;
    1514833.30     -1303.55     5675927.56]*(1e-6);

% link3
link_param{3}.a = -538.8*(1e-3); link_param{3}.alpha = 0; link_param{3}.d = 0;
link_param{3}.m = 4.89;  link_param{3}.rc = [167.6700; 0; 52.7700]*(1e-3);
link_param{3}.m = massVector(3);  link_param{3}.rc = COMVector_3;
link_param{3}.Ic = reshape(inertiaTensor_3, 3, 3);
link_param{3}.I = [
    22759.66      4.91       35193.76;
    4.91          342592.46  -0.50;
    35193.76      -0.50      325789.61]*(1e-6);

% link4
link_param{4}.a = 0; link_param{4}.alpha = pi/2; link_param{4}.d = 184.7*(1e-3);
link_param{4}.m = 2.44; link_param{4}.rc = [-0.0400; -6.7300; 32.9700]*(1e-3);
link_param{4}.m = massVector(4);  link_param{4}.rc = COMVector_4;
link_param{4}.Ic = reshape(inertiaTensor_4, 3, 3);
link_param{4}.I = [
    7196.55      4.42      0.56;
    4.42         6579.05   -89.10;
    0.56         -89.10    2562.38]*(1e-6);

% link5
link_param{5}.a = 0; link_param{5}.alpha = -pi/2; link_param{5}.d = 151.2*(1e-3);
link_param{5}.m = massVector(5);  link_param{5}.rc = COMVector_5;
link_param{5}.Ic = reshape(inertiaTensor_5, 3, 3);
link_param{5}.I = [
    7196.85      4.42      -0.56;
    4.42         6579.05   89.10;
    -0.56        89.10     2562.38]*(1e-6);

% link6
link_param{6}.a = 0; link_param{6}.alpha = 0; link_param{6}.d = 141.2*(1e-3);
link_param{6}.m = massVector(6);  link_param{6}.rc = COMVector_6;
link_param{6}.Ic = reshape(inertiaTensor_6, 3, 3);
link_param{6}.I = [
    915.79      -0.50      1.69;
    -0.50       944.52     -5.71;
    1.69        -5.71      651.77]*(1e-6);

% payload
payload.mL = 0; payload.rcL = [0; 0; 0]; payload.IL = diag([0; 0; 0]);

% robot define
HCR14 = SerialLink([
    Revolute('d', link_param{1}.d, 'a', link_param{1}.a, 'alpha', link_param{1}.alpha, ...
    'm', link_param{1}.m, 'r', link_param{1}.rc, 'I', link_param{1}.Ic, ...
    'B', 0, 'G', 0, 'Jm', 0, 'standard')
    Revolute('d', link_param{2}.d, 'a', link_param{2}.a, 'alpha', link_param{2}.alpha, ...
    'm', link_param{2}.m, 'r', link_param{2}.rc, 'I', link_param{2}.Ic, ...
    'B', 0, 'G', 0, 'Jm', 0, 'standard')
    Revolute('d', link_param{3}.d, 'a', link_param{3}.a, 'alpha', link_param{3}.alpha, ...
    'm', link_param{3}.m, 'r', link_param{3}.rc, 'I', link_param{3}.Ic, ...
    'B', 0, 'G', 0, 'Jm', 0, 'standard')
    Revolute('d', link_param{4}.d, 'a', link_param{4}.a, 'alpha', link_param{4}.alpha, ...
    'm', link_param{4}.m, 'r', link_param{4}.rc, 'I', link_param{4}.Ic, ...
    'B', 0, 'G', 0, 'Jm', 0, 'standard')
    Revolute('d', link_param{5}.d, 'a', link_param{5}.a, 'alpha', link_param{5}.alpha, ...
    'm', link_param{5}.m, 'r', link_param{5}.rc, 'I', link_param{5}.Ic, ...
    'B', 0, 'G', 0, 'Jm', 0, 'standard')
    Revolute('d', link_param{6}.d, 'a', link_param{6}.a, 'alpha', link_param{6}.alpha, ...
    'm', link_param{6}.m, 'r', link_param{6}.rc, 'I', link_param{6}.Ic, ...
    'B', 0, 'G', 0, 'Jm', 0, 'standard')
    ], ...
    'name', 'HCR14', ...
    'comment', '230504_HCR_14_1420mm');

HCR14.base = eye(4); %r2t(rotz(pi));
grav = [0; 0; 9.81];
q_home = [0; -pi/2; -pi/2; -pi/2; pi/2; 0];  
q_0 = [0; -pi/2; 0; -pi/2; pi/2; 0];
q_max = [2*pi;  2*pi;   2.8798;  2*pi;  2*pi;  2*pi];
dotq_max = [3.4907; 2.7053; 4.7124; 4.7124; 4.7124; 4.7124];
ddotq_max = [4.1888; 4.0143; 9.2502; 9.4248; 9.4248; 9.4248];

end