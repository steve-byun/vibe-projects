function [link_param, payload, fn, HCR3, grav, q0] = HCR_1gen_3_parameters(n_dof)

% HCR3 1st generation (units - [rad] , [m] , [kg], [kg.m^2] )
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
link_param{1}.a = 0; link_param{1}.alpha = pi/2; link_param{1}.d = 139.6*(1e-3); 
link_param{1}.m = 3.1081;  link_param{1}.rc = [-0.000000847580; -0.0477940; 0.00570330]; 
link_param{1}.Ic = [
   0.011616100000000   0.000002757100000  -0.000004194000000;
   0.000002757100000   0.003113500000000   0.000037877000000;
  -0.000004194000000   0.000037877000000   0.011100000000000];
link_param{1}.I = fn.Ic2I(link_param{1}.m, link_param{1}.rc, link_param{1}.Ic);

% link2
link_param{2}.a = -201*(1e-3); link_param{2}.alpha = 0; link_param{2}.d = 0; 
link_param{2}.m = 5.2467; link_param{2}.rc = [0.105820; 0.0000153030; 0.122890]; 
link_param{2}.Ic = [
   0.089371000000000  -0.004983500000000  -0.068354000000000
  -0.004983500000000   0.193220000000000  -0.000013466000000
  -0.068354000000000  -0.000013466000000   0.108590000000000];
link_param{2}.I = fn.Ic2I(link_param{2}.m, link_param{2}.rc, link_param{2}.Ic);

% link3
link_param{3}.a = -281.5*(1e-3); link_param{3}.alpha = 0; link_param{3}.d = 0; 
link_param{3}.m = 2.1843;  link_param{3}.rc = [0.0945610; 0.0000189020; 0.0337080]; 
link_param{3}.Ic = [
   0.006367800000000   0.000001606200000  -0.002686800000000
   0.000001606200000   0.055388000000000  -0.000001109400000
  -0.002686800000000  -0.000001109400000   0.050606000000000];
link_param{3}.I = fn.Ic2I(link_param{3}.m, link_param{3}.rc, link_param{3}.Ic);

% link4
link_param{4}.a = 0; link_param{4}.alpha = pi/2; link_param{4}.d = 148.6; 
link_param{4}.m = 1.2469; link_param{4}.rc = [0.000296190; -0.00340590; 0.049240]; 
link_param{4}.Ic = [
   0.005055800000000   0.000010258000000   0.000000135420000
   0.000010258000000   0.004930400000000   0.000003912400000
   0.000000135420000   0.000003912400000   0.000791640000000];
link_param{4}.I = fn.Ic2I(link_param{4}.m, link_param{4}.rc, link_param{4}.Ic);

% link5
link_param{5}.a = 0; link_param{5}.alpha = -pi/2; link_param{5}.d = 147.5; 
link_param{5}.m = 1.246;  link_param{5}.rc = [0.00000177470; 0.00341940; 0.0492290]; 
link_param{5}.Ic = [
   0.005053900000000  -0.000000782350000  -0.000000476170000
  -0.000000782350000   0.004926900000000  -0.000003885400000
  -0.000000476170000  -0.000003885400000   0.000791640000000];
link_param{5}.I = fn.Ic2I(link_param{5}.m, link_param{5}.rc, link_param{5}.Ic);

% link6
link_param{6}.a = 0; link_param{6}.alpha = 0; link_param{6}.d = 152; 
link_param{6}.m = 0.2086; link_param{6}.rc = [0.0000943840; -0.000470310; -0.0259170];
link_param{6}.Ic = [
   0.277410000000000  -0.000262250000000   0.000275120000000
  -0.000262250000000   0.276800000000000  -0.004122600000000
   0.000275120000000  -0.004122600000000   0.143570000000000]*(1e-3);
link_param{6}.I = fn.Ic2I(link_param{6}.m, link_param{6}.rc, link_param{6}.Ic);

% payload
payload.mL = 0; payload.rcL = [0; 0; 0]; payload.IL = diag([0; 0; 0]);

% robot define
HCR3 = SerialLink([
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
    'name', 'HCR3', ...
    'comment', 'HCR_1&2세대_파라미터');

HCR3.base = eye(4); %r2t(rotz(-pi)); 
grav = [0; 0; 9.81];
q0 = [0, -pi/2, -pi/2, -pi/2, pi/2, 0]';

end