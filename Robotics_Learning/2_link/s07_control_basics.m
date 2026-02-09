%% s07_control_basics.m
% 제어 기초: PD 제어 + 중력보상
%
% 핵심 질문: "원하는 위치로 정확하게 가려면 토크를 어떻게 줘야 하지?"
%
% s06 복습: tau = M*qdd + C*qd + g  (이렇게 움직이려면 이만큼 힘 필요)
% s07 핵심: 근데 현실에서는 완벽한 계산이 불가능 → "피드백"으로 보정!
%
% 배울 것:
%   1. 왜 제어가 필요한가?
%   2. PD 제어 (가장 기본)
%   3. 중력보상 + PD (실무에서 많이 씀)
%   4. 시뮬레이션으로 비교

clear; clc; close all;

%% 1. 로봇 정의 (s06과 동일)
L1 = 1.0;  m1 = 5.0;
L2 = 0.8;  m2 = 3.0;

link1 = Revolute('d', 0, 'a', L1, 'alpha', 0, ...
    'm', m1, 'r', [L1/2, 0, 0], 'I', [0, 0, m1*L1^2/12]);
link2 = Revolute('d', 0, 'a', L2, 'alpha', 0, ...
    'm', m2, 'r', [L2/2, 0, 0], 'I', [0, 0, m2*L2^2/12]);

robot = SerialLink([link1 link2], 'name', '2-Link');
robot.gravity = [0; -9.81; 0];

%% 2. 왜 제어가 필요한가?
%
% s06에서 배운 것: "이 자세로 가려면 토크가 이만큼 필요해"
% 근데 현실 문제:
%   - 로봇 무게를 정확히 모를 수 있음 (모델 오차)
%   - 외부에서 뭔가 밀 수 있음 (외란)
%   - 마찰 같은 거 무시했음
%
% → 그래서 "지금 어디 있는지 확인하고 보정하는" 피드백 제어가 필요!
%
% 비유: 목적지까지 눈 감고 걸어가기(오픈루프) vs 눈 뜨고 걸어가기(피드백)

disp('=== 제어가 필요한 이유 ===');
disp('토크 계산만으로는 부족한 이유:');
disp('  1. 모델 오차: 실제 무게 ≠ 계산에 쓴 무게');
disp('  2. 외란: 누가 밀거나, 바람이 불거나');
disp('  3. 마찰: 계산에 안 넣었지만 실제로는 있음');
disp('→ 피드백 제어 = "지금 위치 확인하고 보정하기"');
disp(' ');

%% 3. PD 제어란?
%
% 제어 토크: tau = Kp * (q_desired - q) + Kd * (qd_desired - qd)
%                  ~~~~~~~~~~~~~~~~~~     ~~~~~~~~~~~~~~~~~~~~~~
%                   위치 오차 × 스프링     속도 오차 × 댐퍼
%
% Kp (비례 게인): 목표와 멀면 힘을 세게 → 스프링처럼
% Kd (미분 게인): 빨리 움직이면 브레이크  → 댐퍼(충격흡수기)처럼
%
% Kp만 있으면? → 목표점 주위로 진동 (스프링처럼 왔다갔다)
% Kd도 있으면? → 진동 없이 부드럽게 멈춤

disp('=== PD 제어 공식 ===');
disp('tau = Kp * e + Kd * ed');
disp('  e  = q_desired - q      (위치 오차)');
disp('  ed = qd_desired - qd    (속도 오차)');
disp('  Kp = 비례 게인 (스프링)  → 크면 빨리 감, 너무 크면 진동');
disp('  Kd = 미분 게인 (댐퍼)   → 크면 부드럽게 멈춤');
disp(' ');

%% 4. 시뮬레이션 설정
% 목표: q_start에서 q_goal로 이동

q_start = [0; 0];           % 시작: 수평으로 뻗은 자세
q_goal  = [pi/4; -pi/3];    % 목표: 45°, -60°

% 시뮬레이션 시간
t_span = [0, 5];   % 5초
dt = 0.01;         % 시간 간격
t = t_span(1):dt:t_span(2);
N = length(t);

