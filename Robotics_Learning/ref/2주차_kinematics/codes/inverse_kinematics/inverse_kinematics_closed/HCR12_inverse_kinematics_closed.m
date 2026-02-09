function [pResult, solExist] = HCR12_inverse_kinematics_closed(T,referenceAngleRad,setPosture,DHParameter)

pResult = nan*ones(size(referenceAngleRad));
existSolution = true*ones(size(referenceAngleRad));

[pResult(1), existSolution(1)] = solvingJointAngleRad1(T, referenceAngleRad, setPosture, DHParameter);
[pResult(3), existSolution(3), T16] = solvingJointAngleRad3(T, pResult, referenceAngleRad, setPosture, DHParameter);
[pResult(2), existSolution(2)] = solvingJointAngleRad2(T, T16, pResult, referenceAngleRad, setPosture, DHParameter);
[pResult(5), existSolution(5), T46] = solvingJointAngleRad5(T16, pResult, referenceAngleRad, setPosture, DHParameter);
[pResult(4), existSolution(4)] = solvingJointAngleRad4(T46, pResult, referenceAngleRad, setPosture, DHParameter);
[pResult(6), existSolution(6)] = solvingJointAngleRad6(T46, pResult, referenceAngleRad, setPosture, DHParameter);

solExist = true;

for i=1:6
    if (existSolution(i) ~= true)
        solExist = false;
        break;
    end
end

if (solExist == false)
    pResult = nan*ones(size(referenceAngleRad));
end
end

%% Solving Joint1 Angle (unit : rad)
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
function [retVal, solExist] = solvingJointAngleRad1(T,referenceAngleRad,setPosture, DHParameter)

solvData = zeros(2,1);

p = T(1:3,4);
z = T(1:3,3);

p05x = p(1) - DHParameter.d(6)*z(1);
p05y = p(2) - DHParameter.d(6)*z(2);
r = sqrt(p05x*p05x + p05y*p05y);
if (1.0 < (DHParameter.d(3)/r)*(DHParameter.d(3)/r))
    retVal = nan;
    solExist = false;
    return;
else
    r_temp = sqrt(1.0- (DHParameter.d(3)/r)*(DHParameter.d(3)/r));
end

solvData(1) = atan2(p05y, p05x) - atan2(DHParameter.d(3)/r, r_temp);
solvData(2) = atan2(p05y, p05x) - atan2(DHParameter.d(3)/r, (-1.0)*r_temp);

if (setPosture(1) == uint16(123))
    retVal = solvingJointAngleRad1NoDirectionSelect(referenceAngleRad,solvData);
else
    if (setPosture(2) == uint16(0)) % front
        retVal = solvingJointAngleRad1Front(referenceAngleRad,solvData);
    else % rear
        retVal = solvingJointAngleRad1Rear(referenceAngleRad,solvData);
    end
    
    retVal = roundPI2(retVal);
end

solExist = true;

end

function retVal = solvingJointAngleRad1Front(referenceAngleRad, solvingData)

retVal = solvingIndex1IsLessThanOrEqualToIndex2(abs(solvingData(1)),pi/2,solvingData);

end

function retVal = solvingJointAngleRad1Rear(referenceAngleRad, solvingData)

retVal = solvingIndex2IsLessThanIndex1(abs(solvingData(1)),pi/2,solvingData);

end

function retVal = solvingJointAngleRad1NoDirectionSelect(referenceAngleRad, solvingData)

solvData = zeros(2,1);

solvData(1) = roundPI(solvingData(1), referenceAngleRad(1));
solvData(2) = roundPI(solvingData(2), referenceAngleRad(1));
dTemp1 = abs(referenceAngleRad(1) - solvData(1));
dTemp2 = abs(referenceAngleRad(1) - solvData(2));

retVal = solvingIndex1IsLessThanIndex2(dTemp1, dTemp2, solvData);

end

%% Solving Joint3 Angle (unit : rad)
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
function [retVal, solExist, Tstar] = solvingJointAngleRad3(T, resultData, referenceAngleRad, setPosture, DHParameter)

