% clc; clear all; close all;
function Compute_torques_sym(poseType)
%% Compute dynamics
% Set variables
syms cx_axis cy_axis sx_axis sy_axis; 
syms m1 m2 m3 m4 m5 m6;
syms c1 c2 c3 c4 c5 c6;
syms s1 s2 s3 s4 s5 s6;
syms g;
syms q1 dq1 ddq1;
syms q2 dq2 ddq2;
syms q3 dq3 ddq3;
syms q4 dq4 ddq4;
syms q5 dq5 ddq5;
syms q6 dq6 ddq6;
syms q7 dq7 ddq7;

syms l1 l2 l3 l4 l5 l6;

syms r1cx r1cy r1cz;
syms r2cx r2cy r2cz;
syms r3cx r3cy r3cz;
syms r4cx r4cy r4cz;
syms r5cx r5cy r5cz;
syms r6cx r6cy r6cz;

syms I1xx I1xy I1xz I1yx I1yy I1yz I1zx I1zy I1zz;
syms I2xx I2xy I2xz I2yx I2yy I2yz I2zx I2zy I2zz;
syms I3xx I3xy I3xz I3yx I3yy I3yz I3zx I3zy I3zz;
syms I4xx I4xy I4xz I4yx I4yy I4yz I4zx I4zy I4zz;
syms I5xx I5xy I5xz I5yx I5yy I5yz I5zx I5zy I5zz;
syms I6xx I6xy I6xz I6yx I6yy I6yz I6zx I6zy I6zz;

% Mass per each link
m = [m1 m2 m3 m4 m5 m6];

% Gravity
G = [g*cx_axis*sy_axis; -g*sx_axis; -g*cx_axis*cy_axis];

% Vector from frame i-1 to frame i, seen from frame i
r01 = [0; l1; 0];
r12 = [-l2; 0; 0];
r23 = [-l3; 0; 0];
r34 = [0; l4; 0];
r45 = [0; -l5; 0];
r56 = [0; 0; l6];

% Vector from the origin of frame i to the COM of frame i, seen from frame i
r1c = [r1cx; r1cy; r1cz];
r2c = [r2cx; r2cy; r2cz];
r3c = [r3cx; r3cy; r3cz];
r4c = [r4cx; r4cy; r4cz];
r5c = [r5cx; r5cy; r5cz];
r6c = [r6cx; r6cy; r6cz];

% Inertia matrices
I1 = [I1xx I1xy I1xz; I1xy I1yy I1yz; I1xz I1yz I1zz];
I2 = [I2xx I2xy I2xz; I2xy I2yy I2yz; I2xz I2yz I2zz];
I3 = [I3xx I3xy I3xz; I3xy I3yy I3yz; I3xz I3yz I3zz];
I4 = [I4xx I4xy I4xz; I4xy I4yy I4yz; I4xz I4yz I4zz];
I5 = [I5xx I5xy I5xz; I5xy I5yy I5yz; I5xz I5yz I5zz];
I6 = [I6xx I6xy I6xz; I6xy I6yy I6yz; I6xz I6yz I6zz];

% Motor parameters
z0 = [0; 0; 1];
z01 = [0; 0; 1];
z12 = [0; 0; 1];
z23 = [0; 0; 1];
z34 = [0; 0; 1];
z45 = [0; 0; 1];
z56 = [0; 0; 1];
z67 = [0; 0; 1];

im1 = 0;
im2 = 0;
im3 = 0;
im4 = 0;
im5 = 0;
im6 = 0;
im7 = 0;
kr1 = 0;
kr2 = 0;
kr3 = 0;
kr4 = 0;
kr5 = 0;
kr6 = 0;
kr7 = 0;

