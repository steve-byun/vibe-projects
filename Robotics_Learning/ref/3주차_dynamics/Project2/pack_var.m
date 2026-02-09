function [param_kin,param_dyn,param_dyn_loadest] = pack_var(alpha,d,a,m,rc,Ic,I,n_dof,n_kin,n_dyn)

param_kin = zeros(n_dof*n_kin,1); param_dyn = zeros(n_dof*n_dyn,1); param_dyn_loadest = zeros(n_dof*n_dyn,1);
for i = 1:n_dof
    param_kin((i-1)*n_kin+1:i*n_kin,1) = [alpha(i); d(i); a(i)];
    param_dyn((i-1)*n_dyn+1:i*n_dyn,1) = [m{i}; rc{i}(:); Ic{i}(1); Ic{i}(5); Ic{i}(9); Ic{i}(4); Ic{i}(8); Ic{i}(7)];
    param_dyn_loadest((i-1)*n_dyn+1:i*n_dyn,1) = [m{i}; m{i}*rc{i}(:); I{i}(1); I{i}(5); I{i}(9); I{i}(4); I{i}(8); I{i}(7)];
end

end