solvData = zeros(2,1);

z = T(1:3,3);

T01 = trans_mat(resultData(1), DHParameter.d(1), DHParameter.a(1), DHParameter.alpha(1));
[invT01,singularError] = T_inverse(T01);
if (singularError)
    retVal = nan;
    Tstar = nan(size(T));
    solExist = false;
    return;
end

T16 = invT01 * T;
Tstar = T16;

pxy16 = T16(1,4) - DHParameter.d(6)*cos(resultData(1))*z(1) - DHParameter.d(6)*sin(resultData(1))*z(2);
pz16 = T16(2,4) - DHParameter.d(6)*z(3);

K = (pxy16*pxy16 + pz16*pz16 - DHParameter.a(2)*DHParameter.a(2) - DHParameter.a(3)*DHParameter.a(3) - DHParameter.d(4)*DHParameter.d(4))...
    / (2.0 * DHParameter.a(2));
K_temp = DHParameter.a(3)*DHParameter.a(3) + DHParameter.d(4)*DHParameter.d(4) - K*K;
criticalAngleRad = pi/2 - atan2(DHParameter.a(3),DHParameter.d(3));

if (K_temp >= 0.0)
    K_temp = sqrt(K_temp);
    solvData(1) = (-1.0)*atan2((-1.0)*DHParameter.d(4),DHParameter.a(3)) - atan2(K_temp, K);
    solvData(2) = (-1.0)*atan2((-1.0)*DHParameter.d(4),DHParameter.a(3)) + atan2(K_temp, K);
    
    if (setPosture(1) == uint16(123))
        retVal = solvingJointAngleRad3NoDirectionSelect(referenceAngleRad, solvData, criticalAngleRad);
    else       
        if (setPosture(3) == uint16(0)) % above
            retVal = solvingJointAngleRad3Above(referenceAngleRad, solvData, criticalAngleRad);
        else % below
            retVal = solvingJointAngleRad3Below(referenceAngleRad, solvData, criticalAngleRad);
        end
       
        retVal = roundPI2(retVal);
    end
        
    solExist = true;
else
    retVal = nan;
    Tstar = nan(size(T));
    solExist = false;
end

end

function retVal = solvingJointAngleRad3Above(referenceAngleRad, solvingData, criticalAngleRad)

retVal = solvingIndex1IsLessThanOrEqualToIndex2(solvingData(1), criticalAngleRad, solvingData);

end

function retVal = solvingJointAngleRad3Below(referenceAngleRad, solvingData, criticalAngleRad)

retVal = solvingIndex2IsLessThanIndex1(solvingData(1), criticalAngleRad, solvingData);

end

function retVal = solvingJointAngleRad3NoDirectionSelect(referenceAngleRad, solvingData, criticalAngleRad)

solvData = zeros(2,1);

solvData(1) = roundPI(solvingData(1), referenceAngleRad(3));
solvData(2) = roundPI(solvingData(2), referenceAngleRad(3));

dTemp1 = abs(referenceAngleRad(3) - solvData(1));
dTemp2 = abs(referenceAngleRad(3) - solvData(2));

retVal = solvingIndex1IsLessThanIndex2(dTemp1, dTemp2, solvData);

end

%% Solving Joint2 Angle (unit : rad)
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
function [retVal, solExist] = solvingJointAngleRad2(T, T16, resultData, referenceAngleRad, setPosture, DHParameter)

solvData = zeros(1,1);

z = T(1:3,3);

c1 = cos(resultData(1));
s1 = sin(resultData(1));

c3 = cos(resultData(3));
s3 = sin(resultData(3));

pxy16 = T16(1,4) - DHParameter.d(6)*c1*z(1) - DHParameter.d(6)*s1*z(2);
pz16 = T16(2,4) - DHParameter.d(6)*z(3);

tempDen = pxy16*pxy16 + pz16*pz16;

