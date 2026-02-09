function [link_param, payload, fn, HCR14, grav, q0] = HCR_3gen_14DV_parameters(n_dof)

% HCR14 3rd generation (units - [rad] , [m] , [kg], [kg.m^2] )
fn.M = eval(sprintf('@M_%ddofs', n_dof));
fn.C = eval(sprintf('@C_%ddofs', n_dof));
fn.g = eval(sprintf('@g_%ddofs', n_dof));
fn.Jg = eval(sprintf('@Jg_%ddofs', n_dof));
fn.Ja = eval(sprintf('@Ja_%ddofs', n_dof));
fn.dotJa = eval(sprintf('@dotJa_%ddofs', n_dof));

% link1
link_param{1}.a = 0; link_param{1}.alpha = pi/2; link_param{1}.d = 201*(1E-3); 
link_param{1}.m = 8.99;  link_param{1}.rc = [0.78; -45.27; 9.43]*(1E-3); 
link_param{1}.Ic = [
    34493.24    401.83    -38.12;
    401.83      26744.42  2993.69;
    -38.12      2993.69   31527.88]*(1e-6);
link_param{1}.I = [
    53720.85    86.33     27.61;
    86.33       27549.51  -845.13;
    27.61       -845.13   49961.20]*(1e-6);

% link2
link_param{2}.a = -730*(1E-3); link_param{2}.alpha = 0; link_param{2}.d = 0; 
link_param{2}.m = 18.19; link_param{2}.rc = [451.52; -0.33; 176.01]*(1e-3); 
link_param{2}.Ic = [
    62693.89    -2359.01    -17410.03;
    -2359.01    1803819.78  -260.67;
    -17410.03   -260.67     1783792.72]*(1e-6);
link_param{2}.I = [
    626302.14   -5032.25    1428407.08;
    -5032.25    6076375.11  -1302.75;
    1428407.08  -1302.75    5492743.65
    ]*(1e-6);

% link3
link_param{3}.a = -540.5*(1E-3); link_param{3}.alpha = 0; link_param{3}.d = 0; 
link_param{3}.m = 5.20;  link_param{1}.rc = [186.18; -0.01; 53.12]*(1e-3); 
link_param{3}.Ic = [
    9773.97      -4.30      -6281.29;
    -4.30        224944.40  0.47;
    -6281.29     0.47       221835.97]*(1e-6);
link_param{3}.I = [
    24451.99     -13.89     45161.11;
    -13.89       419913.76  -2.27;
    45161.11     -2.27      402127.31]*(1e-6);

% link4
link_param{4}.a = 0; link_param{4}.alpha = pi/2; link_param{4}.d = 183*(1E-3); 
link_param{4}.m = 2.43; link_param{4}.rc = [-0.03; -6.08; 32.38]*(1e-3); 
link_param{4}.Ic = [
    4321.40      4.57      1.94;
    4.57         3884.15   387.79;
    1.94         387.79    2338.51]*(1e-6);
link_param{4}.I = [
    6959.76      5.03      -0.49;
    5.03         6432.68   -90.69;
    -0.49        -90.69    2428.34]*(1e-6);

% link5
link_param{5}.a = 0; link_param{5}.alpha = -pi/2; link_param{5}.d = 149.5*(1E-3); 
link_param{5}.m = 2.43;  link_param{5}.rc = [0.03; 6.08; 32.38]*(1e-3); 
link_param{5}.Ic = []*(1e-6);
link_param{5}.I = []*(1e-6);

% link6
link_param{6}.a = 0; link_param{6}.alpha = 0; link_param{6}.d = 139.5*(1E-3); 
link_param{6}.m = 0.48; link_param{6}.rc = [-0.12; 0.81; -28.71]; 
link_param{6}.Ic = [
    439.81     -0.51      0.09;
    -0.51      470.94     5.63;
    0.09       5.63       626.91]*(1e-6);
link_param{6}.I = [
    839.16     -0.55      1.79;
    -0.55      869.98     -5.65;
    1.79       -5.65      627.24]*(1e-6);

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
    'name', 'HCR14DV', ...
    'comment', '221102_HCR_14_1420mm');

HCR14.base = eye(4); %r2t(rotz(-pi)); 
grav = [0; 0; 9.81];
q0 = [0, -pi/2, -pi/2, -pi/2, pi/2, 0]';

end