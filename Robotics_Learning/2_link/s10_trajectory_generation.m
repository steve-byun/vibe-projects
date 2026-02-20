%% s10_trajectory_generation.m
% 궤적 생성: "점"이 아니라 "경로"를 따라가기!
%
% 지금까지: 목표 = 점 1개 ("저기로 가!")
%   s07: PD+G로 점 이동
%   s08: CT로 정확한 점 이동
%   s09: 임피던스로 부드러운 점 이동
%
% 이제부터: 목표 = 경로 ("이 선을 따라 가!")
%   용접 → 이음새를 따라 직선으로
%   도장 → 표면을 따라 균일하게
%   조립 → 부품을 직선으로 넣기
%
% 핵심 질문:
%   A에서 B로 갈 때 중간 경로는?
%   → 관절을 직선으로 보간? 끝점을 직선으로 보간?
%   → 결과가 완전히 다르다!
%
% 배울 것:
%   1. 관절 공간 vs 작업 공간 궤적 (핵심!)
%   2. 속도 프로파일 (부드러운 시작/정지)
%   3. 직선/원호 보간 (실무: MoveJ, MoveL, MoveC)

clear; clc; close all;

%% 1. 로봇 정의
L1 = 1.0; L2 = 0.8;

% FK (s02 복습)
fk = @(q) [L1*cos(q(1)) + L2*cos(q(1)+q(2));
           L1*sin(q(1)) + L2*sin(q(1)+q(2))];

%% 2. 시작/끝 설정
q_A = [deg2rad(30); deg2rad(60)];    % A 자세
q_B = [deg2rad(90); deg2rad(-30)];   % B 자세

x_A = fk(q_A);  % A 끝점
x_B = fk(q_B);  % B 끝점

fprintf('=== A → B ===\n');
fprintf('A: q=(%.0f°, %.0f°) → 끝점=(%.2f, %.2f)\n', ...
    rad2deg(q_A(1)), rad2deg(q_A(2)), x_A(1), x_A(2));
fprintf('B: q=(%.0f°, %.0f°) → 끝점=(%.2f, %.2f)\n', ...
    rad2deg(q_B(1)), rad2deg(q_B(2)), x_B(1), x_B(2));
fprintf('\n');

%% 3. 시간/프로파일 설정
T_total = 2;  % 총 시간 (초)
N = 200;
t = linspace(0, T_total, N);
dt = t(2) - t(1);

% 정규화 시간 (0→1)
tau = t / T_total;

% 5차 다항식 프로파일: 위치/속도/가속도 모두 시작=0, 끝=0
s = 10*tau.^3 - 15*tau.^4 + 6*tau.^5;

% 사다리꼴 프로파일: 가속→등속→감속 (실무 표준)
ta = 0.3;  % 가속 구간 비율
v_peak = 1 / (1 - ta);
s_trap = zeros(size(tau));
for i = 1:N
    if tau(i) < ta
        s_trap(i) = 0.5 * v_peak * tau(i)^2 / ta;
    elseif tau(i) < 1 - ta
        s_trap(i) = v_peak * (tau(i) - ta/2);
    else
        s_trap(i) = 1 - 0.5 * v_peak * (1-tau(i))^2 / ta;
    end
end

%% 4. 관절 공간 궤적 (MoveJ)
%
% 관절 각도를 직선으로 보간
% → 각 관절이 자기 페이스대로 움직임
% → 끝점이 어디로 가는지? 모른다! 곡선이 된다!
%
% 비유: 네비 없이 운전. 핸들/가속을 부드럽게 조작하지만
%       실제 차가 어디로 가는지는 모름

disp('=== 관절 공간 궤적 (MoveJ) ===');
disp('관절 각도를 직선 보간 → 끝점은 곡선!');

q_jnt = zeros(2, N);
x_jnt = zeros(2, N);

for i = 1:N
    q_jnt(:,i) = q_A + s(i) * (q_B - q_A);
    x_jnt(:,i) = fk(q_jnt(:,i));
end

fprintf('  끝점 중간(t=1s): (%.2f, %.2f)\n', x_jnt(1,round(N/2)), x_jnt(2,round(N/2)));

