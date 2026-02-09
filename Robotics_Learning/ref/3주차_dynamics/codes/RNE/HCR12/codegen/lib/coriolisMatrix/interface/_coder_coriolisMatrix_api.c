/*
 * File: _coder_coriolisMatrix_api.c
 *
 * MATLAB Coder version            : 3.1
 * C/C++ source code generated on  : 16-Dec-2017 18:21:45
 */

/* Include Files */
#include "tmwtypes.h"
#include "_coder_coriolisMatrix_api.h"
#include "_coder_coriolisMatrix_mex.h"

/* Variable Definitions */
emlrtCTX emlrtRootTLSGlobal = NULL;
emlrtContext emlrtContextGlobal = { true, false, 131434U, NULL, "coriolisMatrix",
  NULL, false, { 2045744189U, 2170104910U, 2743257031U, 4284093946U }, NULL };

/* Function Declarations */
static real_T (*b_emlrt_marshallIn(const emlrtStack *sp, const mxArray *u, const
  emlrtMsgIdentifier *parentId))[7];
static real_T (*c_emlrt_marshallIn(const emlrtStack *sp, const mxArray
  *massVector, const char_T *identifier))[6];
static real_T (*d_emlrt_marshallIn(const emlrtStack *sp, const mxArray *u, const
  emlrtMsgIdentifier *parentId))[6];
static real_T e_emlrt_marshallIn(const emlrtStack *sp, const mxArray *g, const
  char_T *identifier);
static real_T (*emlrt_marshallIn(const emlrtStack *sp, const mxArray
  *lengthVector, const char_T *identifier))[7];
static const mxArray *emlrt_marshallOut(const real_T u[36]);
static real_T f_emlrt_marshallIn(const emlrtStack *sp, const mxArray *u, const
  emlrtMsgIdentifier *parentId);
static real_T (*g_emlrt_marshallIn(const emlrtStack *sp, const mxArray
  *inertiaTensor_1, const char_T *identifier))[9];
static real_T (*h_emlrt_marshallIn(const emlrtStack *sp, const mxArray *u, const
  emlrtMsgIdentifier *parentId))[9];
static real_T (*i_emlrt_marshallIn(const emlrtStack *sp, const mxArray
  *COMVector_1, const char_T *identifier))[3];
static real_T (*j_emlrt_marshallIn(const emlrtStack *sp, const mxArray *u, const
  emlrtMsgIdentifier *parentId))[3];
static real_T (*k_emlrt_marshallIn(const emlrtStack *sp, const mxArray
  *tiltVector, const char_T *identifier))[4];
static real_T (*l_emlrt_marshallIn(const emlrtStack *sp, const mxArray *u, const
  emlrtMsgIdentifier *parentId))[4];
static real_T (*m_emlrt_marshallIn(const emlrtStack *sp, const mxArray *src,
  const emlrtMsgIdentifier *msgId))[7];
static real_T (*n_emlrt_marshallIn(const emlrtStack *sp, const mxArray *src,
  const emlrtMsgIdentifier *msgId))[6];
static real_T o_emlrt_marshallIn(const emlrtStack *sp, const mxArray *src, const
  emlrtMsgIdentifier *msgId);
static real_T (*p_emlrt_marshallIn(const emlrtStack *sp, const mxArray *src,
  const emlrtMsgIdentifier *msgId))[9];
static real_T (*q_emlrt_marshallIn(const emlrtStack *sp, const mxArray *src,
  const emlrtMsgIdentifier *msgId))[3];
static real_T (*r_emlrt_marshallIn(const emlrtStack *sp, const mxArray *src,
  const emlrtMsgIdentifier *msgId))[4];

/* Function Definitions */

/*
 * Arguments    : const emlrtStack *sp
 *                const mxArray *u
 *                const emlrtMsgIdentifier *parentId
 * Return Type  : real_T (*)[7]
 */
