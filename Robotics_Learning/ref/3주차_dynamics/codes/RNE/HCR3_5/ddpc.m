function r = ddpc(ddp,w,dw,rc)
r = ddp + cross(dw,rc) + cross(w,cross(w,rc));