% 사다리꼴 MoveJ
q_jnt_tr = zeros(2, N);
x_jnt_tr = zeros(2, N);
for i = 1:N
    q_jnt_tr(:,i) = q_A + s_trap(i) * (q_B - q_A);
    x_jnt_tr(:,i) = fk(q_jnt_tr(:,i));
end
fprintf('\n');

%% 5. 작업 공간 궤적 - 직선 (MoveL)
%
% 끝점 위치를 직선으로 보간 → 매 순간 IK로 관절 계산
% → 끝점은 정확히 직선! 관절은 비선형으로 움직임!
%
% 비유: 네비가 "직진하세요" → 핸들이 어떻게 돌아가든 경로는 직선

disp('=== 작업 공간 궤적 - 직선 (MoveL) ===');
disp('끝점을 직선 보간 + IK → 끝점 직선, 관절 비선형!');

x_lin = zeros(2, N);
q_lin = zeros(2, N);

for i = 1:N
    x_lin(:,i) = x_A + s(i) * (x_B - x_A);
    q_lin(:,i) = ik_solve(x_lin(1,i), x_lin(2,i), L1, L2);
end

fprintf('  끝점 중간(t=1s): (%.2f, %.2f) ← 직선 위!\n', x_lin(1,round(N/2)), x_lin(2,round(N/2)));

% 사다리꼴 MoveL
x_lin_tr = zeros(2, N);
q_lin_tr = zeros(2, N);
for i = 1:N
    x_lin_tr(:,i) = x_A + s_trap(i) * (x_B - x_A);
    q_lin_tr(:,i) = ik_solve(x_lin_tr(1,i), x_lin_tr(2,i), L1, L2);
end
fprintf('\n');

%% 6. 작업 공간 궤적 - 원호 (MoveC)
%
% 끝점이 원호를 그리며 이동
% 용도: 나사 조이기, 원형 연마, 디버링(burr 제거)

disp('=== 작업 공간 궤적 - 원호 (MoveC) ===');
disp('끝점이 반원을 따라 이동');

center = [0.5; 0.7];   % 원 중심
radius = 0.4;           % 반지름
ang_start = deg2rad(-30);
ang_end = deg2rad(150);

x_arc = zeros(2, N);
q_arc = zeros(2, N);

for i = 1:N
    ang = ang_start + s(i) * (ang_end - ang_start);
    x_arc(:,i) = center + radius * [cos(ang); sin(ang)];
    q_arc(:,i) = ik_solve(x_arc(1,i), x_arc(2,i), L1, L2);
end

fprintf('\n');

%% 7. Figure 1: 관절 공간 vs 작업 공간 비교 (핵심!)
figure('Name', 'MoveJ vs MoveL: 관절 공간 vs 작업 공간', 'Position', [50 50 1400 700]);

% --- 왼쪽 (큰 칸): 끝점 경로 비교 ---
subplot(2, 3, [1 4]);
hold on; grid on; axis equal;

% 경로
plot(x_jnt(1,:), x_jnt(2,:), 'r-', 'LineWidth', 2.5);
plot(x_lin(1,:), x_lin(2,:), 'g-', 'LineWidth', 2.5);

% 중간 로봇 자세 (관절 공간, 반투명)
for idx = round(linspace(1, N, 5))
    q = q_jnt(:,idx);
    x1 = L1*cos(q(1)); y1 = L1*sin(q(1));
    x2 = x1 + L2*cos(q(1)+q(2)); y2 = y1 + L2*sin(q(1)+q(2));
    plot([0 x1 x2], [0 y1 y2], '-', 'Color', [1 0.4 0.4 0.3], 'LineWidth', 1);
end

% A, B 표시
plot(x_A(1), x_A(2), 'wo', 'MarkerSize', 14, 'LineWidth', 2);
plot(x_B(1), x_B(2), 'w*', 'MarkerSize', 16, 'LineWidth', 2);
text(x_A(1)+0.03, x_A(2)+0.06, 'A', 'Color', 'w', 'FontSize', 13, 'FontWeight', 'bold');
text(x_B(1)+0.03, x_B(2)+0.06, 'B', 'Color', 'w', 'FontSize', 13, 'FontWeight', 'bold');

xlim([-0.3 1.5]); ylim([-0.1 1.5]);
xlabel('X [m]'); ylabel('Y [m]');
title({'끝점 경로 비교', '같은 A→B인데 경로가 다르다!'}, 'FontSize', 12);
legend('MoveJ (곡선)', 'MoveL (직선)', 'Location', 'southeast');

