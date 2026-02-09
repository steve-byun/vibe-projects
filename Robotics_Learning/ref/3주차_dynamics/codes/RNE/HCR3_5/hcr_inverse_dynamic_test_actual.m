function hcr_inverse_dynamic_test_actual()

clear; close all; clc;

mdl_HCR5;
robot = hcr5;
ts = 0.002;

data = load('SQE_Motion'); % 11300 17660 23200 29320 35440 41490 47590 53680 59720 65780 71860
idx_i = 11250; idx_f = 17600;
t = data.ScopeData_Axis0.get(1).Values.Time;
[qt,dqt,ddqt,act_torq,dyn_torq,fric_torq,ext_torq,resi_torq] = load_data(t,data,idx_i,idx_f);
t = (0:(length(qt.cmd)-1))'*ts;

[ddqt_c,ddqt_a] = kinematic_error_check(robot,qt.cmd,dqt.cmd,qt.act,dqt.act,t,ts);

% filter test
[qtf_cmd,dqtf_cmd,ddqtf_cmd,qtf_act,dqtf_act,ddqtf_act] = state_estimation(qt.cmd,qt.act);
kinematic_error_check(robot,qtf_cmd,dqtf_cmd,qtf_act,dqtf_act,t,ts);
[torq_c,torq_a,force_c,force_a] = dynamic_error_check(robot,qtf_cmd,dqtf_cmd,ddqtf_cmd,qtf_act,dqtf_act,ddqtf_act,t);

% dynamic check
torque_check(robot,qt.cmd,dqt.cmd,ddqt_c,qt.act,dqt.act,ddqt_a,act_torq,dyn_torq,fric_torq,ext_torq,resi_torq,t);

% [tauExt_list,Fc_list] = collision_observer(robot,qtf_cmd,dqtf_cmd,ddqtf_cmd,qtf_act,act_torq,fric_torq,t,ts);

% figure;
% subplot(321); plot(t,torq_c(:,1)-torq_n(:,1),'-',t,tauExt_list(:,1),'--'); 
% subplot(322); plot(t,torq_c(:,2)-torq_n(:,2),'-',t,tauExt_list(:,2),'--');
% subplot(323); plot(t,torq_c(:,3)-torq_n(:,3),'-',t,tauExt_list(:,3),'--'); 
% subplot(324); plot(t,torq_c(:,4)-torq_n(:,4),'-',t,tauExt_list(:,4),'--');
% subplot(325); plot(t,torq_c(:,5)-torq_n(:,5),'-',t,tauExt_list(:,5),'--'); 
% subplot(326); plot(t,torq_c(:,6)-torq_n(:,6),'-',t,tauExt_list(:,6),'--');


% [torq,force] = singularity_check_fn(robot,qt.cmd,dqt.cmd,ddqt,t,ts);

% torque_error_check(robot,qt.cmd,dqt.cmd,ddqt_c,qt.act,dqt.act,ddqt_a,act_torq,dyn_torq,fric_torq,ext_torq,t);

% torque_residual_check(robot,qt.cmd,dqt.cmd,ddqt_c,qt.act,dqt.act,ddqt_a,act_torq,dyn_torq,fric_torq,ext_torq,resi_torq,t);

% figure; robot.plot(qt.cmd);

end

function [torq_c,torq_a,force_c,force_a] = dynamic_error_check(robot,qt_c,dqt_c,ddqt_c,qt_a,dqt_a,ddqt_a,t)

n = length(t);
torq_c = zeros(n,6); force_c = zeros(n,6); 
torq_a = zeros(n,6); force_a = zeros(n,6); 
torq_n = zeros(n,6); 

