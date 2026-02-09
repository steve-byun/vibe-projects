function [pResult,solExist,xyzError,orientationError,iteration] = HCR3_5_12_inverse_kinematics_iterative(T,referenceAngleRad,setPosture,dhNominal,dhActual,isHCH12Model1or2,errorTol,maxIteration)

n_dof = 6;
n_sol = 8;
pResult  = nan*ones(n_dof,n_sol);
solExist = false*ones(n_sol,1);
xyzError = nan*ones(n_sol,1);
orientationError = nan*ones(n_sol,1);
iteration = uint16(zeros(n_sol,1));

[initialAngleRad_all,initialSolExist] = HCR3_5_12_inverse_kinematics_closed(T,referenceAngleRad,setPosture,dhNominal,n_dof,n_sol,isHCH12Model1or2);
for i = 1:n_sol   
   if (initialSolExist(i) == true)
       [pResult_step,solExist_step,xyzError_step,orientationError_step,iteration_step] = HCR_inverse_kinematics_iterative(T,initialAngleRad_all(:,i),dhActual,isHCH12Model1or2,errorTol,maxIteration,n_dof,n_sol);      
       pResult(:,i) = pResult_step;
       solExist(i) = solExist_step; 
       xyzError(i) = xyzError_step;
       orientationError(i) = orientationError_step;
       iteration(i) = iteration_step;
   end
end

end

function [pResult_step,solExist_step,xyzError_step,orientationError_step,iteration_step] = HCR_inverse_kinematics_iterative(T,initialAngleRad,dhActual,isHCH12Model1or2,errorTol,maxIteration,n_dof,n_sol)

pResult_step = nan*ones(n_dof,1);
xyzError_step = nan;
orientationError_step = nan;
solExist_step = false;
iteration_step = uint16(0);
H_fake_old  = T;
H_aprox_old = T;
while (uint16(iteration_step) < uint16(maxIteration))
    H_fake = (H_fake_old/H_aprox_old)*T;
    [q_aprox,closedIK_sol_exist] = HCR3_5_12_inverse_kinematics_closed(H_fake,initialAngleRad,uint16([123; 0; 0; 0]),dhActual,n_dof,n_sol,isHCH12Model1or2);
    if (~closedIK_sol_exist(1))
        break;
    end
    H_aprox = HCR3_5_12_forward_kinematics(q_aprox(:,1),dhActual);
    T_error_vec = kinematicDifferenceVector(H_aprox,T);
    E = norm(T_error_vec);
    if (abs(E) < errorTol)
        xyzError_step = norm(T_error_vec(1:3),2);
        orientationError_step = norm(T_error_vec(4:6),2);
        pResult_step = q_aprox(:,1);
        solExist_step = true;
        break;
    else
        xyzError_step = norm(T_error_vec(1:3),2);
        orientationError_step = norm(T_error_vec(4:6),2);
        pResult_step = q_aprox(:,1);
    end
    H_fake_old = H_fake;
    H_aprox_old = H_aprox;
    iteration_step = iteration_step + uint16(1);
    if (iteration_step == uint16(95))
       disp('here') ;
    end
end

end