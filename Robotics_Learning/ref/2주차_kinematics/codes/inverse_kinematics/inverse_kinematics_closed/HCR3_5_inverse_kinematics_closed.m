function [pResult, solExist] = HCR3_5_inverse_kinematics_closed(T, referenceAngleRad, setPosture, DHParameter)

pResult = nan*ones(size(referenceAngleRad));
existSolution = true*ones(size(referenceAngleRad));

[pResult(1), existSolution(1)] = solvingJointAngleRad1(T, referenceAngleRad, setPosture, DHParameter);
[pResult(5), existSolution(5), T16] = solvingJointAngleRad5(T, pResult, referenceAngleRad, setPosture, DHParameter);
[pResult(6), existSolution(6)] = solvingJointAngleRad6(T16, pResult, referenceAngleRad, setPosture, DHParameter);
[pResult(3), existSolution(3), T14] = solvingJointAngleRad3(T16, pResult, referenceAngleRad, setPosture, DHParameter);
[pResult(2), existSolution(2)] = solvingJointAngleRad2(T14, pResult, referenceAngleRad, setPosture, DHParameter);
[pResult(4), existSolution(4)] = solvingJointAngleRad4(T14, pResult, referenceAngleRad, setPosture, DHParameter);

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

if (abs(DHParameter.d(4)/r) > 1.0)
    retVal = nan;
    solExist = false;
    return;
end

solvData(1) = atan2(p05y,p05x) + acos(DHParameter.d(4)/r) + pi/2;
solvData(2) = atan2(p05y,p05x) - acos(DHParameter.d(4)/r) + pi/2;

if (setPosture(1) == uint16(123))   % Default
    retVal = solvingJointAngleRad1NoDirectionSelect(referenceAngleRad,solvData);
else   
    if (setPosture(2) == uint16(0))    % Front
        retVal = solvingJointAngleRad1Front(referenceAngleRad,solvData);
    else    % Rear
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

%% Solving Joint5 Angle (unit : rad)
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
function [retVal, solExist, Tstar] = solvingJointAngleRad5(T, resultData, referenceAngleRad, setPosture, DHParameter)

solvData = zeros(2,1);

p = T(1:3,4);

T01 = trans_mat(resultData(1), DHParameter.d(1), DHParameter.a(1), DHParameter.alpha(1));
[invT01, singularError] = T_inverse(T01);

if (setPosture(1) == uint16(123))
    if ((abs((p(1)*sin(resultData(1)) - p(2)*cos(resultData(1)) - DHParameter.d(4))/DHParameter.d(6)) > 1.0) ||...
            (singularError == true))
        retVal = nan;
        solExist = false;
        Tstar = nan*ones(size(T));
        return;
    end
else
    if (singularError == true)
        retVal = nan;
        solExist = false;
        Tstar = nan*ones(size(T));
        return;
    end
end

T16 = invT01 * T;
Tstar = T16;

solvData(1) = acos((p(1)*sin(resultData(1)) - p(2)*cos(resultData(1)) - DHParameter.d(4))/DHParameter.d(6));
solvData(2) = -acos((p(1)*sin(resultData(1)) - p(2)*cos(resultData(1)) - DHParameter.d(4))/DHParameter.d(6));

if (setPosture(1) == uint16(123))   % Default
    retVal = solvingJointAngleRad5NoDirectionSelect(referenceAngleRad, solvData);
else   
    if (setPosture(4) == uint16(0)) % Flip
        retVal = solvingJointAngleRad5Flip(referenceAngleRad, solvData);
    else    % Non Flip
        retVal = solvingJointAngleRad5NonFlip(referenceAngleRad, solvData);
    end
    
    retVal = roundPI2(retVal);
end

solExist = true;

end

function retVal = solvingJointAngleRad5Flip(referenceAngleRad, solvingData)

retVal =  solvingIndex1IsLessThanOrEqualToIndex2(solvingData(1), 0.0, solvingData);

end

function retVal = solvingJointAngleRad5NonFlip(referenceAngleRad, solvingData)

retVal =  solvingIndex2IsLessThanIndex1(solvingData(1), 0.0, solvingData);

end

function retVal = solvingJointAngleRad5NoDirectionSelect(referenceAngleRad, solvingData)

solvData = zeros(2,1);

solvData(1) = roundPI(solvingData(1),referenceAngleRad(5));
solvData(2) = roundPI(solvingData(2),referenceAngleRad(5));

dTemp1 = abs(referenceAngleRad(5) - solvData(1));
dTemp2 = abs(referenceAngleRad(5) - solvData(2));

retVal = solvingIndex1IsLessThanIndex2(dTemp1,dTemp2,solvData);

end

%% Solving Joint6 Angle (unit : rad)
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
function [retVal, solExist] = solvingJointAngleRad6(T16, resultData, referenceAngleRad, setPosture, DHParameter)

solvData = zeros(1,1);

[invT16, singularError] = T_inverse(T16);

tempDen = sin(resultData(5));

if (setPosture(1) == uint16(123))
    if (abs(sin(resultData(5)))<1e-5 || (abs(invT16(1,3))<1e-5 && abs(invT16(2,3))<1e-5) ||...
       (singularError == true))
        retVal = nan;
        solExist = false;
        return;
    end
else
    if (singularError == true)
        retVal = nan;
        solExist = false;
        return;
    end
    
    if (abs(tempDen) < 1e-10)
        if ((tempDen < 1e-10) && (tempDen >= 0.0))
            tempDen = 1e-10;
        else
            tempDen = -1e-10;
        end
    end