for i = 1:n
    [torq_c(i,:)] = Compute_Torque(qt_c(i,:), dqt_c(i,:), ddqt_c(i,:), [deg2rad(0.0); 0], 0, [0, 0, 0]);
    J_c = robot.jacob0(qt_c(i,:));
    force_c(i,:) = J_c'\torq_c(i,:)';
    
    [torq_a(i,:)] = Compute_Torque(qt_a(i,:), dqt_a(i,:), ddqt_a(i,:), [deg2rad(0.0); 0], 0, [0, 0, 0]);
    J_a = robot.jacob0(qt_a(i,:));
    force_a(i,:) = J_a'\torq_a(i,:)';   
    
    torq_n(i,1:3) = torq_c(i,1:3) + 5*randn(size(torq_c(i,1:3)));
    torq_n(i,4:6) = torq_c(i,4:6) + randn(size(torq_c(i,4:6)));
end

figure;
subplot(221); plot(t,torq_c,'-',t,torq_a,':'); ylabel('torq');
subplot(222); plot(t,force_c,'-',t,force_a,':'); ylabel('force');
subplot(223); plot(t,torq_c-torq_a,'-'); ylabel('Err_{torq}');
subplot(224); plot(t,force_c-force_a,'-'); ylabel('Err_{force}');

end

function [qtf_cmd,dqtf_cmd,ddqtf_cmd,qtf_act,dqtf_act,ddqtf_act] = state_estimation(qt_cmd,qt_act)

qtf_cmd = zeros(size(qt_cmd)); dqtf_cmd = zeros(size(qt_cmd)); ddqtf_cmd = zeros(size(qt_cmd));
qtf_act = zeros(size(qt_act)); dqtf_act = zeros(size(qt_act)); ddqtf_act = zeros(size(qt_act));
for i = 1:6
    xf_cmd = motor_state_filtering(qt_cmd(:,i));
    qtf_cmd(:,i) = xf_cmd(1,:)';
    dqtf_cmd(:,i) = xf_cmd(2,:)';
    ddqtf_cmd(:,i) = xf_cmd(3,:)';
    xf_act = motor_state_filtering(qt_act(:,i));
    qtf_act(:,i) = xf_act(1,:)';
    dqtf_act(:,i) = xf_act(2,:)';
    ddqtf_act(:,i) = xf_act(3,:)';
end

end

function torque_check(robot,qt_c,dqt_c,ddqt_c,qt_a,dqt_a,ddqt_a,act_torq,dyn_torq,fric_torq,ext_torq,resi_torq,t)

figure;
subplot(321); plot(t,act_torq(:,1:3),'-'); legend('torq_{act1}','torq_{act2}','torq_{act3}'); grid on;
subplot(322); plot(t,act_torq(:,4:6),'-'); legend('torq_{act4}','torq_{act5}','torq_{act6}'); grid on;
subplot(323); plot(t,dyn_torq(:,1:3),'-'); legend('torq_{dyn1}','torq_{dyn2}','torq_{dyn3}'); grid on;
subplot(324); plot(t,dyn_torq(:,4:6),'-'); legend('torq_{dyn4}','torq_{dyn5}','torq_{dyn6}'); grid on;
subplot(325); plot(t,fric_torq(:,1:3),'-'); legend('torq_{fri1}','torq_{fri2}','torq_{fri3}'); grid on;
subplot(326); plot(t,fric_torq(:,4:6),'-'); legend('torq_{fri4}','torq_{fri5}','torq_{fri6}'); grid on;

figure;
subplot(221); plot(t,resi_torq(:,1:3),'-'); legend('torq_{resi1}','torq_{resi2}','torq_{resi3}'); grid on;
subplot(222); plot(t,resi_torq(:,4:6),'-'); legend('torq_{resi4}','torq_{resi5}','torq_{resi6}'); grid on;
subplot(223); plot(t,ext_torq(:,1:3),'-'); legend('torq_{ext1}','torq_{ext2}','torq_{ext3}'); grid on;
subplot(224); plot(t,ext_torq(:,4:6),'-'); legend('torq_{ext4}','torq_{ext5}','torq_{ext6}'); grid on;

