function [alpha,d,a,m,rc,Ic,mrc,I] = unpack_var(param_kin,param_dyn,param_dyn_loadest,n_dof,n_dh,n_dyn)

alpha = zeros(n_dof,1); d = zeros(n_dof,1); a = zeros(n_dof,1);
m = cell(n_dof,1); rc = cell(n_dof,1); Ic = cell(n_dof,1);
mrc = cell(n_dof,1); I = cell(n_dof,1);
for i = 1:n_dof
    i1 = (i-1)*(n_dh-1);
    i2 = (i-1)*n_dyn;
    alpha(i) = param_kin(i1+1);
    d(i) = param_kin(i1+2);
    a(i) = param_kin(i1+3);
    m{i} = param_dyn(i2+1);
    rc{i} = param_dyn(i2+2:i2+4);
    Ic{i} = [
        param_dyn(i2+5)  param_dyn(i2+8) param_dyn(i2+10); 
        param_dyn(i2+8)  param_dyn(i2+6) param_dyn(i2+9); 
        param_dyn(i2+10) param_dyn(i2+9) param_dyn(i2+7)];
    mrc{i} = param_dyn_loadest(i2+2:i2+4);
    I{i} = [
        param_dyn_loadest(i2+5)  param_dyn_loadest(i2+8) param_dyn_loadest(i2+10);
        param_dyn_loadest(i2+8)  param_dyn_loadest(i2+6) param_dyn_loadest(i2+9);
        param_dyn_loadest(i2+10) param_dyn_loadest(i2+9) param_dyn_loadest(i2+7)];
end

end