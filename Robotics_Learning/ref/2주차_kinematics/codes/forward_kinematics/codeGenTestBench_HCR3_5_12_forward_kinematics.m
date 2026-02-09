function codeGenTestBench_HCR3_5_12_forward_kinematics()

[hcr3params,hcr5params,hcr12params] = HCR_1gen_parameters;

theta = hcr5params.home;
DHParameter = hcr5params.dh;

transformationMatrix = HCR3_5_12_forward_kinematics(theta,DHParameter);

end