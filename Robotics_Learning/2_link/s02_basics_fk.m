%% Step 2: 순기구학 (Forward Kinematics)
% 목표: 관절 각도 → 끝점 위치 계산
clear; close all; clc;

%% 로봇 정의
L1 = 1.0;
L2 = 0.8;

%% FK 공식 (2-Link)
fprintf('=== FK 공식 ===\n');
fprintf('x = L1*cos(q1) + L2*cos(q1+q2)\n');
fprintf('y = L1*sin(q1) + L2*sin(q1+q2)\n\n');

%% 예제 계산
examples = {
    [0, 0],      '팔 쭉 핌';
    [0, pi/2],   '팔꿈치 90°';
    [pi/2, 0],   '어깨 90°';
};

fprintf('=== 예제 ===\n');
for i = 1:size(examples, 1)
    q = examples{i, 1};
    name = examples{i, 2};
    x = L1*cos(q(1)) + L2*cos(q(1)+q(2));
    y = L1*sin(q(1)) + L2*sin(q(1)+q(2));
    fprintf('%s: q1=%.0f°, q2=%.0f° → (%.2f, %.2f)\n', ...
        name, rad2deg(q(1)), rad2deg(q(2)), x, y);
end

%% 시각화: q1 고정, q2 변화 → 끝점 궤적 + 로봇 표시
figure('Name', 'FK: q1 고정, q2 변화', 'Position', [100 100 1200 500]);

q1_values = [0, pi/4, pi/2];  % 0°, 45°, 90°
titles = {'q1 = 0°', 'q1 = 45°', 'q1 = 90°'};

for idx = 1:length(q1_values)
    subplot(1, 3, idx);
    hold on; grid on; axis equal;

    q1 = q1_values(idx);

    % 끝점 궤적 (q2: -180° ~ 180°)
    x_traj = [];
    y_traj = [];
    for q2 = -pi:0.05:pi
        x = L1*cos(q1) + L2*cos(q1+q2);
        y = L1*sin(q1) + L2*sin(q1+q2);
        x_traj = [x_traj, x];
        y_traj = [y_traj, y];
    end
    plot(x_traj, y_traj, 'g-');  % 궤적 (초록)

    % 링크1 위치 계산
    x0 = 0; y0 = 0;
    x1 = L1*cos(q1);
    y1 = L1*sin(q1);

    % 링크1 그리기 (베이스 → 관절)
    plot([x0 x1], [y0 y1], '-', 'Color', [1 0.8 0]);  % 노란색/주황
    plot(x0, y0, 'wo', 'MarkerSize', 8, 'MarkerFaceColor', 'w');  % 베이스
    plot(x1, y1, 'ro', 'MarkerSize', 8, 'MarkerFaceColor', 'r');  % 관절

    % 링크2 예시 2개만 (그림처럼)
    q2_examples = [pi/4, -pi/2];  % 45°, -90°
    colors = {[1 0.4 0.7], [0.4 1 1]};  % 밝은 핑크, 밝은 시안

    for j = 1:length(q2_examples)
        q2 = q2_examples(j);
        x2 = x1 + L2*cos(q1+q2);
        y2 = y1 + L2*sin(q1+q2);
        plot([x1 x2], [y1 y2], '-', 'Color', colors{j});
        plot(x2, y2, 'o', 'Color', colors{j}, 'MarkerFaceColor', colors{j});
    end

    xlim([-2.5 2.5]); ylim([-2.5 2.5]);
    xlabel('X'); ylabel('Y');
    title(sprintf('%s\n링크1 고정, 링크2만 회전', titles{idx}));

    % 범례
    if idx == 1
        h1 = plot(nan, nan, '-', 'Color', [1 0.8 0]);
        h2 = plot(nan, nan, 'ro', 'MarkerFaceColor', 'r');
        h3 = plot(nan, nan, 'g-');
        legend([h1 h2 h3], {'링크1', '관절 (원 중심)', '끝점 궤적'}, 'Location', 'southwest');
    end
end

fprintf('\n=== 핵심 ===\n');
fprintf('q1 고정 → 링크1 끝점이 원의 중심\n');
fprintf('q2 변화 → 링크2가 회전하며 원을 그림\n');
fprintf('원의 반지름 = L2 = %.1f\n', L2);
