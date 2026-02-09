function transformationMatrix = HCR3_5_12_forward_kinematics(q,DHParameter)

n_dof = length(q);
T = zeros(4,4,n_dof);
transformationMatrix = eye(4);
for i = 1:n_dof
    T(:,:,i) = trans_mat(q(i) + DHParameter.theta(i)+ DHParameter.thetaOffset(i), DHParameter.d(i), DHParameter.a(i), DHParameter.alpha(i));   
    transformationMatrix = transformationMatrix * T(:,:,i);
end
   
end