if (setPosture(1) == uint16(123))
    if (abs(pxy16*pxy16 + pz16*pz16) < 1e-10)
        retVal = nan;
        solExist = false;
        return;
    end
else
    if (abs(tempDen) < 1e-10)
        if ((tempDen < 1e-10) && (tempDen) >= 0.0)
            tempDen = 1e-10;
        else
            tempDen = -1e-10;
        end
    end
end

s23_temp = ((DHParameter.a(3) + DHParameter.a(2)*c3)*pz16 - pxy16*(-DHParameter.a(2)*s3 - DHParameter.d(4))) / (tempDen);
c23_temp = ((-DHParameter.a(2)*s3 - DHParameter.d(4))*pz16 + (DHParameter.a(3) + DHParameter.a(2)*c3)*pxy16) / (tempDen);
angleRad23 = atan2(s23_temp, c23_temp);

solvData = angleRad23 - resultData(3) - pi/2;

if (setPosture(1) == uint16(123))   % Default
    retVal = roundPI(solvData, referenceAngleRad(2));
else
    retVal = roundPI2(solvData);
end

solExist = true;

end

%% Solving Joint5 Angle (unit : rad)
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
function [retVal, solExist, Tstar] = solvingJointAngleRad5(T16, resultData, referenceAngleRad, setPosture, DHParameter)

solvData = zeros(2,1);

T12 = trans_mat(resultData(2)+pi/2, DHParameter.d(2), DHParameter.a(2), DHParameter.alpha(2));
T23 = trans_mat(resultData(3), DHParameter.d(3), DHParameter.a(3), DHParameter.alpha(3));
T13 = T12*T23;
[invT13,singularError] = T_inverse(T13);
if (singularError)
    retVal = nan;
    solExist = false;
    Tstar = nan(size(T13));
    return;
end

T46 = invT13 * T16;
z46 = T46(1:3,3);

c5 = z46(3);
s5 = sqrt(abs(1.0 - c5*c5));

solvData(1) = atan2(s5, c5);
solvData(2) = -solvData(1);

if (setPosture(1) == uint16(123))
    retVal = solvingJointAngleRad5NoDirectionSelect(referenceAngleRad, solvData);
else
    if (setPosture(4) == uint16(0)) % flip
        retVal =  solvingJointAngleRad5Flip(referenceAngleRad, solvData);
    else % non-flip
        retVal =  solvingJointAngleRad5NonFlip(referenceAngleRad, solvData);
    end
    
    retVal = roundPI2(retVal);
end

solExist = true;
Tstar = T46;

end

function retVal = solvingJointAngleRad5Flip(referenceAngleRad, solvingData)

retVal =  solvingIndex2IsLessThanOrEqualToIndex1(solvingData(1), 0.0, solvingData);

end

function retVal = solvingJointAngleRad5NonFlip(referenceAngleRad, solvingData)

retVal =  solvingIndex1IsLessThanIndex2(solvingData(1), 0.0, solvingData);

end

function retVal = solvingJointAngleRad5NoDirectionSelect(referenceAngleRad, solvingData)

solvData = zeros(2,1);

solvData(1) = roundPI(solvingData(1),referenceAngleRad(5));
solvData(2) = roundPI(solvingData(2),referenceAngleRad(5));

dTemp1 = abs(referenceAngleRad(5) - solvData(1));
dTemp2 = abs(referenceAngleRad(5) - solvData(2));

retVal = solvingIndex1IsLessThanIndex2(dTemp1,dTemp2,solvData);

end

%% Solving Joint4 Angle (unit : rad)
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
function [retVal, solExist] = solvingJointAngleRad4(T46, resultData, referenceAngleRad, setPosture, DHParameter)

solvData = zeros(1,1);

z46 = T46(1:3,3);

if (setPosture(1) == uint16(123))
    if (abs(sin(resultData(5))) < 1e-6)
        retVal = nan;
        solExist = false;
        return;
    else
        if (resultData(5) < 0.0)
            solvData = atan2(-z46(2), -z46(1));
        else
            solvData = atan2(z46(2), z46(1));
        end
    end
