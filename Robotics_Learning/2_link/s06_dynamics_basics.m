%% s06_dynamics_basics.m
% 동역학 기초: 토크 계산
%
% 핵심 질문: "이렇게 움직이려면 모터가 얼마의 힘을 내야 하지?"
%
% 핵심 공식: tau = M*qdd + C*qd + g
%   - tau: 토크 (모터가 내야 할 힘)
%   - M: 질량 행렬 (무거우면 힘 더 필요)
%   - C: 코리올리 (회전하면서 생기는 힘)
%   - g: 중력 (중력 이기는 힘)

clear; clc; close all;

%% 1. 로봇 정의 (질량 포함!)
% Kinematics에서는 질량 없었음 -> Dynamics에서는 질량 필수!

L1 = 1.0;  % 링크1 길이 [m]
L2 = 0.8;  % 링크2 길이 [m]
m1 = 5.0;  % 링크1 질량 [kg]  <-- 새로 추가!
m2 = 3.0;  % 링크2 질량 [kg]  <-- 새로 추가!

% RVCTools로 로봇 생성 (질량, 무게중심, 관성 포함)
%   'm': 질량
%   'r': 무게중심 위치 (링크 중앙)
%   'I': 관성 모멘트 (막대 공식: 1/12 * m * L^2)

link1 = Revolute('d', 0, 'a', L1, 'alpha', 0, ...
    'm', m1, 'r', [L1/2, 0, 0], 'I', [0, 0, m1*L1^2/12]);

link2 = Revolute('d', 0, 'a', L2, 'alpha', 0, ...
    'm', m2, 'r', [L2/2, 0, 0], 'I', [0, 0, m2*L2^2/12]);

robot = SerialLink([link1 link2], 'name', '2-Link (with mass)');
robot.gravity = [0; -9.81; 0];  % 중력 방향 (아래쪽)

disp('=== 로봇 파라미터 ===');
disp(['링크1: 길이=' num2str(L1) 'm, 질량=' num2str(m1) 'kg']);
disp(['링크2: 길이=' num2str(L2) 'm, 질량=' num2str(m2) 'kg']);
disp(' ');

%% 2. M, C, g 직접 보기!
% rne()는 내부에서 M, C, g를 계산 → 우리가 직접 뽑아볼 수 있음

disp('=== M, C, g 분해해서 보기 ===');

q = [0, 0];      % 수평으로 뻗은 자세
qd = [1, 1];     % 속도 있음 (코리올리 보려면 속도 필요)
qdd = [1, 0];    % 가속도 있음

% 각 항 개별 계산
M = robot.inertia(q);       % 질량 행렬 (2x2)
C = robot.coriolis(q, qd);  % 코리올리 행렬 (2x2)
g = robot.gravload(q);      % 중력 벡터 (1x2)

disp('M (질량 행렬):');
disp(M);
disp('C (코리올리 행렬):');
disp(C);
disp('g (중력 벡터):');
disp(g);

