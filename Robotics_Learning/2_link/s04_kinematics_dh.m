%% Step 1: DH 파라미터 (Denavit-Hartenberg Convention)
% 목표: DH 파라미터로 로봇 기구학을 체계적으로 표현
clear; close all; clc;

%% DH 파라미터란?
fprintf('=== DH 파라미터 (Denavit-Hartenberg) ===\n\n');
fprintf('로봇 링크 간의 관계를 4개 파라미터로 표현하는 표준 방법\n\n');
fprintf('4개 파라미터:\n');
fprintf('  θ (theta) : Z축 기준 회전 (관절 각도, Revolute에서 변수)\n');
fprintf('  d         : Z축 방향 이동 (Prismatic에서 변수)\n');
fprintf('  a         : X축 방향 이동 (링크 길이)\n');
fprintf('  α (alpha) : X축 기준 회전 (링크 비틀림)\n\n');

%% 2-Link Robot DH 파라미터
fprintf('=== 2-Link Planar Robot DH 파라미터 ===\n\n');
L1 = 1.0;
L2 = 0.8;

fprintf('| Link |   θ   |  d  |   a   |  α  |\n');
fprintf('|------|-------|-----|-------|-----|\n');
fprintf('|  1   |  q1   |  0  |  %.1f  |  0  |\n', L1);
fprintf('|  2   |  q2   |  0  |  %.1f  |  0  |\n\n', L2);

fprintf('Planar Robot 특징:\n');
fprintf('  - d = 0 (Z방향 이동 없음)\n');
fprintf('  - α = 0 (비틀림 없음, 모든 관절이 평행)\n');
fprintf('  - θ = 관절 변수 (q1, q2)\n');
fprintf('  - a = 링크 길이 (L1, L2)\n\n');

%% DH 변환 행렬
fprintf('=== DH 변환 행렬 공식 ===\n\n');
fprintf('T = Rz(θ) * Tz(d) * Tx(a) * Rx(α)\n\n');
fprintf('     | cos(θ)  -sin(θ)*cos(α)   sin(θ)*sin(α)  a*cos(θ) |\n');
fprintf('T =  | sin(θ)   cos(θ)*cos(α)  -cos(θ)*sin(α)  a*sin(θ) |\n');
fprintf('     |   0         sin(α)          cos(α)          d     |\n');
fprintf('     |   0           0               0             1     |\n\n');

%% DH 변환 행렬 함수 정의
dh_transform = @(theta, d, a, alpha) [
    cos(theta), -sin(theta)*cos(alpha),  sin(theta)*sin(alpha), a*cos(theta);
    sin(theta),  cos(theta)*cos(alpha), -cos(theta)*sin(alpha), a*sin(theta);
    0,           sin(alpha),             cos(alpha),            d;
    0,           0,                      0,                     1
];

%% 예제: q1 = 30°, q2 = 45°
q1 = deg2rad(30);
q2 = deg2rad(45);

fprintf('=== 예제: q1 = 30°, q2 = 45° ===\n\n');

% 각 링크의 변환 행렬
T01 = dh_transform(q1, 0, L1, 0);  % Base → Link1
T12 = dh_transform(q2, 0, L2, 0);  % Link1 → Link2

% 전체 변환 행렬
T02 = T01 * T12;  % Base → End-effector

fprintf('T01 (Base → Link1 끝):\n');
disp(T01);

fprintf('T12 (Link1 끝 → Link2 끝):\n');
disp(T12);

fprintf('T02 = T01 * T12 (Base → End-effector):\n');
disp(T02);

% 끝점 위치 추출
end_pos = T02(1:2, 4);
fprintf('끝점 위치: (%.3f, %.3f)\n\n', end_pos(1), end_pos(2));

% FK 공식으로 검증
x_fk = L1*cos(q1) + L2*cos(q1+q2);
y_fk = L1*sin(q1) + L2*sin(q1+q2);
fprintf('FK 공식 검증: (%.3f, %.3f)\n', x_fk, y_fk);
fprintf('→ 결과 일치!\n\n');

%% 시각화
figure('Name', 'DH 파라미터 시각화', 'Position', [100 100 1000 500]);

% 좌표계 그리기 함수
draw_frame = @(T, scale, name) deal(...
    quiver3(T(1,4), T(2,4), T(3,4), T(1,1)*scale, T(2,1)*scale, T(3,1)*scale, 'r', 'LineWidth', 2), ...
    quiver3(T(1,4), T(2,4), T(3,4), T(1,2)*scale, T(2,2)*scale, T(3,2)*scale, 'g', 'LineWidth', 2), ...
    quiver3(T(1,4), T(2,4), T(3,4), T(1,3)*scale, T(2,3)*scale, T(3,3)*scale, 'Color', [0.4 1 1], 'LineWidth', 2));

