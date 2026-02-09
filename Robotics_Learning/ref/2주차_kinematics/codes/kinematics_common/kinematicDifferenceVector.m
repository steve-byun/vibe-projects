function e = kinematicDifferenceVector(T1,T2)

e = zeros(6,1);
xyz1 = T1(1:3,4);
xyz2 = T2(1:3,4);
xyz_e = xyz1 - xyz2;

R1 = T1(1:3,1:3);
R2 = T2(1:3,1:3);
R_e = R1*R2';

% calculate between rotation matrix -> euler angle error
value = 0.5*(R_e(1,1)+R_e(2,2)+R_e(3,3)-1.0);
if (abs(value) > (1.0-eps))
    phi = zeros(3,1);
else
    th = acos(value);
    n = 1/(2.0*sin(th))*[R_e(3,2)-R_e(2,3); R_e(1,3)-R_e(3,1); R_e(2,1)-R_e(1,2)];
    phi = th*n;
end

e(1:3) = xyz_e;
e(4:6) = phi;

end