function [link_param, payload, fn, HCR5, grav, q0] = HCR_2gen_5_parameters(n_dof)

% HCR5 2nd generation (units - [rad] , [m] , [kg], [kg.m^2] )
fn.M = eval(sprintf('@M_%ddofs', n_dof));
fn.C = eval(sprintf('@C_%ddofs', n_dof));
fn.g = eval(sprintf('@g_%ddofs', n_dof));
fn.Jg = eval(sprintf('@Jg_%ddofs', n_dof));
fn.Ja = eval(sprintf('@Ja_%ddofs', n_dof));
fn.dotJa = eval(sprintf('@dotJa_%ddofs', n_dof));

fn.S = @(x)([0 -x(3) x(2); x(3) 0 -x(1); -x(2) x(1) 0]); % skew
fn.Ic2I = @(m, rc, Ic)(Ic + m*fn.S(rc)'*fn.S(rc));
fn.I2Ic = @(m, rc, I)(I - m*fn.S(rc)'*fn.S(rc));

% link1
link_param{1}.a = 0; link_param{1}.alpha = pi/2; link_param{1}.d = 149.0*(1e-3); 
link_param{1}.m = 4.4018;  link_param{1}.rc = [0.0000103110; -0.0635280; 0.00436040]; 
link_param{1}.Ic = [
   0.011252000000000   0.000000758310000  -0.000003697500000
   0.000000758310000   0.007933500000000  -0.001137000000000
  -0.000003697500000  -0.001137000000000   0.010549000000000];
link_param{1}.I = fn.Ic2I(link_param{1}.m, link_param{1}.rc, link_param{1}.Ic);

% link2
link_param{2}.a = -425*(1e-3); link_param{2}.alpha = 0; link_param{2}.d = 0; 
link_param{2}.m = 9.9180; link_param{2}.rc = [0.212450; 0.00000805210; 0.139250]; 
link_param{2}.Ic = [
   0.024747000000000   0.000031268000000   0.000010637000000
   0.000031268000000   0.418240000000000  -0.000003942600000
   0.000010637000000  -0.000003942600000   0.408560000000000];
link_param{2}.I = fn.Ic2I(link_param{2}.m, link_param{2}.rc, link_param{2}.Ic);

% link3
link_param{3}.a = -338.5*(1e-3); link_param{3}.alpha = 0; link_param{3}.d = 0; 
link_param{3}.m = 2.8375;  link_param{3}.rc = [0.102450; 0.0000197030; 0.04560]; 
link_param{3}.Ic = [
   0.005212100000000   0.000010251000000   0.006417300000000
   0.000010251000000   0.054100000000000  -0.000001922500000
   0.006417300000000  -0.000001922500000   0.051968000000000];
link_param{3}.I = fn.Ic2I(link_param{3}.m, link_param{3}.rc, link_param{3}.Ic);

% link4
link_param{4}.a = 0; link_param{4}.alpha = pi/2; link_param{4}.d = 170.5*(1e-3); 
link_param{4}.m = 1.6783; link_param{4}.rc = [0.0000288150; -0.00443960; 0.0430410]; 
link_param{4}.Ic = [
   0.002596100000000  -0.000005093500000  -0.000001928400000
  -0.000005093500000   0.002359400000000  -0.000300620000000
  -0.000001928400000  -0.000300620000000   0.001547500000000];
link_param{4}.I = fn.Ic2I(link_param{4}.m, link_param{4}.rc, link_param{4}.Ic);

% link5
link_param{5}.a = 0; link_param{5}.alpha = -pi/2; link_param{5}.d = 151.5*(1e-3); 
link_param{5}.m = 1.6783;  link_param{5}.rc = [-0.0000288150; 0.00443960; 0.0430410]; 
link_param{5}.Ic = [
   0.002596100000000  -0.000005095400000   0.000001928400000
  -0.000005095400000   0.002359400000000   0.000300620000000
   0.000001928400000   0.000300620000000   0.001547500000000];
link_param{5}.I = fn.Ic2I(link_param{5}.m, link_param{5}.rc, link_param{5}.Ic);

% link6
link_param{6}.a = 0; link_param{6}.alpha = 0; link_param{6}.d = 132.5*(1e-3); 
link_param{6}.m = 0.2936; link_param{6}.rc = [0.0000314470; -0.0000810820; -0.0212170];
link_param{6}.Ic = [
   0.274360000000000   0.001942900000000   0.002028400000000
   0.001942900000000   0.269930000000000  -0.005925400000000
   0.002028400000000  -0.005925400000000   0.286490000000000]*(1e-3);
link_param{6}.I = fn.Ic2I(link_param{6}.m, link_param{6}.rc, link_param{6}.Ic);

% payload
payload.mL = 0; payload.rcL = [0; 0; 0]; payload.IL = diag([0; 0; 0]);

% robot define
HCR5 = SerialLink([
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
    'name', 'HCR5', ...
    'comment', 'HCR_1&2세대_파라미터');

HCR5.base = eye(4); %r2t(rotz(-pi)); 
grav = [0; 0; 9.81];
q0 = [0, -pi/2, -pi/2, -pi/2, pi/2, 0]';
q_ss = [0, -pi/2, 0, -pi/2, 0, 0]';

end