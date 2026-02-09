function retVal = solvingIndex2IsLessThanIndex1(value1, value2, solvingData)

if (value2 < value1)
    retVal = solvingData(1);
else
    retVal = solvingData(2);
end

end