disp('=== 시뮬레이션 설정 ===');
disp(['시작 자세: [' num2str(rad2deg(q_start')) '°]']);
disp(['목표 자세: [' num2str(rad2deg(q_goal')) '°]']);
disp(['시간: ' num2str(t_span(2)) '초']);
disp(' ');

%% 5. 시뮬레이션 1: PD 제어만 (중력보상 없음)
disp('=== 시뮬레이션 1: PD 제어만 ===');

Kp = 50 * eye(2);   % 비례 게인 (2x2 대각 행렬)
Kd = 20 * eye(2);   % 미분 게인

% 결과 저장
q_hist1 = zeros(2, N);
tau_hist1 = zeros(2, N);

% 초기 상태
q = q_start;
qd = [0; 0];

for i = 1:N
    % 위치/속도 오차
    e  = q_goal - q;
    ed = [0; 0] - qd;   % 목표 속도 = 0 (멈추고 싶으니까)

    % PD 제어 토크
    tau_ctrl = Kp * e + Kd * ed;

    % 실제 로봇에 가해지는 가속도 (순동역학)
    % tau = M*qdd + C*qd + g  →  qdd = M\(tau - C*qd - g)
    M = robot.inertia(q');
    C = robot.coriolis(q', qd');
    g = robot.gravload(q');

    qdd = M \ (tau_ctrl - C*qd - g');

    % 적분 (오일러 방법)
    qd = qd + qdd * dt;
    q  = q + qd * dt;

    % 저장
    q_hist1(:, i) = q;
    tau_hist1(:, i) = tau_ctrl;
end

disp(['최종 위치: [' num2str(rad2deg(q_hist1(:, end)')) '°]']);
disp(['목표 위치: [' num2str(rad2deg(q_goal')) '°]']);
disp(['오차: [' num2str(rad2deg(q_goal' - q_hist1(:, end)')) '°]']);
disp('→ 중력 때문에 목표에 정확히 못 감! (정상상태 오차 발생)');
disp(' ');

%% 6. 시뮬레이션 2: PD + 중력보상
disp('=== 시뮬레이션 2: PD + 중력보상 ===');

% 결과 저장
q_hist2 = zeros(2, N);
tau_hist2 = zeros(2, N);

% 초기 상태 리셋
q = q_start;
qd = [0; 0];

for i = 1:N
    % 위치/속도 오차
    e  = q_goal - q;
    ed = [0; 0] - qd;

    % PD + 중력보상 토크
    g = robot.gravload(q');
    tau_ctrl = Kp * e + Kd * ed + g';   % ← g 더해줌!

    % 순동역학
    M = robot.inertia(q');
    C = robot.coriolis(q', qd');

    qdd = M \ (tau_ctrl - C*qd - g');

    % 적분
    qd = qd + qdd * dt;
    q  = q + qd * dt;

    % 저장
    q_hist2(:, i) = q;
    tau_hist2(:, i) = tau_ctrl;
end

disp(['최종 위치: [' num2str(rad2deg(q_hist2(:, end)')) '°]']);
disp(['목표 위치: [' num2str(rad2deg(q_goal')) '°]']);
disp(['오차: [' num2str(rad2deg(q_goal' - q_hist2(:, end)')) '°]']);
disp('→ 중력보상 하면 목표에 정확히 도달!');
disp(' ');

%% 7. 시각화: 비교
figure('Name', '제어 비교: PD vs PD+중력보상', 'Position', [50 50 1400 700]);

% 7-1. 관절1 각도 비교
subplot(2, 3, 1);
plot(t, rad2deg(q_hist1(1,:)), 'r-', 'LineWidth', 1.5); hold on;
plot(t, rad2deg(q_hist2(1,:)), 'g-', 'LineWidth', 1.5);
yline(rad2deg(q_goal(1)), 'w--', 'LineWidth', 1);
xlabel('시간 [s]'); ylabel('각도 [°]');
title('관절1 (q1)', 'FontSize', 12);
legend('PD only', 'PD+중력보상', '목표', 'Location', 'best');
grid on;

% 7-2. 관절2 각도 비교
subplot(2, 3, 2);
plot(t, rad2deg(q_hist1(2,:)), 'r-', 'LineWidth', 1.5); hold on;
plot(t, rad2deg(q_hist2(2,:)), 'g-', 'LineWidth', 1.5);
yline(rad2deg(q_goal(2)), 'w--', 'LineWidth', 1);
xlabel('시간 [s]'); ylabel('각도 [°]');
title('관절2 (q2)', 'FontSize', 12);
legend('PD only', 'PD+중력보상', '목표', 'Location', 'best');
grid on;

% 7-3. 위치 오차
subplot(2, 3, 3);
err1 = rad2deg(q_goal - q_hist1);
err2 = rad2deg(q_goal - q_hist2);
plot(t, vecnorm(err1), 'r-', 'LineWidth', 1.5); hold on;
plot(t, vecnorm(err2), 'g-', 'LineWidth', 1.5);
xlabel('시간 [s]'); ylabel('오차 크기 [°]');
title('위치 오차 (줄어드는 속도 비교)', 'FontSize', 12);
legend('PD only', 'PD+중력보상', 'Location', 'best');
grid on;

% 7-4. 토크 비교 (관절1)
subplot(2, 3, 4);
plot(t, tau_hist1(1,:), 'r-', 'LineWidth', 1.5); hold on;
plot(t, tau_hist2(1,:), 'g-', 'LineWidth', 1.5);
xlabel('시간 [s]'); ylabel('토크 [Nm]');
title('관절1 토크', 'FontSize', 12);
legend('PD only', 'PD+중력보상', 'Location', 'best');
grid on;

% 7-5. 끝점 궤적
subplot(2, 3, 5);
% PD only 궤적
x1_pd = L1*cos(q_hist1(1,:)) + L2*cos(q_hist1(1,:)+q_hist1(2,:));
y1_pd = L1*sin(q_hist1(1,:)) + L2*sin(q_hist1(1,:)+q_hist1(2,:));
% PD+중력보상 궤적
x1_gc = L1*cos(q_hist2(1,:)) + L2*cos(q_hist2(1,:)+q_hist2(2,:));
y1_gc = L1*sin(q_hist2(1,:)) + L2*sin(q_hist2(1,:)+q_hist2(2,:));
% 시작점, 목표점
x_start = L1*cos(q_start(1)) + L2*cos(q_start(1)+q_start(2));
y_start = L1*sin(q_start(1)) + L2*sin(q_start(1)+q_start(2));
x_goal = L1*cos(q_goal(1)) + L2*cos(q_goal(1)+q_goal(2));
y_goal = L1*sin(q_goal(1)) + L2*sin(q_goal(1)+q_goal(2));

plot(x1_pd, y1_pd, 'r-', 'LineWidth', 1.5); hold on;
plot(x1_gc, y1_gc, 'g-', 'LineWidth', 1.5);
plot(x_start, y_start, 'wo', 'MarkerSize', 12, 'LineWidth', 2);
plot(x_goal, y_goal, 'w*', 'MarkerSize', 15, 'LineWidth', 2);
xlabel('X [m]'); ylabel('Y [m]');
title('끝점 궤적', 'FontSize', 12);
legend('PD only', 'PD+중력보상', '시작', '목표', 'Location', 'best');
axis equal; grid on;

% 7-6. 핵심 정리 텍스트
subplot(2, 3, 6);
axis off;
text(0.05, 0.95, '제어 핵심 정리', 'FontSize', 14, 'FontWeight', 'bold', ...
    'Color', [1 0.8 0], 'VerticalAlignment', 'top');
text(0.05, 0.80, 'PD 제어:', 'FontSize', 11, 'FontWeight', 'bold', ...
    'Color', [1 0.4 0.4], 'VerticalAlignment', 'top');
text(0.05, 0.70, {'  \tau = Kp \cdot e + Kd \cdot \dot{e}', ...
    '  스프링 + 댐퍼', ...
    '  중력 무시 → 정상상태 오차!'}, ...
    'FontSize', 10, 'Color', 'w', 'VerticalAlignment', 'top');
text(0.05, 0.42, 'PD + 중력보상:', 'FontSize', 11, 'FontWeight', 'bold', ...
    'Color', [0.4 1 0.4], 'VerticalAlignment', 'top');
text(0.05, 0.32, {'  \tau = Kp \cdot e + Kd \cdot \dot{e} + g(q)', ...
    '  중력 미리 상쇄 → 오차 0!', ...
    '  실무에서 가장 많이 쓰는 방식'}, ...
    'FontSize', 10, 'Color', 'w', 'VerticalAlignment', 'top');

%% 8. Kp, Kd 효과 실험
% Kp 크면? → 빨리 가지만 진동 (오버슈트)
% Kd 크면? → 부드럽지만 느림

figure('Name', 'Kp/Kd 효과 비교', 'Position', [100 100 1200 500]);

gains = {
    50, 20, 'Kp=50, Kd=20 (기본)';
    200, 20, 'Kp=200, Kd=20 (Kp 높음→빠르지만 진동)';
    50, 5,  'Kp=50, Kd=5 (Kd 낮음→진동)';
    50, 80, 'Kp=50, Kd=80 (Kd 높음→느리지만 안정)';
};
colors_gain = {'g', [1 0.5 0], 'r', [0.4 0.8 1]};

subplot(1, 2, 1); hold on; grid on;
title('관절1 응답 (Kp/Kd 비교)', 'FontSize', 12);
xlabel('시간 [s]'); ylabel('각도 [°]');
yline(rad2deg(q_goal(1)), 'w--', 'LineWidth', 1);

subplot(1, 2, 2); hold on; grid on;
title('관절2 응답 (Kp/Kd 비교)', 'FontSize', 12);
xlabel('시간 [s]'); ylabel('각도 [°]');
yline(rad2deg(q_goal(2)), 'w--', 'LineWidth', 1);

for k = 1:size(gains, 1)
    Kp_test = gains{k, 1} * eye(2);
    Kd_test = gains{k, 2} * eye(2);

    q = q_start; qd = [0; 0];
    q_hist_test = zeros(2, N);

    for i = 1:N
        e  = q_goal - q;
        ed = [0; 0] - qd;
        g = robot.gravload(q');
        tau_ctrl = Kp_test * e + Kd_test * ed + g';

        M = robot.inertia(q');
        C = robot.coriolis(q', qd');
        qdd = M \ (tau_ctrl - C*qd - g');

        qd = qd + qdd * dt;
        q  = q + qd * dt;
        q_hist_test(:, i) = q;
    end

    subplot(1, 2, 1);
    plot(t, rad2deg(q_hist_test(1,:)), 'Color', colors_gain{k}, 'LineWidth', 1.5);
    subplot(1, 2, 2);
    plot(t, rad2deg(q_hist_test(2,:)), 'Color', colors_gain{k}, 'LineWidth', 1.5);
end

subplot(1, 2, 1);
legend([gains(:,3); {'목표'}], 'Location', 'best');
subplot(1, 2, 2);
legend([gains(:,3); {'목표'}], 'Location', 'best');

%% 9. 핵심 정리
disp('========================================');
disp('         제어 기초 핵심 정리');
disp('========================================');
disp(' ');
disp('1. 왜 제어? → 모델 오차, 외란, 마찰 때문에 피드백 필요');
disp(' ');
disp('2. PD 제어:');
disp('   tau = Kp*(q_goal-q) + Kd*(0-qd)');
disp('   → 스프링(Kp) + 댐퍼(Kd)');
disp('   → 중력 안 잡으면 목표 못 맞춤!');
disp(' ');
disp('3. PD + 중력보상:');
disp('   tau = Kp*e + Kd*ed + g(q)');
disp('   → 중력 미리 상쇄해서 오차 0');
disp('   → 회사에서 말하는 "중력보상" 이 바로 이것!');
disp(' ');
disp('4. 게인 튜닝:');
disp('   Kp ↑ → 빠르게 도달, 너무 크면 진동');
disp('   Kd ↑ → 진동 줄임, 너무 크면 느림');
disp('   → 트레이드오프! 적절한 균형 찾기');
disp(' ');
disp('5. 흐름:');
disp('   FK → IK → Jacobian → Dynamics → Control ← 여기!');
disp('   "어디?" → "어떻게?" → "얼마나 빨리?" → "얼마의 힘?" → "어떻게 제어?"');
disp('========================================');