static real_T (*b_emlrt_marshallIn(const emlrtStack *sp, const mxArray *u, const
  emlrtMsgIdentifier *parentId))[7]
{
  real_T (*y)[7];
  y = m_emlrt_marshallIn(sp, emlrtAlias(u), parentId);
  emlrtDestroyArray(&u);
  return y;
}
/*
 * Arguments    : const emlrtStack *sp
 *                const mxArray *massVector
 *                const char_T *identifier
 * Return Type  : real_T (*)[6]
 */
  static real_T (*c_emlrt_marshallIn(const emlrtStack *sp, const mxArray
  *massVector, const char_T *identifier))[6]
{
  real_T (*y)[6];
  emlrtMsgIdentifier thisId;
  thisId.fIdentifier = identifier;
  thisId.fParent = NULL;
  thisId.bParentIsCell = false;
  y = d_emlrt_marshallIn(sp, emlrtAlias(massVector), &thisId);
  emlrtDestroyArray(&massVector);
  return y;
}

/*
 * Arguments    : const emlrtStack *sp
 *                const mxArray *u
 *                const emlrtMsgIdentifier *parentId
 * Return Type  : real_T (*)[6]
 */
static real_T (*d_emlrt_marshallIn(const emlrtStack *sp, const mxArray *u, const
  emlrtMsgIdentifier *parentId))[6]
{
  real_T (*y)[6];
  y = n_emlrt_marshallIn(sp, emlrtAlias(u), parentId);
  emlrtDestroyArray(&u);
  return y;
}
/*
 * Arguments    : const emlrtStack *sp
 *                const mxArray *g
 *                const char_T *identifier
 * Return Type  : real_T
 */
  static real_T e_emlrt_marshallIn(const emlrtStack *sp, const mxArray *g, const
  char_T *identifier)
{
  real_T y;
  emlrtMsgIdentifier thisId;
  thisId.fIdentifier = identifier;
  thisId.fParent = NULL;
  thisId.bParentIsCell = false;
  y = f_emlrt_marshallIn(sp, emlrtAlias(g), &thisId);
  emlrtDestroyArray(&g);
  return y;
}

/*
 * Arguments    : const emlrtStack *sp
 *                const mxArray *lengthVector
 *                const char_T *identifier
 * Return Type  : real_T (*)[7]
 */
static real_T (*emlrt_marshallIn(const emlrtStack *sp, const mxArray
  *lengthVector, const char_T *identifier))[7]
{
  real_T (*y)[7];
  emlrtMsgIdentifier thisId;
  thisId.fIdentifier = identifier;
  thisId.fParent = NULL;
  thisId.bParentIsCell = false;
  y = b_emlrt_marshallIn(sp, emlrtAlias(lengthVector), &thisId);
  emlrtDestroyArray(&lengthVector);
  return y;
}
/*
 * Arguments    : const real_T u[36]
 * Return Type  : const mxArray *
 */
  static const mxArray *emlrt_marshallOut(const real_T u[36])
{
  const mxArray *y;
  const mxArray *m0;
  static const int32_T iv0[2] = { 0, 0 };

  static const int32_T iv1[2] = { 1, 36 };

  y = NULL;
  m0 = emlrtCreateNumericArray(2, iv0, mxDOUBLE_CLASS, mxREAL);
  mxSetData((mxArray *)m0, (void *)u);
  emlrtSetDimensions((mxArray *)m0, *(int32_T (*)[2])&iv1[0], 2);
  emlrtAssign(&y, m0);
  return y;
}

/*
 * Arguments    : const emlrtStack *sp
 *                const mxArray *u
 *                const emlrtMsgIdentifier *parentId
 * Return Type  : real_T
 */
static real_T f_emlrt_marshallIn(const emlrtStack *sp, const mxArray *u, const
  emlrtMsgIdentifier *parentId)
{
  real_T y;
  y = o_emlrt_marshallIn(sp, emlrtAlias(u), parentId);
  emlrtDestroyArray(&u);
  return y;
}