% --- 오른쪽 위: MoveJ 관절 각도 ---
subplot(2, 3, 2);
plot(t, rad2deg(q_jnt(1,:)), 'r-', 'LineWidth', 1.5); hold on;
plot(t, rad2deg(q_jnt(2,:)), 'Color', [1 0.6 0.6], 'LineWidth', 1.5);
plot(t, rad2deg(q_jnt_tr(1,:)), 'r--', 'LineWidth', 1.2);
plot(t, rad2deg(q_jnt_tr(2,:)), '--', 'Color', [1 0.6 0.6], 'LineWidth', 1.2);
xlabel('시간 [s]'); ylabel('각도 [°]');
title('MoveJ: 관절 각도', 'FontSize', 11);
legend('q1 (5차)', 'q2 (5차)', 'q1 (사다리꼴)', 'q2 (사다리꼴)', 'Location', 'best'); grid on;

% --- 오른쪽 위: MoveJ 끝점 속도 ---
subplot(2, 3, 3);
v_jnt = sqrt(diff(x_jnt(1,:)).^2 + diff(x_jnt(2,:)).^2) / dt;
v_jnt_tr = sqrt(diff(x_jnt_tr(1,:)).^2 + diff(x_jnt_tr(2,:)).^2) / dt;
plot(t(1:end-1), v_jnt, 'r-', 'LineWidth', 1.5); hold on;
plot(t(1:end-1), v_jnt_tr, 'r--', 'LineWidth', 1.2);
xlabel('시간 [s]'); ylabel('끝점 속도 [m/s]');
title({'MoveJ: 끝점 속도', '어떤 프로파일이든 울퉁불퉁!'}, 'FontSize', 11);
legend('5차', '사다리꼴', 'Location', 'best'); grid on;

% --- 오른쪽 아래: MoveL 관절 각도 ---
subplot(2, 3, 5);
plot(t, rad2deg(q_lin(1,:)), 'g-', 'LineWidth', 1.5); hold on;
plot(t, rad2deg(q_lin(2,:)), 'Color', [0.6 1 0.6], 'LineWidth', 1.5);
plot(t, rad2deg(q_lin_tr(1,:)), 'g--', 'LineWidth', 1.2);
plot(t, rad2deg(q_lin_tr(2,:)), '--', 'Color', [0.6 1 0.6], 'LineWidth', 1.2);
xlabel('시간 [s]'); ylabel('각도 [°]');
title({'MoveL: 관절 각도', '비선형! (IK 때문)'}, 'FontSize', 11);
legend('q1 (5차)', 'q2 (5차)', 'q1 (사다리꼴)', 'q2 (사다리꼴)', 'Location', 'best'); grid on;

% --- 오른쪽 아래: MoveL 끝점 속도 ---
subplot(2, 3, 6);
v_lin = sqrt(diff(x_lin(1,:)).^2 + diff(x_lin(2,:)).^2) / dt;
v_lin_tr = sqrt(diff(x_lin_tr(1,:)).^2 + diff(x_lin_tr(2,:)).^2) / dt;
plot(t(1:end-1), v_lin, 'g-', 'LineWidth', 1.5); hold on;
plot(t(1:end-1), v_lin_tr, 'g--', 'LineWidth', 1.2);
xlabel('시간 [s]'); ylabel('끝점 속도 [m/s]');
title({'MoveL: 끝점 속도', '프로파일 모양 그대로!'}, 'FontSize', 11);
legend('5차', '사다리꼴', 'Location', 'best'); grid on;

%% 8. Figure 2: 속도 프로파일 비교
%
% "어떻게 시작하고 멈추느냐?"
%
% 비유: 자동차
%   1차(선형) = 급발진 + 급정지 (뒤에 탄 사람 화남)
%   3차 = 부드럽게 출발, 부드럽게 정지
%   5차 = 더 부드럽게 (가속도도 0에서 시작)
%   사다리꼴 = 가속→정속→감속 (택배 컨베이어)

figure('Name', '속도 프로파일 비교', 'Position', [100 100 1200 500]);

% --- 해석적 계산 ---
% 1차: 급발진 (현실에서는 불가능)
s1_vel = ones(size(tau));
s1_acc = zeros(size(tau));  % 경계에서 무한대 (표시 불가)

