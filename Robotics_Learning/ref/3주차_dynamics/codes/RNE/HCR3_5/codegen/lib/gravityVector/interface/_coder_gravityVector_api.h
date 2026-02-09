/*
 * File: _coder_gravityVector_api.h
 *
 * MATLAB Coder version            : 3.1
 * C/C++ source code generated on  : 05-Aug-2016 00:55:37
 */

#ifndef _CODER_GRAVITYVECTOR_API_H
#define _CODER_GRAVITYVECTOR_API_H

/* Include Files */
#include "tmwtypes.h"
#include "mex.h"
#include "emlrt.h"
#include <stddef.h>
#include <stdlib.h>
#include "_coder_gravityVector_api.h"

/* Variable Declarations */
extern emlrtCTX emlrtRootTLSGlobal;
extern emlrtContext emlrtContextGlobal;

/* Function Declarations */
extern void gravityVector(real_T lengthVector[6], real_T massVector[6], real_T g,
  real_T inertiaTensor_1[9], real_T inertiaTensor_2[9], real_T inertiaTensor_3[9],
  real_T inertiaTensor_4[9], real_T inertiaTensor_5[9], real_T inertiaTensor_6[9],
  real_T COMVector_1[3], real_T COMVector_2[3], real_T COMVector_3[3], real_T
  COMVector_4[3], real_T COMVector_5[3], real_T COMVector_6[3], real_T
  angleVector[6], real_T angleVelocityVector[6], real_T
  angularAccelerationVector[6], real_T sinVector[6], real_T cosVector[6], real_T
  tiltVector[4], real_T gravity[6]);
extern void gravityVector_api(const mxArray *prhs[21], const mxArray *plhs[1]);
extern void gravityVector_atexit(void);
extern void gravityVector_initialize(void);
extern void gravityVector_terminate(void);
extern void gravityVector_xil_terminate(void);

#endif

/*
 * File trailer for _coder_gravityVector_api.h
 *
 * [EOF]
 */