% Rotation matrices
% Rz1 = [cos(q1), -sin(q1), 0;
%        sin(q1),  cos(q1), 0;
%        0,        0,       1];
% Rz2 = [cos(q2), -sin(q2), 0;
%        sin(q2),  cos(q2), 0;
%        0,             0,            1];
% Rz3 = [cos(q3), -sin(q3), 0;
%        sin(q3),  cos(q3), 0;
%        0,        0,       1];
% Rz4 = [cos(q4), -sin(q4), 0;
%        sin(q4),  cos(q4), 0;
%        0,        0,       1];
% Rz5 = [cos(q5), -sin(q5), 0;
%        sin(q5),  cos(q5), 0;
%        0,        0,       1];
% Rz6 = [cos(q6), -sin(q6), 0;
%        sin(q6),  cos(q6), 0;
%        0,        0,       1];
% 
% Rx1 = [1, 0,         0;
%        0, cos(pi/2), -sin(pi/2);
%        0, sin(pi/2), cos(pi/2)];
% Rx2 = [1, 0,         0;
%        0, cos(0), -sin(0);
%        0, sin(0), cos(0)];
% Rx3 = [1, 0,         0;
%        0, cos(pi/2), -sin(pi/2);
%        0, sin(pi/2), cos(pi/2)];
% Rx4 = [1, 0,         0;
%        0, cos(-pi/2), -sin(-pi/2);
%        0, sin(-pi/2), cos(-pi/2)];
% Rx5 = [1, 0,         0;
%        0, cos(pi/2), -sin(pi/2);
%        0, sin(pi/2), cos(pi/2)];
% Rx6 = [1, 0,         0;
%        0, cos(0), -sin(0);
%        0, sin(0), cos(0)];

Rz1 = [c1, -s1, 0;
       s1,  c1, 0;
       0,   0,  1];
Rz2 = [c2, -s2, 0;
       s2,  c2, 0;
       0,   0,   1];
Rz3 = [c3, -s3, 0;
       s3,  c3, 0;
       0,   0,  1];
Rz4 = [c4, -s4, 0;
       s4,  c4, 0;
       0,   0,  1];
Rz5 = [c5, -s5, 0;
       s5,  c5, 0;
       0,   0,  1];
Rz6 = [c6, -s6, 0;
       s6,  c6, 0;
       0,   0,  1];

Rx1 = [1, 0, 0;
       0, 0, -1;
       0, 1, 0];
Rx2 = [1, 0,  0;
       0, 1, -0;
       0, 0, 1];
Rx3 = [1, 0, 0;
       0, 1, -0;
       0, 0, 1];
Rx4 = [1, 0, 0;
       0, 0, -1;
       0, 1, 0];
Rx5 = [1, 0, 0;
       0, 0, 1;
       0, -1, 0];
Rx6 = [1, 0, 0;
       0, 1, -0;
       0, 0, 1];

R01 = Rz1 * Rx1;
R12 = Rz2 * Rx2;
R23 = Rz3 * Rx3;
R34 = Rz4 * Rx4;
R45 = Rz5 * Rx5;
R56 = Rz6 * Rx6;
R67 = eye(3);

% Initial conditions
w00 = [0; 0; 0];
dw00 = [0; 0; 0];
ddp00 = G;

% Terminal conditions
f77 = [0; 0; 0];
mu77 = [0; 0; 0];

% Forward recursion
% link 1
w11 = w(R01,w00,dq1,z01);
dw11 = dw(R01,w00,dw00,dq1,ddq1,z01);
ddp11 = ddp(R01,w11,dw11,ddp00,r01);
ddp1c1 = ddpc(ddp11,w11,dw11,r1c);
dw0m1 = dwm(w00,dw00,dq1,ddq1,kr1,z01);

% link 2
w22 = w(R12,w11,dq2,z12);
dw22 = dw(R12,w11,dw11,dq2,ddq2,z12);
ddp22 = ddp(R12,w22,dw22,ddp11,r12);
ddp2c2 = ddpc(ddp22,w22,dw22,r2c);
dw1m2 = dwm(w11,dw11,dq2,ddq2,kr2,z12);

% link 3
w33 = w(R23,w22,dq3,z23);
dw33 = dw(R23,w22,dw22,dq3,ddq3,z23);
ddp33 = ddp(R23,w33,dw33,ddp22,r23);
ddp3c3 = ddpc(ddp33,w33,dw33,r3c);
dw2m3 = dwm(w22,dw22,dq3,ddq3,kr3,z23);

