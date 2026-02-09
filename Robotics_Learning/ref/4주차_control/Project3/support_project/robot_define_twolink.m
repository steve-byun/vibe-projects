function [twolink, fn] = robot_define_twolink(param_kin,param_dyn,param_dyn_loadest,param_grav,n_dof,n_kin,n_dyn)

[alpha,d,a,m,rc,Ic,mrc,I] = unpack_robot_param(param_kin,param_dyn,param_dyn_loadest,n_dof,n_kin,n_dyn);

twolink = SerialLink([
    Revolute('d', d(1), 'a', a(1), 'alpha', alpha(1), 'm', m{1}, 'r', rc{1}, 'I', Ic{1}, 'B', 0 , 'G', 0, 'Jm', 0, 'standard' );
    Revolute('d', d(2), 'a', a(2), 'alpha', alpha(2), 'm', m{2}, 'r', rc{2}, 'I', Ic{2}, 'B', 0 , 'G', 0, 'Jm', 0, 'standard' )],...
    'name', 'twoLink', 'comment', 'from spong');

twolink.base = eye(4);
twolink.fast = 0;
twolink.gravity = param_grav;

fn.M = eval(sprintf('@M_%ddofs', n_dof));
fn.C = eval(sprintf('@C_%ddofs', n_dof));
fn.g = eval(sprintf('@g_%ddofs', n_dof));
fn.Jg = eval(sprintf('@Jg_%ddofs', n_dof));
fn.Ja = eval(sprintf('@Ja_%ddofs', n_dof));
fn.dotJa = eval(sprintf('@dotJa_%ddofs', n_dof));

end