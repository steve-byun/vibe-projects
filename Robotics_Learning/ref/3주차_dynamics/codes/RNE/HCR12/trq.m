function r = trq(R,mu,z,kr,im,dwm,zm)
r = transpose(mu)*transpose(R)*z + kr*im*transpose(dwm)*zm;