% link 4
w44 = w(R34,w33,dq4,z34);
dw44 = dw(R34,w33,dw33,dq4,ddq4,z34);
ddp44 = ddp(R34,w44,dw44,ddp33,r34);
ddp4c4 = ddpc(ddp44,w44,dw44,r4c);
dw3m4 = dwm(w33,dw33,dq4,ddq4,kr4,z34);

% link 5
w55 = w(R45,w44,dq5,z45);
dw55 = dw(R45,w44,dw44,dq5,ddq5,z45);
ddp55 = ddp(R45,w55,dw55,ddp44,r45);
ddp5c5 = ddpc(ddp55,w55,dw55,r5c);
dw4m5 = dwm(w44,dw44,dq5,ddq5,kr5,z45);

% link 6
w66 = w(R56,w55,dq6,z56);
dw66 = dw(R56,w55,dw55,dq6,ddq6,z56);
ddp66 = ddp(R56,w66,dw66,ddp55,r56);
ddp6c6 = ddpc(ddp66,w66,dw66,r6c);
dw5m6 = dwm(w55,dw55,dq6,ddq6,kr6,z56);

% Backward recursion
% link 6
f66 = f(R67,f77,m6,ddp6c6);
mu66 = mu(R67,I6,im7,f66,f77,r56,r6c,kr7,dq7,ddq7,w66,dw66,z67,mu77);
trq6 = trq(R56,mu66,z56,kr6,im6,dw5m6,z56);

% link 5
f55 = f(R56,f66,m5,ddp5c5);
mu55 = mu(R56,I5,im6,f55,f66,r45,r5c,kr6,dq6,ddq6,w55,dw55,z56,mu66);
trq5 = trq(R45,mu55,z45,kr5,im5,dw4m5,z45);

% link 4
f44 = f(R45,f55,m4,ddp4c4);
mu44 = mu(R45,I4,im5,f44,f55,r34,r4c,kr5,dq5,ddq5,w44,dw44,z45,mu55);
trq4 = trq(R34,mu44,z34,kr4,im4,dw3m4,z34);

% link 3
f33 = f(R34,f44,m3,ddp3c3);
mu33 = mu(R34,I3,im4,f33,f44,r23,r3c,kr4,dq4,ddq4,w33,dw33,z34,mu44);
trq3 = trq(R23,mu33,z23,kr3,im3,dw2m3,z23);

% link 2
f22 = f(R23,f33,m2,ddp2c2);
mu22 = mu(R23,I2,im3,f22,f33,r12,r2c,kr3,dq3,ddq3,w22,dw22,z23,mu33);
trq2 = trq(R12,mu22,z12,kr2,im2,dw1m2,z12);

% link 1
f11 = f(R12,f22,m1,ddp1c1);
mu11 = mu(R12,I1,im2,f11,f22,r01,r1c,kr2,dq2,ddq2,w11,dw11,z12,mu22);
trq1 = trq(R01,mu11,z01,kr1,im1,dw0m1,z01);

%% Compute the mass, coriolis and gravity matrices 
% Set variables
eqs = [trq1; trq2; trq3; trq4; trq5; trq6];
q = [q1; q2; q3; q4; q5; q6];
dq = [dq1; dq2; dq3; dq4; dq5; dq6];
ddq = [ddq1; ddq2; ddq3; ddq4; ddq5; ddq6];

% Compute torque matrix
for i= 1:6
    torque(i,1)= eqs(i);
end

% Compute inertia matrix
for i= 1:6
    for j= 1:6
        mass(i,j)= diff(eqs(i), ddq(j));
    end
    
end

% Compute gravity vector
for i= 1:6
   gravity(i,1)= diff(eqs(i), g) * g;
end