% 3차: 속도 부드러움, 가속도는 경계에서 불연속
s3_vel = 6*tau - 6*tau.^2;
s3_acc = 6 - 12*tau;

% 5차: 전부 부드러움 (이상적)
s5_vel = 30*tau.^2 - 60*tau.^3 + 30*tau.^4;
s5_acc = 60*tau - 180*tau.^2 + 120*tau.^3;

% 사다리꼴: 실무 표준
ta = 0.3;  % 가속 구간 비율
v_peak = 1 / (1 - ta);
s_trap_vel = zeros(size(tau));
s_trap_acc = zeros(size(tau));

for i = 1:N
    if tau(i) < ta
        s_trap_vel(i) = v_peak * tau(i) / ta;
        s_trap_acc(i) = v_peak / ta;
    elseif tau(i) < 1 - ta
        s_trap_vel(i) = v_peak;
        s_trap_acc(i) = 0;
    else
        s_trap_vel(i) = v_peak * (1-tau(i)) / ta;
        s_trap_acc(i) = -v_peak / ta;
    end
end

cols = {[0.7 0.7 0.7], [1 0.8 0], [0.4 1 0.4], [0.4 0.8 1]};
names = {'1차 (급발진!)', '3차 다항식', '5차 다항식', '사다리꼴 (실무)'};

% 속도
subplot(1, 3, 1);
plot(tau, s1_vel, 'Color', cols{1}, 'LineWidth', 1.5); hold on;
plot(tau, s3_vel, 'Color', cols{2}, 'LineWidth', 1.5);
plot(tau, s5_vel, 'Color', cols{3}, 'LineWidth', 1.5);
plot(tau, s_trap_vel, 'Color', cols{4}, 'LineWidth', 1.5);
xlabel('정규화 시간 (0→1)'); ylabel('속도');
title({'속도 프로파일', '시작/끝 = 0 이어야 부드러움!'}, 'FontSize', 12);
legend(names, 'Location', 'north'); grid on;

% 가속도
subplot(1, 3, 2);
plot(tau, s1_acc, 'Color', cols{1}, 'LineWidth', 1.5); hold on;
plot(tau, s3_acc, 'Color', cols{2}, 'LineWidth', 1.5);
plot(tau, s5_acc, 'Color', cols{3}, 'LineWidth', 1.5);
plot(tau, s_trap_acc, 'Color', cols{4}, 'LineWidth', 1.5);
xlabel('정규화 시간'); ylabel('가속도');
title({'가속도 프로파일', '이것도 0이면 충격 없음!'}, 'FontSize', 12);
legend(names, 'Location', 'northeast'); grid on;

% 정리
subplot(1, 3, 3);
axis off;
text(0.05, 0.95, '속도 프로파일 비교', 'FontSize', 14, ...
    'FontWeight', 'bold', 'Color', [1 0.8 0], 'VerticalAlignment', 'top');

text(0.05, 0.80, '1차: 급발진/급정지', ...
    'FontSize', 11, 'Color', [0.7 0.7 0.7], 'VerticalAlignment', 'top');
text(0.05, 0.72, '  속도 불연속 → 충격 → 실무 불가', ...
    'FontSize', 10, 'Color', 'w', 'VerticalAlignment', 'top');

text(0.05, 0.58, '3차: 속도 부드러움', ...
    'FontSize', 11, 'Color', [1 0.8 0], 'VerticalAlignment', 'top');
text(0.05, 0.50, '  가속도 불연속 → 약간 충격', ...
    'FontSize', 10, 'Color', 'w', 'VerticalAlignment', 'top');

text(0.05, 0.36, '5차: 전부 부드러움', ...
    'FontSize', 11, 'Color', [0.4 1 0.4], 'VerticalAlignment', 'top');
text(0.05, 0.28, '  가속도도 0에서 시작/끝 → 이상적', ...
    'FontSize', 10, 'Color', 'w', 'VerticalAlignment', 'top');

text(0.05, 0.14, '사다리꼴: 실무 표준!', ...
    'FontSize', 11, 'FontWeight', 'bold', 'Color', [0.4 0.8 1], 'VerticalAlignment', 'top');
