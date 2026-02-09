function [link_param, payload, fn, twolink, grav, q_home, q_0, q_max, dotq_max, ddotq_max] = twolink_parameters(n_dof)

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
link_param{1}.a = 1; link_param{1}.alpha = 0; link_param{1}.d = 0; 
link_param{1}.m = 1;  link_param{1}.rc = [-0.5; 0; 0]; 
link_param{1}.Ic = diag([0; 0; (link_param{1}.m*link_param{1}.a^2)/12]);
link_param{1}.I = fn.Ic2I(link_param{1}.m, link_param{1}.rc, link_param{1}.Ic);

% link2
link_param{2}.a = 1; link_param{2}.alpha = 0; link_param{2}.d = 0; 
link_param{2}.m = 1; link_param{2}.rc = [-0.5; 0; 0]; 
link_param{2}.Ic = diag([0; 0; (link_param{2}.m*link_param{2}.a^2)/12]);
link_param{2}.I = fn.Ic2I(link_param{2}.m, link_param{2}.rc, link_param{2}.Ic); 

% payload
payload.mL = 1.5; payload.rcL = [0.3; 0.1; 0]; payload.IL = diag([0; 0; 0.1813]);
payload.IcL = fn.I2Ic(payload.mL, payload.rcL, payload.IL);

% robot define
twolink = SerialLink([
    Revolute('d', link_param{1}.d, 'a', link_param{1}.a, 'alpha', link_param{1}.alpha, ...
    'm', link_param{1}.m, 'r', link_param{1}.rc, 'I', link_param{1}.Ic, ...
    'B', 0, 'G', 0, 'Jm', 0, 'standard')
    Revolute('d', link_param{2}.d, 'a', link_param{2}.a, 'alpha', link_param{2}.alpha, ...
    'm', link_param{2}.m, 'r', link_param{2}.rc, 'I', link_param{2}.Ic, ...
    'B', 0, 'G', 0, 'Jm', 0, 'standard')
    ], ...
    'name', 'two link', ...
    'comment', 'from Spong, Hutchinson, Vidyasagar');

twolink.base = eye(4); %trotx(pi/2);
grav = [0; 9.81; 0];

q_home = [0; -pi/2];  
q_0 = [0; -pi/2];
q_max = [2*pi;  2*pi;];
dotq_max = [3.4907; 2.7053];
ddotq_max = [4.1888; 4.0143];

end