end

solvData = atan2((-1.0)*invT16(2,3)/tempDen, invT16(1,3)/tempDen);

if (setPosture(1) == uint16(123))   % Default
    retVal = roundPI(solvData, referenceAngleRad(6));
else
    retVal = roundPI2(solvData);
end

solExist = true;

end

%% Solving Joint3 Angle (unit : rad)
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
function [retVal, solExist, Tstar] = solvingJointAngleRad3(T16, resultData, referenceAngleRad, setPosture, DHParameter)

solvData = zeros(2,1);

T45 = trans_mat(resultData(5), DHParameter.d(5), DHParameter.a(5), DHParameter.alpha(5));
T56 = trans_mat(resultData(6), DHParameter.d(6), DHParameter.a(6), DHParameter.alpha(6));
T46 = T45*T56;

[invT46, singularError] = T_inverse(T46);
if (singularError)
    retVal = nan;
    solExist = false;
    Tstar = nan*ones(size(T16));
    return;
end

Tstar = T16 * invT46;

p13 = Tstar*[0; (-1.0)*DHParameter.d(4); 0; 1];
p13xyz = sqrt(p13(1:3)'*p13(1:3));

if (setPosture(1) == uint16(123))
    threshold = 0.999999999847691;
else
    tempData = abs(p13xyz) - (abs(DHParameter.a(2)) + abs(DHParameter.a(3)));
    if (abs(tempData) < 1e-10 &&...
        abs(tempData) > 0.0)
        p13xyz = abs(DHParameter.a(2)) + abs(DHParameter.a(3));
    end
    threshold = 1.0;
end

theta3 = (p13xyz*p13xyz - DHParameter.a(2)*DHParameter.a(2) - DHParameter.a(3)*DHParameter.a(3))/(2*DHParameter.a(2)*DHParameter.a(3));

if (abs(theta3) > threshold)
    retVal = nan;
    solExist = false;
    Tstar = nan*ones(size(Tstar));
    return;
end

solvData(1) = acos(theta3);
solvData(2) = (-1.0)*solvData(1);

if (setPosture(1) == uint16(123))   % Default
    retVal = solvingJointAngleRad3NoDirectionSelect(referenceAngleRad, solvData);
else   
    if (setPosture(3) == uint16(0)) % Above
        retVal = solvingJointAngleRad3Above(referenceAngleRad, solvData, 0.0);
    else    % Below
        retVal = solvingJointAngleRad3Below(referenceAngleRad, solvData, 0.0);
    end
    
    retVal = roundPI2(retVal);
end

solExist = true;

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
function [retVal, solExist] = solvingJointAngleRad2(T14, resultData, referenceAngleRad, setPosture, DHParameter)

solvData = zeros(1,1);

p13 = T14*[0; (-1.0)*DHParameter.d(4); 0; 1];
p13xyz = sqrt(p13(1:3)'*p13(1:3));

directionChanged = 1.0;
checkOneMoreRoundPI = false;

if (abs(resultData(3)) > 90*pi/180) && (abs(abs(DHParameter.a(3)) * cos(resultData(3))) - abs(DHParameter.a(2))) > 0.0 && (abs(DHParameter.a(3)*cos(resultData(3))) / abs(DHParameter.a(2)) > 1)
    p13(1) = (-1.0)*p13(1);
    directionChanged = (-1.0);
    checkOneMoreRoundPI = true;
end

solvData = (-1.0) * atan2(p13(2), (-1.0)*p13(1)) + asin(DHParameter.a(3)*sin(resultData(3))/p13xyz);

if (setPosture(1) == uint16(123))   % Default
    retVal = directionChanged*roundPI(solvData, referenceAngleRad(2));
    if (checkOneMoreRoundPI)
        retVal = roundPI(retVal, referenceAngleRad(2));
    end
else
    retVal = roundPI2(directionChanged*solvData);
end

solExist = true;

end

%% Solving Joint4 Angle (unit : rad)
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
function [retVal, solExist] = solvingJointAngleRad4(T14, resultData, referenceAngleRad, setPosture, DHParameter)

solvData = zeros(1,1);

T12 = trans_mat(resultData(2), DHParameter.d(2), DHParameter.a(2), DHParameter.alpha(2));
T23 = trans_mat(resultData(3), DHParameter.d(3), DHParameter.a(3), DHParameter.alpha(3));
T13 = T12*T23;

[invT13, singularError] = T_inverse(T13);
if (singularError)
    retVal = nan;
    solExist = false;
    return;
end

tempT = invT13*T14;

solvData = atan2(tempT(2,1),tempT(1,1));

if (setPosture(1) == uint16(123))   % Default
    retVal = roundPI(solvData, referenceAngleRad(4));
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
% 
% if (value1 <= value2)
%     retVal = solvingData(1);
% else
%     retVal = solvingData(2);
% end
% 
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
% if ((angle > ((-1.0) * 2.0 * pi)) && (angle < 2.0 * pi))
%     retVal = angle;
% elseif (angle <= (-1.0) * 2.0 * pi)
%     retVal = angle + (2.0 * pi);
% elseif (angle >= 2.0 * pi)
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
% 
% if (rcond(T_inv) < 1e-10)
%     singularError = true;
% else
%     singularError = false;
% end
% 
% end