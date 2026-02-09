//
// File: inertiaMatrix.cpp
//
// MATLAB Coder version            : 3.1
// C/C++ source code generated on  : 05-Aug-2016 00:56:18
//

// Include Files
#include "rt_nonfinite.h"
#include "inertiaMatrix.h"

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
//                double inertia[36]
// Return Type  : void
//
void inertiaMatrix(const double lengthVector[6], const double massVector[6],
                   double, const double inertiaTensor_1[9], const double
                   inertiaTensor_2[9], const double inertiaTensor_3[9], const
                   double inertiaTensor_4[9], const double inertiaTensor_5[9],
                   const double inertiaTensor_6[9], const double COMVector_1[3],
                   const double COMVector_2[3], const double COMVector_3[3],
                   const double COMVector_4[3], const double COMVector_5[3],
                   const double COMVector_6[3], const double [6], const double
                   [6], const double [6], const double sinVector[6], const
                   double cosVector[6], const double [4], double inertia[36])
{
  double t3;
  double t8;
  double t9;
  double t12;
  double t15;
  double t16;
  double t17;
  double t18;
  double t19;
  double t20;
  double t23;
  double t31;
  double t24;
  double t26;
  double t27;
  double t28;
  double t35;
  double t40;
  double t44;
  double t45;
  double t54;
  double t51;
  double t58;
  double t62;
  double t74;
  double t63;
  double t66;
  double t67;
  double t71;
  double t72;
  double t73;
  double t75;
  double t84;
  double t77;
  double t79;
  double t81;
  double t82;
  double t83;
  double t85;
  double t87;
  double t88;
  double t89;
  double t99;
  double t91;
  double t92;
  double t95;
  double t96;
  double t98;
  double t104;
  double t103;
  double t105;
  double t106;
  double t110;
  double t115;
  double t116;
  double t117;
  double t118;
  double t119;
  double t120;
  double t121;
  double t132;
  double t133;
  double t134;
  double t177;
  double t178;
  double t180;
  double t140;
  double t144;
  double t146;
  double t148;
  double t150;
  double t151;
  double t152;
  double t153;
  double t154;
  double t168;
  double t169;
  double t170;
  double t155;
  double t158;
  double t160;
  double t161;
  double t162;
  double t163;
  double t164;
  double t171;
  double t185;
  double t190;
  double t192;
  double t193;
  double t194;
  double t195;
  double t196;
  double t197;
  double t198;
  double t199;
  double t202;
  double t200;
  double t201;
  double t210;
  double t204;
  double t205;
  double t206;
  double t219;
  double t207;
  double t208;
  double t209;
  double t211;
  double t212;
  double t214;
  double t216;
  double t245;
  double t218;
  double t221;
  double t244;
  double t223;
  double t225;
  double t226;
  double t227;
  double t230;
  double t231;
  double t232;
  double t234;
  double t236;
  double t237;
  double t239;
  double t243;
  double t242;
  double t247;
  double t249;
  double t250;
  double t251;
  double t254;
  double t255;
  double t256;
  double t257;
  double t258;
  double t259;
  double t260;
  double t261;
  double t263;
  double t274;
  double t265;
  double t267;
  double t276;
  double t277;
  double t269;
  double t270;
  double t271;
  double t272;
  double t273;
  double t275;
  double t278;
  double t279;
  double t281;
  double t310;
  double t311;
  double t312;
  double t314;
  double t282;
  double t283;
  double t284;
  double t285;
  double t286;
  double t287;
  double t288;
  double t289;
  double t317;
  double t318;
  double t319;
  double t291;
  double t292;
  double t293;
  double t294;
  double t321;
  double t322;
  double t323;
  double t297;
  double t298;
  double t320;
  double t299;
  double t301;
  double t302;
  double t304;
  double t303;
  double t306;
  double t307;
  double t308;
  double t309;
  double t315;
  double t324;
  double t325;
  double t327;
  double t328;
  double t329;
  double t330;
  double t331;
  double t332;
  double t339;
  double t333;
  double t336;
  double t338;
  double t342;
  double t343;
  double t345;
  double t349;
  double t350;
  double t351;
  double t352;
  double t354;
  double t355;
  double t358;
  double t359;
  double t360;
  double t361;
  double t364;
  double t366;
  double t367;
  double t370;
  double t373;
  double t375;
  double t376;
  double t377;
  double t378;
  double t380;
  double t381;
  double t382;
  double t398;
  double t400;
  double t383;
  double t387;
  double t409;
  double t388;
  double t392;
  double t394;
  double t395;
  double t396;
  double t401;
  double t405;
  double t402;
  double t403;
  double t404;
  double t414;
  double t415;
  double t417;
  double t420;
  double t422;
  double t424;
  double t425;
  double t426;
  double t428;
  double t429;
  double t430;
  double t431;
  double t433;
  double t434;
  double t448;
  double t437;
  double t439;
  double t440;
  double t441;
  double t444;
  double t447;
  double t449;
  double t452;
  double t456;
  double t453;
  double t454;
  double t455;
  double t457;
  double t458;
  double t459;
  double t460;
  double t461;
  double t462;
  double t470;
  double t463;
  double t464;
  double t465;
  double t467;
  double t468;
  double t469;
  double t472;
  double t473;
  double t474;
  double t480;
  double t482;
  double t476;
  double t477;
  double t478;
  double t483;
  double t614;
  double t484;
  double t489;
  double t492;
  double t496;
  double t497;
  double t498;
  double t501;
  double t503;
  double t506;
  double t512;
  double t516;
  double t517;
  double t519;
  double t520;
  double t521;
  double t523;
  double t524;
  double t541;
  double t543;
  double t526;
  double t527;
  double t532;
  double t534;
  double t535;
  double t546;
  double t547;
  double t538;
  double t540;
  double t552;
  double t554;
  double t557;
  double t559;
  double t560;
  double t561;
  double t563;
  double t565;
  double t567;
  double t571;
  double t573;
  double t574;
  double t577;
  double t578;
  double t587;
  double t591;
  double t592;
  double t593;
  double t594;
  double t595;
  double t596;
  double t598;
  double t600;
  double t601;
  double t602;
  double t605;
  double t606;
  double t612;
  double t607;
  double t608;
  double t611;
  double t616;
  double t622;
  double t624;
  double t628;
  double t630;
  double t631;
  double t632;
  double t633;
  double t634;
  double t635;
  double t636;
  double t637;
  double t638;
  double t639;
  double t640;
  double t641;
  double t642;
  double t643;
  double t644;
  double t645;
  double t647;
  double t648;
  double t649;
  double t650;
  double t651;
  double t652;
  double t653;
  double t654;
  double t655;
  double t656;
  double t657;
  double t658;
  double t659;
  double t660;
  double t661;

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
  t3 = cosVector[1] * cosVector[2] - sinVector[1] * sinVector[2];
  t8 = cosVector[1] * sinVector[2] + cosVector[2] * sinVector[1];
  t9 = cosVector[3] * t3 - sinVector[3] * t8;
  t12 = cosVector[3] * t8 + sinVector[3] * t3;
  t15 = cosVector[5] * t9 - cosVector[4] * sinVector[5] * t12;
  t16 = cosVector[1] * lengthVector[1];
  t17 = lengthVector[2] * t3;
  t18 = t16 + t17;
  t19 = sinVector[4] * t18;
  t20 = cosVector[4] * lengthVector[3] * t9;
  t23 = sinVector[5] * t9 + cosVector[4] * cosVector[5] * t12;
  t31 = lengthVector[4] * sinVector[4] * t12;
  t24 = (t19 + t20) - t31;
  t26 = cosVector[4] * lengthVector[4] * t12;
  t27 = lengthVector[3] * sinVector[4] * t9;
  t28 = lengthVector[3] * t12;
  t35 = (((lengthVector[5] * t23 + COMVector_6[2] * t23) + sinVector[5] * t24) +
         cosVector[5] * lengthVector[3] * t12) + COMVector_6[0] * sinVector[4] *
    t12;
  t40 = (((lengthVector[5] * t15 + COMVector_6[2] * t15) + cosVector[5] * t24) +
         COMVector_6[1] * sinVector[4] * t12) - lengthVector[3] * sinVector[5] *
    t12;
  t44 = cosVector[5] * massVector[5] * t40;
  t45 = massVector[5] * sinVector[5] * t35;
  t54 = cosVector[4] * t18;
  t51 = (((t26 + t27) + COMVector_6[0] * t15) - t54) - COMVector_6[1] * t23;
  t58 = massVector[4] * ((t28 + cosVector[4] * COMVector_5[2] * t12) +
    COMVector_5[0] * sinVector[4] * t12);
  t62 = cosVector[5] * massVector[5] * t35;
  t74 = massVector[5] * sinVector[5] * t40;
  t63 = ((t58 + massVector[3] * (t28 + COMVector_4[1] * t12)) + t62) - t74;
  t66 = (t44 + t45) + massVector[4] * ((((t19 + t20) - t31) + COMVector_5[2] *
    t9) + COMVector_5[1] * sinVector[4] * t12);
  t67 = cosVector[4] * t66;
  t71 = massVector[5] * t51 + massVector[4] * ((((t26 + t27) + COMVector_5[0] *
    t9) - t54) - cosVector[4] * COMVector_5[1] * t12);
  t72 = sinVector[4] * t71;
  t73 = (massVector[3] * (lengthVector[3] * t9 + COMVector_4[1] * t9) + t67) +
    t72;
  t75 = cosVector[3] * t63;
  t84 = sinVector[3] * t73;
  t77 = (t75 + massVector[2] * COMVector_3[2] * t8) - t84;
  t79 = sinVector[3] * t63;
  t81 = cosVector[3] * t73;
  t82 = (t79 + massVector[2] * COMVector_3[2] * t3) + t81;
  t83 = cosVector[2] * t82;
  t85 = sinVector[2] * t77;
  t87 = (t83 + t85) + cosVector[1] * massVector[1] * COMVector_2[2];
  t88 = cosVector[1] * t87;
  t89 = cosVector[2] * t77;
  t99 = sinVector[2] * t82;
  t91 = (t89 + massVector[1] * COMVector_2[2] * sinVector[1]) - t99;
  t92 = sinVector[1] * t91;
  t95 = massVector[2] * (((t16 + t17) + COMVector_3[1] * t8) - COMVector_3[0] *
    t3);
  t96 = sinVector[4] * t66;
  t98 = massVector[3] * (((t16 + t17) - COMVector_4[0] * t9) - COMVector_4[2] *
    t12);
  t104 = cosVector[4] * t71;
  t103 = ((t95 + t96) + t98) - t104;
  t105 = lengthVector[5] + COMVector_6[2];
  t106 = (t96 + t98) - t104;
  t110 = (((inertiaTensor_6[0] * t23 + inertiaTensor_6[1] * t15) + massVector[5]
           * t35 * t105) - massVector[5] * COMVector_6[1] * t51) -
    inertiaTensor_6[2] * sinVector[4] * t12;
  t115 = (((inertiaTensor_6[1] * t23 + inertiaTensor_6[4] * t15) + massVector[5]
           * t40 * t105) + massVector[5] * COMVector_6[0] * t51) -
    inertiaTensor_6[5] * sinVector[4] * t12;
  t116 = lengthVector[4] - COMVector_5[1];
  t117 = t62 - t74;
  t118 = t44 + t45;
  t119 = (t58 + t62) - t74;
  t120 = lengthVector[3] + COMVector_4[1];
  t121 = t96 - t104;
  t132 = (((((((t71 * t116 + inertiaTensor_5[1] * t9) + cosVector[5] * t110) +
              COMVector_5[2] * t119) + massVector[5] * COMVector_5[1] * t51) +
            inertiaTensor_5[0] * cosVector[4] * t12) - sinVector[5] * t115) -
          COMVector_5[2] * t117) - inertiaTensor_5[2] * sinVector[4] * t12;
  t133 = inertiaTensor_6[2] * t23;
  t134 = inertiaTensor_6[5] * t15;
  t177 = massVector[5] * COMVector_6[0] * t35;
  t178 = massVector[5] * COMVector_6[1] * t40;
  t180 = inertiaTensor_6[8] * sinVector[4] * t12;
  t140 = ((((((((((t133 + t134) + inertiaTensor_5[5] * t9) + t66 * t116) +
                COMVector_5[0] * t117) + COMVector_5[1] * t118) +
              inertiaTensor_5[2] * cosVector[4] * t12) - COMVector_5[0] * t119)
            - t177) - t178) - inertiaTensor_5[8] * sinVector[4] * t12) - t180;
  t144 = ((((((COMVector_4[2] * t106 + sinVector[4] * t140) + inertiaTensor_4[2]
              * t9) + COMVector_4[1] * t119) - cosVector[4] * t132) -
           inertiaTensor_4[0] * t12) - t63 * t120) - COMVector_4[2] * t121;
  t146 = inertiaTensor_5[4] * t9;
  t148 = COMVector_5[2] * t66;
  t150 = t67 + t72;
  t151 = cosVector[5] * t115;
  t152 = sinVector[5] * t110;
  t153 = COMVector_5[0] * t71;
  t154 = inertiaTensor_5[1] * cosVector[4] * t12;
  t168 = COMVector_5[2] * t118;
  t169 = massVector[5] * COMVector_5[0] * t51;
  t170 = inertiaTensor_5[5] * sinVector[4] * t12;
  t155 = (((((((((((((t73 * t120 + t146) + inertiaTensor_4[8] * t9) + t148) +
                   COMVector_4[0] * t121) + t151) + t152) + t153) + t154) -
              COMVector_4[0] * t106) - inertiaTensor_4[2] * t12) - COMVector_4[1]
            * t150) - t168) - t169) - t170;
  t158 = massVector[1] * ((t16 + COMVector_2[1] * sinVector[1]) - cosVector[1] *
    COMVector_2[0]);
  t160 = (((t95 + t96) + t98) - t104) + t158;
  t161 = COMVector_3[1] * t103;
  t162 = inertiaTensor_3[0] * t8;
  t163 = inertiaTensor_3[1] * t3;
  t164 = t75 - t84;
  t171 = COMVector_3[2] * t77;
  t185 = lengthVector[2] - COMVector_3[0];
  t190 = t79 + t81;
  t192 = ((((((COMVector_3[0] * t106 + t103 * t185) + inertiaTensor_3[1] * t8) +
             inertiaTensor_3[4] * t3) + cosVector[3] * t155) + COMVector_3[2] *
           t82) - COMVector_3[2] * t190) - sinVector[3] * t144;
  t193 = cosVector[2] * lengthVector[1];
  t194 = lengthVector[2] + t193;
  t195 = sinVector[3] * t194;
  t196 = cosVector[3] * lengthVector[1] * sinVector[2];
  t197 = t195 + t196;
  t198 = cosVector[4] * t197;
  t199 = cosVector[3] * t194;
  t202 = lengthVector[1] * sinVector[2] * sinVector[3];
  t200 = t199 - t202;
  t201 = sinVector[4] * t197;
  t210 = cosVector[4] * lengthVector[4];
  t204 = t198 - t210;
  t205 = cosVector[5] * lengthVector[5] * sinVector[4];
  t206 = cosVector[5] * COMVector_6[2] * sinVector[4];
  t219 = cosVector[4] * COMVector_6[0];
  t207 = (((cosVector[5] * t200 + t205) + t206) - t219) - sinVector[5] * t204;
  t208 = cosVector[4] * COMVector_6[1];
  t209 = sinVector[5] * t200;
  t211 = lengthVector[5] * sinVector[4] * sinVector[5];
  t212 = COMVector_6[2] * sinVector[4] * sinVector[5];
  t214 = (((t208 + t209) + t211) + t212) + cosVector[5] * t204;
  t216 = COMVector_5[2] * sinVector[4];
  t245 = cosVector[4] * COMVector_5[0];
  t218 = massVector[4] * (((t199 - t202) + t216) - t245);
  t221 = cosVector[5] * massVector[5] * t207;
  t244 = massVector[3] * ((COMVector_4[0] - t199) + t202);
  t223 = ((t218 + t221) + massVector[5] * sinVector[5] * t214) - t244;
  t225 = massVector[3] * ((-COMVector_4[2] + t195) + t196);
  t226 = cosVector[4] * COMVector_5[1];
  t227 = COMVector_5[1] * sinVector[4];
  t230 = lengthVector[4] * sinVector[4];
  t231 = cosVector[5] * COMVector_6[1] * sinVector[4];
  t232 = COMVector_6[0] * sinVector[4] * sinVector[5];
  t234 = ((t201 - t230) + t231) + t232;
  t236 = massVector[4] * ((t201 + t227) - t230) + massVector[5] * t234;
  t237 = sinVector[4] * t236;
  t239 = massVector[4] * ((t198 - t210) + t226);
  t243 = massVector[5] * sinVector[5] * t207;
  t242 = (t225 + t237) + cosVector[4] * ((cosVector[5] * massVector[5] * t214 +
    t239) - t243);
  t247 = (((t208 + t209) + t211) + t212) + cosVector[5] * (t198 - t210);
  t249 = massVector[2] * ((lengthVector[2] - COMVector_3[0]) + t193);
  t250 = massVector[5] * sinVector[5] * t247;
  t251 = ((t218 + t221) - t244) + t250;
  t254 = massVector[2] * (COMVector_3[1] + lengthVector[1] * sinVector[2]);
  t255 = cosVector[5] * massVector[5] * t247;
  t256 = (t239 - t243) + t255;
  t257 = cosVector[4] * t256;
  t258 = (t225 + t237) + t257;
  t259 = t243 - t255;
  t260 = t221 + t250;
  t261 = inertiaTensor_6[2] * cosVector[4];
  t263 = inertiaTensor_6[0] * cosVector[5] * sinVector[4];
  t274 = inertiaTensor_6[1] * sinVector[4] * sinVector[5];
  t265 = (((t261 + massVector[5] * t105 * t207) + t263) + massVector[5] *
          COMVector_6[1] * t234) - t274;
  t267 = inertiaTensor_6[4] * sinVector[4] * sinVector[5];
  t276 = inertiaTensor_6[5] * cosVector[4];
  t277 = inertiaTensor_6[1] * cosVector[5] * sinVector[4];
  t269 = (((massVector[5] * t105 * t247 + t267) + massVector[5] * COMVector_6[0]
           * t234) - t276) - t277;
  t270 = (t218 + t221) + t250;
  t271 = sinVector[3] * t258;
  t272 = cosVector[3] * (((t218 + t221) - t244) + t250);
  t273 = COMVector_5[2] * t259;
  t275 = COMVector_5[2] * t256;
  t278 = cosVector[5] * t269;
  t279 = t237 + t257;
  t281 = COMVector_5[0] * t236;
  t310 = inertiaTensor_5[5] * cosVector[4];
  t311 = inertiaTensor_5[1] * sinVector[4];
  t312 = sinVector[5] * t265;
  t314 = massVector[5] * COMVector_5[0] * t234;
  t282 = (((((((((inertiaTensor_4[5] + t273) + t275) + t278) + t120 * t258) +
              t281) - t310) - t311) - t312) - COMVector_4[1] * t279) - t314;
  t283 = inertiaTensor_5[8] * cosVector[4];
  t284 = inertiaTensor_6[8] * cosVector[4];
  t285 = inertiaTensor_5[2] * sinVector[4];
  t286 = COMVector_5[0] * t260;
  t287 = COMVector_5[1] * t259;
  t288 = inertiaTensor_6[2] * cosVector[5] * sinVector[4];
  t289 = massVector[5] * COMVector_6[1] * t247;
  t317 = t116 * t256;
  t318 = inertiaTensor_6[5] * sinVector[4] * sinVector[5];
  t319 = massVector[5] * COMVector_6[0] * t207;
  t291 = inertiaTensor_5[2] * cosVector[4];
  t292 = inertiaTensor_5[0] * sinVector[4];
  t293 = cosVector[5] * t265;
  t294 = sinVector[5] * t269;
  t321 = t116 * t236;
  t322 = COMVector_5[2] * t260;
  t323 = massVector[5] * COMVector_5[1] * t234;
  t297 = cosVector[4] * (((((((t291 + t292) + t293) + t294) + COMVector_5[2] *
    t270) - t321) - t322) - t323);
  t298 = t120 * t251;
  t320 = sinVector[4] * ((((((((((t283 + t284) + t285) + t286) + t287) + t288) +
    t289) - COMVector_5[0] * t270) - t317) - t318) - t319);
  t299 = (((inertiaTensor_4[1] + t297) + t298) - t320) - COMVector_4[1] * t270;
  t301 = cosVector[4] * t236 - sinVector[4] * t256;
  t302 = cosVector[3] * t258;
  t304 = sinVector[3] * t251;
  t303 = (t254 + t302) - t304;
  t306 = lengthVector[1] - COMVector_2[0];
  t307 = (t249 + t271) + t272;
  t308 = cosVector[2] * t307;
  t309 = sinVector[2] * t303;
  t315 = sinVector[3] * t282;
  t324 = COMVector_3[2] * t307;
  t325 = t271 + t272;
  t327 = (t221 + t250) + massVector[4] * (((t199 - t202) + t216) - t245);
  t328 = COMVector_3[0] * t301;
  t329 = t302 - t304;
  t330 = COMVector_3[2] * t329;
  t331 = t185 * t301;
  t332 = lengthVector[2] * sinVector[3] * sinVector[4];
  t339 = cosVector[4] * lengthVector[2] * sinVector[3];
  t333 = t210 - t339;
  t336 = ((-t230 + t231) + t232) + t332;
  t338 = massVector[4] * ((t227 - t230) + t332) + massVector[5] * t336;
  t342 = (((t205 + t206) - t219) + sinVector[5] * t333) + cosVector[3] *
    cosVector[5] * lengthVector[2];
  t343 = massVector[5] * sinVector[5] * t342;
  t345 = (((t208 + t211) + t212) + cosVector[3] * lengthVector[2] * sinVector[5])
    - cosVector[5] * t333;
  t349 = cosVector[5] * massVector[5] * t345;
  t350 = (-t343 + massVector[4] * ((-t210 + t226) + t339)) + t349;
  t351 = sinVector[4] * t338;
  t352 = cosVector[4] * t350;
  t354 = (t351 + t352) - massVector[3] * (COMVector_4[2] - lengthVector[2] *
    sinVector[3]);
  t355 = cosVector[3] * lengthVector[2];
  t358 = massVector[4] * ((t216 - t245) + t355);
  t359 = cosVector[5] * massVector[5] * t342;
  t360 = massVector[5] * sinVector[5] * t345;
  t361 = ((t358 + t359) + t360) - massVector[3] * (COMVector_4[0] - t355);
  t364 = cosVector[3] * t354;
  t366 = (t358 + t359) + t360;
  t367 = t359 + t360;
  t370 = (((t261 + t263) - t274) + massVector[5] * t105 * t342) + massVector[5] *
    COMVector_6[1] * t336;
  t373 = (((t267 - t276) - t277) + massVector[5] * t105 * t345) + massVector[5] *
    COMVector_6[0] * t336;
  t375 = cosVector[4] * t338 - sinVector[4] * t350;
  t376 = t343 - t349;
  t377 = COMVector_5[0] * t338;
  t378 = COMVector_5[2] * t376;
  t380 = cosVector[5] * t373;
  t381 = COMVector_5[2] * t350;
  t382 = t351 + t352;
  t398 = sinVector[5] * t370;
  t400 = massVector[5] * COMVector_5[0] * t336;
  t383 = (((((((((inertiaTensor_4[5] - t310) - t311) + t377) + t378) + t120 *
              t354) + t380) + t381) - t398) - COMVector_4[1] * t382) - t400;
  t387 = massVector[5] * COMVector_6[1] * t345;
  t409 = massVector[5] * COMVector_6[0] * t342;
  t388 = (((((((((t283 + t284) + t285) + t288) - t318) + COMVector_5[0] * t367)
             + COMVector_5[1] * t376) + t387) - COMVector_5[0] * t366) - t116 *
          t350) - t409;
  t392 = ((((((t291 + t292) + COMVector_5[2] * t366) + cosVector[5] * t370) +
            sinVector[5] * t373) - t116 * t338) - COMVector_5[2] * t367) -
    massVector[5] * COMVector_5[1] * t336;
  t394 = (((inertiaTensor_4[1] + t120 * t361) + cosVector[4] * t392) -
          COMVector_4[1] * t366) - sinVector[4] * t388;
  t395 = cosVector[3] * t361;
  t396 = sinVector[3] * t354;
  t401 = t185 * t375;
  t405 = sinVector[3] * t361;
  t402 = t364 - t405;
  t403 = COMVector_3[2] * t402;
  t404 = massVector[2] * COMVector_3[1];
  t414 = sinVector[3] * t394;
  t415 = COMVector_3[0] * t375;
  t417 = t395 + t396;
  t420 = (t395 + t396) + massVector[2] * t185;
  t422 = (((inertiaTensor_3[2] + sinVector[3] * t383) + cosVector[3] * t394) +
          COMVector_3[2] * t420) - COMVector_3[2] * t417;
  t424 = ((t205 + t206) - t219) + cosVector[4] * lengthVector[4] * sinVector[5];
  t425 = ((t208 + t211) + t212) - cosVector[4] * cosVector[5] * lengthVector[4];
  t426 = cosVector[5] * massVector[5] * t424;
  t428 = massVector[5] * sinVector[5] * t425;
  t429 = massVector[5] * sinVector[5] * t424;
  t430 = massVector[4] * (t216 - t245);
  t431 = (t426 + t428) + t430;
  t433 = t426 + t428;
  t434 = (-t230 + t231) + t232;
  t448 = cosVector[5] * massVector[5] * t425;
  t437 = (t429 + massVector[4] * (t210 - t226)) - t448;
  t439 = massVector[4] * (t227 - t230);
  t440 = massVector[5] * t434;
  t441 = t439 + t440;
  t444 = (((t261 + t263) - t274) + massVector[5] * COMVector_6[1] * t434) +
    massVector[5] * t105 * t424;
  t447 = (((t267 - t276) - t277) + massVector[5] * COMVector_6[0] * t434) +
    massVector[5] * t105 * t425;
  t449 = cosVector[4] * t437;
  t452 = sinVector[4] * t437 + cosVector[4] * (t439 + t440);
  t456 = sinVector[4] * t441;
  t453 = t449 - t456;
  t454 = sinVector[5] * t444;
  t455 = massVector[3] * COMVector_4[2];
  t457 = COMVector_5[2] * t437;
  t458 = t429 - t448;
  t459 = massVector[5] * COMVector_5[0] * t434;
  t460 = t116 * t437;
  t461 = COMVector_5[0] * t433;
  t462 = massVector[5] * COMVector_6[1] * t425;
  t470 = massVector[3] * COMVector_4[0];
  t463 = ((t426 + t428) + t430) - t470;
  t464 = t120 * t463;
  t465 = sinVector[5] * t447;
  t467 = (t426 + t428) + massVector[4] * (t216 - t245);
  t468 = cosVector[5] * t444;
  t469 = COMVector_5[1] * t458;
  t472 = ((((((t291 + t292) + t465) + t468) + COMVector_5[2] * t467) -
           COMVector_5[2] * t433) - t116 * t441) - massVector[5] * COMVector_5[1]
    * t434;
  t473 = cosVector[4] * t472;
  t474 = (t449 + t455) - t456;
  t480 = cosVector[5] * t447;
  t482 = COMVector_5[2] * t458;
  t476 = (((((((((-inertiaTensor_4[5] + t310) + t311) + t454) + t457) + t459) +
             t120 * t474) - COMVector_4[1] * t453) - t480) - COMVector_5[0] *
          t441) - t482;
  t477 = COMVector_3[0] * t452;
  t478 = t185 * t452;
  t483 = cosVector[3] * t476;
  t614 = massVector[5] * COMVector_6[0] * t424;
  t484 = (((((((((t283 + t284) + t285) + t288) - t318) + t460) + t461) + t462) +
           t469) - COMVector_5[0] * t467) - t614;
  t489 = cosVector[5] * COMVector_6[0] - COMVector_6[1] * sinVector[5];
  t492 = cosVector[5] * lengthVector[5] + cosVector[5] * COMVector_6[2];
  t496 = lengthVector[5] * sinVector[5] + COMVector_6[2] * sinVector[5];
  t497 = massVector[5] * sinVector[5] * t496;
  t498 = cosVector[5] * massVector[5] * t492;
  t501 = massVector[4] * COMVector_5[0] + massVector[5] * t489;
  t503 = (t497 + t498) + massVector[4] * COMVector_5[2];
  t506 = sinVector[4] * t501 + cosVector[4] * t503;
  t512 = ((inertiaTensor_6[4] * cosVector[5] + inertiaTensor_6[1] * sinVector[5])
          + massVector[5] * COMVector_6[0] * t489) + massVector[5] * t105 * t492;
  t516 = ((inertiaTensor_6[1] * cosVector[5] + inertiaTensor_6[0] * sinVector[5])
          + massVector[5] * t105 * t496) - massVector[5] * COMVector_6[1] * t489;
  t517 = t497 + t498;
  t519 = cosVector[4] * t501 - sinVector[4] * t503;
  t520 = COMVector_5[0] * t501;
  t521 = cosVector[5] * t512;
  t523 = sinVector[5] * t516;
  t524 = COMVector_5[2] * t503;
  t541 = COMVector_5[2] * t517;
  t543 = massVector[5] * COMVector_5[0] * t489;
  t526 = (((((((inertiaTensor_5[4] + t520) + t521) + t523) + t524) + t120 * t506)
           - t541) - COMVector_4[1] * t506) - t543;
  t527 = cosVector[5] * massVector[5] * t496 - massVector[5] * sinVector[5] *
    t492;
  t532 = (((inertiaTensor_5[1] + t116 * t501) + cosVector[5] * t516) +
          massVector[5] * COMVector_5[1] * t489) - sinVector[5] * t512;
  t534 = inertiaTensor_6[5] * cosVector[5];
  t535 = inertiaTensor_6[2] * sinVector[5];
  t546 = massVector[5] * COMVector_6[1] * t492;
  t547 = massVector[5] * COMVector_6[0] * t496;
  t538 = (((((inertiaTensor_5[5] + t534) + t535) + COMVector_5[1] * t517) + t116
           * t503) - t546) - t547;
  t540 = ((cosVector[4] * t532 + t120 * t527) - sinVector[4] * t538) -
    COMVector_4[1] * t527;
  t552 = ((cosVector[3] * t526 + sinVector[3] * t540) - COMVector_3[0] * t519) -
    t185 * t519;
  t554 = cosVector[3] * t540 - sinVector[3] * t526;
  t557 = cosVector[5] * massVector[5] * COMVector_6[1] + massVector[5] *
    COMVector_6[0] * sinVector[5];
  t559 = cosVector[5] * massVector[5] * COMVector_6[0] - massVector[5] *
    COMVector_6[1] * sinVector[5];
  t560 = inertiaTensor_6[2] - massVector[5] * COMVector_6[0] * t105;
  t561 = inertiaTensor_6[5] - massVector[5] * COMVector_6[1] * t105;
  t563 = cosVector[5] * t561;
  t565 = sinVector[5] * t560;
  t567 = ((t563 + t565) + cosVector[4] * COMVector_4[1] * t557) - cosVector[4] *
    t120 * t557;
  t571 = massVector[5] * (COMVector_6[0] * COMVector_6[0]);
  t573 = massVector[5] * (COMVector_6[1] * COMVector_6[1]);
  t574 = (((inertiaTensor_6[8] + t571) + t573) - COMVector_5[1] * t557) - t116 *
    t557;
  t577 = cosVector[5] * t560 - sinVector[5] * t561;
  t578 = ((t120 * t559 + sinVector[4] * t574) - COMVector_4[1] * t559) -
    cosVector[4] * t577;
  t587 = sinVector[3] * t567 + cosVector[3] * t578;
  t591 = ((sinVector[3] * t578 + sinVector[4] * t185 * t557) + COMVector_3[0] *
          sinVector[4] * t557) - cosVector[3] * t567;
  t592 = t89 - t99;
  t593 = t83 + t85;
  t594 = t308 + t309;
  t595 = cosVector[2] * t303;
  t596 = massVector[1] * COMVector_2[1];
  t598 = ((((((t291 + t292) + t293) + t294) - t321) - t322) - t323) +
    COMVector_5[2] * t327;
  t600 = (t308 + t309) + massVector[1] * t306;
  t601 = (((((((((t283 + t284) + t285) + t286) + t287) + t288) + t289) - t317) -
           t318) - t319) - COMVector_5[0] * t327;
  t602 = (t364 + t404) - t405;
  t605 = sinVector[2] * t602 + cosVector[2] * t420;
  t606 = cosVector[3] * t463;
  t612 = sinVector[3] * t474;
  t607 = t606 - t612;
  t608 = cosVector[2] * t607;
  t611 = cosVector[3] * t474 + sinVector[3] * (((t426 + t428) + t430) - t470);
  t616 = cosVector[3] * t527 - sinVector[3] * t506;
  t622 = cosVector[2] * t616 - sinVector[2] * (sinVector[3] * t527 + cosVector[3]
    * t506);
  t624 = cosVector[3] * t559 - cosVector[4] * sinVector[3] * t557;
  t628 = cosVector[2] * t624 - sinVector[2] * (sinVector[3] * t559 + cosVector[3]
    * cosVector[4] * t557);
  t630 = t77 * t185;
  t631 = cosVector[4] * t140;
  t632 = sinVector[4] * t132;
  t633 = inertiaTensor_4[1] * t12;
  t634 = COMVector_4[2] * t73;
  t635 = inertiaTensor_3[2] * t8;
  t636 = inertiaTensor_3[5] * t3;
  t637 = COMVector_4[0] * t119;
  t638 = COMVector_3[0] * (t75 - t84);
  t639 = COMVector_3[1] * t190;
  t640 = sinVector[4] * t598;
  t641 = t185 * t307;
  t642 = COMVector_4[0] * t327;
  t643 = COMVector_4[2] * t279;
  t644 = COMVector_3[1] * t303;
  t645 = COMVector_3[0] * t325;
  t647 = cosVector[4] * t601;
  t648 = COMVector_3[0] * t417;
  t649 = COMVector_4[0] * t366;
  t650 = COMVector_3[1] * t602;
  t651 = cosVector[4] * t388;
  t652 = t185 * t420;
  t653 = COMVector_4[2] * t382;
  t654 = sinVector[4] * t392;
  t655 = COMVector_4[2] * t474;
  t656 = COMVector_4[0] * t467;
  t657 = sinVector[4] * t472;
  t658 = COMVector_3[0] * (t606 - t612);
  t659 = cosVector[4] * t484;
  t660 = sinVector[4] * t577;
  t661 = cosVector[4] * t574;
  inertia[0] = (((((inertiaTensor_1[4] - COMVector_1[2] * (t88 + t92)) +
                   COMVector_1[0] * t160) + COMVector_1[2] * ((t88 + t92) +
    massVector[0] * COMVector_1[2])) - COMVector_1[0] * (((((t95 + t96) + t98) +
    t158) - cosVector[4] * t71) - massVector[0] * COMVector_1[0])) + cosVector[1]
                * (((((((sinVector[2] * (((((((t161 + t162) + t163) + t171) -
    cosVector[3] * t144) - COMVector_3[1] * t106) - COMVector_3[2] * t164) -
    sinVector[3] * t155) + inertiaTensor_2[4] * cosVector[1]) + inertiaTensor_2
                        [1] * sinVector[1]) + cosVector[2] * t192) +
                      COMVector_2[2] * t87) + COMVector_2[0] * t103) -
                    COMVector_2[2] * t593) + t160 * t306)) + sinVector[1] *
    (((((((cosVector[2] * (((((((t161 + t162) + t163) + t171) - cosVector[3] *
    t144) - COMVector_3[2] * t164) - sinVector[3] * t155) - COMVector_3[1] *
            ((t96 + t98) - cosVector[4] * t71)) + inertiaTensor_2[1] *
           cosVector[1]) + inertiaTensor_2[0] * sinVector[1]) + COMVector_2[2] *
         t91) - COMVector_2[1] * t103) + COMVector_2[1] * t160) - COMVector_2[2]
      * t592) - sinVector[2] * t192);
  inertia[1] = sinVector[1] * ((((inertiaTensor_2[2] - sinVector[2] *
    ((((((inertiaTensor_3[5] + t328) + t330) + t331) - cosVector[3] * t282) -
      COMVector_3[2] * t303) + sinVector[3] * ((((inertiaTensor_4[1] + t298) +
    cosVector[4] * t598) - COMVector_4[1] * t327) - sinVector[4] * t601))) +
    cosVector[2] * ((((inertiaTensor_3[2] + t315) + t324) - COMVector_3[2] *
                     t325) + cosVector[3] * ((((inertiaTensor_4[1] + t297) +
    t298) - t320) - COMVector_4[1] * t327))) - COMVector_2[2] * t594) +
    COMVector_2[2] * t600) + cosVector[1] * ((((((inertiaTensor_2[5] +
    COMVector_2[0] * t301) + t301 * t306) + COMVector_2[2] * (cosVector[2] *
    ((t254 + cosVector[3] * t242) - sinVector[3] * t223) - sinVector[2] * ((t249
    + cosVector[3] * t223) + sinVector[3] * t242))) - COMVector_2[2] * ((t595 +
    t596) - sinVector[2] * ((t249 + t271) + cosVector[3] * t251))) + cosVector[2]
    * ((((((inertiaTensor_3[5] + t328) + t330) + t331) - cosVector[3] * t282) -
        COMVector_3[2] * t303) + sinVector[3] * t299)) + sinVector[2] *
    ((((inertiaTensor_3[2] + t315) + t324) + cosVector[3] * t299) - COMVector_3
     [2] * t325));
  inertia[2] = sinVector[1] * (cosVector[2] * t422 - sinVector[2] *
    ((((((inertiaTensor_3[5] + t401) + t403) + t414) + t415) - cosVector[3] *
      t383) - COMVector_3[2] * ((t364 + t404) - sinVector[3] * t361))) +
    cosVector[1] * (((COMVector_2[0] * t375 + sinVector[2] * t422) + t306 * t375)
                    + cosVector[2] * ((((((inertiaTensor_3[5] + t401) + t403) +
    t414) + t415) - cosVector[3] * t383) - COMVector_3[2] * t602));
  inertia[3] = cosVector[1] * (((COMVector_2[0] * t452 + t306 * t452) -
    sinVector[2] * (sinVector[3] * t476 - cosVector[3] * ((((inertiaTensor_4[1]
    + t464) + t473) - COMVector_4[1] * t467) - sinVector[4] * t484))) +
    cosVector[2] * (((t477 + t478) + t483) + sinVector[3] * ((((inertiaTensor_4
    [1] + t464) + t473) - COMVector_4[1] * t467) - sinVector[4] * t484))) +
    sinVector[1] * (cosVector[2] * (cosVector[3] * ((((inertiaTensor_4[1] + t464)
    - COMVector_4[1] * t431) - sinVector[4] * ((((((((((t283 + t284) + t285) +
    t288) - t318) + t460) + t461) + t462) - COMVector_5[0] * t431) +
    COMVector_5[1] * (t429 - cosVector[5] * massVector[5] * t425)) - massVector
    [5] * COMVector_6[0] * t424)) + cosVector[4] * (((((((t291 + t292) + t465) +
    t468) + COMVector_5[2] * t431) - COMVector_5[2] * t433) - t116 * t441) -
    massVector[5] * COMVector_5[1] * t434)) - sinVector[3] *
    ((((((((((-inertiaTensor_4[5] + t310) + t311) + t454) + t457) + t459) -
         cosVector[5] * t447) - COMVector_5[0] * t441) - COMVector_4[1] * t453)
      - COMVector_5[2] * t458) + t120 * ((t449 + t455) - sinVector[4] * t441)))
                    - sinVector[2] * (((t477 + t478) + t483) + sinVector[3] *
    ((((inertiaTensor_4[1] + t464) + t473) - COMVector_4[1] * t467) - sinVector
     [4] * ((((((((((t283 + t284) + t285) + t288) - t318) + t460) + t461) + t462)
              + t469) - COMVector_5[0] * t431) - massVector[5] * COMVector_6[0] *
            t424))));
  inertia[4] = -cosVector[1] * (((cosVector[2] * t552 - COMVector_2[0] * t519) +
    sinVector[2] * t554) - t306 * t519) - sinVector[1] * (cosVector[2] * t554 -
    sinVector[2] * t552);
  inertia[5] = -cosVector[1] * (((cosVector[2] * t591 + sinVector[2] * t587) +
    COMVector_2[0] * sinVector[4] * t557) + sinVector[4] * t306 * t557) -
    sinVector[1] * (cosVector[2] * t587 - sinVector[2] * t591);
  inertia[6] = ((((((((((((((((((t630 + t631) + t632) + t633) + t634) + t635) +
    t636) + t637) + t638) + t639) + inertiaTensor_2[5] * cosVector[1]) +
                       inertiaTensor_2[2] * sinVector[1]) - inertiaTensor_4[5] *
                      t9) - COMVector_4[0] * t63) - COMVector_3[1] * t82) -
                   COMVector_2[1] * t87) - COMVector_4[2] * t150) + COMVector_2
                 [0] * t592) + COMVector_2[1] * t593) + t91 * t306;
  inertia[7] = (((((((((((((((inertiaTensor_4[4] + inertiaTensor_2[8]) +
    inertiaTensor_3[8]) + t640) + t641) + t642) + t643) + t644) + t645) + t647)
                     - COMVector_4[0] * t251) - COMVector_4[2] * t258) -
                   COMVector_3[1] * t329) + COMVector_2[0] * t594) + t306 * t600)
                + COMVector_2[1] * ((t595 + t596) - sinVector[2] * t307)) -
    COMVector_2[1] * (t595 - sinVector[2] * t307);
  inertia[8] = ((((((((((((inertiaTensor_4[4] + inertiaTensor_3[8]) + t648) +
    t649) + t650) + t651) + t652) + t653) + t654) - COMVector_4[2] * t354) -
                  COMVector_4[0] * t361) - COMVector_3[1] * t402) + COMVector_2
                [0] * t605) + t306 * t605;
  inertia[9] = (((((((((inertiaTensor_4[4] + t655) + t656) + t657) + t658) +
                    t659) - COMVector_4[2] * t453) - COMVector_4[0] * t463) +
                 t185 * t607) + COMVector_2[0] * (t608 - sinVector[2] * t611)) +
    t306 * (t608 - sinVector[2] * t611);
  inertia[10] = ((((-cosVector[4] * t538 - COMVector_3[0] * t616) - COMVector_2
                   [0] * t622) - sinVector[4] * t532) - t185 * t616) - t306 *
    t622;
  inertia[11] = ((((t660 + t661) - COMVector_3[0] * t624) - COMVector_2[0] *
                  t628) - t185 * t624) - t306 * t628;
  inertia[12] = ((((((((((((t630 + t631) + t632) + t633) + t634) + t635) + t636)
                      + t637) + t638) + t639) - inertiaTensor_4[5] * t9) -
                  COMVector_4[0] * t63) - COMVector_3[1] * t82) - COMVector_4[2]
    * t150;
  inertia[13] = ((((((((((inertiaTensor_4[4] + inertiaTensor_3[8]) + t640) +
                        t641) + t642) + t643) + t644) + t645) + t647) -
                  COMVector_4[0] * t251) - COMVector_4[2] * t258) - COMVector_3
    [1] * t329;
  inertia[14] = ((((((((((inertiaTensor_4[4] + inertiaTensor_3[8]) + t648) +
                        t649) + t650) + t651) + t652) + t653) + t654) -
                  COMVector_4[2] * t354) - COMVector_4[0] * t361) - COMVector_3
    [1] * t402;
  inertia[15] = (((((((inertiaTensor_4[4] + t655) + t656) + t657) + t658) + t659)
                  - COMVector_4[2] * t453) - COMVector_4[0] * t463) + t185 *
    (t606 - t612);
  inertia[16] = ((-cosVector[4] * t538 - COMVector_3[0] * t616) - sinVector[4] *
                 t532) - t185 * t616;
  inertia[17] = ((t660 + t661) - COMVector_3[0] * t624) - t185 * t624;
  inertia[18] = ((((((t631 + t632) + t633) + t634) + t637) - inertiaTensor_4[5] *
                  t9) - COMVector_4[0] * t63) - COMVector_4[2] * t150;
  inertia[19] = (((((inertiaTensor_4[4] + t640) + t642) + t643) + t647) -
                 COMVector_4[0] * t251) - COMVector_4[2] * t258;
  inertia[20] = (((((inertiaTensor_4[4] + t649) + t651) + t653) + t654) -
                 COMVector_4[2] * t354) - COMVector_4[0] * t361;
  inertia[21] = (((((inertiaTensor_4[4] + t655) + t656) + t657) + t659) -
                 COMVector_4[2] * t453) - COMVector_4[0] * t463;
  inertia[22] = -cosVector[4] * t538 - sinVector[4] * t532;
  inertia[23] = t660 + t661;
  inertia[24] = (((((((-t146 - t148) - t151) - t152) - t153) - t154) + t168) +
                 t169) + t170;
  inertia[25] = ((((((t273 + t275) + t278) + t281) - t310) - t311) - t312) -
    t314;
  inertia[26] = ((((((-t310 - t311) + t377) + t378) + t380) + t381) - t398) -
    t400;
  inertia[27] = ((((((-t310 - t311) - t454) - t457) - t459) + t480) + t482) +
    COMVector_5[0] * (t439 + t440);
  inertia[28] = (((((inertiaTensor_5[4] + t520) + t521) + t523) + t524) - t541)
    - t543;
  inertia[29] = -t563 - t565;
  inertia[30] = (((t133 + t134) - t177) - t178) - t180;
  inertia[31] = (((t284 + t288) + t289) - t318) - t319;
  inertia[32] = (((t284 + t288) - t318) + t387) - t409;
  inertia[33] = (((t284 + t288) - t318) + t462) - t614;
  inertia[34] = ((-t534 - t535) + t546) + t547;
  inertia[35] = (inertiaTensor_6[8] + t571) + t573;
}

//
// File trailer for inertiaMatrix.cpp
//
// [EOF]
//