/*
 * Arguments    : const emlrtStack *sp
 *                const mxArray *inertiaTensor_1
 *                const char_T *identifier
 * Return Type  : real_T (*)[9]
 */
static real_T (*g_emlrt_marshallIn(const emlrtStack *sp, const mxArray
  *inertiaTensor_1, const char_T *identifier))[9]
{
  real_T (*y)[9];
  emlrtMsgIdentifier thisId;
  thisId.fIdentifier = identifier;
  thisId.fParent = NULL;
  thisId.bParentIsCell = false;
  y = h_emlrt_marshallIn(sp, emlrtAlias(inertiaTensor_1), &thisId);
  emlrtDestroyArray(&inertiaTensor_1);
  return y;
}
/*
 * Arguments    : const emlrtStack *sp
 *                const mxArray *u
 *                const emlrtMsgIdentifier *parentId
 * Return Type  : real_T (*)[9]
 */
  static real_T (*h_emlrt_marshallIn(const emlrtStack *sp, const mxArray *u,
  const emlrtMsgIdentifier *parentId))[9]
{
  real_T (*y)[9];
  y = p_emlrt_marshallIn(sp, emlrtAlias(u), parentId);
  emlrtDestroyArray(&u);
  return y;
}

/*
 * Arguments    : const emlrtStack *sp
 *                const mxArray *COMVector_1
 *                const char_T *identifier
 * Return Type  : real_T (*)[3]
 */
static real_T (*i_emlrt_marshallIn(const emlrtStack *sp, const mxArray
  *COMVector_1, const char_T *identifier))[3]
{
  real_T (*y)[3];
  emlrtMsgIdentifier thisId;
  thisId.fIdentifier = identifier;
  thisId.fParent = NULL;
  thisId.bParentIsCell = false;
  y = j_emlrt_marshallIn(sp, emlrtAlias(COMVector_1), &thisId);
  emlrtDestroyArray(&COMVector_1);
  return y;
}
/*
 * Arguments    : const emlrtStack *sp
 *                const mxArray *u
 *                const emlrtMsgIdentifier *parentId
 * Return Type  : real_T (*)[3]
 */
  static real_T (*j_emlrt_marshallIn(const emlrtStack *sp, const mxArray *u,
  const emlrtMsgIdentifier *parentId))[3]
{
  real_T (*y)[3];
  y = q_emlrt_marshallIn(sp, emlrtAlias(u), parentId);
  emlrtDestroyArray(&u);
  return y;
}

/*
 * Arguments    : const emlrtStack *sp
 *                const mxArray *tiltVector
 *                const char_T *identifier
 * Return Type  : real_T (*)[4]
 */
static real_T (*k_emlrt_marshallIn(const emlrtStack *sp, const mxArray
  *tiltVector, const char_T *identifier))[4]
{
  real_T (*y)[4];
  emlrtMsgIdentifier thisId;
  thisId.fIdentifier = identifier;
  thisId.fParent = NULL;
  thisId.bParentIsCell = false;
  y = l_emlrt_marshallIn(sp, emlrtAlias(tiltVector), &thisId);
  emlrtDestroyArray(&tiltVector);
  return y;
}
/*
 * Arguments    : const emlrtStack *sp
 *                const mxArray *u
 *                const emlrtMsgIdentifier *parentId
 * Return Type  : real_T (*)[4]
 */
  static real_T (*l_emlrt_marshallIn(const emlrtStack *sp, const mxArray *u,
  const emlrtMsgIdentifier *parentId))[4]
{
  real_T (*y)[4];
  y = r_emlrt_marshallIn(sp, emlrtAlias(u), parentId);
  emlrtDestroyArray(&u);
  return y;
}

/*
 * Arguments    : const emlrtStack *sp
 *                const mxArray *src
 *                const emlrtMsgIdentifier *msgId
 * Return Type  : real_T (*)[7]
 */
