function r = dw(R, w, dw, dq,ddq, z)
r = transpose(R)*(dw + ddq*z + cross(dq*w,z));