subplot(1, 2, 1);
hold on; grid on; axis equal;
view(2);  % 2D 뷰

% 베이스 좌표계 (원점)
T_base = eye(4);
scale = 0.3;

% 좌표계 그리기
quiver(0, 0, scale, 0, 'r', 'LineWidth', 2, 'MaxHeadSize', 0.5);
quiver(0, 0, 0, scale, 'g', 'LineWidth', 2, 'MaxHeadSize', 0.5);
text(scale+0.05, 0, 'X_0', 'Color', 'r');
text(0, scale+0.05, 'Y_0', 'Color', 'g');

% Link1 끝 좌표계
quiver(T01(1,4), T01(2,4), T01(1,1)*scale, T01(2,1)*scale, 'r', 'LineWidth', 2, 'MaxHeadSize', 0.5);
quiver(T01(1,4), T01(2,4), T01(1,2)*scale, T01(2,2)*scale, 'g', 'LineWidth', 2, 'MaxHeadSize', 0.5);
text(T01(1,4)+T01(1,1)*scale+0.05, T01(2,4)+T01(2,1)*scale, 'X_1', 'Color', 'r');
text(T01(1,4)+T01(1,2)*scale, T01(2,4)+T01(2,2)*scale+0.05, 'Y_1', 'Color', 'g');

% End-effector 좌표계
quiver(T02(1,4), T02(2,4), T02(1,1)*scale, T02(2,1)*scale, 'r', 'LineWidth', 2, 'MaxHeadSize', 0.5);
quiver(T02(1,4), T02(2,4), T02(1,2)*scale, T02(2,2)*scale, 'g', 'LineWidth', 2, 'MaxHeadSize', 0.5);
text(T02(1,4)+T02(1,1)*scale+0.05, T02(2,4)+T02(2,1)*scale, 'X_2', 'Color', 'r');
text(T02(1,4)+T02(1,2)*scale, T02(2,4)+T02(2,2)*scale+0.05, 'Y_2', 'Color', 'g');

% 링크 그리기
plot([0 T01(1,4)], [0 T01(2,4)], '-', 'Color', [1 0.8 0], 'LineWidth', 2);
plot([T01(1,4) T02(1,4)], [T01(2,4) T02(2,4)], '-', 'Color', [1 0.4 0.7], 'LineWidth', 2);

% 관절 표시
plot(0, 0, 'wo', 'MarkerSize', 8, 'MarkerFaceColor', 'w');
plot(T01(1,4), T01(2,4), 'ro', 'MarkerSize', 8, 'MarkerFaceColor', 'r');
plot(T02(1,4), T02(2,4), 'mo', 'MarkerSize', 8, 'MarkerFaceColor', 'm');

xlim([-0.5 2.5]); ylim([-0.5 2]);
xlabel('X'); ylabel('Y');
title(sprintf('DH 좌표계 시각화\nq1 = %.0f°, q2 = %.0f°', rad2deg(q1), rad2deg(q2)));

% DH 테이블 subplot
subplot(1, 2, 2);
axis off;
text(0.1, 0.9, 'DH 파라미터 테이블', 'FontSize', 14, 'FontWeight', 'bold', 'Color', 'w');
text(0.1, 0.75, sprintf('| Link |   θ    |  d  |   a   |  α  |'), 'FontName', 'Consolas', 'Color', 'w');
text(0.1, 0.65, sprintf('|  1   |  %.0f°  |  0  |  %.1f  |  0  |', rad2deg(q1), L1), 'FontName', 'Consolas', 'Color', 'w');
text(0.1, 0.55, sprintf('|  2   |  %.0f°  |  0  |  %.1f  |  0  |', rad2deg(q2), L2), 'FontName', 'Consolas', 'Color', 'w');

text(0.1, 0.35, '핵심 포인트:', 'FontSize', 12, 'FontWeight', 'bold', 'Color', 'w');
text(0.1, 0.25, '• 각 좌표계는 관절에 부착', 'Color', 'w');
text(0.1, 0.15, '• T01 * T12 = T02 (행렬 곱으로 연결)', 'Color', 'w');
text(0.1, 0.05, '• 끝점 위치 = T02의 마지막 열', 'Color', 'w');

%% 핵심 정리
fprintf('=== 핵심 정리 ===\n');
fprintf('1. DH 파라미터: θ, d, a, α 4개로 링크 관계 정의\n');
fprintf('2. 변환 행렬: 각 링크마다 4x4 행렬 생성\n');
fprintf('3. 연쇄 법칙: T_total = T01 * T12 * ... * T(n-1)n\n');
fprintf('4. 끝점 위치: T_total(1:3, 4)에서 추출\n');
