function retVal = roundPI(angle, ref)

retVal = angle;

if ((angle > (ref - pi)) && (angle < (ref + pi)))
    retVal = angle;
elseif (angle < (ref - pi))
    retVal = angle + (2.0 * pi);
elseif (angle > (ref + pi))
    retVal = angle - (2.0 * pi);
end

end
