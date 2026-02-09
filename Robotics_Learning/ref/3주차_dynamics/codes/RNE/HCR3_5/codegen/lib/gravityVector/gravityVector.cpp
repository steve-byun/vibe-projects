//
// File: gravityVector.cpp
//
// MATLAB Coder version            : 3.1
// C/C++ source code generated on  : 05-Aug-2016 00:55:37
//

// Include Files
#include "rt_nonfinite.h"
#include "gravityVector.h"

// Function Definitions

//
// length vector
// Arguments    : const double lengthVector[6]
//                const double massVector[6]
//                double g
//                const double inertiaTensor_1[9]
//                const double inertiaTensor_2[9]
//                const double inertiaTensor_3[9]
//                const double inertiaTensor_4[9]
//                const double inertiaTensor_5[9]
//                const double inertiaTensor_6[9]
//                const double COMVector_1[3]
//                const double COMVector_2[3]
//                const double COMVector_3[3]
//                const double COMVector_4[3]
//                const double COMVector_5[3]
//                const double COMVector_6[3]
//                const double angleVector[6]
//                const double angleVelocityVector[6]
//                const double angularAccelerationVector[6]
//                const double sinVector[6]
//                const double cosVector[6]
//                const double tiltVector[4]
//                double gravity[6]
// Return Type  : void
//
void gravityVector(const double lengthVector[6], const double massVector[6],
                   double g, const double [9], const double [9], const double [9],
                   const double [9], const double [9], const double [9], const
                   double COMVector_1[3], const double COMVector_2[3], const
                   double COMVector_3[3], const double COMVector_4[3], const
                   double COMVector_5[3], const double COMVector_6[3], const
                   double [6], const double [6], const double [6], const double
                   sinVector[6], const double cosVector[6], const double
                   tiltVector[4], double gravity[6])
{
  double t3;
  double t7;
  double t9;
  double t13;
  double t16;
  double t18;
  double t22;
  double t25;
  double t26;
  double t31;
  double t33;
  double t36;
  double t39;
  double t53;
  double t41;
  double t44;
  double t45;
  double t54;
  double t46;
  double t48;
  double t49;
  double t50;
  double t51;
  double t52;
  double t66;
  double t56;
  double t57;
  double t58;
  double t59;
  double t61;
  double t62;
  double t63;
  double t64;
  double t65;
  double t68;
  double t70;
  double t71;
  double t72;
  double t73;
  double t74;
  double t75;
  double t76;
  double t77;
  double t78;
  double t79;
  double t85;
  double t91;
  double t116;
  double t92;
  double t94;
  double t95;
  double t96;
  double t97;
  double t99;
  double t104;
  double t107;
  double t108;
  double t101;
  double t102;
  double t103;
  double t110;
  double t122;
  double t123;
  double t127;
  double t129;
  double t130;
  double t131;
  double t133;
  double t137;
  double t135;
  double t136;
  double t138;
  double t139;
  double t140;
  double t141;
  double t142;
  double t143;
  double t144;
  double t145;

  //  mass vector
  //  gravity has only one
  //  inertia vector
  //  center of mass vector
  //  input angle vector
  //  input angular velocity vector
  //  input angular acceleration vector
  //  sin vector
  //  cos vector
  //  tilt vector
  t3 = sinVector[0] * tiltVector[0] - cosVector[0] * tiltVector[2] * tiltVector
    [1];
  t7 = cosVector[1] * t3 + tiltVector[2] * tiltVector[3] * sinVector[1];
  t9 = sinVector[1] * t3 - cosVector[1] * tiltVector[2] * tiltVector[3];
  t13 = cosVector[2] * t9 + sinVector[2] * t7;
  t16 = cosVector[2] * t7 - sinVector[2] * t9;
  t18 = cosVector[3] * t13 + sinVector[3] * t16;
  t22 = cosVector[0] * tiltVector[0] + tiltVector[2] * sinVector[0] *
    tiltVector[1];
  t25 = cosVector[3] * t16 - sinVector[3] * t13;
  t26 = sinVector[4] * t22 - cosVector[4] * t25;
  t31 = sinVector[5] * t18 + cosVector[5] * t26;
  t33 = cosVector[5] * t18 - sinVector[5] * t26;
  t36 = cosVector[4] * t22 + sinVector[4] * t25;
  t39 = cosVector[5] * massVector[5] * t31;
  t53 = massVector[5] * sinVector[5] * t33;
  t41 = (massVector[4] * t26 + t39) - t53;
  t44 = massVector[4] * t36 + massVector[5] * t36;
  t45 = sinVector[4] * t44;
  t54 = cosVector[4] * t41;
  t46 = (massVector[3] * t25 + t45) - t54;
  t48 = massVector[4] * t18;
  t49 = cosVector[5] * massVector[5] * t33;
  t50 = massVector[5] * sinVector[5] * t31;
  t51 = ((massVector[3] * t18 + t48) + t49) + t50;
  t52 = cosVector[3] * t51;
  t66 = sinVector[3] * t46;
  t56 = (t52 + massVector[2] * t13) - t66;
  t57 = cosVector[2] * t56;
  t58 = cosVector[3] * t46;
  t59 = sinVector[3] * t51;
  t61 = (t58 + t59) + massVector[2] * t16;
  t62 = lengthVector[5] + COMVector_6[2];
  t63 = cosVector[4] * t44;
  t64 = sinVector[4] * t41;
  t65 = massVector[3] * t22;
  t68 = massVector[5] * COMVector_6[1] * t36 - massVector[5] * t33 * t62;
  t70 = massVector[5] * COMVector_6[0] * t36 - massVector[5] * t31 * t62;
  t71 = (t48 + t49) + t50;
  t72 = t49 + t50;
  t73 = t39 - t53;
  t74 = lengthVector[4] - COMVector_5[1];
  t75 = t63 + t64;
  t76 = (t63 + t64) + t65;
  t77 = lengthVector[3] + COMVector_4[1];
  t78 = massVector[2] * t22;
  t79 = ((t63 + t64) + t65) + t78;
  t85 = ((((COMVector_5[2] * t72 + cosVector[5] * t68) + sinVector[5] * t70) -
          COMVector_5[2] * t71) - t44 * t74) - massVector[5] * COMVector_5[1] *
    t36;
  t91 = massVector[5] * COMVector_6[0] * t33;
  t116 = massVector[5] * COMVector_6[1] * t31;
  t92 = ((((COMVector_5[1] * t73 + COMVector_5[0] * t71) + t41 * t74) + t91) -
         COMVector_5[0] * t72) - t116;
  t94 = ((((cosVector[4] * t85 + COMVector_4[1] * t71) + COMVector_4[2] * t75) -
          sinVector[4] * t92) - COMVector_4[2] * t76) - t51 * t77;
  t95 = COMVector_5[2] * t73;
  t96 = cosVector[5] * t70;
  t97 = t45 - t54;
  t99 = COMVector_5[0] * t44;
  t104 = sinVector[5] * t68;
  t107 = COMVector_5[2] * t41;
  t108 = massVector[5] * COMVector_5[0] * t36;
  t101 = ((((((((t95 + t96) + COMVector_4[0] * t76) + t99) + t46 * t77) - t104)
            - COMVector_4[0] * t75) - COMVector_4[1] * t97) - t107) - t108;
  t102 = cosVector[2] * t61;
  t103 = sinVector[2] * t56;
  t110 = t52 - t66;
  t122 = ((((sinVector[3] * t101 + COMVector_3[2] * t110) + cosVector[3] * t94)
           + COMVector_3[1] * t79) - COMVector_3[2] * t56) - COMVector_3[1] *
    t76;
  t123 = t58 + t59;
  t127 = lengthVector[2] - COMVector_3[0];
  t129 = ((((COMVector_3[2] * t123 + sinVector[3] * t94) + COMVector_3[0] * t76)
           + t79 * t127) - cosVector[3] * t101) - COMVector_3[2] * t61;
  t130 = massVector[1] * t22;
  t131 = (((t63 + t64) + t65) + t78) + t130;
  t133 = (t102 + t103) + massVector[1] * t7;
  t137 = sinVector[2] * t61;
  t135 = (t57 + massVector[1] * t9) - t137;
  t136 = cosVector[1] * t133;
  t138 = sinVector[1] * t135;
  t139 = lengthVector[1] - COMVector_2[0];
  t140 = t102 + t103;
  t141 = COMVector_4[2] * t46;
  t142 = t56 * t127;
  t143 = COMVector_3[0] * t110;
  t144 = COMVector_3[1] * t123;
  t145 = COMVector_4[0] * t71;
  gravity[0] = g * (((((COMVector_1[2] * (t136 + t138) + COMVector_1[0] * t131)
                       - COMVector_1[2] * ((t136 + t138) + massVector[0] * t3))
                      + sinVector[1] * (((((cosVector[2] * t122 - COMVector_2[1]
    * t79) + COMVector_2[1] * t131) - COMVector_2[2] * t135) - sinVector[2] *
    t129) + COMVector_2[2] * (t57 - sinVector[2] * t61))) - COMVector_1[0] *
                     (((((t63 + t64) + t65) + t78) + t130) + massVector[0] * t22))
                    + cosVector[1] * (((((cosVector[2] * t129 + COMVector_2[0] *
    t79) - COMVector_2[2] * t133) + COMVector_2[2] * t140) + sinVector[2] * t122)
    + t131 * t139));
  gravity[1] = -g * (((((((((((((t141 + t142) + t143) + t144) + t145) -
    cosVector[4] * t92) - COMVector_4[0] * t51) - COMVector_3[1] * t61) -
    COMVector_4[2] * t97) - COMVector_2[1] * t133) + COMVector_2[1] * t140) -
                       sinVector[4] * t85) + t135 * t139) + COMVector_2[0] *
                     (t57 - t137));
  gravity[2] = -g * (((((((((t141 + t142) + t143) + t144) + t145) - cosVector[4]
    * t92) - COMVector_4[0] * t51) - COMVector_3[1] * t61) - COMVector_4[2] *
                      t97) - sinVector[4] * t85);
  gravity[3] = g * (((((-t141 - t145) + cosVector[4] * t92) + COMVector_4[0] *
                      t51) + sinVector[4] * t85) + COMVector_4[2] * (t45 - t54));
  gravity[4] = g * (((((t95 + t96) + t99) - t104) - t107) - t108);
  gravity[5] = g * (t91 - t116);
}

//
// File trailer for gravityVector.cpp
//
// [EOF]
//
