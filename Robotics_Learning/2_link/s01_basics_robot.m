%% Step 1: 2-Link 로봇 만들기
% 목표: 2축 로봇의 여러 자세를 이해하기
clear; close all; clc;

%% 로봇 파라미터
L1 = 1.0;   % 링크1 길이
L2 = 0.8;   % 링크2 길이

%% 로봇 정의
link1 = Revolute('d', 0, 'a', L1, 'alpha', 0);
link2 = Revolute('d', 0, 'a', L2, 'alpha', 0);
robot = SerialLink([link1 link2], 'name', 'TwoLink');

%% 여러 자세 정의
poses = {
    [0, 0],         '팔 쭉 핌';
    [0, pi/2],      '팔꿈치 90°';
    [pi/2, 0],      '어깨 90°';
    [pi/4, -pi/4],  '대각선';
    [pi/2, pi/2],   '접힘';
};

%% 한 figure에 모든 자세 그리기
figure('Name', '2-Link Robot Poses', 'Position', [100 100 1200 800]);

for i = 1:size(poses, 1)
    subplot(2, 3, i);
    q = poses{i, 1};
    name = poses{i, 2};

    % FK로 각 점 위치 계산
    x0 = 0; y0 = 0;  % 베이스
    x1 = L1 * cos(q(1));
    y1 = L1 * sin(q(1));
    x2 = x1 + L2 * cos(q(1) + q(2));
    y2 = y1 + L2 * sin(q(1) + q(2));

    % 로봇 그리기
    hold on; grid on; axis equal;
    plot([x0 x1], [y0 y1], 'b-', 'LineWidth', 4);  % 링크1 (파랑)
    plot([x1 x2], [y1 y2], 'r-', 'LineWidth', 4);  % 링크2 (빨강)
    plot(x0, y0, 'ko', 'MarkerSize', 12, 'MarkerFaceColor', 'k');  % 베이스
    plot(x1, y1, 'bo', 'MarkerSize', 10, 'MarkerFaceColor', 'b');  % 관절1
    plot(x2, y2, 'ro', 'MarkerSize', 10, 'MarkerFaceColor', 'r');  % 끝점

    xlim([-2.5 2.5]); ylim([-2.5 2.5]);
    xlabel('X'); ylabel('Y');
    title(sprintf('%s\nq1=%.0f°, q2=%.0f° → (%.1f, %.1f)', ...
        name, rad2deg(q(1)), rad2deg(q(2)), x2, y2));
end

% 6번째 subplot: 도달 가능 영역
subplot(2, 3, 6);
hold on; grid on; axis equal;

% 외부 원 (팔 쭉 폈을 때)
theta = 0:0.01:2*pi;
plot((L1+L2)*cos(theta), (L1+L2)*sin(theta), 'g-', 'LineWidth', 2);

% 내부 원 (팔 접었을 때)
plot(abs(L1-L2)*cos(theta), abs(L1-L2)*sin(theta), 'g--', 'LineWidth', 2);

% 영역 채우기
fill([(L1+L2)*cos(theta), abs(L1-L2)*cos(fliplr(theta))], ...
     [(L1+L2)*sin(theta), abs(L1-L2)*sin(fliplr(theta))], ...
     'g', 'FaceAlpha', 0.3);

xlim([-2.5 2.5]); ylim([-2.5 2.5]);
xlabel('X'); ylabel('Y');
title(sprintf('도달 가능 영역\n%.1f ≤ r ≤ %.1f', abs(L1-L2), L1+L2));

%% 출력
fprintf('\n=== 2-Link Robot ===\n');
fprintf('L1 = %.1f m, L2 = %.1f m\n', L1, L2);
fprintf('도달 가능 거리: %.1f ~ %.1f m\n', abs(L1-L2), L1+L2);
fprintf('\n애니메이션 보려면: step1_animation 실행\n');
