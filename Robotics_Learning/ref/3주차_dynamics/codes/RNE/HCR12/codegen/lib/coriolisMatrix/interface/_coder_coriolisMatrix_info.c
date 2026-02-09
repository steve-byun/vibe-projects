/*
 * File: _coder_coriolisMatrix_info.c
 *
 * MATLAB Coder version            : 3.1
 * C/C++ source code generated on  : 16-Dec-2017 18:21:45
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
    "789ced564d6fd3301876d028e3c087b871a227843429663b203471e9daa186b5a81a15ea344dc84d0cb564c7919d6eedade2b423077e003f8703c7ed67a049bb"
    "70c56ed3ce32915225818298252779623fcef3bc7e5fc5c0f1da40b5bbaa7fbd074045ddd755bf0166ed66829de4d959bc5f037712fc51759f87311ec5b3c110",
    "310ce62de08c84288cbbe308038125a7c738988ebc27147709c32d6e80265180bd348616400f89815cac0ca809664dfb98802b1f6b293eda868ffb093edc3d6a"
    "6cc3260a4f06e85d17fb831312c2667d7f736b76ad76dec237840d298a090fab0d1423d8182ba3c497d0e782704a641bc5828c5c96e8789ea163ddd2a1311301",
    "3926015e865fb1f89569b4877d8a978bc32b8baff1a1d7eaed1ed5b76147f00f02b1aa0ebe84ed5ab755db81fb5b4f379f2118734efb7c0431a390923e6428a6"
    "a80f7924e15cbf1b5ded87e9a392a2c33174dc4edeab76fae2cb79ad00bfe8f7c78f1f96f3fd2706df49e103e39e67fe04fc7dfb9ca6e396a543e36499a5f845",
    "f3ddb3f85e097198878119fb912f5f263fbe77569aefa5f1579def7f6a9f3b193a1e593a34f67980854bd4cf528488ba44ee0c098dbdf0f5906141fc52eae034"
    "83dfb3f8bd3cf1d17d63ea066ecced40db8ecb0ae4d3e7cb6f67d7f5b0c4fc09f837eaa16ae9d0d8aa07e9238a47519db3481db4544697510f9f32f80716ff20",
    "4f7c52ebe1173b25fc27802ceb5cb26afeff5217cd0c1d0f2c1d1a5b75a1564d8ffbef3827ed59fcbd3c7149ad076523894c8173d2c5f539297bfe4f46798db4",
    "" };

  nameCaptureInfo = NULL;
  emlrtNameCaptureMxArrayR2016a(data, 4056U, &nameCaptureInfo);
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
