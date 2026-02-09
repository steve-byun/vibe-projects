clear all; close all; clc;

load dyn_2dof.mat;
name = sprintf('%ddofs',n_dof);

disp('C code generation files : -----------------------------------------')

q = zeros(n_dof, 1); 
dotq = zeros(n_dof, 1); 
ddotq = zeros(n_dof, 1);

param_grav = zeros(3, 1);
param_kin = zeros(n_dof*(n_dh-1), 1);
param_dyn = zeros(n_dof*n_dyn, 1);
param_dyn_load = zeros(n_dyn, 1);
param_dyn_load_est = zeros(n_dof*n_dyn, 1);
tauL = zeros(n_dof, 1);

disp('codegen - g : ')
g_gen = {sprintf('g_%ddofs',n_dof), '-args', '{q , param_grav, param_kin, param_dyn}'};
codegen(g_gen{:}); 

disp('codegen - M : ')
M_gen = {sprintf('M_%ddofs',n_dof), '-args', '{q , param_kin, param_dyn}'};
codegen(M_gen{:});

disp('codegen - C : ')
C_gen = {sprintf('C_%ddofs',n_dof), '-args', '{q , dotq, param_kin, param_dyn}'};
codegen(C_gen{:}); 

disp('codegen - Phi : ')
Phi_gen = {sprintf('Phi_%ddofs',n_dof), '-args', '{param_dyn}'};
codegen(Phi_gen{:}); 

disp('codegen - Phi_without_load : ')
Phi_without_load_gen = {sprintf('Phi_without_load_%ddofs',n_dof), '-args', '{param_dyn_load_est}'};
codegen(g_gen{:}); 

disp('codegen - Phi_with_load : ')
Phi_with_load_gen = {sprintf('Phi_with_load_%ddofs',n_dof), '-args', '{param_dyn_load_est, param_dyn_load}'};
codegen(Phi_with_load_gen{:}); 

disp('codegen - error_Phi : ')
error_Phi_gen = {sprintf('error_Phi_%ddofs',n_dof), '-args', '{param_dyn_load_est, param_dyn_load}'};
codegen(error_Phi_gen{:}); 

disp('codegen - grad_error_Phi : ')
grad_error_Phi_gen = {sprintf('grad_error_Phi_%ddofs',n_dof), '-args', '{param_dyn_load_est, param_dyn_load}'};
codegen(grad_error_Phi_gen{:}); 

disp('codegen - W : ')
W_q_dotq_ddotq_gen = {sprintf('W_%ddofs',n_dof), '-args', '{q , dotq, ddotq, param_grav, param_kin}'};
codegen(W_q_dotq_ddotq_gen{:}); 

disp('codegen - error_tauL : ')
error_tauL_gen = {sprintf('error_tauL_%ddofs',n_dof), '-args', '{tauL, q , dotq, ddotq, param_grav, param_kin, param_dyn_load_est, param_dyn_load}'};
codegen(error_tauL_gen{:}); 

disp('codegen - grad_error_tauL_wrt_pL : ')
grad_error_tauL_wrt_pL_gen = {sprintf('grad_error_tauL_wrt_pL_%ddofs',n_dof), '-args', '{q , dotq, ddotq, param_grav, param_kin}'};
codegen(grad_error_tauL_wrt_pL_gen{:}); 
