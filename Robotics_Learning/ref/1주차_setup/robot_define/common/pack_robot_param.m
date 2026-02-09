function [param_kin,param_dyn,param_dyn_loadest] = pack_robot_param(link_param,n_dof,n_dh,n_dyn)

param_kin = zeros(n_dof*(n_dh-1),1); param_dyn = zeros(n_dof*n_dyn,1); param_dyn_loadest = zeros(n_dof*n_dyn,1);
for i = 1:n_dof
    param_kin((i-1)*(n_dh-1)+1:i*(n_dh-1),1) = [link_param{i}.alpha; link_param{i}.d; link_param{i}.a];
    param_dyn((i-1)*n_dyn+1:i*n_dyn,1) = [link_param{i}.m; link_param{i}.rc(:); ...
        link_param{i}.Ic(1); link_param{i}.Ic(5); link_param{i}.Ic(9); ...
        link_param{i}.Ic(4); link_param{i}.Ic(8); link_param{i}.Ic(7)];
    param_dyn_loadest((i-1)*n_dyn+1:i*n_dyn,1) = [link_param{i}.m; link_param{i}.m*link_param{i}.rc(:); ...
        link_param{i}.I(1); link_param{i}.I(5); link_param{i}.I(9); ...
        link_param{i}.I(4); link_param{i}.I(8); link_param{i}.I(7)];
end

end