//
// File: gravityVector.h
//
// MATLAB Coder version            : 3.1
// C/C++ source code generated on  : 05-Aug-2016 00:55:37
//
#ifndef GRAVITYVECTOR_H
#define GRAVITYVECTOR_H

// Include Files
#include <stddef.h>
#include <stdlib.h>
#include "rtwtypes.h"
#include "gravityVector_types.h"

// Function Declarations
extern void gravityVector(const double lengthVector[6], const double massVector
  [6], double g, const double inertiaTensor_1[9], const double inertiaTensor_2[9],
  const double inertiaTensor_3[9], const double inertiaTensor_4[9], const double
  inertiaTensor_5[9], const double inertiaTensor_6[9], const double COMVector_1
  [3], const double COMVector_2[3], const double COMVector_3[3], const double
  COMVector_4[3], const double COMVector_5[3], const double COMVector_6[3],
  const double angleVector[6], const double angleVelocityVector[6], const double
  angularAccelerationVector[6], const double sinVector[6], const double
  cosVector[6], const double tiltVector[4], double gravity[6]);

#endif

//
// File trailer for gravityVector.h
//
// [EOF]
//