end

function [ddqt_c,ddqt_a] = kinematic_error_check(robot,qt_c,dqt_c,qt_a,dqt_a,t,ts)

ddqt_c = [zeros(1,6); diff(dqt_c)/ts];
ddqt_a = [zeros(1,6); diff(dqt_a)/ts];

% cartesian space 
Xt_c = transl(robot.fkine(qt_c))*1000;
Xt_a = transl(robot.fkine(qt_a))*1000;

[a_c,v_c,p_c] = interpolation_arcLength(Xt_c,ts);
[a_a,v_a,p_a] = interpolation_arcLength(Xt_a,ts);

figure;
subplot(231); plot(t,p_c,'b-',t,p_a,'r:'); ylabel('pos'); 
subplot(232); plot(t,v_c,'b-',t,v_a,'r:'); ylabel('vel');
subplot(233); plot(t,a_c,'b-',t,a_a,'r:'); ylabel('acc');
subplot(234); plot(t,p_c-p_a,'b-'); ylabel('Err_{pos}');
subplot(235); plot(t,v_c-v_a,'b-'); ylabel('Err_{vel}'); 
subplot(236); plot(t,a_c-a_a,'b-'); ylabel('Err_{acc}');

% joint space 
% figure;
% subplot(241); plot(t,qt_c(:,1:3),'-',t,qt_a(:,1:3),':'); legend('q1','q2','q3'); grid on;
% subplot(242); plot(t,qt_c(:,4:6),'-',t,qt_a(:,4:6),':'); legend('q4','q5','q6'); grid on;
% subplot(243); plot(t,dqt_c(:,1:3),'-',t,dqt_a(:,1:3),':'); legend('dq1','dq2','dq3'); grid on;
% subplot(244); plot(t,dqt_c(:,4:6),'-',t,dqt_a(:,4:6),':'); legend('dq4','dq5','dq6'); grid on;
% subplot(245); plot(t,qt_c(:,1:3)-qt_a(:,1:3),'-'); legend('Err_{q1}','Err_{q2}','Err_{q3}'); grid on;
% subplot(246); plot(t,qt_c(:,4:6)-qt_a(:,4:6),'-'); legend('Err_{q4}','Err_{q5}','Err_{q6}'); grid on;
% subplot(247); plot(t,dqt_c(:,1:3)-dqt_a(:,1:3),'-'); legend('Err_{dq1}','Err_{dq2}','Err_{dq3}'); grid on;
% subplot(248); plot(t,dqt_c(:,4:6)-dqt_a(:,4:6),'-'); legend('Err_{dq4}','Err_{dq5}','Err_{dq6}'); grid on;

figure;
subplot(231); plot(t,qt_c,'-',t,qt_a,':'); ylabel('q'); grid on;
subplot(232); plot(t,dqt_c,'-',t,dqt_a,':'); ylabel('dq'); grid on;
subplot(233); plot(t,ddqt_c,'-',t,ddqt_a,':'); ylabel('ddq'); grid on;
subplot(234); plot(t,qt_c-qt_a,'-'); ylabel('Err_{q}'); grid on;
subplot(235); plot(t,dqt_c-dqt_a,'-'); ylabel('Err_{dq}'); grid on;
subplot(236); plot(t,ddqt_c-ddqt_a,'-'); ylabel('Err_{ddq}'); grid on;

end

function [torq,force,J] = singularity_check_fn(robot,qt,dqt,ddqt,t,ts)

n = length(qt);
J = zeros(6,6,n);
force = zeros(n,6);
force_new = zeros(n,6);
d = zeros(n,1);
m = zeros(n,1);
c = zeros(n,1);
rc = zeros(n,1);
limit = 0.03;
torq = zeros(n,6);

for i = 1:n

    [torq(i,:)] = Compute_Torque(qt(i,:), dqt(i,:), ddqt(i,:), [0; 0]);
    J(:,:,i) = robot.jacob0(qt(i,:));
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

