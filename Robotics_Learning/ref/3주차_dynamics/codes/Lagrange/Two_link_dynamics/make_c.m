clear; close all; clc;

load dyn_2dof.mat;
name = sprintf('%ddofs',n_dof);

disp('c file : ---------------------------------------------------')

disp('c code - g : ')
ccode(g_q,'file',['g_' name '.c']);

disp('c code - M : ')
ccode(M_q,'file',['M_' name '.c']);

disp('c code - C : ')
ccode(C_q_dotq,'file',['C_' name '.c']);

disp('c code - Phi : ')
ccode(Phi,'file',['Phi_' name '.c']);

disp('c code - Phi_without_load : ')
ccode(Phi_without_load,'file',['Phi_without_load_' name '.c']);

disp('c code - Phi_with_load : ')
ccode(Phi_with_load,'file',['Phi_with_load_' name '.c']);

disp('c code - error_Phi : ')
ccode(error_Phi,'file',['error_Phi_' name '.c']);

disp('c code - grad_error_Phi : ')
ccode(grad_error_Phi,'file',['grad_error_Phi_' name '.c']);

disp('c code - W : ')
ccode(W_q_dotq_ddotq,'file',['W_' name '.c'])

disp('c code - error_tauL : ')
ccode(error_tauL,'file',['error_tauL_' name '.c']);

disp('c code - grad_error_tauL_wrt_pL : ')
ccode(grad_error_tauL_wrt_pL,'file',['grad_error_tauL_wrt_pL_' name '.c']);