static real_T (*m_emlrt_marshallIn(const emlrtStack *sp, const mxArray *src,
  const emlrtMsgIdentifier *msgId))[7]
{
  real_T (*ret)[7];
  static const int32_T dims[2] = { 1, 7 };

  emlrtCheckBuiltInR2012b(sp, msgId, src, "double", false, 2U, dims);
  ret = (real_T (*)[7])mxGetData(src);
  emlrtDestroyArray(&src);
  return ret;
}
/*
 * Arguments    : const emlrtStack *sp
 *                const mxArray *src
 *                const emlrtMsgIdentifier *msgId
 * Return Type  : real_T (*)[6]
 */
  static real_T (*n_emlrt_marshallIn(const emlrtStack *sp, const mxArray *src,
  const emlrtMsgIdentifier *msgId))[6]
{
  real_T (*ret)[6];
  static const int32_T dims[2] = { 1, 6 };

  emlrtCheckBuiltInR2012b(sp, msgId, src, "double", false, 2U, dims);
  ret = (real_T (*)[6])mxGetData(src);
  emlrtDestroyArray(&src);
  return ret;
}

/*
 * Arguments    : const emlrtStack *sp
 *                const mxArray *src
 *                const emlrtMsgIdentifier *msgId
 * Return Type  : real_T
 */
static real_T o_emlrt_marshallIn(const emlrtStack *sp, const mxArray *src, const
  emlrtMsgIdentifier *msgId)
{
  real_T ret;
  static const int32_T dims = 0;
  emlrtCheckBuiltInR2012b(sp, msgId, src, "double", false, 0U, &dims);
  ret = *(real_T *)mxGetData(src);
  emlrtDestroyArray(&src);
  return ret;
}

/*
 * Arguments    : const emlrtStack *sp
 *                const mxArray *src
 *                const emlrtMsgIdentifier *msgId
 * Return Type  : real_T (*)[9]
 */
static real_T (*p_emlrt_marshallIn(const emlrtStack *sp, const mxArray *src,
  const emlrtMsgIdentifier *msgId))[9]
{
  real_T (*ret)[9];
  static const int32_T dims[2] = { 1, 9 };

  emlrtCheckBuiltInR2012b(sp, msgId, src, "double", false, 2U, dims);
  ret = (real_T (*)[9])mxGetData(src);
  emlrtDestroyArray(&src);
  return ret;
}
/*
 * Arguments    : const emlrtStack *sp
 *                const mxArray *src
 *                const emlrtMsgIdentifier *msgId
 * Return Type  : real_T (*)[3]
 */
  static real_T (*q_emlrt_marshallIn(const emlrtStack *sp, const mxArray *src,
  const emlrtMsgIdentifier *msgId))[3]
{
  real_T (*ret)[3];
  static const int32_T dims[2] = { 1, 3 };

  emlrtCheckBuiltInR2012b(sp, msgId, src, "double", false, 2U, dims);
  ret = (real_T (*)[3])mxGetData(src);
  emlrtDestroyArray(&src);
  return ret;
}

/*
 * Arguments    : const emlrtStack *sp
 *                const mxArray *src
 *                const emlrtMsgIdentifier *msgId
 * Return Type  : real_T (*)[4]
 */
