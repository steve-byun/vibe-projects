%% s09_control_impedance.m
% 임피던스 제어: 위치만이 아니라 "힘"도 제어!
%
% 지금까지 배운 것: PD, PD+G, CT = 전부 "위치 제어"
%   → "여기로 가!" 만 신경 씀
%   → 뭔가 부딪히면? 무한정 밀어버림! 위험!
%
% 임피던스 제어: "여기로 가되, 뭔가 닿으면 부드럽게!"
%   → 위치와 힘의 관계를 제어
%
% 핵심: 로봇의 "강성(stiffness)"을 내가 정하는 것!
%   강성 높으면 → 딱딱 (계란 깨짐, 사람 다침)
%   강성 낮으면 → 말랑 (계란 안 깨짐, 사람 안전)
%
% 배울 것:
%   1. 위치 제어의 문제 (벽에 부딪힐 때)
%   2. 임피던스 제어 개념
%   3. 강성(K)에 따른 힘 변화
%   4. 실무 적용

clear; clc; close all;

%% 1. 로봇 정의
L1 = 1.0;  m1 = 5.0;
L2 = 0.8;  m2 = 3.0;

link1 = Revolute('d', 0, 'a', L1, 'alpha', 0, ...
    'm', m1, 'r', [L1/2, 0, 0], 'I', [0, 0, m1*L1^2/12]);
link2 = Revolute('d', 0, 'a', L2, 'alpha', 0, ...
    'm', m2, 'r', [L2/2, 0, 0], 'I', [0, 0, m2*L2^2/12]);

robot = SerialLink([link1 link2], 'name', '2-Link');
robot.gravity = [0; -9.81; 0];

%% 2. 위치 제어의 문제
%
% 시나리오: 로봇 끝점이 벽 뒤에 있는 목표로 이동
%   → 벽에 부딪힘!
%   → 위치 제어: "아직 목표 안 갔으니 더 밀어!" → 힘 폭발!
%   → 임피던스 제어: "뭔가 막고 있으니 살살!" → 힘 조절
%
% 비유:
%   위치 제어 = 눈 감고 밀기 (벽이든 사람이든 밀어버림)
%   임피던스 제어 = 눈 뜨고 밀기 (저항 느끼면 힘 조절)

disp('=== 위치 제어의 문제 ===');
disp('목표가 벽 뒤에 있으면?');
disp('  위치 제어: "아직 안 갔으니 더 밀어!" -> 힘 폭발!');
disp('  임피던스:  "저항 느껴지니 살살!" -> 힘 조절');
disp(' ');

%% 3. 시나리오 설정
%
% 로봇 끝점이 오른쪽으로 이동 → 벽에 부딪힘
%
%   시작(1.3m) ----→ 벽(1.4m) ----→ 목표(1.6m)
%                     |||
%                   여기서 멈춰야!

q_start = [pi/3; -pi/3];   % 끝점 시작: (~1.3, 0.87)
x_target = [1.6; 0.5];     % 목표: 벽 뒤! (도달 불가)
x_wall = 1.4;              % 수직 벽 위치

% FK 함수 (s02 복습)
fk = @(q) [L1*cos(q(1)) + L2*cos(q(1)+q(2));
           L1*sin(q(1)) + L2*sin(q(1)+q(2))];

% 자코비안 (s05 복습): 끝점 속도 = J * 관절 속도
jac = @(q) [-L1*sin(q(1))-L2*sin(q(1)+q(2)), -L2*sin(q(1)+q(2));
             L1*cos(q(1))+L2*cos(q(1)+q(2)),  L2*cos(q(1)+q(2))];

x_start = fk(q_start);
disp('=== 시나리오 ===');
disp(['끝점 시작: (' num2str(x_start(1),'%.2f') ', ' num2str(x_start(2),'%.2f') ')']);
disp(['벽 위치: x = ' num2str(x_wall)]);
disp(['목표: (' num2str(x_target(1),'%.2f') ', ' num2str(x_target(2),'%.2f') ') <- 벽 뒤!']);
disp(' ');

%% 4. 벽 모델
% 벽에 닿으면 스프링처럼 밀어냄
% F_wall = -K_wall * 침투량 (x방향)
K_wall = 10000;   % 단단한 벽 (N/m)
B_wall = 100;     % 벽 감쇠 (진동 방지)

