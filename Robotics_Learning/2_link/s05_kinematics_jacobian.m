%% Step 2: 야코비안 (Jacobian Matrix)
% 목표: 관절 속도 ↔ 끝점 속도 관계 이해
clear; close all; clc;

%% 야코비안이란?
fprintf('=== 야코비안 (Jacobian) ===\n\n');
fprintf('관절 속도(q_dot)와 끝점 속도(x_dot) 사이의 관계를 나타내는 행렬\n\n');
fprintf('  ẋ = J(q) * q̇\n\n');
fprintf('  [ẋ]   [J11 J12] [q̇1]\n');
fprintf('  [ẏ] = [J21 J22] [q̇2]\n\n');

%% 2-Link Robot 야코비안 유도
fprintf('=== 2-Link Robot 야코비안 유도 ===\n\n');
fprintf('FK 공식:\n');
fprintf('  x = L1*cos(q1) + L2*cos(q1+q2)\n');
fprintf('  y = L1*sin(q1) + L2*sin(q1+q2)\n\n');

fprintf('야코비안 = 편미분:\n');
fprintf('  J11 = ∂x/∂q1 = -L1*sin(q1) - L2*sin(q1+q2)\n');
fprintf('  J12 = ∂x/∂q2 = -L2*sin(q1+q2)\n');
fprintf('  J21 = ∂y/∂q1 =  L1*cos(q1) + L2*cos(q1+q2)\n');
fprintf('  J22 = ∂y/∂q2 =  L2*cos(q1+q2)\n\n');

%% 로봇 정의
L1 = 1.0;
L2 = 0.8;

% 야코비안 함수 정의
jacobian_2link = @(q1, q2, L1, L2) [
    -L1*sin(q1) - L2*sin(q1+q2),  -L2*sin(q1+q2);
     L1*cos(q1) + L2*cos(q1+q2),   L2*cos(q1+q2)
];

%% 예제 1: 일반적인 자세
q1 = deg2rad(45);
q2 = deg2rad(30);

fprintf('=== 예제: q1 = 45°, q2 = 30° ===\n\n');

J = jacobian_2link(q1, q2, L1, L2);
fprintf('야코비안 J:\n');
fprintf('  [%.3f  %.3f]\n', J(1,1), J(1,2));
fprintf('  [%.3f  %.3f]\n\n', J(2,1), J(2,2));

% 행렬식 (특이점 판단)
det_J = det(J);
fprintf('det(J) = %.3f\n', det_J);
if abs(det_J) < 0.01
    fprintf('→ 특이점 근처! (움직임 제한)\n\n');
else
    fprintf('→ 정상 (모든 방향 움직임 가능)\n\n');
end

%% 속도 변환 예제
fprintf('=== 속도 변환 예제 ===\n\n');
q_dot = [1; 0.5];  % 관절 속도 [rad/s]
x_dot = J * q_dot;  % 끝점 속도 [m/s]

fprintf('관절 속도: q̇1 = %.1f rad/s, q̇2 = %.1f rad/s\n', q_dot(1), q_dot(2));
fprintf('끝점 속도: ẋ = %.3f m/s, ẏ = %.3f m/s\n\n', x_dot(1), x_dot(2));

%% 역야코비안 (역기구학 속도)
fprintf('=== 역야코비안 ===\n\n');
fprintf('q̇ = J⁻¹ * ẋ  (끝점 속도 → 관절 속도)\n\n');

J_inv = inv(J);
fprintf('J⁻¹:\n');
fprintf('  [%.3f  %.3f]\n', J_inv(1,1), J_inv(1,2));
fprintf('  [%.3f  %.3f]\n\n', J_inv(2,1), J_inv(2,2));

% 검증: 끝점 속도로 관절 속도 복원
q_dot_recovered = J_inv * x_dot;
fprintf('복원된 관절 속도: q̇1 = %.3f, q̇2 = %.3f\n', q_dot_recovered(1), q_dot_recovered(2));
fprintf('→ 원래 값과 일치!\n\n');

%% 특이점 (Singularity) 분석
fprintf('=== 특이점 (Singularity) ===\n\n');
fprintf('det(J) = 0 → 야코비안 역행렬 불가 → 특이점\n\n');

