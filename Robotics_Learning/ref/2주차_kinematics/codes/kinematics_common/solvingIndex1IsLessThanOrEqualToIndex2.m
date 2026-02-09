function retVal = solvingIndex1IsLessThanOrEqualToIndex2(value1, value2, solvingData)
if (value1 <= value2)
    retVal = solvingData(1);
else
    retVal = solvingData(2);
end
end