% 공식대로 직접 계산
tau_manual = M * qdd' + C * qd' + g';
disp('tau = M*qdd + C*qd + g (직접 계산):');
disp(tau_manual');

% rne로 한방에 계산
tau_rne = robot.rne(q, qd, qdd);
disp('tau = robot.rne() (한방 계산):');
disp(tau_rne);

disp('→ 둘이 같음! rne()가 내부에서 M, C, g 다 계산해주는 것');
disp(' ');

%% 3. 토크 계산 예제: 정지 상태 (중력만)
% 팔을 수평으로 뻗고 가만히 있으려면?

disp('=== 예제 1: 정지 상태 (중력만 버티기) ===');

q = [0, 0];      % 수평으로 뻗은 자세 (둘 다 0도)
qd = [0, 0];     % 속도 = 0 (정지)
qdd = [0, 0];    % 가속도 = 0 (정지)

tau = robot.rne(q, qd, qdd);  % 토크 계산!

disp(['자세: q1=' num2str(rad2deg(q(1))) '°, q2=' num2str(rad2deg(q(2))) '°']);
disp(['토크: τ1=' num2str(tau(1), '%.2f') ' Nm, τ2=' num2str(tau(2), '%.2f') ' Nm']);
disp('→ 가만히 있어도 중력 때문에 토크 필요!');
disp(' ');

%% 4. 자세에 따른 토크 변화
% 팔을 들어올리면? 내리면?

disp('=== 예제 2: 자세별 토크 비교 ===');

poses = [
    0, 0;           % 수평
    pi/2, 0;        % 위로 90도
    -pi/2, 0;       % 아래로 90도
    0, pi/2;        % 팔꿈치만 90도
];
pose_names = {'수평 (0°, 0°)', '위로 (90°, 0°)', '아래로 (-90°, 0°)', '팔꿈치 굽힘 (0°, 90°)'};

for i = 1:size(poses, 1)
    q = poses(i, :);
    tau = robot.rne(q, [0,0], [0,0]);
    fprintf('%s → τ1=%.2f, τ2=%.2f Nm\n', pose_names{i}, tau(1), tau(2));
end
disp('→ 자세에 따라 필요한 토크가 다름!');
disp(' ');

%% 5. 가속도가 있을 때
% 빨리 움직이려면 힘이 더 필요!

disp('=== 예제 3: 가속도에 따른 토크 ===');

q = [0, 0];       % 수평 자세
qd = [0, 0];      % 속도 0

accels = [0, 1, 5, 10];  % 가속도 [rad/s^2]
for acc = accels
    qdd = [acc, 0];  % 관절1만 가속
    tau = robot.rne(q, qd, qdd);
    fprintf('가속도 %2d rad/s² → τ1=%.2f, τ2=%.2f Nm\n', acc, tau(1), tau(2));
end
disp('→ 빨리 가속할수록 토크 많이 필요!');
disp(' ');

%% 6. 시각화: 자세별 토크 비교
figure('Name', '동역학: 자세별 토크', 'Position', [100 100 1200 500]);

% 5-1. 로봇 자세들
subplot(1, 2, 1);
hold on; grid on; axis equal;
title('다양한 자세', 'FontSize', 14);
xlabel('X [m]'); ylabel('Y [m]');

colors = {'r', 'g', 'b', 'm'};
for i = 1:size(poses, 1)
    q = poses(i, :);

    % 끝점 계산
    x1 = L1*cos(q(1));
    y1 = L1*sin(q(1));
    x2 = x1 + L2*cos(q(1)+q(2));
    y2 = y1 + L2*sin(q(1)+q(2));

    % 로봇 그리기
    plot([0, x1, x2], [0, y1, y2], [colors{i} '-o'], 'LineWidth', 2, 'MarkerSize', 8);
end
legend(pose_names, 'Location', 'best');
xlim([-2 2]); ylim([-2 2]);

% 5-2. 토크 막대 그래프
subplot(1, 2, 2);
tau_all = zeros(size(poses, 1), 2);
for i = 1:size(poses, 1)
    tau_all(i, :) = robot.rne(poses(i,:), [0,0], [0,0]);
end

bar(tau_all);
set(gca, 'XTickLabel', {'수평', '위로', '아래로', '팔꿈치'});
xlabel('자세'); ylabel('토크 [Nm]');
title('자세별 필요 토크 (정지 상태)', 'FontSize', 14);
legend({'τ1 (어깨)', 'τ2 (팔꿈치)'}, 'Location', 'best');
grid on;

%% 7. 핵심 정리
disp('========================================');
disp('         동역학 핵심 정리');
disp('========================================');
disp(' ');
disp('1. 동역학 = "얼마의 힘으로?" (토크 계산)');
disp(' ');
disp('2. 토크에 영향 주는 것:');
disp('   - 자세 (q): 팔 뻗으면 토크 ↑');
disp('   - 속도 (qd): 빠르면 코리올리 힘 발생');
disp('   - 가속도 (qdd): 급가속하면 토크 ↑');
disp('   - 중력: 항상 존재, 자세에 따라 다름');
disp(' ');
disp('3. 실제 코드:');
disp('   tau = robot.rne(q, qd, qdd);');
disp('   → 궤적(q, qd, qdd) 주면 토크(tau) 나옴');
disp('========================================');
