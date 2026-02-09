/*
 * File: _coder_coriolisMatrix_info.c
 *
 * MATLAB Coder version            : 3.1
 * C/C++ source code generated on  : 05-Aug-2016 00:55:52
 */

/* Include Files */
#include "_coder_coriolisMatrix_info.h"

/* Function Definitions */

/*
 * Arguments    : void
 * Return Type  : const mxArray *
 */
const mxArray *emlrtMexFcnResolvedFunctionsInfo()
{
  const mxArray *nameCaptureInfo;
  const char * data[6] = {
    "789ced56bf4fe330147610146ee087d86039a61312520c0c0821960287c8d1a20a7528420c6e62c0921d474e5a95ad62626460b8f1fea01be1cf40482cacd86d"
    "5a221329551228082c59c967fb7b7edff37bb2816195816c53b2ff9d06a020bf13b28f806e1b0bb111fe1bfdf1513019e24bd96dee06b81574275dc430e83587",
    "33e22237a85e781808ec73dac44e67e694505c250c977804ec1109d86e64aa0fd49438f7fb96018d826e533a2ae045c7688c8ef9888e99101fff3ed9de803bb8"
    "096d2e08a7c42fa3409096c95eecae27d89dd0ec2acc84439ac4c183f00b1abfd0895ea34e7177ff7602ff8fc657f8d82ad53ad22a829f09c41654307d582e56",
    "4bc52d78b8babcb28660c039adf316c48c424aea90a180a23ae49e0f7bfe9b5e7c1c0a317e18113f7e84e3b25d6dfebb2b66e067ddffe2d75c3efb2f46f8460c"
    "1f44be69d6b7c1c73be7383fc6353f140ecd0cc4cf9aef96c6b77288432f0c2c721ee9f2a5fd745f196abee7c61f76bebfd73927dd1b3f353f14b6b9838549e4",
    "e5275c444de26f35080d2cf7a0c1b020762e757095c0af69fc5a9af8a8bed45103977a72a02ec76419f2e9e6f1ffed773d0cb0be0d3e473d2c687e28acd5836f"
    "238a5bde36671e0a88cce83ceae13a817fa4f18fd2c427b61e5ec9c9e19e007e5eef9261f3bf4a5dec25f831abf9a1b05617d26a7cdcdfe29db4aff1f7d3c425",
    "b61ea48c303219de490fdfefa4e4f5cf65697b8b", "" };

  nameCaptureInfo = NULL;
  emlrtNameCaptureMxArrayR2016a(data, 4008U, &nameCaptureInfo);
  return nameCaptureInfo;
}

/*
 * Arguments    : void
 * Return Type  : mxArray *
 */
mxArray *emlrtMexFcnProperties()
{
  mxArray *xResult;
  mxArray *xEntryPoints;
  const char * fldNames[4] = { "Name", "NumberOfInputs", "NumberOfOutputs",
    "ConstantInputs" };

  mxArray *xInputs;
  const char * b_fldNames[4] = { "Version", "ResolvedFunctions", "EntryPoints",
    "CoverageInfo" };

  xEntryPoints = emlrtCreateStructMatrix(1, 1, 4, fldNames);
  xInputs = emlrtCreateLogicalMatrix(1, 21);
  emlrtSetField(xEntryPoints, 0, "Name", mxCreateString("coriolisMatrix"));
  emlrtSetField(xEntryPoints, 0, "NumberOfInputs", mxCreateDoubleScalar(21.0));
  emlrtSetField(xEntryPoints, 0, "NumberOfOutputs", mxCreateDoubleScalar(1.0));
  emlrtSetField(xEntryPoints, 0, "ConstantInputs", xInputs);
  xResult = emlrtCreateStructMatrix(1, 1, 4, b_fldNames);
  emlrtSetField(xResult, 0, "Version", mxCreateString("9.0.0.341360 (R2016a)"));
  emlrtSetField(xResult, 0, "ResolvedFunctions", (mxArray *)
                emlrtMexFcnResolvedFunctionsInfo());
  emlrtSetField(xResult, 0, "EntryPoints", xEntryPoints);
  return xResult;
}

/*
 * File trailer for _coder_coriolisMatrix_info.c
 *
 * [EOF]
 */
