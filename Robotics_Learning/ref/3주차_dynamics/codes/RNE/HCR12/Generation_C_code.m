%% C code generation
% Torque matrix
T = [torque(1,1) torque(2,1) torque(3,1) torque(4,1) torque(5,1) torque(6,1)]; 
% ccode(T,'file','T_6by1.txt');

% Mass matrix
% M = [mass(1,1) mass(1,2) mass(1,3) mass(1,4) mass(1,5) mass(1,6);
%      mass(2,1) mass(2,2) mass(2,3) mass(2,4) mass(2,5) mass(2,6);
%      mass(3,1) mass(3,2) mass(3,3) mass(3,4) mass(3,5) mass(3,6);
%      mass(4,1) mass(4,2) mass(4,3) mass(4,4) mass(4,5) mass(4,6);
%      mass(5,1) mass(5,2) mass(5,3) mass(5,4) mass(5,5) mass(5,6);
%      mass(6,1) mass(6,2) mass(6,3) mass(6,4) mass(6,5) mass(6,6)];
% ccode(M,'file','M_6by6.txt');

% Coriolis matrix
% C = [coriolis(1,1) coriolis(1,2) coriolis(1,3) coriolis(1,4) coriolis(1,5) coriolis(1,6);
%      coriolis(2,1) coriolis(2,2) coriolis(2,3) coriolis(2,4) coriolis(2,5) coriolis(2,6);
%      coriolis(3,1) coriolis(3,2) coriolis(3,3) coriolis(3,4) coriolis(3,5) coriolis(3,6);
%      coriolis(4,1) coriolis(4,2) coriolis(4,3) coriolis(4,4) coriolis(4,5) coriolis(4,6);
%      coriolis(5,1) coriolis(5,2) coriolis(5,3) coriolis(5,4) coriolis(5,5) coriolis(5,6);
%      coriolis(6,1) coriolis(6,2) coriolis(6,3) coriolis(6,4) coriolis(6,5) coriolis(6,6)];
 C = [coriolis(1,1) 0 0 0 0 0;
     0 coriolis(2,2) 0 0 0 0;
     0 coriolis(3,2) 0 0 0 0;
     0 coriolis(4,2) 0 0 0 0;
     0 0 0 0 0 0;
     0 0 0 0 0 0];
% C = [0 coriolis(1,2) coriolis(1,3) coriolis(1,4) coriolis(1,5) coriolis(1,6);
%      coriolis(2,1) 0 coriolis(2,3) coriolis(2,4) coriolis(2,5) coriolis(2,6);
%      coriolis(3,1) coriolis(3,2) 0 coriolis(3,4) coriolis(3,5) coriolis(3,6);
%      coriolis(4,1) coriolis(4,2) coriolis(4,3) 0 coriolis(4,5) coriolis(4,6);
%      coriolis(5,1) coriolis(5,2) coriolis(5,3) coriolis(5,4) 0 coriolis(5,6);
%      coriolis(6,1) coriolis(6,2) coriolis(6,3) coriolis(6,4) coriolis(6,5) 0];
ccode(C,'file','C_6by6.txt');

% Gravity matrix
% G = [gravity(1,1) gravity(2,1) gravity(3,1) gravity(4,1) gravity(5,1) gravity(6,1)];
% ccode(G,'file','G_6by1.txt');



% ccode(T,'file','T_6by1.txt');
% ccode(M,'file','M_6by6.txt');
% ccode(G,'file','G_6by1.txt');
% ccode(C,'file','C_6by6.txt');