text(0.05, 0.06, '  가속→등속→감속, 시간 효율적', ...
    'FontSize', 10, 'Color', 'w', 'VerticalAlignment', 'top');

%% 9. Figure 3: 직선 + 원호 보간 (MoveL vs MoveC)
figure('Name', 'MoveL (직선) + MoveC (원호)', 'Position', [100 100 800 500]);
hold on; grid on; axis equal;

% 직선 궤적
plot(x_lin(1,:), x_lin(2,:), 'g-', 'LineWidth', 2.5);

% 원호 궤적
plot(x_arc(1,:), x_arc(2,:), 'Color', [0.4 0.8 1], 'LineWidth', 2.5);

% 원호 중간 로봇 자세 (반투명)
for idx = round(linspace(1, N, 5))
    q = q_arc(:,idx);
    x1 = L1*cos(q(1)); y1 = L1*sin(q(1));
    x2 = x1 + L2*cos(q(1)+q(2)); y2 = y1 + L2*sin(q(1)+q(2));
    plot([0 x1 x2], [0 y1 y2], '-', 'Color', [0.4 0.8 1 0.4], 'LineWidth', 1);
end

% 시작/끝 표시
plot(x_A(1), x_A(2), 'go', 'MarkerSize', 12, 'LineWidth', 2);
plot(x_B(1), x_B(2), 'g*', 'MarkerSize', 14, 'LineWidth', 2);
plot(x_arc(1,1), x_arc(2,1), 'o', 'Color', [0.4 0.8 1], 'MarkerSize', 12, 'LineWidth', 2);
plot(x_arc(1,end), x_arc(2,end), '*', 'Color', [0.4 0.8 1], 'MarkerSize', 14, 'LineWidth', 2);
plot(center(1), center(2), 'w+', 'MarkerSize', 12, 'LineWidth', 2);
text(center(1)+0.03, center(2), '중심', 'Color', 'w', 'FontSize', 11);

xlabel('X [m]'); ylabel('Y [m]');
title({'MoveL (직선) + MoveC (원호)', '용접=직선, 나사 조이기=원호'}, 'FontSize', 12);
legend('MoveL (직선)', 'MoveC (원호)', 'Location', 'best');

%% 10. 핵심 정리
fprintf('\n========================================\n');
fprintf('       궤적 생성 핵심 정리\n');
fprintf('========================================\n\n');

fprintf('1. MoveJ (관절 공간):\n');
fprintf('   관절 각도를 보간 → 끝점은 곡선\n');
fprintf('   장점: 빠름, 특이점 안전\n');
fprintf('   단점: 경로 예측 불가 (충돌 위험)\n');
fprintf('   용도: 빈 공간 이동, 홈 위치 복귀\n\n');

fprintf('2. MoveL (직선 보간):\n');
fprintf('   끝점을 직선 보간 + 매번 IK\n');
fprintf('   장점: 경로 정확, 예측 가능\n');
fprintf('   단점: 특이점 근처 위험, IK 계산량\n');
fprintf('   용도: 용접, 절단, 조립, 실링\n\n');

fprintf('3. MoveC (원호 보간):\n');
fprintf('   끝점이 원호를 따라감 + 매번 IK\n');
fprintf('   용도: 나사 조이기, 원형 연마, 디버링\n\n');

fprintf('4. 속도 프로파일:\n');
fprintf('   사다리꼴: 실무 표준 (가속→등속→감속)\n');
fprintf('   5차 다항식: 가장 부드러움\n');
fprintf('   핵심: 시작/끝에서 속도=0 (급발진 금지!)\n\n');

fprintf('5. 실무 (UR/FANUC/ABB 공통):\n');
fprintf('   MoveJ → 빈 공간 빠르게 이동\n');
fprintf('   MoveL → 작업 경로 직선 이동\n');
fprintf('   MoveC → 곡면/원형 작업\n');
fprintf('========================================\n');

%% IK 함수
function q = ik_solve(x, y, L1, L2)
    cos_q2 = (x^2 + y^2 - L1^2 - L2^2) / (2*L1*L2);
    cos_q2 = max(-1, min(1, cos_q2));  % 안전 클램핑
    q2 = acos(cos_q2);  % elbow-up
    q1 = atan2(y, x) - atan2(L2*sin(q2), L1+L2*cos(q2));
    q = [q1; q2];
end