fprintf('2-Link Robot 특이점 조건:\n');
fprintf('  det(J) = L1*L2*sin(q2) = 0\n');
fprintf('  → q2 = 0° 또는 q2 = 180° (팔이 완전히 펴지거나 접힘)\n\n');

%% 시각화
figure('Name', '야코비안 시각화', 'Position', [100 100 1200 500]);

% 자세별 야코비안 비교
poses = {
    [deg2rad(45), deg2rad(30)], '일반 자세 (q2 = 30°)';
    [deg2rad(45), deg2rad(5)],  '특이점 근처 (q2 = 5°)';
    [deg2rad(45), deg2rad(90)], '팔꿈치 90° (q2 = 90°)';
};

for idx = 1:3
    subplot(1, 3, idx);
    hold on; grid on; axis equal;

    q = poses{idx, 1};
    name = poses{idx, 2};
    q1 = q(1); q2 = q(2);

    % 끝점 위치
    x1 = L1*cos(q1); y1 = L1*sin(q1);
    x2 = x1 + L2*cos(q1+q2); y2 = y1 + L2*sin(q1+q2);

    % 로봇 그리기
    plot([0 x1], [0 y1], '-', 'Color', [1 0.8 0], 'LineWidth', 2);
    plot([x1 x2], [y1 y2], '-', 'Color', [1 0.4 0.7], 'LineWidth', 2);
    plot(0, 0, 'wo', 'MarkerSize', 8, 'MarkerFaceColor', 'w');
    plot(x1, y1, 'ro', 'MarkerSize', 8, 'MarkerFaceColor', 'r');
    plot(x2, y2, 'go', 'MarkerSize', 8, 'MarkerFaceColor', 'g');

    % 야코비안 계산
    J = jacobian_2link(q1, q2, L1, L2);
    det_J = det(J);

    % 속도 타원 그리기 (manipulability ellipse)
    theta_ellipse = linspace(0, 2*pi, 100);
    unit_circle = [cos(theta_ellipse); sin(theta_ellipse)];
    ellipse = J * unit_circle * 0.3;  % 스케일 조정
    plot(x2 + ellipse(1,:), y2 + ellipse(2,:), 'c-', 'LineWidth', 1.5);

    xlim([-0.5 2.5]); ylim([-0.5 2]);
    xlabel('X'); ylabel('Y');
    title(sprintf('%s\ndet(J) = %.3f', name, det_J));

    if idx == 1
        legend('링크1', '링크2', '', '', '', '속도 타원', 'Location', 'southwest');
    end
end

%% 특이점 시각화 (det(J) vs q2)
figure('Name', '특이점 분석', 'Position', [100 100 600 400]);
q2_range = linspace(-pi, pi, 200);
det_values = L1 * L2 * sin(q2_range);

plot(rad2deg(q2_range), det_values, 'g-', 'LineWidth', 2);
hold on; grid on;
plot([-180 180], [0 0], 'r--', 'LineWidth', 1);
plot([0 0], [-1 1], 'r--', 'LineWidth', 1);
plot([180 180], [-1 1], 'r--', 'LineWidth', 1);
plot([-180 -180], [-1 1], 'r--', 'LineWidth', 1);

xlabel('q2 (degrees)');
ylabel('det(J)');
title('det(J) = L1 * L2 * sin(q2)');
text(0, 0.1, '특이점!', 'Color', 'r', 'FontWeight', 'bold');
text(180, 0.1, '특이점!', 'Color', 'r', 'FontWeight', 'bold');
text(-180, 0.1, '특이점!', 'Color', 'r', 'FontWeight', 'bold');
xlim([-180 180]);

%% 핵심 정리
fprintf('=== 핵심 정리 ===\n');
fprintf('1. 야코비안: 관절 속도 → 끝점 속도 변환 행렬\n');
fprintf('2. 역야코비안: 끝점 속도 → 관절 속도 (속도 제어에 필수)\n');
fprintf('3. det(J) = 0: 특이점 (역행렬 불가, 움직임 제한)\n');
fprintf('4. 속도 타원: 야코비안이 만드는 속도 공간의 모양\n');
fprintf('5. 2-Link 특이점: q2 = 0° 또는 180° (팔 완전 펴짐/접힘)\n');
