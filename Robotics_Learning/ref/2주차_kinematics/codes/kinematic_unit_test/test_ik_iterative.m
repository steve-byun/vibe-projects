function test_ik_iterative

clear; close all; clc;

[hcr3params,hcr5params,hcr12params] = HCR_1gen_parameters;
[hcr3qtest,hcr5qtest,hcr12qtest] = pick_random_angle();
mdl_HCR3;
mdl_HCR5;
mdl_HCR12;

% hcr3
param = hcr3params; qtest = hcr3qtest; isHCH12Model1or2 = false; n_test_dh = 10000000; n_test_q = 5000000; robot = hcr3;
test_by_model(param,qtest,isHCH12Model1or2,n_test_dh,n_test_q,robot);

% % hcr5
% param = hcr5params; qtest = hcr5qtest; isHCH12Model1or2 = false; n_test_dh = 100000; n_test_q = 50000; robot = hcr5;
% test_by_model(param,qtest,isHCH12Model1or2,n_test_dh,n_test_q,robot);

% % hcr12
% param = hcr12params; qtest = hcr12qtest; isHCH12Model1or2 = true; n_test_dh = 100000; n_test_q = 50000; robot = hcr12; robot.offset = [0 pi/2 0 0 0 0];
% test_by_model(param,qtest,isHCH12Model1or2,n_test_dh,n_test_q,robot);

end

function test_by_model(param,qtest,isHCH12Model1or2,n_test_dh,n_test_q,robot)

n_dof = 6; n_sol = 8;

[idx_save,dh_save,iteration_save] = test_random_dhparams(param,qtest,isHCH12Model1or2,n_test_dh);
isempty(idx_save)

[q_random_save,q0_save,dh_save] = test_random_q(param,isHCH12Model1or2,n_test_q,n_dof,n_sol);
if ~isempty(dh_save)
    q_test_q_save = [];
    for i = 1:size(dh_save,1)
        q = q_random_save(:,i);
        q0 = q0_save(:,i);
        noised_dh = dh_save{i};
        q_test_random = degug_test_random_q(q,q0,noised_dh,param,isHCH12Model1or2,n_dof,n_sol);
        q_test_q_save = [q_test_q_save q_test_random];
    end
    figure; robot.plot(q_test_q_save','delay',2.0, 'view','xy');
end

end

function [idx_save,dh_save,iteration_save] = test_random_dhparams(param,qtest,isHCH12Model1or2,n_test_dh)

q = qtest;
dh = param.dh;
T0 = HCR3_5_12_forward_kinematics(q,dh);
qn_min = 0.1; qn_max = 0.6;
q0 = qn_min*ones(size(q)) + (qn_max-qn_min).*rand(size(q)) + q;

[noised_dh,e_xyz] = noised_dh_params(dh,q,n_test_dh,0.01);

idx_save = []; iteration_save = []; dh_save = {}; 
for i = 1:n_test_dh
    noised_dh_step.a = noised_dh.a(:,i);
    noised_dh_step.alpha = noised_dh.alpha(:,i);
    noised_dh_step.d = noised_dh.d(:,i);
    noised_dh_step.theta = noised_dh.theta(:,i);
    noised_dh_step.thetaOffset = noised_dh.thetaOffset(:,i);
    
    [q_ref,solExist,xyzError,orientationError,iteration] = HCR3_5_12_inverse_kinematics_iterative(T0,q0,uint16([123;0;0;0]),dh,noised_dh_step,isHCH12Model1or2,1e-10,10);

    if iteration(1) >= 5
        iteration_save = [iteration_save iteration(1)];
    end
    
    if ~solExist
        idx_save = [idx_save i];
        dh_save = cat(1,dh_save,noised_dh);
    end
end

end

function [q_random_save,q0_save,dh_save] = test_random_q(param,isHCH12Model1or2,n_test_q,n_dof,n_sol)

q = param.home;
dh = param.dh;

q_random_save = []; q0_save = []; e_xyz_save = []; dh_save = {};
for i = 1:n_test_q
    q_random = q + 0.2*rand(n_dof,1);
    T0 = HCR3_5_12_forward_kinematics(q_random,dh);
    qn_min = 0.1; qn_max = 0.6;
    q0 = qn_min*ones(size(q_random)) + (qn_max-qn_min).*rand(size(q_random)) + q_random;
    [qc_all,solc_all] = HCR3_5_12_inverse_kinematics_closed(T0,q0,uint16([789;0;0;0]),dh,n_dof,n_sol,isHCH12Model1or2);
    
    [noised_dh,e_xyz] = noised_dh_params(dh,q,1,0.01);
    [qi_all,soli_all,xyzError,orientationError,iteration] = HCR3_5_12_inverse_kinematics_iterative(T0,q0,uint16([789;0;0;0]),dh,noised_dh,isHCH12Model1or2,1e-10,10);
    
    check_solExist = (solc_all == soli_all);
    if (uint8(sum(check_solExist)) ~= uint8(n_sol))
        q_random_save = [q_random_save q_random];
        q0_save = [q0_save q0];
        e_xyz_save = [e_xyz_save e_xyz];
        dh_save = cat(1,dh_save,noised_dh);
    end
end

end

function q_save = degug_test_random_q(q,q0,noised_dh,param,isHCH12Model1or2,n_dof,n_sol)

dh = param.dh;
T = HCR3_5_12_forward_kinematics(q,dh);

[qc_all,solc_all] = HCR3_5_12_inverse_kinematics_closed(T,q0,uint16([789;0;0;0]),dh,n_dof,n_sol,isHCH12Model1or2);
[qi_all,soli_all,xyzError,orientationError,iteration] = HCR3_5_12_inverse_kinematics_iterative(T,q0,uint16([789;0;0;0]),dh,noised_dh,isHCH12Model1or2,1e-10,10);

q_save = [];
for i = 1:n_sol
    if (solc_all(i) ~= soli_all(i))
        q_save = [q_save qc_all(:,i)];
    end
end

end

function [noised_dh,e_xyz] = noised_dh_params(dh,q0,N,scale)

stdev_a = 0.2;
stdev_d = 0.2;
stdev_al = 0.2;
stdev_th = 0.2;

noised_dh.a = dh.a*ones(1,N) + stdev_a*randn(length(dh.a),N)*scale;
noised_dh.d = dh.d*ones(1,N) + stdev_d*randn(length(dh.d),N)*scale;
noised_dh.alpha = dh.alpha*ones(1,N) + stdev_al*randn(length(dh.alpha),N)*scale;
noised_dh.theta = dh.theta*ones(1,N) + stdev_th*randn(length(dh.theta),N)*scale;
noised_dh.thetaOffset = dh.thetaOffset*ones(1,N);

e_xyz = zeros(N,1);
for i = 1:N   
    noised_dh_step.a = noised_dh.a(:,i);
    noised_dh_step.alpha = noised_dh.alpha(:,i);
    noised_dh_step.d = noised_dh.d(:,i);
    noised_dh_step.theta = noised_dh.theta(:,i);
    noised_dh_step.thetaOffset = noised_dh.thetaOffset(:,i);
    
    T1 = HCR3_5_12_forward_kinematics(q0,dh);
    T2 = HCR3_5_12_forward_kinematics(q0,noised_dh_step);
    e = kinematicDifferenceVector(T1,T2);
    e_xyz(i) = norm(e(1:3))*1E+3;
end

end