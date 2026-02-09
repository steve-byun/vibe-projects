function hcr_inverse_dynamic_test()

clear; close all; clc;

mdl_HCR5;
robot = hcr5;
figure; robot.plot(deg2rad([0 -90 -90 -90 90 0]));

% [qt,dqt,ddqt] = circular_move_test(0.5,2*pi,0,2*pi,5*pi,0.5,0.002,hcr5);
q0 = deg2rad([0 -180 90 -90 90 0]);
q1 = deg2rad([0 -90 -90 -90 90 0]);
qd0 = zeros(1,6);
qd1 = zeros(1,6);

[qt,dqt,ddqt] = joint_move_test(q0,q1,qd0,qd1,500,hcr5);

n = length(qt);
torq = zeros(n,6);
J = zeros(6,6,n);
force = zeros(n,6);
force_new = zeros(n,6);
d = zeros(n,1);
m = zeros(n,1);
c = zeros(n,1);
rc = zeros(n,1);
limit = 0.03;

 for i = 1:n
    [torq(i,:)] = Compute_Torque5_1gen(qt(i,:), dqt(i,:), ddqt(i,:), [0; 0], 0, [0; 0; 0]);
    J(:,:,i) = hcr5.jacob0(qt(i,:));
    force(i,:) = J(:,:,i)'\torq(i,:)';
    d(i) = det(J(:,:,i));
    m(i) = maniplty(robot, qt(i,:), 'axes', 'all');
    c(i) = cond(J(:,:,i));
    rc(i) = rcond(J(:,:,i));
    
    if (m(i) < limit)
        force_new(i,:) = nan*ones(1,6);
    else
        force_new(i,:) = force(i,:);
    end
    
end

figure_plot(qt,dqt,ddqt,torq,force,d,m,c,rc);
figure; plot(force_new); ylabel('force');
legend('f_x','f_y','f_z','f_{rx}','f_{ry}','f_{rz}');

end

function [qt,dqt,ddqt] = joint_move_test(q_0,q_f,dq_0,dq_f,num_of_interp,robot)

[qt,dqt,ddqt] = jtraj(q_0,q_f,num_of_interp,dq_0,dq_f);
figure; robot.name = 'hcr5_j';

robot.plot(qt);

end

function figure_plot(q,dq,ddq,Tor,force,d,m,c,rc)

figure;
subplot(321); plot(q(:,1:3)); legend('q_1','q_2','q_3'); ylabel('joint angle');
subplot(322); plot(q(:,4:6)); legend('q_4','q_5','q_6');
subplot(323); plot(dq(:,1:3)); legend('dq_1','dq_2','dq_3'); ylabel('joint angular velocity');
subplot(324); plot(dq(:,4:6)); legend('dq_4','dq_5','dq_6');
subplot(325); plot(ddq(:,1:3)); legend('ddq_1','ddq_2','ddq_3'); ylabel('joint angular acceleration');
subplot(326); plot(ddq(:,4:6)); legend('ddq_4','ddq_5','ddq_6');

figure;
subplot(221); plot(Tor(:,1:3)); legend('T_1','T_2','T_3'); ylabel('joint torque');
subplot(222); plot(Tor(:,4:6)); legend('T_4','T_5','T_6');
subplot(223); plot(force(:,1:3)); legend('f_x','f_y','f_z'); ylabel('force');
subplot(224); plot(force(:,4:6)); legend('f_{rx}','f_{ry}','f_{rz}');

figure;
subplot(241); plot(force); subplot(242); plot(force); subplot(243); plot(force); subplot(244); plot(force);
subplot(245); plot(d); ylabel('det');
subplot(246); plot(m); ylabel('manipulability');
subplot(247); plot(c); ylabel('cond');
subplot(248); plot(rc); ylabel('rcond');

end

function [inv_jacob,inv_jacob1] = inverse_jacobian(J,opt,param)

if opt.trans
    inv_jacob = jacobian_transpose_method(J);
    inv_jacob1 = inv_jacob;
elseif opt.pdi
    [inv_jacob, inv_jacob1] = pseudo_inverse_method(J);
elseif opt.dls
    [inv_jacob, inv_jacob1] = damped_least_squares_method(J,param.lambda);
elseif opt.svd
    [inv_jacob, inv_jacob1] = singular_value_decomposition_method(J);
else
    inv_jacob = pinv(J);
    inv_jacob1 = inv_jacob;
end

end

function inv_J = jacobian_transpose_method(J)

inv_J = J';

end

function [inv_J, inv_J1] = pseudo_inverse_method(J)

[n_row,n_col] = size(J);

if (n_row > n_col)
    inv_J1 = inv(J'*J)*J';
    inv_J = (J'*J)\J';
else
    inv_J1 = J'*inv(J*J');
    inv_J = J'/(J*J');
end

end

function [inv_J, inv_J1] = damped_least_squares_method(J,lamda)

[n_row,n_col] = size(J);

if (n_row > n_col)
    inv_J1 = inv(J'*J + lamda^2*eye(n_col,n_col))*J';
    inv_J = (J'*J + lamda^2*eye(n_col,n_col))\J';
else
    inv_J1 = J'*inv(J*J' + lamda^2*eye(n_row,n_row));
    inv_J = J'/(J*J' + lamda^2*eye(n_row,n_row));
end

end

function [inv_J, inv_J1] = singular_value_decomposition_method(J)

[U,S,V] = svd(J);
inv_J = inv(U*S*V');
inv_J1 = pinv(J); % provides a least squares solution for which |J*dot(q) - v| is smallest

end