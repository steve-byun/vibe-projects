function [dotx, u] = ode_dynamic_for_direct_force_control(t, x, f_d, f_a, param, ctrl_law)

q = x(1:param.n_dof); 
dotq = x(param.n_dof+1:2*param.n_dof);
interror = x(2*param.n_dof+1:2*param.n_dof+param.n_car);

M = param.fn.M(q, param.dh, param.dyn);
C = param.fn.C(q, dotq, param.dh, param.dyn);
g = param.fn.g(q, param.grav, param.dh, param.dyn);
Jg = param.robot.jacobn(q); %Jg = param.fn.Jg(q, param.dh);


f_a = f_d + randn(size(f_d));

u = ctrl_law(q, dotq, f_d, f_a, param, interror);

ddotq = (M)\(u - C*dotq - g - Jg'*f_a);

dotinterror = f_d-f_a;

dotx = [dotq; ddotq; dotinterror];

end