function u = direct_force_control_law(q, dotq, f_d, f_a, param, interror)

C = param.fn.C(q, dotq, param.dh, param.dyn);
g = param.fn.g(q, param.grav, param.dh, param.dyn);
Jg = param.robot.jacobn(q); %Jg = param.fn.Jg(q, param.dh); Jg = param.robot.jacob0(q);

u = C*dotq + g + Jg'*(f_d + param.ctrl.Kp*(f_d-f_a) + param.ctrl.Ki*interror);

end