else
    if (resultData(5) < 0.0)
        solvData = atan2(-z46(2), -z46(1));
    else
        solvData = atan2(z46(2), z46(1));
    end    
end

if (setPosture(1) == uint16(123))   % Default
    retVal = roundPI(solvData, referenceAngleRad(4));
else
    retVal = roundPI2(solvData);
end

solExist = true;

end

%% Solving Joint6 Angle (unit : rad)
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
function [retVal, solExist] = solvingJointAngleRad6(T46, resultData, referenceAngleRad, setPosture, DHParameter)

solvData = zeros(1,1);

T34 = trans_mat(resultData(4), DHParameter.d(4), DHParameter.a(4), DHParameter.alpha(4));
T45 = trans_mat(resultData(5), DHParameter.d(5), DHParameter.a(5), DHParameter.alpha(5));
T35 = T34*T45;
[invT35,singularError] = T_inverse(T35);
if (singularError)
    retVal = nan;
    solExist = false;
    return;
end
T6 = invT35 * T46;

xx6 = T6(1,1);
yx6 = -T6(1,2);

solvData = atan2(yx6, xx6);

if (setPosture(1) == uint16(123))   % Default
    retVal = roundPI(solvData,referenceAngleRad(6));
else
    retVal = roundPI2(solvData);
end

solExist = true;

end


% %% Unit Converter
% %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% function retVal = solvingIndex1IsLessThanIndex2(value1, value2, solvingData)
% 
% if (value1 < value2)
%     retVal = solvingData(1);
% else
%     retVal = solvingData(2);
% end
% 
% end
% 
% function retVal = solvingIndex1IsLessThanOrEqualToIndex2(value1, value2, solvingData)
% if (value1 <= value2)
%     retVal = solvingData(1);
% else
%     retVal = solvingData(2);
% end
% end
% 
% function retVal = solvingIndex2IsLessThanIndex1(value1, value2, solvingData)
% 
% if (value2 < value1)
%     retVal = solvingData(1);
% else
%     retVal = solvingData(2);
% end
% 
% end
% 
% function retVal = solvingIndex2IsLessThanOrEqualToIndex1(value1, value2, solvingData)
% 
% if (value2 <= value1)
%     retVal = solvingData(1);
% else
%     retVal = solvingData(2);
% end
% 
% end
% 
% function [T] = trans_mat(theta, d, a, alpha)
% 
% T = [cos(theta) -sin(theta)*cos(alpha)  sin(theta)*sin(alpha) a*cos(theta);
%     sin(theta)  cos(theta)*cos(alpha) -cos(theta)*sin(alpha) a*sin(theta);
%     0                      sin(alpha)             cos(alpha)            d;
%     0                               0                      0            1];
% 
% end
% 
% function retVal = roundPI(angle, ref)
% 
% retVal = angle;
% 
% if ((angle > (ref - pi)) && (angle < (ref + pi)))
%     retVal = angle;
% elseif (angle < (ref - pi))
%     retVal = angle + (2.0 * pi);
% elseif (angle > (ref + pi))
%     retVal = angle - (2.0 * pi);
% end
% 
% end
% 
% function retVal = roundPI2(angle)
% 
% retVal = angle;
% 
% if ((angle > ((-1.0) * pi)) && (angle < pi))
%     retVal = angle;
% elseif (angle <= (-1.0) * pi)
%     retVal = angle + (2.0 * pi);
% elseif (angle >= pi)
%     retVal = angle - (2.0 * pi);
% end
% 
% if (abs(retVal) < 1e-10)
%     retVal = 0.0;
% end
%     
% end
% 
% function [T_inv,singularError] = T_inverse(T)
% 
% Rt = transpose(T(1:3,1:3));
% pt = (-1.0) * Rt * T(1:3,4);
% T_inv_temp = [Rt pt];
% T_inv = [T_inv_temp; 0 0 0 1];
% if (rcond(T_inv) < 1e-10)
%     singularError = true;
% else
%     singularError = false;
% end
% 
% end