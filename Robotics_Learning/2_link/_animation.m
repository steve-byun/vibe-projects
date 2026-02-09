%% Step 1b: 2-Link 로봇 애니메이션
% RVCTools robot.plot() 사용
clear; close all; clc;

%% 로봇 정의
L1 = 1.0;
L2 = 0.8;
link1 = Revolute('d', 0, 'a', L1, 'alpha', 0);
link2 = Revolute('d', 0, 'a', L2, 'alpha', 0);
robot = SerialLink([link1 link2], 'name', 'TwoLink');

%% 애니메이션 1: q2만 회전 (q1=0 고정)
fprintf('=== 애니메이션 1: q2 회전 (q1=0 고정) ===\n');
fprintf('팔꿈치만 돌리기\n\n');

q_traj = [];
for q2 = 0:0.05:2*pi
    q_traj = [q_traj; 0, q2];
end

figure('Name', 'Animation 1: q2 회전');
robot.plot(q_traj, 'workspace', [-2.5 2.5 -2.5 2.5 -0.5 0.5], 'view', [0 90], 'fps', 60);

%% 애니메이션 2: q1만 회전 (q2=0 고정)
fprintf('=== 애니메이션 2: q1 회전 (q2=0 고정) ===\n');
fprintf('어깨만 돌리기\n\n');

q_traj = [];
for q1 = 0:0.05:2*pi
    q_traj = [q_traj; q1, 0];
end

figure('Name', 'Animation 2: q1 회전');
robot.plot(q_traj, 'workspace', [-2.5 2.5 -2.5 2.5 -0.5 0.5], 'view', [0 90], 'fps', 60);

%% 애니메이션 3: 둘 다 회전
fprintf('=== 애니메이션 3: q1, q2 동시 회전 ===\n');

q_traj = [];
for t = 0:0.05:2*pi
    q_traj = [q_traj; t, 2*t];  % q2가 2배 빠르게
end

figure('Name', 'Animation 3: 둘 다 회전');
robot.plot(q_traj, 'workspace', [-2.5 2.5 -2.5 2.5 -0.5 0.5], 'view', [0 90], 'fps', 60);

fprintf('완료!\n');
