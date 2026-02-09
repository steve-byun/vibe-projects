%fa = f(i,i)
%fb = f(i+1,i+1)
function r = mu(R,In,im,fa,fb,r,rc,kr,dq,ddq,w,dw,zm,mu)
r = cross(-fa, r+rc) + R*mu + cross(R*fb,rc) + In*dw + cross(w,In*w) + kr*ddq*im*zm + kr*dq*im*cross(w,zm);