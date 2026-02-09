function r = dwm(w,dw,dq,ddq,kr, zm)
r = dw + kr*ddq*zm + cross(kr*dq*w, zm);