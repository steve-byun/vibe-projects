function u = compliance_control_law(p, dotp, p_d, dotp_d, ddotp_d, q, dotq, fa, param)

[~, T_all] = param.robot.fkine(q);
rpy_all = tr2rpy(T_all)';
Ja = param.fn.Ja(q, param.dh, rpy_all(:));

g = param.fn.g(q, param.grav, param.dh, param.dyn);

u = ;

end