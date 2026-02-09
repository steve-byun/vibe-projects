//
// File: gravityVector.cpp
//
// MATLAB Coder version            : 3.1
// C/C++ source code generated on  : 16-Dec-2017 18:21:28
//

// Include Files
#include "rt_nonfinite.h"
#include "gravityVector.h"

// Function Definitions

//
// length vector
// Arguments    : const double lengthVector[7]
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
void gravityVector(const double lengthVector[7], const double massVector[6],
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
  double t6;
  double t9;
  double t12;
  double t16;
  double t20;
  double t22;
  double t24;
  double t27;
  double t29;
  double t31;
  double t34;
  double t38;
  double t35;
  double t37;
  double t44;
  double t39;
  double t43;
  double t45;
  double t61;
  double t47;
  double t48;
  double t49;
  double t50;
  double t51;
  double t52;
  double t54;
  double t55;
  double t56;
  double t57;
  double t59;
  double t60;
  double t63;
  double t64;
  double t66;
  double t65;
  double t67;
  double t68;
  double t69;
  double t70;
  double t71;
  double t72;
  double t73;
  double t74;
  double t75;
  double t76;
  double t79;
  double t80;
  double t81;
  double t82;
  double t83;
  double t84;
  double t85;
  double t86;
  double t87;
  double t88;
  double t89;
  double t90;
  double t105;
  double t106;
  double t92;
  double t93;
  double t94;
  double t95;
  double t108;
  double t109;
  double t110;
  double t97;
  double t101;
  double t98;
  double t99;
  double t100;
  double t102;
  double t103;
  double t104;
  double t107;
  double t111;
  double t112;
  double t113;
  double t115;
  double t118;
  double t119;
  double t137;
  double t138;
  double t139;
  double t120;
  double t121;
  double t123;
  double t125;
  double t126;
  double t127;
  double t128;
  double t129;
  double t130;
  double t131;
  double t132;
  double t133;
  double t134;
  double t135;
  double t142;
  double t143;
  double t144;
  double t145;
  double t147;
  double t148;

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
  t6 = sinVector[1] * t3 - cosVector[1] * tiltVector[2] * tiltVector[3];
  t9 = cosVector[1] * t3 + tiltVector[2] * tiltVector[3] * sinVector[1];
  t12 = cosVector[2] * t9 - sinVector[2] * t6;
  t16 = cosVector[0] * tiltVector[0] + tiltVector[2] * sinVector[0] *
    tiltVector[1];
  t20 = cosVector[2] * t6 + sinVector[2] * t9;
  t22 = sinVector[3] * t16 + cosVector[3] * t20;
  t24 = sinVector[4] * t12 + cosVector[4] * t22;
  t27 = cosVector[3] * t16 - sinVector[3] * t20;
  t29 = cosVector[4] * t12 - sinVector[4] * t22;
  t31 = cosVector[5] * t27;
  t34 = cosVector[5] * t24 + sinVector[5] * t27;
  t38 = sinVector[5] * t24;
  t35 = t31 - t38;
  t37 = cosVector[5] * massVector[5] * t34;
  t44 = massVector[5] * sinVector[5] * t35;
  t39 = (massVector[4] * t24 + t37) - t44;
  t43 = massVector[4] * t29 + massVector[5] * t29;
  t45 = cosVector[4] * t39;
  t61 = sinVector[4] * t43;
  t47 = (t45 + massVector[3] * t22) - t61;
  t48 = cosVector[3] * t47;
  t49 = massVector[3] * t27;
  t50 = massVector[4] * t27;
  t51 = massVector[5] * sinVector[5] * t34;
  t52 = cosVector[5] * massVector[5] * t35;
  t54 = massVector[2] * t20;
  t55 = (t48 + t54) - sinVector[3] * (((t49 + t50) + t51) + t52);
  t56 = sinVector[4] * t39;
  t57 = cosVector[4] * t43;
  t59 = massVector[3] * t12;
  t60 = ((t56 + t57) + massVector[2] * t12) + t59;
  t63 = cosVector[2] * t55;
  t64 = massVector[1] * t6;
  t66 = sinVector[2] * t60;
  t65 = (t63 + t64) - t66;
  t67 = lengthVector[6] + COMVector_6[2];
  t68 = (t56 + t57) + t59;
  t69 = cosVector[5] * massVector[5] * (t31 - t38);
  t70 = (t50 + t51) + t69;
  t71 = ((t49 + t50) + t51) + t69;
  t72 = sinVector[3] * t47;
  t73 = cosVector[3] * t71;
  t74 = lengthVector[5] + COMVector_5[2];
  t75 = t56 + t57;
  t76 = lengthVector[4] - COMVector_4[1];
  t79 = massVector[5] * t34 * t67 + massVector[5] * COMVector_6[0] * t29;
  t80 = massVector[5] * t35 * t67;
  t81 = massVector[5] * COMVector_6[1] * t29;
  t82 = t80 + t81;
  t83 = t37 - t44;
  t84 = t51 + t52;
  t85 = massVector[2] * t16;
  t86 = COMVector_5[1] * t39;
  t87 = massVector[5] * COMVector_6[1] * t34;
  t88 = t70 * t74;
  t89 = sinVector[5] * t79;
  t90 = COMVector_5[1] * t43;
  t105 = COMVector_5[2] * t84;
  t106 = massVector[5] * COMVector_5[1] * t29;
  t92 = ((((t88 + t89) + t90) + cosVector[5] * t82) - t105) - t106;
  t93 = t45 - t61;
  t94 = (t72 + t73) + t85;
  t95 = t72 + t73;
  t108 = COMVector_5[0] * t70;
  t109 = COMVector_5[1] * t83;
  t110 = massVector[5] * COMVector_6[0] * t35;
  t97 = ((((t86 + t87) + COMVector_5[0] * t84) - t108) - t109) - t110;
  t101 = sinVector[3] * t71;
  t98 = (t48 + t54) - t101;
  t99 = cosVector[2] * t60;
  t100 = massVector[1] * t9;
  t102 = sinVector[2] * t98;
  t103 = (t99 + t100) + t102;
  t104 = COMVector_3[1] * t60;
  t107 = COMVector_4[2] * t68;
  t111 = COMVector_4[1] * t70;
  t112 = t71 * t76;
  t113 = COMVector_3[2] * t94;
  t115 = t39 * t74;
  t118 = cosVector[5] * t79;
  t119 = COMVector_5[0] * t43;
  t137 = sinVector[5] * t82;
  t138 = COMVector_5[2] * t83;
  t139 = massVector[5] * COMVector_5[0] * t29;
  t120 = ((((((((COMVector_4[0] * t68 + t115) + COMVector_4[1] * t93) + t47 *
               t76) + t118) + t119) - COMVector_4[0] * t75) - t137) - t138) -
    t139;
  t121 = sinVector[3] * t120;
  t123 = ((((t86 + t87) - t108) - t109) - t110) + COMVector_5[0] * (t51 + t52);
  t125 = ((((t88 + t89) + t90) - t105) - t106) + cosVector[5] * (t80 + t81);
  t126 = COMVector_4[2] * t93;
  t127 = COMVector_4[0] * t71;
  t128 = lengthVector[3] + COMVector_3[0];
  t129 = t94 * t128;
  t130 = massVector[1] * t16;
  t131 = ((t72 + t73) + t85) + t130;
  t132 = cosVector[2] * t98;
  t133 = (t64 - t66) + t132;
  t134 = t99 + t102;
  t135 = t48 - t101;
  t142 = ((((t107 + t111) + t112) + cosVector[4] * t125) + sinVector[4] * t123)
    - COMVector_4[2] * t75;
  t143 = lengthVector[2] + COMVector_2[0];
  t144 = COMVector_3[0] * t68;
  t145 = COMVector_3[2] * t135;
  t147 = sinVector[3] * t142;
  t148 = sinVector[4] * t125;
  gravity[0] = -g * (((((cosVector[1] * (((((cosVector[2] * (((((t104 + t113) +
    t121) + cosVector[3] * t142) - COMVector_3[1] * t68) - COMVector_3[2] * t95)
    + COMVector_2[1] * t94) + COMVector_2[2] * t103) - COMVector_2[1] * t131) -
    COMVector_2[2] * t134) - sinVector[2] * (((((((((t126 + t127) + t129) + t148)
    - cosVector[4] * t123) - COMVector_4[2] * t47) - COMVector_4[0] * t70) -
    COMVector_3[0] * t95) - COMVector_3[1] * t98) + COMVector_3[1] * t135)) +
    (lengthVector[1] + COMVector_1[0]) * ((((t72 + t73) + t85) + t130) +
    massVector[0] * t16)) - COMVector_1[0] * t131) - COMVector_1[2] *
                       (sinVector[1] * t65 + cosVector[1] * ((t99 + t100) +
    sinVector[2] * t55))) - sinVector[1] * (((((-COMVector_2[2] * t65 -
    COMVector_2[0] * t94) + t131 * t143) + sinVector[2] * (((((t104 + t113) +
    t121) + cosVector[3] * (((((t107 + t111) + t112) + cosVector[4] * t92) -
    COMVector_4[2] * t75) + sinVector[4] * t97)) - COMVector_3[1] * t68) -
    COMVector_3[2] * t95)) + COMVector_2[2] * (t63 - t66)) + cosVector[2] *
    (((((((((t126 + t127) + t129) - cosVector[4] * t97) - COMVector_4[2] * t47)
         - COMVector_4[0] * t70) - COMVector_3[0] * t95) - COMVector_3[1] * t98)
      + sinVector[4] * t92) + COMVector_3[1] * (t48 - sinVector[3] * t71)))) +
                     COMVector_1[2] * ((cosVector[1] * t103 + massVector[0] * t3)
    + sinVector[1] * t133));
  gravity[1] = -g * (((((((((t144 + t145) + t147) - cosVector[3] * t120) -
    COMVector_3[2] * t98) + COMVector_2[0] * t134) + COMVector_2[1] * t133) -
                       t60 * t128) - t103 * t143) + COMVector_2[1] * (t66 - t132));
  gravity[2] = -g * (((((t144 + t145) + t147) - cosVector[3] * t120) -
                      COMVector_3[2] * t98) - t60 * t128);
  gravity[3] = g * (((((t126 + t127) + t148) - cosVector[4] * t123) -
                     COMVector_4[2] * t47) - COMVector_4[0] * t70);
  gravity[4] = g * (((((t115 + t118) + t119) - t137) - t138) - t139);
  gravity[5] = -g * (t87 - t110);
}

//
// File trailer for gravityVector.cpp
//
// [EOF]
//