static real_T (*r_emlrt_marshallIn(const emlrtStack *sp, const mxArray *src,
  const emlrtMsgIdentifier *msgId))[4]
{
  real_T (*ret)[4];
  static const int32_T dims[2] = { 1, 4 };

  emlrtCheckBuiltInR2012b(sp, msgId, src, "double", false, 2U, dims);
  ret = (real_T (*)[4])mxGetData(src);
  emlrtDestroyArray(&src);
  return ret;
}
/*
 * Arguments    : const mxArray *prhs[21]
 *                const mxArray *plhs[1]
 * Return Type  : void
 */
  void coriolisMatrix_api(const mxArray *prhs[21], const mxArray *plhs[1])
{
  real_T (*coriolis)[36];
  real_T (*lengthVector)[7];
  real_T (*massVector)[6];
  real_T g;
  real_T (*inertiaTensor_1)[9];
  real_T (*inertiaTensor_2)[9];
  real_T (*inertiaTensor_3)[9];
  real_T (*inertiaTensor_4)[9];
  real_T (*inertiaTensor_5)[9];
  real_T (*inertiaTensor_6)[9];
  real_T (*COMVector_1)[3];
  real_T (*COMVector_2)[3];
  real_T (*COMVector_3)[3];
  real_T (*COMVector_4)[3];
  real_T (*COMVector_5)[3];
  real_T (*COMVector_6)[3];
  real_T (*angleVector)[6];
  real_T (*angleVelocityVector)[6];
  real_T (*angularAccelerationVector)[6];
  real_T (*sinVector)[6];
  real_T (*cosVector)[6];
  real_T (*tiltVector)[4];
  emlrtStack st = { NULL, NULL, NULL };

  st.tls = emlrtRootTLSGlobal;
  coriolis = (real_T (*)[36])mxMalloc(sizeof(real_T [36]));
  prhs[0] = emlrtProtectR2012b(prhs[0], 0, false, -1);
  prhs[1] = emlrtProtectR2012b(prhs[1], 1, false, -1);
  prhs[3] = emlrtProtectR2012b(prhs[3], 3, false, -1);
  prhs[4] = emlrtProtectR2012b(prhs[4], 4, false, -1);
  prhs[5] = emlrtProtectR2012b(prhs[5], 5, false, -1);
  prhs[6] = emlrtProtectR2012b(prhs[6], 6, false, -1);
  prhs[7] = emlrtProtectR2012b(prhs[7], 7, false, -1);
  prhs[8] = emlrtProtectR2012b(prhs[8], 8, false, -1);
  prhs[9] = emlrtProtectR2012b(prhs[9], 9, false, -1);
  prhs[10] = emlrtProtectR2012b(prhs[10], 10, false, -1);
  prhs[11] = emlrtProtectR2012b(prhs[11], 11, false, -1);
  prhs[12] = emlrtProtectR2012b(prhs[12], 12, false, -1);
  prhs[13] = emlrtProtectR2012b(prhs[13], 13, false, -1);
  prhs[14] = emlrtProtectR2012b(prhs[14], 14, false, -1);
  prhs[15] = emlrtProtectR2012b(prhs[15], 15, false, -1);
  prhs[16] = emlrtProtectR2012b(prhs[16], 16, false, -1);
  prhs[17] = emlrtProtectR2012b(prhs[17], 17, false, -1);
  prhs[18] = emlrtProtectR2012b(prhs[18], 18, false, -1);
  prhs[19] = emlrtProtectR2012b(prhs[19], 19, false, -1);
  prhs[20] = emlrtProtectR2012b(prhs[20], 20, false, -1);

  /* Marshall function inputs */
  lengthVector = emlrt_marshallIn(&st, emlrtAlias(prhs[0]), "lengthVector");
  massVector = c_emlrt_marshallIn(&st, emlrtAlias(prhs[1]), "massVector");
  g = e_emlrt_marshallIn(&st, emlrtAliasP(prhs[2]), "g");
  inertiaTensor_1 = g_emlrt_marshallIn(&st, emlrtAlias(prhs[3]),
    "inertiaTensor_1");
  inertiaTensor_2 = g_emlrt_marshallIn(&st, emlrtAlias(prhs[4]),
    "inertiaTensor_2");
  inertiaTensor_3 = g_emlrt_marshallIn(&st, emlrtAlias(prhs[5]),
    "inertiaTensor_3");
  inertiaTensor_4 = g_emlrt_marshallIn(&st, emlrtAlias(prhs[6]),
    "inertiaTensor_4");
  inertiaTensor_5 = g_emlrt_marshallIn(&st, emlrtAlias(prhs[7]),
    "inertiaTensor_5");
  inertiaTensor_6 = g_emlrt_marshallIn(&st, emlrtAlias(prhs[8]),
    "inertiaTensor_6");
  COMVector_1 = i_emlrt_marshallIn(&st, emlrtAlias(prhs[9]), "COMVector_1");
  COMVector_2 = i_emlrt_marshallIn(&st, emlrtAlias(prhs[10]), "COMVector_2");
  COMVector_3 = i_emlrt_marshallIn(&st, emlrtAlias(prhs[11]), "COMVector_3");
  COMVector_4 = i_emlrt_marshallIn(&st, emlrtAlias(prhs[12]), "COMVector_4");
  COMVector_5 = i_emlrt_marshallIn(&st, emlrtAlias(prhs[13]), "COMVector_5");
  COMVector_6 = i_emlrt_marshallIn(&st, emlrtAlias(prhs[14]), "COMVector_6");
  angleVector = c_emlrt_marshallIn(&st, emlrtAlias(prhs[15]), "angleVector");
  angleVelocityVector = c_emlrt_marshallIn(&st, emlrtAlias(prhs[16]),
    "angleVelocityVector");
  angularAccelerationVector = c_emlrt_marshallIn(&st, emlrtAlias(prhs[17]),
    "angularAccelerationVector");
  sinVector = c_emlrt_marshallIn(&st, emlrtAlias(prhs[18]), "sinVector");
  cosVector = c_emlrt_marshallIn(&st, emlrtAlias(prhs[19]), "cosVector");
  tiltVector = k_emlrt_marshallIn(&st, emlrtAlias(prhs[20]), "tiltVector");

  /* Invoke the target function */
  coriolisMatrix(*lengthVector, *massVector, g, *inertiaTensor_1,
                 *inertiaTensor_2, *inertiaTensor_3, *inertiaTensor_4,
                 *inertiaTensor_5, *inertiaTensor_6, *COMVector_1, *COMVector_2,
                 *COMVector_3, *COMVector_4, *COMVector_5, *COMVector_6,
                 *angleVector, *angleVelocityVector, *angularAccelerationVector,
                 *sinVector, *cosVector, *tiltVector, *coriolis);

  /* Marshall function outputs */
  plhs[0] = emlrt_marshallOut(*coriolis);
}

