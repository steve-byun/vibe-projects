%% Step 3: 역기구학 (Inverse Kinematics)
% 목표: 끝점 위치 → 관절 각도 계산
clear; close all; clc;

%% 로봇 정의
L1 = 1.0;
L2 = 0.8;

%% IK 공식 (2-Link)
fprintf('=== IK 공식 ===\n');
fprintf('cos(q2) = (x² + y² - L1² - L2²) / (2*L1*L2)\n');
fprintf('q2 = atan2(±sqrt(1-cos²q2), cos(q2))  ← 해가 2개!\n');
fprintf('q1 = atan2(y, x) - atan2(L2*sin(q2), L1 + L2*cos(q2))\n\n');

%% 목표 위치 설정
target_x = 1.2;
target_y = 0.8;

fprintf('=== 목표 위치: (%.1f, %.1f) ===\n\n', target_x, target_y);

%% IK 계산
cos_q2 = (target_x^2 + target_y^2 - L1^2 - L2^2) / (2*L1*L2);

% 도달 가능한지 확인
if abs(cos_q2) > 1
    fprintf('ERROR: 도달 불가능한 위치!\n');
    fprintf('거리 = %.2f, 가능 범위 = [%.2f, %.2f]\n', ...
        sqrt(target_x^2+target_y^2), abs(L1-L2), L1+L2);
    return;
end

% 해 1: Elbow Up (q2 > 0)
sin_q2_up = sqrt(1 - cos_q2^2);
q2_up = atan2(sin_q2_up, cos_q2);
q1_up = atan2(target_y, target_x) - atan2(L2*sin_q2_up, L1 + L2*cos_q2);

% 해 2: Elbow Down (q2 < 0)
sin_q2_down = -sqrt(1 - cos_q2^2);
q2_down = atan2(sin_q2_down, cos_q2);
q1_down = atan2(target_y, target_x) - atan2(L2*sin_q2_down, L1 + L2*cos_q2);

%% 결과 출력
fprintf('해 1 (Elbow Up): q1 = %.1f°, q2 = %.1f°\n', rad2deg(q1_up), rad2deg(q2_up));
fprintf('해 2 (Elbow Down): q1 = %.1f°, q2 = %.1f°\n\n', rad2deg(q1_down), rad2deg(q2_down));

%% 검증: FK로 다시 계산
x_up = L1*cos(q1_up) + L2*cos(q1_up+q2_up);
y_up = L1*sin(q1_up) + L2*sin(q1_up+q2_up);
x_down = L1*cos(q1_down) + L2*cos(q1_down+q2_down);
y_down = L1*sin(q1_down) + L2*sin(q1_down+q2_down);

fprintf('=== 검증 (FK로 확인) ===\n');
fprintf('Elbow Up:   (%.3f, %.3f)\n', x_up, y_up);
fprintf('Elbow Down: (%.3f, %.3f)\n', x_down, y_down);
fprintf('목표:       (%.3f, %.3f)\n\n', target_x, target_y);

%% 시각화
figure('Name', 'IK: 두 가지 해', 'Position', [100 100 1000 500]);

% 해 1: Elbow Up
subplot(1,2,1);
hold on; grid on; axis equal;

x0 = 0; y0 = 0;
x1 = L1*cos(q1_up); y1 = L1*sin(q1_up);
x2 = x1 + L2*cos(q1_up+q2_up); y2 = y1 + L2*sin(q1_up+q2_up);

plot([x0 x1], [y0 y1], 'b-', 'LineWidth', 4);
plot([x1 x2], [y1 y2], 'r-', 'LineWidth', 4);
plot(x0, y0, 'ko', 'MarkerSize', 12, 'MarkerFaceColor', 'k');
plot(x1, y1, 'bo', 'MarkerSize', 10, 'MarkerFaceColor', 'b');
plot(target_x, target_y, 'gp', 'MarkerSize', 20, 'MarkerFaceColor', 'g');

xlim([-0.5 2.5]); ylim([-1 2]);
xlabel('X'); ylabel('Y');
title(sprintf('Elbow Up (q2 > 0)\nq1 = %.0f°, q2 = %.0f°', rad2deg(q1_up), rad2deg(q2_up)));
legend('링크1', '링크2', '', '', '목표점', 'Location', 'southwest');

% 해 2: Elbow Down
subplot(1,2,2);
hold on; grid on; axis equal;

x1 = L1*cos(q1_down); y1 = L1*sin(q1_down);
x2 = x1 + L2*cos(q1_down+q2_down); y2 = y1 + L2*sin(q1_down+q2_down);

plot([x0 x1], [y0 y1], 'b-', 'LineWidth', 4);
plot([x1 x2], [y1 y2], 'r-', 'LineWidth', 4);
plot(x0, y0, 'ko', 'MarkerSize', 12, 'MarkerFaceColor', 'k');
plot(x1, y1, 'bo', 'MarkerSize', 10, 'MarkerFaceColor', 'b');
plot(target_x, target_y, 'gp', 'MarkerSize', 20, 'MarkerFaceColor', 'g');

xlim([-0.5 2.5]); ylim([-1 2]);
xlabel('X'); ylabel('Y');
title(sprintf('Elbow Down (q2 < 0)\nq1 = %.0f°, q2 = %.0f°', rad2deg(q1_down), rad2deg(q2_down)));

fprintf('=== 핵심 ===\n');
fprintf('같은 위치 → 2가지 자세 가능\n');
fprintf('Elbow Up: 팔꿈치가 위로 (q2 > 0)\n');
fprintf('Elbow Down: 팔꿈치가 아래로 (q2 < 0)\n');
