clear; close all; clc;

[hcr3params,hcr5params,hcr12params] = HCR_1gen_parameters;

% hcr3 home
theta_hcr3 = hcr3params.home;
transformationMatrix_hcr3 = HCR3_5_12_forward_kinematics(theta_hcr3,hcr3params.dh)

% hcr5 home
theta_hcr5 = hcr5params.home;
transformationMatrix_hcr5 = HCR3_5_12_forward_kinematics(theta_hcr5,hcr5params.dh)

% hcr12 home
theta_hcr12 = hcr12params.home;
transformationMatrix_hcr12 = HCR3_5_12_forward_kinematics(theta_hcr12,hcr12params.dh)