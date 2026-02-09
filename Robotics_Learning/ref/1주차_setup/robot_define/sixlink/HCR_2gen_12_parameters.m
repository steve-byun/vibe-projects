function [link_param, payload, fn, HCR12, grav] = HCR_2gen_12_parameters(n_dof)

% HCR12 2nd generation (units - [rad] , [m] , [kg], [kg.m^2] )
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
link_param{1}.a = 100*(1e-3); link_param{1}.alpha = pi/2; link_param{1}.d = 310.0*(1e-3); 
link_param{1}.m = 12.49;  link_param{1}.rc = [-0.019370; -0.0062520; -0.087240]; 
link_param{1}.Ic = [
   0.202800000000000  -0.008157000000000  -0.000650400000000
  -0.008157000000000   0.225700000000000   0.000179500000000
  -0.000650400000000   0.000179500000000   0.078730000000000];
link_param{1}.I = fn.Ic2I(link_param{1}.m, link_param{1}.rc, link_param{1}.Ic);

% link2
link_param{2}.a = 600*(1e-3); link_param{2}.alpha = 0; link_param{2}.d = 0; 
link_param{2}.m = 6.802; link_param{2}.rc = [-0.34380; -0.000055510; -0.20470]; 
link_param{2}.Ic = [
   0.307700000000000  -0.000085590000000  -0.512000000000000
  -0.000085590000000   1.476000000000000  -0.000055430000000
  -0.512000000000000  -0.000055430000000   1.191000000000000];
link_param{2}.I = fn.Ic2I(link_param{2}.m, link_param{2}.rc, link_param{2}.Ic);

% link3
link_param{3}.a = 105*(1e-3); link_param{3}.alpha = pi/2; link_param{3}.d = 0; 
link_param{3}.m = 9.260;  link_param{3}.rc = [-0.064830; -0.036820; 0.027390]; 
link_param{3}.Ic = [
   0.069710000000000  -0.035600000000000   0.000489900000000
  -0.035600000000000   0.102300000000000   0.000030600000000
   0.000489900000000   0.000030600000000   0.107000000000000];
link_param{3}.I = fn.Ic2I(link_param{3}.m, link_param{3}.rc, link_param{3}.Ic);

% link4
link_param{4}.a = 0; link_param{4}.alpha = -pi/2; link_param{4}.d = 591*(1e-3); 
link_param{4}.m = 3.427; link_param{4}.rc = [0.000034320; 0.2820; 0.083450]; 
link_param{4}.Ic = [
   0.398700000000000  -0.000047660000000   0.000000844500000
  -0.000047660000000   0.044300000000000  -0.049970000000000
   0.000000844500000  -0.049970000000000   0.358800000000000];
link_param{4}.I = fn.Ic2I(link_param{4}.m, link_param{4}.rc, link_param{4}.Ic);

% link5
link_param{5}.a = 0; link_param{5}.alpha = pi/2; link_param{5}.d = 0; 
link_param{5}.m = 5.802;  link_param{5}.rc = [-0.000079670; 0.050270; 0.053120]; 
link_param{5}.Ic = [
   0.077800000000000   0.000029970000000  -0.000008052000000
   0.000029970000000   0.045710000000000  -0.000088640000000
  -0.000008052000000  -0.000088640000000   0.037730000000000];
link_param{5}.I = fn.Ic2I(link_param{5}.m, link_param{5}.rc, link_param{5}.Ic);

% link6
link_param{6}.a = 0; link_param{6}.alpha = 0; link_param{6}.d = 223.5*(1e-3); 
link_param{6}.m = 0.3520; link_param{6}.rc = [-0.00033430; 0.00035340; -0.024210];
link_param{6}.Ic = [
   0.539800000000000   0.006031000000000  -0.002773000000000
   0.006031000000000   0.549300000000000   0.007077000000000
  -0.002773000000000   0.007077000000000   0.5129000000000000]*(1e-3);
link_param{6}.I = fn.Ic2I(link_param{6}.m, link_param{6}.rc, link_param{6}.Ic);

% payload
payload.mL = 0; payload.rcL = [0; 0; 0]; payload.IL = diag([0; 0; 0]);

% robot define
HCR12 = SerialLink([
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
    'name', 'HCR12', ...
    'comment', 'HCR_1&2세대_파라미터');

HCR12.q0 = [0, -pi/2, -pi/2, -pi/2, pi/2, 0]';
HCR12.base = eye(4); 
grav = [0; 0; 9.81];

end