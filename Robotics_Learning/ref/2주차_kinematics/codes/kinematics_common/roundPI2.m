function retVal = roundPI2(angle)

retVal = angle;

if ((angle > ((-1.0) * pi)) && (angle < pi))
    retVal = angle;
elseif (angle <= (-1.0) * pi)
    retVal = angle + (2.0 * pi);
elseif (angle >= pi)
    retVal = angle - (2.0 * pi);
end

if (abs(retVal) < 1e-10)
    retVal = 0.0;
end
    
end