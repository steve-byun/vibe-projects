function test_ik_closed

clear; close all; clc;

[hcr3params,hcr5params,hcr12params] = HCR_1gen_parameters;
n_dof = 6; n_sol = 8;
n_test = 5000000;
error_tol = 1E-11;

for i = 1:n_test
    [q_hcr3,q_hcr5,q_hcr12] = pick_random_angle();
    q_hcr3_rd = q_hcr3+0.01*randn(n_dof,1);
    q_hcr5_rd = q_hcr5+0.01*randn(n_dof,1);
    q_hcr12_rd = q_hcr12+0.01*randn(n_dof,1);
    
    qn_min = 0.1; qn_max = 0.6;
    q0_hcr3_rd = qn_min*ones(size(q_hcr3_rd)) + (qn_max-qn_min).*rand(size(q_hcr3_rd)) + q_hcr3_rd;
    q0_hcr5_rd = qn_min*ones(size(q_hcr5_rd)) + (qn_max-qn_min).*rand(size(q_hcr5_rd)) + q_hcr5_rd;
    q0_hcr12_rd = qn_min*ones(size(q_hcr12_rd)) + (qn_max-qn_min).*rand(size(q_hcr12_rd)) + q_hcr12_rd;
          
    % hcr3
    isHCH12Model1or2 = false;
    test_pass3 = test_robot(q_hcr3_rd,q0_hcr3_rd,hcr3params.dh,n_dof,n_sol,isHCH12Model1or2,error_tol);
    if ~test_pass3
%         disp('hcr3 debugging');
%         pause;
%         test_pass3 = test_robot(q_hcr3_rd,q0_hcr3_rd,hcr3params.dh,n_dof,n_sol,isHCH12Model1or2,error_tol);
%         error('hcr3 test fail');
    end
    
    % hcr5
    isHCH12Model1or2 = false;
    test_pass5 = test_robot(q_hcr5_rd,q0_hcr5_rd,hcr5params.dh,n_dof,n_sol,isHCH12Model1or2,error_tol);
    if ~test_pass5
%         disp('hcr5 debugging');
%         pause;
%         test_pass5 = test_robot(q_hcr5_rd,q0_hcr5_rd,hcr5params.dh,n_dof,n_sol,isHCH12Model1or2,error_tol);
%         error('hcr5 test fail');
    end
    
    % hcr12
    isHCH12Model1or2 = true;
    test_pass12 = test_robot(q_hcr12_rd,q0_hcr12_rd,hcr12params.dh,n_dof,n_sol,isHCH12Model1or2,error_tol);
    if ~test_pass12
%         disp('hcr12 debugging');
%         pause;
%         test_pass12 = test_robot(q_hcr12_rd,q0_hcr12_rd,hcr12params.dh,n_dof,n_sol,isHCH12Model1or2,error_tol);
%         error('hcr12 test fail');
    end
end

end

function test_pass = test_robot(q,q0,dh,n_dof,n_sol,isHCH12Model1or2,error_tol)

test_pass = true;

T0 = HCR3_5_12_forward_kinematics(q,dh);

[q_ref,solExist_ref] = HCR3_5_12_inverse_kinematics_closed(T0,q0,uint16([123;0;0;0]),dh,n_dof,n_sol,isHCH12Model1or2);
if solExist_ref(1)
    Tsol_ref = HCR3_5_12_forward_kinematics(q_ref(:,1),dh);
    if ( norm(kinematicDifferenceVector(Tsol_ref,T0)) > error_tol)
        disp(norm(kinematicDifferenceVector(Tsol_ref,T0)))
        test_pass = false;
    end
end

[q_all,solExist_all] = HCR3_5_12_inverse_kinematics_closed(T0,q0,uint16([789;0;0;0]),dh,n_dof,n_sol,isHCH12Model1or2);
for i = 1:n_sol
    if solExist_all(i) == true
        Tsol_3_all = HCR3_5_12_forward_kinematics(q_all(:,i),dh);
        if ( norm(kinematicDifferenceVector(Tsol_3_all,T0)) > error_tol)
            disp(norm( kinematicDifferenceVector(Tsol_3_all,T0)))
            test_pass = false;
        end
    end
end

end