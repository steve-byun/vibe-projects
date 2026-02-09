function [pResult,solExist] = HCR3_5_12_inverse_kinematics_closed(T,referenceAngleRad,setPosture,dhNominal,n_dof,n_sol,isHCH12Model1or2)

pResult = nan*ones(n_dof,n_sol);
solExist = false*ones(n_sol,1);

if (uint16(setPosture(1)) == uint16(123) || uint16(setPosture(1)) == uint16(456)) % solution with reference angles
    [pResult(:,1), solExist(1)] = HCR_inverse_kinematics_closed(T,referenceAngleRad,setPosture,isHCH12Model1or2,dhNominal);
elseif (uint16(setPosture(1)) == uint16(789)) % all possible solutions
    [pResult(:,1), solExist(1)] = HCR_inverse_kinematics_closed(T,referenceAngleRad,uint16([setPosture(1); 0; 0; 0]),isHCH12Model1or2,dhNominal);
    [pResult(:,2), solExist(2)] = HCR_inverse_kinematics_closed(T,referenceAngleRad,uint16([setPosture(1); 0; 0; 1]),isHCH12Model1or2,dhNominal);
    [pResult(:,3), solExist(3)] = HCR_inverse_kinematics_closed(T,referenceAngleRad,uint16([setPosture(1); 0; 1; 0]),isHCH12Model1or2,dhNominal);
    [pResult(:,4), solExist(4)] = HCR_inverse_kinematics_closed(T,referenceAngleRad,uint16([setPosture(1); 0; 1; 1]),isHCH12Model1or2,dhNominal);
    [pResult(:,5), solExist(5)] = HCR_inverse_kinematics_closed(T,referenceAngleRad,uint16([setPosture(1); 1; 0; 0]),isHCH12Model1or2,dhNominal);
    [pResult(:,6), solExist(6)] = HCR_inverse_kinematics_closed(T,referenceAngleRad,uint16([setPosture(1); 1; 0; 1]),isHCH12Model1or2,dhNominal);
    [pResult(:,7), solExist(7)] = HCR_inverse_kinematics_closed(T,referenceAngleRad,uint16([setPosture(1); 1; 1; 0]),isHCH12Model1or2,dhNominal);
    [pResult(:,8), solExist(8)] = HCR_inverse_kinematics_closed(T,referenceAngleRad,uint16([setPosture(1); 1; 1; 1]),isHCH12Model1or2,dhNominal);
else
    
end

end

function [pResult, solExist] = HCR_inverse_kinematics_closed(T,referenceAngleRad,setPosture,isHCH12Model1or2,dhNominal)

if (isHCH12Model1or2)
    [pResult, solExist] = HCR12_inverse_kinematics_closed(T,referenceAngleRad,setPosture,dhNominal);
else
    [pResult, solExist] = HCR3_5_inverse_kinematics_closed(T,referenceAngleRad,setPosture,dhNominal);
end
    
end