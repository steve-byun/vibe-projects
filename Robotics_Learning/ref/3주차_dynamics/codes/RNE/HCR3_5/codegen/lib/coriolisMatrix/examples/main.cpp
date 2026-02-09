//
// File: main.cpp
//
// MATLAB Coder version            : 3.1
// C/C++ source code generated on  : 05-Aug-2016 00:55:52
//

//***********************************************************************
// This automatically generated example C main file shows how to call
// entry-point functions that MATLAB Coder generated. You must customize
// this file for your application. Do not modify this file directly.
// Instead, make a copy of this file, modify it, and integrate it into
// your development environment.
//
// This file initializes entry-point function arguments to a default
// size and value before calling the entry-point functions. It does
// not store or use any values returned from the entry-point functions.
// If necessary, it does pre-allocate memory for returned values.
// You can use this file as a starting point for a main function that
// you can deploy in your application.
//
// After you copy the file, and before you deploy it, you must make the
// following changes:
// * For variable-size function arguments, change the example sizes to
// the sizes that your application requires.
// * Change the example values of function arguments to the values that
// your application requires.
// * If the entry-point functions return values, store these values or
// otherwise use them as required by your application.
//
//***********************************************************************
// Include Files
#include "rt_nonfinite.h"
#include "coriolisMatrix.h"
#include "main.h"
#include "coriolisMatrix_terminate.h"
#include "coriolisMatrix_initialize.h"

// Function Declarations
static void argInit_1x3_real_T(double result[3]);
static void argInit_1x4_real_T(double result[4]);
static void argInit_1x6_real_T(double result[6]);
static void argInit_1x9_real_T(double result[9]);
static double argInit_real_T();
static void main_coriolisMatrix();

// Function Definitions

//
// Arguments    : double result[3]
// Return Type  : void
//
static void argInit_1x3_real_T(double result[3])
{
  int idx1;

  // Loop over the array to initialize each element.
  for (idx1 = 0; idx1 < 3; idx1++) {
    // Set the value of the array element.
    // Change this value to the value that the application requires.
    result[idx1] = argInit_real_T();
  }
}

//
// Arguments    : double result[4]
// Return Type  : void
//
static void argInit_1x4_real_T(double result[4])
{
  int idx1;

  // Loop over the array to initialize each element.
  for (idx1 = 0; idx1 < 4; idx1++) {
    // Set the value of the array element.
    // Change this value to the value that the application requires.
    result[idx1] = argInit_real_T();
  }
}

//
// Arguments    : double result[6]
// Return Type  : void
//
static void argInit_1x6_real_T(double result[6])
{
  int idx1;

  // Loop over the array to initialize each element.
  for (idx1 = 0; idx1 < 6; idx1++) {
    // Set the value of the array element.
    // Change this value to the value that the application requires.
    result[idx1] = argInit_real_T();
  }
}

//
// Arguments    : double result[9]
// Return Type  : void
//
static void argInit_1x9_real_T(double result[9])
{
  int idx1;

  // Loop over the array to initialize each element.
  for (idx1 = 0; idx1 < 9; idx1++) {
    // Set the value of the array element.
    // Change this value to the value that the application requires.
    result[idx1] = argInit_real_T();
  }
}

//
// Arguments    : void
// Return Type  : double
//
static double argInit_real_T()
{
  return 0.0;
}

//
// Arguments    : void
// Return Type  : void
//
static void main_coriolisMatrix()
{
  double lengthVector[6];
  double massVector[6];
  double g;
  double inertiaTensor_1[9];
  double inertiaTensor_2[9];
  double inertiaTensor_3[9];
  double inertiaTensor_4[9];
  double inertiaTensor_5[9];
  double inertiaTensor_6[9];
  double COMVector_1[3];
  double COMVector_2[3];
  double dv0[3];
  double dv1[3];
  double dv2[3];
  double dv3[3];
  double dv4[6];
  double dv5[6];
  double dv6[6];
  double dv7[6];
  double dv8[6];
  double dv9[4];
  double coriolis[36];

  // Initialize function 'coriolisMatrix' input arguments.
  // Initialize function input argument 'lengthVector'.
  argInit_1x6_real_T(lengthVector);

  // Initialize function input argument 'massVector'.
  argInit_1x6_real_T(massVector);
  g = argInit_real_T();

  // Initialize function input argument 'inertiaTensor_1'.
  argInit_1x9_real_T(inertiaTensor_1);

  // Initialize function input argument 'inertiaTensor_2'.
  argInit_1x9_real_T(inertiaTensor_2);

  // Initialize function input argument 'inertiaTensor_3'.
  argInit_1x9_real_T(inertiaTensor_3);

  // Initialize function input argument 'inertiaTensor_4'.
  argInit_1x9_real_T(inertiaTensor_4);

  // Initialize function input argument 'inertiaTensor_5'.
  argInit_1x9_real_T(inertiaTensor_5);

  // Initialize function input argument 'inertiaTensor_6'.
  argInit_1x9_real_T(inertiaTensor_6);

  // Initialize function input argument 'COMVector_1'.
  argInit_1x3_real_T(COMVector_1);

  // Initialize function input argument 'COMVector_2'.
  argInit_1x3_real_T(COMVector_2);

  // Initialize function input argument 'COMVector_3'.
  // Initialize function input argument 'COMVector_4'.
  // Initialize function input argument 'COMVector_5'.
  // Initialize function input argument 'COMVector_6'.
  // Initialize function input argument 'angleVector'.
  // Initialize function input argument 'angleVelocityVector'.
  // Initialize function input argument 'angularAccelerationVector'.
  // Initialize function input argument 'sinVector'.
  // Initialize function input argument 'cosVector'.
  // Initialize function input argument 'tiltVector'.
  // Call the entry-point 'coriolisMatrix'.
  argInit_1x3_real_T(dv0);
  argInit_1x3_real_T(dv1);
  argInit_1x3_real_T(dv2);
  argInit_1x3_real_T(dv3);
  argInit_1x6_real_T(dv4);
  argInit_1x6_real_T(dv5);
  argInit_1x6_real_T(dv6);
  argInit_1x6_real_T(dv7);
  argInit_1x6_real_T(dv8);
  argInit_1x4_real_T(dv9);
  coriolisMatrix(lengthVector, massVector, g, inertiaTensor_1, inertiaTensor_2,
                 inertiaTensor_3, inertiaTensor_4, inertiaTensor_5,
                 inertiaTensor_6, COMVector_1, COMVector_2, dv0, dv1, dv2, dv3,
                 dv4, dv5, dv6, dv7, dv8, dv9, coriolis);
}

//
// Arguments    : int argc
//                const char * const argv[]
// Return Type  : int
//
int main(int, const char * const [])
{
  // Initialize the application.
  // You do not need to do this more than one time.
  coriolisMatrix_initialize();

  // Invoke the entry-point functions.
  // You can call entry-point functions multiple times.
  main_coriolisMatrix();

  // Terminate the application.
  // You do not need to do this more than one time.
  coriolisMatrix_terminate();
  return 0;
}

//
// File trailer for main.cpp
//
// [EOF]
//
