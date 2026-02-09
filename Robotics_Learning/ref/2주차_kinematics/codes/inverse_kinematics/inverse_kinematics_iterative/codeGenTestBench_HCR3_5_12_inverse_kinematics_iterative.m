function codeGenTestBench_HCR3_5_12_inverse_kinematics_iterative()

n_dof = 6;
pi = 3.1416;

theta_nominal = [ 0, 0, 0, 0, 0, 0 ]';
thetaOffset_nominal = [ 0, 0, 0, 0, 0, 0 ]';
d_nominal = [ 0.1490, 0, 0, 0.1705, 0.1515, 0.1325 ]';
a_nominal = [ 0, -0.4250, -0.3385, 0, 0, 0 ]';
alpha_nominal = [ pi / 2, 0, 0, pi / 2, -pi / 2, 0 ]';

theta_actual = [ 0.0008, - 0.0008,    0.0002, - 0.0016,    0.0019,    0.0027 ]';
thetaOffset_actual = [ 0,     0,     0,     0,     0,     0 ]';
d_actual = [ 0.1485, - 0.0006, - 0.0029,    0.1712,    0.1498,    0.1337 ]';
a_actual = [ -0.0018, - 0.4250, - 0.3358, - 0.0024, - 0.0011,    0.0012 ]';
alpha_actual = [ 1.5712, - 0.0019,    0.0018,    1.5747, - 1.5722,    0.0021 ]';

for i = 1:n_dof
    dhNominal.theta(i) = theta_nominal(i);
    dhNominal.thetaOffset(i) = thetaOffset_nominal(i);
    dhNominal.d(i) = d_nominal(i);
    dhNominal.a(i) = a_nominal(i);
    dhNominal.alpha(i) = alpha_nominal(i);
    
    dhActual.theta(i) = theta_actual(i);
    dhActual.thetaOffset(i) = thetaOffset_actual(i);
    dhActual.d(i) = d_actual(i);
    dhActual.a(i) = a_actual(i);
    dhActual.alpha(i) = alpha_actual(i) ;
end

T = [0.3182, - 0.3425,    0.8840,         0,    0.4706, - 0.7524, - 0.4609,         0,    0.8230,    0.5627, - 0.0782,         0,    0.4379,    0.0652,    0.7190,    1.0000];
referenceAngleRad = [0.6790, - 1.0598, - 1.3981,    0.2252,    1.9038, - 0.7129]';
setPosture = uint16([123;0;0;0]);
isHCH12Model1or2 = false;
errorTol = 1E-14;
maxIteration = uint16(20);

[pResult,solExist,xyzError,orientationError,iteration] = ...
    HCR3_5_12_inverse_kinematics_iterative(...
    reshape(T,4,4),...
    referenceAngleRad,...
    setPosture,...
    dhNominal,...
    dhActual,...
    isHCH12Model1or2,...
    errorTol,...
    maxIteration);

pResult

end