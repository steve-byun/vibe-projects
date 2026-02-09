%% s08_control_computed_torque.m
% Computed Torque 제어: PD+G의 업그레이드
%
% s07 복습: tau = Kp*e + Kd*ed + g(q)  ← 중력만 보상
% s08 핵심: tau = M*(원하는 가속도) + C*qd + g  ← 전부 보상!
%
% 핵심 질문: "PD+G로 충분하지 않나? 왜 더 복잡한 게 필요해?"
% → 답: 빠르게 움직이면 관성/코리올리 때문에 PD+G가 못 따라감!
%
% 배울 것:
%   1. PD+G의 한계 (빠른 궤적 추종)
%   2. Computed Torque 개념
%   3. 빠른 궤적에서 PD+G vs CT 비교
%   4. 모델 오차가 있으면?

clear; clc; close all;

%% 1. 로봇 정의 (s07과 동일)
L1 = 1.0;  m1 = 5.0;
L2 = 0.8;  m2 = 3.0;

link1 = Revolute('d', 0, 'a', L1, 'alpha', 0, ...
    'm', m1, 'r', [L1/2, 0, 0], 'I', [0, 0, m1*L1^2/12]);
link2 = Revolute('d', 0, 'a', L2, 'alpha', 0, ...
    'm', m2, 'r', [L2/2, 0, 0], 'I', [0, 0, m2*L2^2/12]);

robot = SerialLink([link1 link2], 'name', '2-Link');
robot.gravity = [0; -9.81; 0];

%% 2. 개념 설명
%
% PD+G:  tau = Kp*e + Kd*ed + g(q)
%   → 중력(g)만 보상, 관성(M)과 코리올리(C)는 무시!
%   → 느리면 OK, 빠르면 오차!
%
% Computed Torque (CT):
%   tau = M*(qdd_d + Kp*e + Kd*ed) + C*qd + g
%   → M, C, g 전부 보상 → 빠르든 느리든 정확!
%
% 왜 이게 되냐?
%   로봇: tau = M*qdd + C*qd + g
%   CT:   tau = M*(qdd_d + Kp*e + Kd*ed) + C*qd + g
%   대입하면 M, C, g 상쇄 → qdd = qdd_d + Kp*e + Kd*ed (선형!)
%
% 비유:
%   시속 30km: 네비만 봐도 됨 (PD+G)
%   시속 200km: 도로+차량+바람 다 고려 (CT)
%
% CT = Computed Torque = Inverse Dynamics Control
%   s06에서 배운 동역학(M,C,g)을 제어에 직접 쓰는 것!

disp('=== PD+G vs Computed Torque ===');
disp(' ');
disp('PD+G:  tau = Kp*e + Kd*ed + g(q)');
disp('  → 중력만 보상, 느리면 OK, 빠르면 오차!');
disp(' ');
disp('CT:    tau = M*(qdd_d + Kp*e + Kd*ed) + C*qd + g');
disp('  → 전부 보상, 빠르든 느리든 정확!');
disp(' ');

%% 3. 빠른 궤적 생성 (0.5초, ~90 deg/s)
%
% "궤적 추종" = 시간에 따라 변하는 목표를 따라가는 것
%   시간 0.0초: "지금 0도에 있어야 해"
%   시간 0.1초: "지금 5도에 있어야 해"
%   시간 0.2초: "지금 15도에 있어야 해"  ← 중간 과정도 중요!
%   ...
%   시간 0.5초: "지금 45도에 있어야 해"
%
% jtraj: 부드러운 궤적 (시작/끝에서 속도 0)

q_start = [0; 0];
q_goal  = [pi/4; -pi/3];    % 45deg, -60deg

dt = 0.001;
t_end = 0.5;              % 0.5초 = 빠른 궤적!
t = 0:dt:t_end;
N = length(t);

[q_des, qd_des, qdd_des] = jtraj(q_start', q_goal', N);

max_speed = max(abs(rad2deg(qd_des(:))));
disp('=== 빠른 궤적 ===');
disp(['0 -> 45deg, 0 -> -60deg 을 ' num2str(t_end) '초 만에!']);
disp(['최대 속도: ~' num2str(round(max_speed)) ' deg/s']);
disp(' ');

