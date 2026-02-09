function u = impedance_control_law(p, dotp, p_d, dotp_d, ddotp_d, q, dotq, f_a, param)

[~, T_all] = param.robot.fkine(q);
rpy_all = tr2rpy(T_all)';
Ja = param.fn.Ja(q, param.dh, rpy_all(:));
dotJa = param.fn.dotJa(q, dotq, param.dh, rpy_all(:));
inv_Ja = pinv(Ja);

M = param.fn.M(q, param.dh, param.dyn);
C = param.fn.C(q, dotq, param.dh, param.dyn);
g = param.fn.g(q, param.grav, param.dh, param.dyn);

u = ;

end