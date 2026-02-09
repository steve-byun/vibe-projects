function r = ddp(R, w,dw,ddp,r)
r = transpose(R)*ddp + cross(dw,r) + cross(w,cross(w,r));