%% 5. 임피던스 제어 공식
%
% tau = g(q) + J' * F_cmd
%
% F_cmd = K * (x_target - x_ee) + B * (0 - xd_ee)
%         ~~~~~~~~~~~~~~~~~~~~~~   ~~~~~~~~~~~~~~~~~
%         "목표로 끌어당기는 스프링"  "속도 줄이는 댐퍼"
%
% K가 핵심!
%   K 크면 → 세게 당김 → 벽을 세게 밀음 (위치 제어처럼)
%   K 작으면 → 약하게 당김 → 벽을 살살 밀음 (힘 조절)
%
% J' (자코비안 전치): 끝점의 힘 → 관절 토크로 변환
%   s05에서 배운 자코비안을 여기서 쓴다!

disp('=== 임피던스 제어 공식 ===');
disp('tau = g(q) + J'' * F_cmd');
disp('F_cmd = K*(x_target - x_ee) + B*(0 - xd_ee)');
disp('  K 크면 -> 딱딱 (위치 우선)');
disp('  K 작으면 -> 말랑 (힘 조절)');
disp(' ');

%% 6. 시뮬레이션
dt = 0.001;
t_end = 2;
t = 0:dt:t_end;
N = length(t);

% 두 가지 컨트롤러
% 1. 강성 높음 (위치 제어처럼): K=5000
% 2. 강성 낮음 (임피던스 제어): K=300
configs = struct('K', {5000, 300}, 'B', {200, 50}, ...
    'name', {'딱딱 (K=5000)', '말랑 (K=300)'}, ...
    'color', {'r', 'g'});

results = struct();

