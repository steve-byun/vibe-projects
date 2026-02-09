function [dotx, T1, T2] = ode_dynamic_for_indirect_force_control(t, x, f_a, p_d, dotp_d, ddotp_d, param, ctrl_law)

q = [x(1); x(3)]; 
dotq = [x(2); x(4)];

[T, T_all] = param.robot.fkine(q);
rpy_all = tr2rpy(T_all)';
Ja = param.fn.Ja(q, param.dh, rpy_all(:));
p = [transl(T); zeros(3,1)]; 
dotp = Ja*dotq;

M = param.fn.M(q, param.dh, param.dyn);
C = param.fn.C(q, dotq, param.dh, param.dyn);
g = param.fn.g(q, param.grav, param.dh, param.dyn);

u = ctrl_law(p, dotp, p_d, dotp_d, ddotp_d, q, dotq, f_a, param);

ddotq = (M)\(u + Ja'*f_a - C*dotq - g);

dotx = [dotq(1); ddotq(1); dotq(2); ddotq(2)];

T1 = u(1); T2 = u(2);

end