figure_plot(qt,dqt,ddqt,torq,force,d,m,c,rc,t,ts);

end

function [qt,dqt,ddqt,torq_act,torq_dyn,torq_fri,torq_ext,torq_res] = load_data(t,data,idx_i,idx_f)

N = length(t);
dof = 6;
qt_num = 1; dqt_num = 2; ddqt_num = 3;
torq_act_num = 4; torq_dyn_num = 5; torq_fri_t_num = 6; torq_fri_num = 7; torq_ext_num = 8; torq_res_num = 9;
act_num = 1; cmd_num = 2;

data.ScopeData_Axis00 = data.ScopeData_Axis0;
qt.cmd = zeros(N,dof); qt.act = zeros(N,dof); dqt.cmd = zeros(N,dof); dqt.act = zeros(N,dof);  
ddqt = zeros(N,dof); torq_act = zeros(N,dof); torq_dyn = zeros(N,dof);
torq_fri = zeros(N,dof); torq_ext = zeros(N,dof); torq_res = zeros(N,dof);

for i = 1:dof
    if (i == 3)
        qt.cmd(:,i)   = eval(sprintf('data.ScopeData_Axis0%d.get(%d).Values.Data(:,%d)',i-1,qt_num,cmd_num));
        qt.act(:,i)   = eval(sprintf('data.ScopeData_Axis0%d.get(%d).Values.Data(:,%d)',i-1,qt_num,act_num));
        dqt.cmd(:,i)  = eval(sprintf('data.ScopeData_Axis0%d.get(%d).Values.Data(:,%d)',i-1,dqt_num,cmd_num));
        dqt.act(:,i)  = eval(sprintf('data.ScopeData_Axis0%d.get(%d).Values.Data(:,%d)',i-1,dqt_num,act_num));
        
        ddqt(:,i)     = eval(sprintf('data.ScopeData_Axis0%d.get(%d).Values.Data(:,%d)',i-1,ddqt_num,act_num));
        torq_act(:,i) = eval(sprintf('data.ScopeData_Axis0%d.get(%d).Values.Data(:,%d)',i-1,torq_act_num,act_num));
        torq_dyn(:,i) = eval(sprintf('data.ScopeData_Axis0%d.get(%d).Values.Data(:,%d)',i-1,torq_dyn_num,act_num));
        torq_fri_t(:,i) = eval(sprintf('data.ScopeData_Axis0%d.get(%d).Values.Data(:,%d)',i-1,torq_fri_t_num,act_num));
        torq_fri(:,i) = eval(sprintf('data.ScopeData_Axis0%d.get(%d).Values.Data(:,%d)',i-1,torq_fri_num,act_num));
        torq_ext(:,i) = eval(sprintf('data.ScopeData_Axis0%d.get(%d).Values.Data(:,%d)',i-1,torq_ext_num,act_num));
        torq_res(:,i) = eval(sprintf('data.ScopeData_Axis0%d.get(%d).Values.Data(:,%d)',i-1,torq_res_num,act_num));
    else
        qt.cmd(:,i)   = eval(sprintf('data.ScopeData_Axis0%d.get(%d).Values.Data(:,%d)',i-1,qt_num,cmd_num));
        qt.act(:,i)   = eval(sprintf('data.ScopeData_Axis0%d.get(%d).Values.Data(:,%d)',i-1,qt_num,act_num));
        dqt.cmd(:,i)  = eval(sprintf('data.ScopeData_Axis0%d.get(%d).Values.Data(:,%d)',i-1,dqt_num,cmd_num));
        dqt.act(:,i)  = eval(sprintf('data.ScopeData_Axis0%d.get(%d).Values.Data(:,%d)',i-1,dqt_num,act_num));
        
        ddqt(:,i)     = eval(sprintf('data.ScopeData_Axis0%d.get(%d).Values.Data(:,%d)',i-1,ddqt_num,act_num));
        torq_act(:,i) = eval(sprintf('data.ScopeData_Axis0%d.get(%d).Values.Data(:,%d)',i-1,torq_act_num,act_num));
        torq_dyn(:,i) = eval(sprintf('data.ScopeData_Axis0%d.get(%d).Values.Data(:,%d)',i-1,torq_dyn_num,act_num));
        torq_fri_t(:,i) = eval(sprintf('data.ScopeData_Axis0%d.get(%d).Values.Data(:,%d)',i-1,torq_fri_t_num,act_num));
        torq_fri(:,i) = eval(sprintf('data.ScopeData_Axis0%d.get(%d).Values.Data(:,%d)',i-1,torq_fri_num,act_num));
        torq_ext(:,i) = eval(sprintf('data.ScopeData_Axis0%d.get(%d).Values.Data(:,%d)',i-1,torq_ext_num,act_num));
        torq_res(:,i) = eval(sprintf('data.ScopeData_Axis0%d.get(%d).Values.Data(:,%d)',i-1,torq_res_num,act_num));
    end