for i= 1:6
    for j= 1:6
        amass(i,j) = subs(mass(i,j), s1, sin(q1));
        amass(i,j) = subs(amass(i,j), s2, sin(q2));
        amass(i,j) = subs(amass(i,j), s3, sin(q3));
        amass(i,j) = subs(amass(i,j), s4, sin(q4));
        amass(i,j) = subs(amass(i,j), s5, sin(q5));
        amass(i,j) = subs(amass(i,j), s6, sin(q6));
        
        amass(i,j) = subs(amass(i,j), c1, cos(q1));
        amass(i,j) = subs(amass(i,j), c2, cos(q2));
        amass(i,j) = subs(amass(i,j), c3, cos(q3));
        amass(i,j) = subs(amass(i,j), c4, cos(q4));
        amass(i,j) = subs(amass(i,j), c5, cos(q5));
        amass(i,j) = subs(amass(i,j), c6, cos(q6));
    end
end

% Compute coriolis matrix
coriolis= sym(zeros(4,4));

for i= 1:6
    for j= 1:6
        coriolis(i,j)= 0;
        for k= 1:6
            coriolis(i,j)= coriolis(i,j) + 1/2 * (diff(amass(i,j), q(k)) + diff(amass(i,k), q(j)) - diff(amass(j,k), q(i))) * dq(k);
        end
    end
end

for i= 1:6
    for j= 1:6
        coriolis(i,j) = subs(coriolis(i,j), sin(q1), s1);
        coriolis(i,j) = subs(coriolis(i,j), sin(q2), s2);
        coriolis(i,j) = subs(coriolis(i,j), sin(q3), s3);
        coriolis(i,j) = subs(coriolis(i,j), sin(q4), s4);
        coriolis(i,j) = subs(coriolis(i,j), sin(q5), s5);
        coriolis(i,j) = subs(coriolis(i,j), sin(q6), s6);
        
        coriolis(i,j) = subs(coriolis(i,j), cos(q1), c1);
        coriolis(i,j) = subs(coriolis(i,j), cos(q2), c2);
        coriolis(i,j) = subs(coriolis(i,j), cos(q3), c3);
        coriolis(i,j) = subs(coriolis(i,j), cos(q4), c4);
        coriolis(i,j) = subs(coriolis(i,j), cos(q5), c5);
        coriolis(i,j) = subs(coriolis(i,j), cos(q6), c6);
    end
end

if poseType == 1
% Mass matrix
M = [mass(1,1) mass(1,2) mass(1,3) mass(1,4) mass(1,5) mass(1,6);
     mass(2,1) mass(2,2) mass(2,3) mass(2,4) mass(2,5) mass(2,6);
     mass(3,1) mass(3,2) mass(3,3) mass(3,4) mass(3,5) mass(3,6);
     mass(4,1) mass(4,2) mass(4,3) mass(4,4) mass(4,5) mass(4,6);
     mass(5,1) mass(5,2) mass(5,3) mass(5,4) mass(5,5) mass(5,6);
     mass(6,1) mass(6,2) mass(6,3) mass(6,4) mass(6,5) mass(6,6)];
ccode(M,'file','inertiaMatrix.txt');

elseif poseType == 2
% Coriolis matrix
C = [coriolis(1,1) coriolis(1,2) coriolis(1,3) coriolis(1,4) coriolis(1,5) coriolis(1,6);
     coriolis(2,1) coriolis(2,2) coriolis(2,3) coriolis(2,4) coriolis(2,5) coriolis(2,6);
     coriolis(3,1) coriolis(3,2) coriolis(3,3) coriolis(3,4) coriolis(3,5) coriolis(3,6);
     coriolis(4,1) coriolis(4,2) coriolis(4,3) coriolis(4,4) coriolis(4,5) coriolis(4,6);
     coriolis(5,1) coriolis(5,2) coriolis(5,3) coriolis(5,4) coriolis(5,5) coriolis(5,6);
     coriolis(6,1) coriolis(6,2) coriolis(6,3) coriolis(6,4) coriolis(6,5) coriolis(6,6)];
ccode(C,'file','coriolisMatrix.txt');

elseif poseType == 3
% Gravity matrix
G = [gravity(1,1) gravity(2,1) gravity(3,1) gravity(4,1) gravity(5,1) gravity(6,1)];
ccode(G,'file','gravityVector.txt');

else
end
end