clear; close all; clc;

load dyn_2dof.mat;
name = sprintf('%ddofs',n_dof);

disp('matlabfunction : ---------------------------------------------------')

disp('matlabfunction - g : ')
matlabFunction(g_q,'file',['g_' name],'vars',{q , param_grav, param_kin, param_dyn});

disp('matlabfunction - M : ')
matlabFunction(M_q,'file',['M_' name],'vars',{q , param_kin, param_dyn});

disp('matlabfunction - C : ')
matlabFunction(C_q_dotq,'file',['C_' name],'vars',{q , dotq, param_kin, param_dyn});

disp('matlabfunction - Phi : ')
matlabFunction(Phi,'file',['Phi_' name],'vars',{param_dyn});

disp('matlabfunction - Phi_without_load : ')
matlabFunction(Phi_without_load,'file',['Phi_without_load_' name],'vars',{param_dyn_load_est});

disp('matlabfunction - Phi_with_load : ')
matlabFunction(Phi_with_load,'file',['Phi_with_load_' name],'vars',{param_dyn_load_est, param_dyn_load});

disp('matlabfunction - error_Phi : ')
matlabFunction(error_Phi,'file',['error_Phi_' name],'vars',{param_dyn_load_est, param_dyn_load});

disp('matlabfunction - grad_error_Phi : ')
matlabFunction(grad_error_Phi,'file',['grad_error_Phi_' name],'vars',{param_dyn_load_est, param_dyn_load});

disp('matlabfunction - W : ')
matlabFunction(W_q_dotq_ddotq,'file',['W_' name],'vars',{q , dotq, ddotq, param_grav, param_kin});

disp('matlabfunction - error_tauL : ')
matlabFunction(error_tauL,'file',['error_tauL_' name],'vars',{tauL, q , dotq, ddotq, param_grav, param_kin, param_dyn_load_est, param_dyn_load});

disp('matlabfunction - grad_error_tauL_wrt_pL : ')
matlabFunction(grad_error_tauL_wrt_pL,'file',['grad_error_tauL_wrt_pL_' name],'vars',{q , dotq, ddotq, param_grav, param_kin});