end

qt.cmd = qt.cmd(idx_i:idx_f,:);
qt.act = qt.act(idx_i:idx_f,:);
dqt.cmd = dqt.cmd(idx_i:idx_f,:);
dqt.act = dqt.act(idx_i:idx_f,:);

ddqt = ddqt(idx_i:idx_f,:);
torq_act = torq_act(idx_i:idx_f,:);
torq_dyn = torq_dyn(idx_i:idx_f,:);
torq_fri = torq_fri(idx_i:idx_f,:);
torq_ext = torq_ext(idx_i:idx_f,:);
torq_res = torq_res(idx_i:idx_f,:);

end

function figure_plot(q,dq,ddq,Tor,force,d,m,c,rc,t,ts)

figure;
subplot(321); plot(t,q(:,1:3)); legend('q_1','q_2','q_3'); ylabel('joint angle');
subplot(322); plot(t,q(:,4:6)); legend('q_4','q_5','q_6');
subplot(323); plot(t,dq(:,1:3)); legend('dq_1','dq_2','dq_3'); ylabel('joint angular velocity');
subplot(324); plot(t,dq(:,4:6)); legend('dq_4','dq_5','dq_6');
subplot(325); plot(t,ddq(:,1:3)); legend('ddq_1','ddq_2','ddq_3'); ylabel('joint angular acceleration');
subplot(326); plot(t,ddq(:,4:6)); legend('ddq_4','ddq_5','ddq_6');

figure;
subplot(221); plot(t,Tor(:,1:3)); legend('T_1','T_2','T_3'); ylabel('joint torque');
subplot(222); plot(t,Tor(:,4:6)); legend('T_4','T_5','T_6');
subplot(223); plot(t,force(:,1:3)); legend('f_x','f_y','f_z'); ylabel('force');
subplot(224); plot(t,force(:,4:6)); legend('f_{rx}','f_{ry}','f_{rz}');

figure;
subplot(241); plot(t,force); subplot(242); plot(t,force); subplot(243); plot(t,force); subplot(244); plot(t,force);
subplot(245); plot(t,d); ylabel('det');
subplot(246); plot(t,m); ylabel('manipulability');
subplot(247); plot(t,c); ylabel('cond');
subplot(248); plot(t,rc); ylabel('rcond');

end

function [acc_k,feedrate_k,s_k] = interpolation_arcLength(data,ts)

delta_s_k = sqrt(sum(diff(data).^2,2));

s_k = zeros(length(delta_s_k)+1,1);
for i = 1:length(delta_s_k)
    s_k(i+1) = sum(delta_s_k(1:i));
end

feedrate_k = [0;delta_s_k/ts];
acc_k = [0;diff(feedrate_k)/ts];

end