%% 4. 시뮬레이션: PD+G vs CT
Kp = 100 * eye(2);
Kd = 40 * eye(2);

% --- PD+G ---
q_pdg = zeros(2, N);  err_pdg = zeros(2, N);  tau_pdg = zeros(2, N);
q = q_start;  qd = [0; 0];

for i = 1:N
    q_d  = q_des(i,:)';
    qd_d = qd_des(i,:)';
    e = q_d - q;  ed = qd_d - qd;

    g_vec = robot.gravload(q')';
    tau_ctrl = Kp*e + Kd*ed + g_vec;

    M_mat = robot.inertia(q');
    C_mat = robot.coriolis(q', qd');
    qdd = M_mat \ (tau_ctrl - C_mat*qd - g_vec);

    qd = qd + qdd*dt;  q = q + qd*dt;
    q_pdg(:,i) = q;  err_pdg(:,i) = e;  tau_pdg(:,i) = tau_ctrl;
end

% --- CT ---
q_ct = zeros(2, N);  err_ct = zeros(2, N);  tau_ct = zeros(2, N);
q = q_start;  qd = [0; 0];

for i = 1:N
    q_d   = q_des(i,:)';
    qd_d  = qd_des(i,:)';
    qdd_d = qdd_des(i,:)';
    e = q_d - q;  ed = qd_d - qd;

    M_mat = robot.inertia(q');
    C_mat = robot.coriolis(q', qd');
    g_vec = robot.gravload(q')';

    % CT 핵심 한 줄!
    tau_ctrl = M_mat*(qdd_d + Kp*e + Kd*ed) + C_mat*qd + g_vec;

    qdd = M_mat \ (tau_ctrl - C_mat*qd - g_vec);

    qd = qd + qdd*dt;  q = q + qd*dt;
    q_ct(:,i) = q;  err_ct(:,i) = e;  tau_ct(:,i) = tau_ctrl;
end

disp('=== 최대 추종 오차 ===');
disp(['PD+G:            ' num2str(max(rad2deg(vecnorm(err_pdg))), '%.2f') ' deg']);
disp(['Computed Torque:  ' num2str(max(rad2deg(vecnorm(err_ct))), '%.2f') ' deg']);
disp(' ');

%% 5. 시각화: PD+G vs CT (빠른 궤적)
figure('Name', 'PD+G vs Computed Torque (빠른 궤적)', 'Position', [50 50 1400 700]);

% 5-1. 관절1 추종
subplot(2, 3, 1);
plot(t, rad2deg(q_des(:,1)), 'w--', 'LineWidth', 1.5); hold on;
plot(t, rad2deg(q_pdg(1,:)), 'r-', 'LineWidth', 1.5);
plot(t, rad2deg(q_ct(1,:)), 'g-', 'LineWidth', 1.5);
xlabel('시간 [s]'); ylabel('각도 [deg]');
title('관절1 (어깨, 무거움)', 'FontSize', 12);
legend('목표', 'PD+G', 'CT', 'Location', 'best');
grid on;

% 5-2. 관절2 추종
subplot(2, 3, 2);
plot(t, rad2deg(q_des(:,2)), 'w--', 'LineWidth', 1.5); hold on;
plot(t, rad2deg(q_pdg(2,:)), 'r-', 'LineWidth', 1.5);
plot(t, rad2deg(q_ct(2,:)), 'g-', 'LineWidth', 1.5);
xlabel('시간 [s]'); ylabel('각도 [deg]');
title('관절2 (팔꿈치, 가벼움)', 'FontSize', 12);
legend('목표', 'PD+G', 'CT', 'Location', 'best');
grid on;

% 5-3. 추종 오차 (핵심!)
subplot(2, 3, 3);
plot(t, rad2deg(vecnorm(err_pdg)), 'r-', 'LineWidth', 1.5); hold on;
plot(t, rad2deg(vecnorm(err_ct)), 'g-', 'LineWidth', 1.5);
xlabel('시간 [s]'); ylabel('오차 [deg]');
title('추종 오차 (이게 핵심!)', 'FontSize', 12);
legend('PD+G', 'CT', 'Location', 'best');
grid on;

% 5-4. 토크 비교 (관절1)
subplot(2, 3, 4);
plot(t, tau_pdg(1,:), 'r-', 'LineWidth', 1); hold on;
plot(t, tau_ct(1,:), 'g-', 'LineWidth', 1);
xlabel('시간 [s]'); ylabel('토크 [Nm]');
title('관절1 토크', 'FontSize', 12);
legend('PD+G', 'CT', 'Location', 'best');
grid on;

% 5-5. 끝점 궤적
subplot(2, 3, 5);
x_des = L1*cos(q_des(:,1)) + L2*cos(q_des(:,1)+q_des(:,2));
y_des = L1*sin(q_des(:,1)) + L2*sin(q_des(:,1)+q_des(:,2));
x_pdg = L1*cos(q_pdg(1,:)) + L2*cos(q_pdg(1,:)+q_pdg(2,:));
y_pdg = L1*sin(q_pdg(1,:)) + L2*sin(q_pdg(1,:)+q_pdg(2,:));
x_ct = L1*cos(q_ct(1,:)) + L2*cos(q_ct(1,:)+q_ct(2,:));
y_ct = L1*sin(q_ct(1,:)) + L2*sin(q_ct(1,:)+q_ct(2,:));

plot(x_des, y_des, 'w--', 'LineWidth', 2); hold on;
plot(x_pdg, y_pdg, 'r-', 'LineWidth', 1.5);
plot(x_ct, y_ct, 'g-', 'LineWidth', 1.5);
plot(x_des(1), y_des(1), 'wo', 'MarkerSize', 12, 'LineWidth', 2);
plot(x_des(end), y_des(end), 'w*', 'MarkerSize', 15, 'LineWidth', 2);
xlabel('X [m]'); ylabel('Y [m]');
title('끝점 경로', 'FontSize', 12);
legend('목표', 'PD+G', 'CT', '시작', '목표', 'Location', 'best');
axis equal; grid on;

% 5-6. 정리 텍스트
subplot(2, 3, 6);
axis off;
text(0.05, 0.95, ['빠른 궤적: ~' num2str(round(max_speed)) ' deg/s'], ...
    'FontSize', 14, 'FontWeight', 'bold', 'Color', [1 0.8 0], 'VerticalAlignment', 'top');

text(0.05, 0.78, 'PD+G:', 'FontSize', 11, 'FontWeight', 'bold', ...
    'Color', [1 0.4 0.4], 'VerticalAlignment', 'top');
text(0.05, 0.68, {'tau = Kp*e + Kd*ed + g', ...
    '  g만 보상, M/C 무시', ...
    ['  최대 오차: ' num2str(max(rad2deg(vecnorm(err_pdg))), '%.1f') ' deg']}, ...
    'FontSize', 10, 'Color', 'w', 'VerticalAlignment', 'top');

text(0.05, 0.42, 'Computed Torque:', 'FontSize', 11, 'FontWeight', 'bold', ...
    'Color', [0.4 1 0.4], 'VerticalAlignment', 'top');
text(0.05, 0.32, {'tau = M*(qdd_d+Kp*e+Kd*ed) + C*qd + g', ...
    '  M, C, g 전부 보상!', ...
    ['  최대 오차: ' num2str(max(rad2deg(vecnorm(err_ct))), '%.1f') ' deg']}, ...
    'FontSize', 10, 'Color', 'w', 'VerticalAlignment', 'top');

text(0.05, 0.08, '느리면 둘 다 비슷, 빠르면 CT 압승!', ...
    'FontSize', 10, 'FontWeight', 'bold', 'Color', [0.4 1 1], 'VerticalAlignment', 'top');

%% 6. 모델 오차 실험 (CT의 약점)
%
% CT는 M, C, g를 "정확히 안다"고 가정
% 현실: 질량을 정확히 모를 수 있음!

disp('=== 모델 오차 실험 ===');
disp('질량을 20% 잘못 알고 있다면?');

m1_wrong = m1 * 1.2;
m2_wrong = m2 * 1.2;

link1_wrong = Revolute('d', 0, 'a', L1, 'alpha', 0, ...
    'm', m1_wrong, 'r', [L1/2, 0, 0], 'I', [0, 0, m1_wrong*L1^2/12]);
link2_wrong = Revolute('d', 0, 'a', L2, 'alpha', 0, ...
    'm', m2_wrong, 'r', [L2/2, 0, 0], 'I', [0, 0, m2_wrong*L2^2/12]);

robot_wrong = SerialLink([link1_wrong link2_wrong], 'name', '2-Link (wrong)');
robot_wrong.gravity = [0; -9.81; 0];

q_wrong = zeros(2, N);  err_wrong = zeros(2, N);
q = q_start;  qd = [0; 0];

for i = 1:N
    q_d   = q_des(i,:)';
    qd_d  = qd_des(i,:)';
    qdd_d = qdd_des(i,:)';
    e = q_d - q;  ed = qd_d - qd;

    % 잘못된 모델로 CT 계산
    M_w = robot_wrong.inertia(q');
    C_w = robot_wrong.coriolis(q', qd');
    g_w = robot_wrong.gravload(q')';
    tau_ctrl = M_w*(qdd_d + Kp*e + Kd*ed) + C_w*qd + g_w;

    % 실제 로봇 (진짜 모델)
    M_r = robot.inertia(q');
    C_r = robot.coriolis(q', qd');
    g_r = robot.gravload(q')';
    qdd = M_r \ (tau_ctrl - C_r*qd - g_r);

    qd = qd + qdd*dt;  q = q + qd*dt;
    q_wrong(:,i) = q;  err_wrong(:,i) = e;
end

disp(['PD+G:            ' num2str(max(rad2deg(vecnorm(err_pdg))), '%.2f') ' deg']);
disp(['CT (정확 모델):   ' num2str(max(rad2deg(vecnorm(err_ct))), '%.2f') ' deg']);
disp(['CT (20% 오차):   ' num2str(max(rad2deg(vecnorm(err_wrong))), '%.2f') ' deg']);
disp(' ');

figure('Name', '모델 오차의 영향', 'Position', [100 100 900 400]);

subplot(1, 2, 1);
plot(t, rad2deg(q_des(:,1)), 'w--', 'LineWidth', 1.5); hold on;
plot(t, rad2deg(q_pdg(1,:)), 'r-', 'LineWidth', 1.5);
plot(t, rad2deg(q_ct(1,:)), 'g-', 'LineWidth', 1.5);
plot(t, rad2deg(q_wrong(1,:)), 'Color', [1 0.5 0], 'LineWidth', 1.5);
xlabel('시간 [s]'); ylabel('각도 [deg]');
title('관절1: 모델 오차 비교', 'FontSize', 12);
legend('목표', 'PD+G', 'CT (정확)', 'CT (20%오차)', 'Location', 'best');
grid on;

subplot(1, 2, 2);
plot(t, rad2deg(vecnorm(err_pdg)), 'r-', 'LineWidth', 1.5); hold on;
plot(t, rad2deg(vecnorm(err_ct)), 'g-', 'LineWidth', 1.5);
plot(t, rad2deg(vecnorm(err_wrong)), 'Color', [1 0.5 0], 'LineWidth', 1.5);
xlabel('시간 [s]'); ylabel('오차 [deg]');
title('추종 오차 비교', 'FontSize', 12);
legend('PD+G', 'CT (정확)', 'CT (20%오차)', 'Location', 'best');
grid on;

%% 7. 핵심 정리
disp('========================================');
disp('      Computed Torque 핵심 정리');
disp('========================================');
disp(' ');
disp('1. CT = Computed Torque = Inverse Dynamics Control');
disp('   s06 동역학(M,C,g)을 제어에 직접 쓰는 것');
disp(' ');
disp('2. 공식:');
disp('   PD+G: tau = Kp*e + Kd*ed + g         (g만 보상)');
disp('   CT:   tau = M*(qdd_d+Kp*e+Kd*ed) + C*qd + g  (전부 보상)');
disp(' ');
disp('3. 차이:');
disp('   느리면 -> 둘 다 비슷 (PD+G로 충분)');
disp('   빠르면 -> CT 압승 (M,C 효과 커지니까)');
disp(' ');
disp('4. 약점:');
disp('   모델이 틀리면 성능 떨어짐');
disp('   -> 보완: Robust Control, Adaptive Control');
disp(' ');
disp('5. 흐름:');
disp('   s07: PD, PD+G          (기초 제어)');
disp('   s08: Computed Torque    (고급 제어) <- 여기!');
disp('   다음: 임피던스/힘 제어  (힘 + 위치 동시 제어)');
disp('========================================');