/*
 * Arguments    : void
 * Return Type  : void
 */
void coriolisMatrix_atexit(void)
{
  emlrtStack st = { NULL, NULL, NULL };

  mexFunctionCreateRootTLS();
  st.tls = emlrtRootTLSGlobal;
  emlrtEnterRtStackR2012b(&st);
  emlrtLeaveRtStackR2012b(&st);
  emlrtDestroyRootTLS(&emlrtRootTLSGlobal);
  coriolisMatrix_xil_terminate();
}

/*
 * Arguments    : void
 * Return Type  : void
 */
void coriolisMatrix_initialize(void)
{
  emlrtStack st = { NULL, NULL, NULL };

  mexFunctionCreateRootTLS();
  st.tls = emlrtRootTLSGlobal;
  emlrtClearAllocCountR2012b(&st, false, 0U, 0);
  emlrtEnterRtStackR2012b(&st);
  emlrtFirstTimeR2012b(emlrtRootTLSGlobal);
}

/*
 * Arguments    : void
 * Return Type  : void
 */
void coriolisMatrix_terminate(void)
{
  emlrtStack st = { NULL, NULL, NULL };

  st.tls = emlrtRootTLSGlobal;
  emlrtLeaveRtStackR2012b(&st);
  emlrtDestroyRootTLS(&emlrtRootTLSGlobal);
}

/*
 * File trailer for _coder_coriolisMatrix_api.c
 *
 * [EOF]
 */