for c = 1:2
    K_ctrl = configs(c).K * eye(2);
    B_ctrl = configs(c).B * eye(2);

    x_hist = zeros(2, N);
    xd_hist = zeros(2, N);
    f_wall_hist = zeros(1, N);
    f_ctrl_hist = zeros(2, N);

    q = q_start;  qd = [0; 0];

    for i = 1:N
        % 끝점 위치/속도
        x_ee = fk(q);
        J = jac(q);
        xd_ee = J * qd;

        % 벽 반력 (끝점이 벽을 지나면 밀어냄)
        pen = max(0, x_ee(1) - x_wall);
        F_wall = [-K_wall * pen - B_wall * xd_ee(1) * (pen > 0); 0];
        tau_wall = J' * F_wall;

        % 임피던스 제어
        F_ctrl = K_ctrl * (x_target - x_ee) + B_ctrl * (0 - xd_ee);
        g_vec = robot.gravload(q')';
        tau_ctrl = g_vec + J' * F_ctrl;

        % 동역학
        M_mat = robot.inertia(q');
        C_mat = robot.coriolis(q', qd');
        qdd = M_mat \ (tau_ctrl + tau_wall - C_mat*qd - g_vec);

        qd = qd + qdd * dt;
        q  = q + qd * dt;

        % 저장
        x_hist(:, i) = x_ee;
        xd_hist(:, i) = xd_ee;
        f_wall_hist(i) = K_wall * pen;  % 벽에 가하는 힘 크기
        f_ctrl_hist(:, i) = F_ctrl;
    end

    results(c).x = x_hist;
    results(c).xd = xd_hist;
    results(c).f_wall = f_wall_hist;
    results(c).f_ctrl = f_ctrl_hist;
end

% 결과 출력
disp('=== 결과 비교 ===');
for c = 1:2
    disp([configs(c).name ':']);
    disp(['  최종 끝점 X: ' num2str(results(c).x(1,end), '%.3f') 'm']);
    disp(['  최대 벽 힘: ' num2str(max(results(c).f_wall), '%.0f') 'N']);
    disp(['  정상상태 벽 힘: ' num2str(results(c).f_wall(end), '%.0f') 'N']);
end
disp(' ');

%% 7. 시각화
figure('Name', '딱딱 vs 말랑: 벽과의 접촉', 'Position', [50 50 1400 700]);

% 7-1. 끝점 X 위치
subplot(2, 3, 1);
for c = 1:2
    plot(t, results(c).x(1,:), configs(c).color, 'LineWidth', 1.5); hold on;
end
yline(x_wall, 'w--', 'LineWidth', 1.5);
yline(x_target(1), 'Color', [0.5 0.5 0.5], 'LineStyle', ':', 'LineWidth', 1);
xlabel('시간 [s]'); ylabel('X 위치 [m]');
title('끝점 X 위치', 'FontSize', 12);
legend(configs(1).name, configs(2).name, '벽', '목표', 'Location', 'best');
grid on;

% 7-2. 벽에 가하는 힘 (핵심!)
subplot(2, 3, 2);
for c = 1:2
    plot(t, results(c).f_wall, configs(c).color, 'LineWidth', 1.5); hold on;
end
xlabel('시간 [s]'); ylabel('힘 [N]');
title('벽에 가하는 힘 (이게 핵심!)', 'FontSize', 12);
legend(configs(1).name, configs(2).name, 'Location', 'best');
grid on;

% 7-3. 끝점 궤적 (X-Y)
subplot(2, 3, 3);
% 벽 그리기
plot([x_wall x_wall], [-0.5 1.5], 'w-', 'LineWidth', 3); hold on;
for c = 1:2
    plot(results(c).x(1,:), results(c).x(2,:), configs(c).color, 'LineWidth', 1.5);
end
plot(x_start(1), x_start(2), 'wo', 'MarkerSize', 12, 'LineWidth', 2);
plot(x_target(1), x_target(2), 'w*', 'MarkerSize', 15, 'LineWidth', 2);
xlabel('X [m]'); ylabel('Y [m]');
title('끝점 경로 + 벽', 'FontSize', 12);
legend('벽', configs(1).name, configs(2).name, '시작', '목표', 'Location', 'best');
axis equal; grid on;

% 7-4. 끝점 Y 위치
subplot(2, 3, 4);
for c = 1:2
    plot(t, results(c).x(2,:), configs(c).color, 'LineWidth', 1.5); hold on;
end
yline(x_target(2), 'Color', [0.5 0.5 0.5], 'LineStyle', ':', 'LineWidth', 1);
xlabel('시간 [s]'); ylabel('Y 위치 [m]');
title('끝점 Y 위치 (벽 없는 방향)', 'FontSize', 12);
legend(configs(1).name, configs(2).name, '목표', 'Location', 'best');
grid on;

% 7-5. 제어 힘 크기
subplot(2, 3, 5);
for c = 1:2
    plot(t, vecnorm(results(c).f_ctrl), configs(c).color, 'LineWidth', 1.5); hold on;
end
xlabel('시간 [s]'); ylabel('제어 힘 [N]');
title('제어기가 내는 힘', 'FontSize', 12);
legend(configs(1).name, configs(2).name, 'Location', 'best');
grid on;

% 7-6. 정리
subplot(2, 3, 6);
axis off;
text(0.05, 0.95, '임피던스 제어 핵심', 'FontSize', 14, ...
    'FontWeight', 'bold', 'Color', [1 0.8 0], 'VerticalAlignment', 'top');

text(0.05, 0.78, ['딱딱 (K=5000): ' num2str(max(results(1).f_wall),'%.0f') 'N'], ...
    'FontSize', 11, 'FontWeight', 'bold', 'Color', [1 0.4 0.4], 'VerticalAlignment', 'top');
text(0.05, 0.68, {'  위치는 정확하지만', '  힘이 과도 -> 위험!'}, ...
    'FontSize', 10, 'Color', 'w', 'VerticalAlignment', 'top');

text(0.05, 0.48, ['말랑 (K=300): ' num2str(max(results(2).f_wall),'%.0f') 'N'], ...
    'FontSize', 11, 'FontWeight', 'bold', 'Color', [0.4 1 0.4], 'VerticalAlignment', 'top');
text(0.05, 0.38, {'  위치는 덜 정확하지만', '  힘이 부드러움 -> 안전!'}, ...
    'FontSize', 10, 'Color', 'w', 'VerticalAlignment', 'top');

text(0.05, 0.15, 'K를 바꾸면 힘이 바뀐다!', ...
    'FontSize', 11, 'FontWeight', 'bold', 'Color', [0.4 1 1], 'VerticalAlignment', 'top');

%% 8. 강성(K) 튜닝 비교
% K를 바꾸면 벽에 가하는 힘이 어떻게 달라지나?
% → 이게 임피던스 제어의 핵심!

K_values = [100, 300, 1000, 3000];
colors_K = {[0.4 1 0.4], [1 0.8 0], [1 0.5 0], [1 0.3 0.3]};

figure('Name', '강성(K)에 따른 벽 힘 변화', 'Position', [100 100 1000 400]);

subplot(1, 2, 1); hold on; grid on;
title('K값별 벽에 가하는 힘', 'FontSize', 12);
xlabel('시간 [s]'); ylabel('힘 [N]');

f_steady = zeros(size(K_values));

for k = 1:length(K_values)
    K_ctrl = K_values(k) * eye(2);
    B_ctrl = K_values(k) * 0.04 * eye(2);  % 감쇠비 일정

    q = q_start;  qd = [0; 0];
    f_hist = zeros(1, N);

    for i = 1:N
        x_ee = fk(q);
        J = jac(q);
        xd_ee = J * qd;

        pen = max(0, x_ee(1) - x_wall);
        F_wall = [-K_wall * pen - B_wall * xd_ee(1) * (pen > 0); 0];
        tau_wall = J' * F_wall;

        F_ctrl = K_ctrl * (x_target - x_ee) + B_ctrl * (0 - xd_ee);
        g_vec = robot.gravload(q')';
        tau_ctrl = g_vec + J' * F_ctrl;

        M_mat = robot.inertia(q');
        C_mat = robot.coriolis(q', qd');
        qdd = M_mat \ (tau_ctrl + tau_wall - C_mat*qd - g_vec);

        qd = qd + qdd * dt;
        q  = q + qd * dt;
        f_hist(i) = K_wall * pen;
    end

    subplot(1, 2, 1);
    plot(t, f_hist, 'Color', colors_K{k}, 'LineWidth', 1.5);
    f_steady(k) = f_hist(end);
end

legend(arrayfun(@(k) ['K=' num2str(k)], K_values, 'UniformOutput', false), ...
    'Location', 'best');

% K vs 정상상태 힘
subplot(1, 2, 2);
cats = arrayfun(@(k) ['K=' num2str(k)], K_values, 'UniformOutput', false);
bar(categorical(cats, cats), f_steady, 'FaceColor', [0.4 0.8 1]);
ylabel('정상상태 벽 힘 [N]');
title('K가 크면 힘도 크다!', 'FontSize', 12);
grid on;

disp('=== 강성별 정상상태 벽 힘 ===');
for k = 1:length(K_values)
    disp(['  K=' num2str(K_values(k)) ': ' num2str(f_steady(k), '%.0f') 'N']);
end
disp(' ');

%% 9. 핵심 정리
disp('========================================');
disp('       임피던스 제어 핵심 정리');
disp('========================================');
disp(' ');
disp('1. 문제: 위치 제어만으로는 힘 조절 불가');
disp('   벽/사람/물체에 부딪히면 무한정 밀어버림!');
disp(' ');
disp('2. 임피던스 제어:');
disp('   tau = g(q) + J'' * (K*(x_d-x) + B*(0-xd))');
disp('   K(강성) = 얼마나 세게 밀 건지');
disp('   B(감쇠) = 얼마나 부드럽게 멈출 건지');
disp(' ');
disp('3. K 선택 기준:');
disp('   계란 잡기  -> K 작게 (말랑)');
disp('   드릴 작업  -> K 크게 (딱딱)');
disp('   사람 옆    -> K 작게 (안전)');
disp(' ');
disp('4. J''(자코비안 전치) 역할:');
disp('   끝점의 힘(F) -> 관절 토크(tau) 변환');
disp('   s05에서 배운 자코비안을 여기서 쓴다!');
disp(' ');
disp('5. 전체 제어 흐름:');
disp('   s07: PD, PD+G       (위치 제어 기초)');
disp('   s08: CT              (위치 제어 고급)');
disp('   s09: 임피던스 제어    (위치+힘 제어) <- 여기!');
disp('========================================');
