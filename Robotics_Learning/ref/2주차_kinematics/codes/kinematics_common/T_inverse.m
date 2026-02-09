function [T_inv,singularError] = T_inverse(T)

Rt = transpose(T(1:3,1:3));
pt = (-1.0) * Rt * T(1:3,4);
T_inv_temp = [Rt pt];
T_inv = [T_inv_temp; 0 0 0 1];
if (rcond(T_inv) < 1e-10)
    singularError = true;
else
    singularError = false;
end

end