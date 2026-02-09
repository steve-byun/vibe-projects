//
// File: inertiaMatrix.cpp
//
// MATLAB Coder version            : 3.1
// C/C++ source code generated on  : 16-Dec-2017 18:22:10
//

// Include Files
#include "rt_nonfinite.h"
#include "inertiaMatrix.h"

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
//                double inertia[36]
// Return Type  : void
//
void inertiaMatrix(const double lengthVector[7], const double massVector[6],
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
  double t4;
  double t6;
  double t8;
  double t9;
  double t10;
  double t11;
  double t22;
  double t12;
  double t13;
  double t16;
  double t18;
  double t21;
  double t23;
  double t24;
  double t31;
  double t25;
  double t28;
  double t29;
  double t38;
  double t39;
  double t33;
  double t34;
  double t35;
  double t36;
  double t37;
  double t45;
  double t51;
  double t52;
  double t55;
  double t60;
  double t63;
  double t67;
  double t71;
  double t73;
  double t74;
  double t75;
  double t83;
  double t76;
  double t84;
  double t78;
  double t79;
  double t80;
  double t81;
  double t82;
  double t85;
  double t86;
  double t87;
  double t88;
  double t89;
  double t92;
  double t93;
  double t95;
  double t96;
  double t97;
  double t98;
  double t99;
  double t104;
  double t108;
  double t109;
  double t113;
  double t114;
  double t115;
  double t116;
  double t125;
  double t126;
  double t127;
  double t131;
  double t133;
  double t153;
  double t154;
  double t155;
  double t134;
  double t135;
  double t136;
  double t137;
  double t138;
  double t655;
  double t145;
  double t147;
  double t149;
  double t156;
  double t158;
  double t754;
  double t755;
  double t756;
  double t757;
  double t160;
  double t164;
  double t166;
  double t167;
  double t169;
  double t170;
  double t171;
  double t660;
  double t661;
  double t173;
  double t183;
  double t184;
  double t185;
  double t186;
  double t190;
  double t191;
  double t193;
  double t194;
  double t199;
  double t196;
  double t197;
  double t198;
  double t200;
  double t201;
  double t202;
  double t203;
  double t204;
  double t205;
  double t206;
  double t207;
  double t208;
  double t210;
  double t211;
  double t212;
  double t213;
  double t214;
  double t215;
  double t218;
  double t219;
  double t223;
  double t224;
  double t230;
  double t225;
  double t227;
  double t228;
  double t233;
  double t229;
  double t231;
  double t234;
  double t235;
  double t236;
  double t245;
  double t239;
  double t240;
  double t252;
  double t242;
  double t261;
  double t244;
  double t246;
  double t247;
  double t250;
  double t257;
  double t249;
  double t251;
  double t264;
  double t265;
  double t255;
  double t256;
  double t262;
  double t258;
  double t259;
  double t260;
  double t267;
  double t263;
  double t266;
  double t268;
  double t269;
  double t270;
  double t271;
  double t272;
  double t274;
  double t276;
  double t277;
  double t278;
  double t279;
  double t280;
  double t324;
  double t325;
  double t281;
  double t282;
  double t283;
  double t284;
  double t285;
  double t286;
  double t288;
  double t289;
  double t290;
  double t291;
  double t292;
  double t293;
  double t295;
  double t296;
  double t297;
  double t298;
  double t299;
  double t300;
  double t306;
  double t302;
  double t303;
  double t304;
  double t305;
  double t311;
  double t314;
  double t315;
  double t316;
  double t317;
  double t319;
  double t320;
  double t321;
  double t326;
  double t327;
  double t328;
  double t353;
  double t355;
  double t329;
  double t331;
  double t674;
  double t335;
  double t336;
  double t337;
  double t338;
  double t339;
  double t340;
  double t341;
  double t342;
  double t343;
  double t344;
  double t669;
  double t670;
  double t671;
  double t348;
  double t349;
  double t350;
  double t351;
  double t352;
  double t356;
  double t357;
  double t358;
  double t359;
  double t360;
  double t361;
  double t362;
  double t363;
  double t364;
  double t365;
  double t367;
  double t370;
  double t372;
  double t375;
  double t402;
  double t377;
  double t380;
  double t383;
  double t384;
  double t385;
  double t386;
  double t390;
  double t392;
  double t394;
  double t393;
  double t395;
  double t396;
  double t398;
  double t399;
  double t401;
  double t405;
  double t406;
  double t407;
  double t408;
  double t409;
  double t410;
  double t412;
  double t417;
  double t442;
  double t443;
  double t420;
  double t421;
  double t422;
  double t423;
  double t424;
  double t425;
  double t426;
  double t427;
  double t428;
  double t677;
  double t678;
  double t679;
  double t433;
  double t446;
  double t448;
  double t450;
  double t451;
  double t452;
  double t454;
  double t456;
  double t759;
  double t760;
  double t457;
  double t462;
  double t466;
  double t469;
  double t492;
  double t471;
  double t472;
  double t475;
  double t478;
  double t479;
  double t480;
  double t487;
  double t488;
  double t489;
  double t490;
  double t491;
  double t493;
  double t497;
  double t502;
  double t503;
  double t504;
  double t507;
  double t510;
  double t511;
  double t540;
  double t541;
  double t512;
  double t521;
  double t522;
  double t523;
  double t524;
  double t526;
  double t528;
  double t684;
  double t685;
  double t686;
  double t687;
  double t529;
  double t542;
  double t543;
  double t544;
  double t546;
  double t547;
  double t548;
  double t761;
  double t762;
  double t549;
  double t553;
  double t554;
  double t558;
  double t559;
  double t561;
  double t562;
  double t565;
  double t564;
  double t568;
  double t570;
  double t575;
  double t579;
  double t580;
  double t581;
  double t587;
  double t582;
  double t583;
  double t584;
  double t596;
  double t597;
  double t586;
  double t588;
  double t590;
  double t591;
  double t599;
  double t600;
  double t601;
  double t593;
  double t594;
  double t598;
  double t602;
  double t603;
  double t604;
  double t605;
  double t700;
  double t701;
  double t614;
  double t616;
  double t618;
  double t620;
  double t624;
  double t625;
  double t628;
  double t629;
  double t634;
  double t639;
  double t641;
  double t763;
  double t644;
  double t645;
  double t646;
  double t647;
  double t714;
  double t715;
  double t716;
  double t649;
  double t650;
  double t717;
  double t718;
  double t653;
  double t654;
  double t666;
  double t667;
  double t668;
  double t673;
  double t676;
  double t683;
  double t693;
  double t694;
  double t699;
  double t707;
  double t713;
  double t719;
  double t720;
  double t721;
  double t722;
  double t723;
  double t724;
  double t726;
  double t727;
  double t730;
  double t731;
  double t732;
  double t735;
  double t736;
  double t737;
  double t738;
  double t741;
  double t745;
  double t746;
  double t750;
  double t751;
  double t752;
  double t753;

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
  t4 = cosVector[1] * sinVector[2] + cosVector[2] * sinVector[1];
  t6 = cosVector[1] * cosVector[2] - sinVector[1] * sinVector[2];
  t8 = lengthVector[2] * sinVector[1];
  t9 = lengthVector[3] * t4;
  t10 = (-lengthVector[1] + t8) + t9;
  t11 = sinVector[3] * t10;
  t22 = lengthVector[4] * sinVector[3] * t6;
  t12 = t11 - t22;
  t13 = lengthVector[5] * sinVector[3] * t6;
  t16 = cosVector[4] * t4 + cosVector[3] * sinVector[4] * t6;
  t18 = sinVector[4] * t4 - cosVector[3] * cosVector[4] * t6;
  t21 = sinVector[5] * t18 - cosVector[5] * sinVector[3] * t6;
  t23 = lengthVector[5] * t18;
  t24 = cosVector[3] * t10;
  t31 = cosVector[3] * lengthVector[4] * t6;
  t25 = (t23 + t24) - t31;
  t28 = cosVector[5] * t18 + sinVector[3] * sinVector[5] * t6;
  t29 = sinVector[4] * t12;
  t38 = cosVector[4] * t12;
  t39 = t13 - t38;
  t33 = cosVector[5] * t25;
  t34 = COMVector_6[0] * t16;
  t35 = lengthVector[6] * t28;
  t36 = COMVector_6[2] * t28;
  t37 = (((sinVector[5] * t39 + t33) + t34) + t35) + t36;
  t45 = (((sinVector[5] * t25 + lengthVector[6] * t21) + COMVector_6[2] * t21) -
         cosVector[5] * t39) - COMVector_6[1] * t16;
  t51 = (-t29 + COMVector_6[0] * t21) + COMVector_6[1] * t28;
  t52 = massVector[4] * ((t29 + COMVector_5[0] * sinVector[3] * t6) -
    COMVector_5[1] * t18) - massVector[5] * t51;
  t55 = massVector[4] * (((t13 - t38) + COMVector_5[1] * t16) + COMVector_5[2] *
    sinVector[3] * t6);
  t60 = sinVector[4] * t52;
  t63 = massVector[3] * (((t11 - t22) + COMVector_4[1] * sinVector[3] * t6) -
    COMVector_4[2] * t4);
  t67 = massVector[4] * ((((t23 + t24) - t31) + COMVector_5[0] * t16) +
    COMVector_5[2] * t18);
  t71 = massVector[3] * (((t24 - t31) + COMVector_4[0] * t4) + cosVector[3] *
    COMVector_4[1] * t6);
  t73 = (((t33 + t34) + t35) + t36) + sinVector[5] * (t13 - t38);
  t74 = massVector[5] * sinVector[5] * t45;
  t75 = massVector[5] * sinVector[5] * t73;
  t83 = cosVector[5] * massVector[5] * t45;
  t76 = (t55 + t75) - t83;
  t84 = cosVector[4] * t76;
  t78 = (t60 + t63) - t84;
  t79 = sinVector[3] * t78;
  t80 = cosVector[5] * massVector[5] * t73;
  t81 = ((t67 + t71) + t74) + t80;
  t82 = cosVector[3] * t81;
  t85 = cosVector[3] * t78;
  t86 = massVector[2] * COMVector_3[1] * t4;
  t87 = (t67 + t74) + t80;
  t88 = lengthVector[6] + COMVector_6[2];
  t89 = t74 + t80;
  t92 = massVector[2] * ((((-lengthVector[1] + t8) + t9) + COMVector_3[0] * t4)
    - COMVector_3[2] * t6);
  t93 = t79 + t82;
  t95 = sinVector[3] * ((t60 + t63) - t84);
  t96 = (t82 + t92) + t95;
  t97 = t75 - t83;
  t98 = cosVector[4] * t52;
  t99 = t60 - t84;
  t104 = (((inertiaTensor_6[5] * t16 + inertiaTensor_6[4] * t21) + massVector[5]
           * COMVector_6[0] * t51) + massVector[5] * t45 * t88) -
    inertiaTensor_6[1] * t28;
  t108 = (((inertiaTensor_6[0] * t28 + massVector[5] * COMVector_6[1] * t51) +
           massVector[5] * t73 * t88) - inertiaTensor_6[2] * t16) -
    inertiaTensor_6[1] * t21;
  t109 = sinVector[4] * t76;
  t113 = massVector[3] * (COMVector_4[0] * sinVector[3] * t6 + cosVector[3] *
    COMVector_4[2] * t6);
  t114 = lengthVector[5] + COMVector_5[2];
  t115 = (t98 + t109) + t113;
  t116 = massVector[2] * COMVector_3[1] * t6;
  t125 = (((((((t87 * t114 + cosVector[5] * t108) + inertiaTensor_5[0] * t18) +
              sinVector[5] * t104) + inertiaTensor_5[1] * sinVector[3] * t6) -
            COMVector_5[2] * t89) - COMVector_5[1] * t52) - inertiaTensor_5[2] *
          t16) - massVector[5] * COMVector_5[1] * t51;
  t126 = t98 + t109;
  t127 = lengthVector[4] - COMVector_4[1];
  t131 = inertiaTensor_6[2] * t28;
  t133 = massVector[5] * COMVector_6[1] * t45;
  t153 = inertiaTensor_6[8] * t16;
  t154 = inertiaTensor_6[5] * t21;
  t155 = massVector[5] * COMVector_6[0] * t73;
  t134 = ((((((((((COMVector_5[0] * t89 + COMVector_5[1] * t97) +
                  inertiaTensor_5[2] * t18) + t131) + inertiaTensor_5[5] *
                sinVector[3] * t6) + t133) - COMVector_5[1] * t76) -
             COMVector_5[0] * t87) - inertiaTensor_5[8] * t16) - t153) - t154) -
    t155;
  t135 = sinVector[3] * t81;
  t136 = (-t85 + t86) + t135;
  t137 = ((t98 + t109) + t113) + t116;
  t138 = (massVector[5] * sinVector[5] * t37 + t55) - t83;
  t655 = t85 - t135;
  t145 = sinVector[4] * t125;
  t147 = inertiaTensor_4[4] * t4;
  t149 = COMVector_4[0] * t81;
  t156 = lengthVector[3] + COMVector_3[0];
  t158 = inertiaTensor_4[5] * sinVector[3] * t6;
  t754 = COMVector_4[0] * t87;
  t755 = COMVector_4[2] * t78;
  t756 = cosVector[4] * t134;
  t757 = inertiaTensor_4[1] * cosVector[3] * t6;
  t160 = (((((((((((((COMVector_3[1] * t655 + COMVector_3[1] * t136) + t145) +
                    inertiaTensor_3[2] * t6) + t147) + inertiaTensor_3[8] * t4)
                 + t149) + t96 * t156) + t158) + COMVector_4[2] * t99) - t754) -
            t755) - t756) - t757) - COMVector_3[0] * t93;
  t164 = COMVector_5[0] * t52;
  t166 = inertiaTensor_5[1] * t18;
  t167 = sinVector[5] * t108;
  t169 = t76 * t114;
  t170 = massVector[5] * COMVector_5[0] * t51;
  t171 = inertiaTensor_5[4] * sinVector[3] * t6;
  t660 = cosVector[5] * t104;
  t661 = inertiaTensor_5[5] * t16;
  t173 = ((((((((((((((t164 + inertiaTensor_4[5] * t4) + t166) + t167) +
                    COMVector_4[0] * t115) + t169) + t170) + t171) +
                inertiaTensor_4[8] * sinVector[3] * t6) - COMVector_5[2] * t97)
              - t78 * t127) - COMVector_4[0] * t126) - COMVector_4[1] * t99) -
           t660) - t661) - inertiaTensor_4[2] * cosVector[3] * t6;
  t183 = (((((((COMVector_4[1] * t87 + cosVector[4] * t125) + inertiaTensor_4[1]
               * t4) + COMVector_4[2] * t126) + t81 * t127) + inertiaTensor_4[2]
            * sinVector[3] * t6) + sinVector[4] * t134) - COMVector_4[2] * t115)
    - inertiaTensor_4[0] * cosVector[3] * t6;
  t184 = ((((((COMVector_3[2] * t93 + inertiaTensor_3[0] * t6) +
              inertiaTensor_3[2] * t4) + sinVector[3] * t173) + COMVector_3[1] *
            t137) - cosVector[3] * t183) - COMVector_3[2] * t96) - COMVector_3[1]
    * t115;
  t185 = sinVector[2] * t136;
  t186 = cosVector[2] * t137;
  t190 = massVector[1] * (((-lengthVector[1] + t8) + cosVector[1] * COMVector_2
    [1]) + COMVector_2[0] * sinVector[1]);
  t191 = ((t82 + t92) + t95) + t190;
  t193 = (t185 + t186) + cosVector[1] * massVector[1] * COMVector_2[2];
  t194 = cosVector[2] * t136;
  t199 = sinVector[2] * t137;
  t196 = (t194 + massVector[1] * COMVector_2[2] * sinVector[1]) - t199;
  t197 = lengthVector[1] + COMVector_1[0];
  t198 = cosVector[1] * t193;
  t200 = sinVector[1] * t196;
  t201 = cosVector[3] * lengthVector[4];
  t202 = cosVector[3] * lengthVector[2] * sinVector[2];
  t203 = cosVector[3] * lengthVector[5];
  t204 = cosVector[2] * lengthVector[2];
  t205 = lengthVector[3] + t204;
  t206 = sinVector[4] * t205;
  t207 = t201 + t202;
  t208 = cosVector[4] * t207;
  t210 = cosVector[3] * cosVector[5] - cosVector[4] * sinVector[3] * sinVector[5];
  t211 = (t203 + t206) + t208;
  t212 = lengthVector[4] * sinVector[3];
  t213 = cosVector[4] * lengthVector[5] * sinVector[3];
  t214 = lengthVector[2] * sinVector[2] * sinVector[3];
  t215 = (t212 + t213) + t214;
  t218 = cosVector[3] * sinVector[5] + cosVector[4] * cosVector[5] * sinVector[3];
  t219 = cosVector[4] * t205;
  t223 = lengthVector[6] * t218;
  t224 = COMVector_6[2] * t218;
  t230 = COMVector_6[0] * sinVector[3] * sinVector[4];
  t225 = (((sinVector[5] * t211 + cosVector[5] * t215) + t223) + t224) - t230;
  t227 = lengthVector[6] * t210;
  t228 = COMVector_6[2] * t210;
  t233 = COMVector_6[1] * sinVector[3] * sinVector[4];
  t229 = (((cosVector[5] * t211 + t227) + t228) - sinVector[5] * t215) - t233;
  t231 = cosVector[5] * massVector[5] * t225;
  t234 = cosVector[5] * massVector[5] * t229;
  t235 = massVector[5] * sinVector[5] * t225;
  t236 = cosVector[3] * COMVector_5[2];
  t245 = COMVector_5[1] * sinVector[3] * sinVector[4];
  t239 = (t234 + t235) + massVector[4] * ((((t203 + t206) + t208) + t236) - t245);
  t240 = cosVector[4] * COMVector_5[2] * sinVector[3];
  t252 = COMVector_5[0] * sinVector[3] * sinVector[4];
  t242 = massVector[4] * ((((t212 + t213) + t214) + t240) - t252);
  t261 = cosVector[3] * COMVector_4[1];
  t244 = massVector[3] * ((t201 + t202) - t261);
  t246 = cosVector[4] * t239;
  t247 = cosVector[3] * COMVector_5[0];
  t250 = sinVector[4] * t207;
  t257 = cosVector[4] * COMVector_5[1] * sinVector[3];
  t249 = massVector[4] * (((t219 + t247) - t250) - t257);
  t251 = COMVector_6[0] * t210;
  t264 = COMVector_4[1] * sinVector[3];
  t265 = massVector[5] * sinVector[5] * t229;
  t255 = ((t231 + t242) + massVector[3] * ((t212 + t214) - t264)) - t265;
  t256 = cosVector[3] * t255;
  t262 = COMVector_6[1] * t218;
  t258 = ((t219 - t250) + t251) - t262;
  t259 = massVector[5] * t258;
  t260 = t249 + t259;
  t267 = sinVector[4] * t260;
  t263 = (t244 + t246) - t267;
  t266 = (t231 + t242) - t265;
  t268 = t256 - sinVector[3] * t263;
  t269 = cosVector[3] * t263;
  t270 = sinVector[3] * t255;
  t271 = t231 - t265;
  t272 = inertiaTensor_5[5] * cosVector[3];
  t274 = t234 + t235;
  t276 = inertiaTensor_6[2] * t218;
  t277 = inertiaTensor_6[5] * t210;
  t278 = inertiaTensor_5[2] * cosVector[4] * sinVector[3];
  t279 = inertiaTensor_5[8] * sinVector[3] * sinVector[4];
  t280 = inertiaTensor_6[8] * sinVector[3] * sinVector[4];
  t324 = massVector[5] * COMVector_6[0] * t225;
  t325 = massVector[5] * COMVector_6[1] * t229;
  t281 = ((((((((((t272 + COMVector_5[0] * t271) + COMVector_5[1] * t274) + t276)
                + t277) + t278) + t279) + t280) - COMVector_5[1] * t239) -
           COMVector_5[0] * t266) - t324) - t325;
  t282 = inertiaTensor_5[1] * cosVector[3];
  t283 = t114 * t266;
  t284 = inertiaTensor_6[0] * t218;
  t285 = inertiaTensor_6[1] * t210;
  t286 = inertiaTensor_6[2] * sinVector[3] * sinVector[4];
  t288 = (((t284 + t285) + t286) + massVector[5] * t88 * t225) - massVector[5] *
    COMVector_6[1] * t258;
  t289 = cosVector[5] * t288;
  t290 = inertiaTensor_6[1] * t218;
  t291 = inertiaTensor_6[4] * t210;
  t292 = inertiaTensor_6[5] * sinVector[3] * sinVector[4];
  t293 = massVector[5] * t88 * t229;
  t295 = (((t290 + t291) + t292) + t293) + massVector[5] * COMVector_6[0] * t258;
  t296 = inertiaTensor_5[0] * cosVector[4] * sinVector[3];
  t297 = inertiaTensor_5[2] * sinVector[3] * sinVector[4];
  t298 = sinVector[4] * t239;
  t299 = cosVector[4] * (t249 + t259);
  t300 = cosVector[3] * COMVector_4[0];
  t306 = COMVector_4[2] * sinVector[3];
  t302 = massVector[3] * (((lengthVector[3] + t204) + t300) - t306);
  t303 = (t298 + t299) + t302;
  t304 = t298 + t299;
  t305 = t246 - t267;
  t311 = (t269 + t270) + massVector[2] * (COMVector_3[2] + lengthVector[2] *
    sinVector[2]);
  t314 = ((t298 + t299) + t302) + massVector[2] * ((lengthVector[3] +
    COMVector_3[0]) + t204);
  t315 = lengthVector[2] + COMVector_2[0];
  t316 = sinVector[2] * t311;
  t317 = cosVector[2] * t314;
  t319 = t127 * t255;
  t320 = inertiaTensor_4[2] * cosVector[3];
  t321 = inertiaTensor_4[0] * sinVector[3];
  t326 = sinVector[4] * t281;
  t327 = COMVector_4[2] * t304;
  t328 = massVector[5] * COMVector_5[1] * (((t219 - t250) + t251) - t262);
  t353 = COMVector_5[2] * t271;
  t355 = COMVector_5[1] * t260;
  t329 = (((((((t282 + t283) + t289) + t296) + t297) + t328) - t353) -
          sinVector[5] * t295) - t355;
  t331 = COMVector_4[1] * t266;
  t674 = COMVector_4[2] * t303;
  t335 = inertiaTensor_5[4] * cosVector[3];
  t336 = inertiaTensor_4[8] * cosVector[3];
  t337 = inertiaTensor_4[2] * sinVector[3];
  t338 = t114 * t239;
  t339 = COMVector_4[1] * t305;
  t340 = COMVector_4[0] * t303;
  t341 = sinVector[5] * t288;
  t342 = t127 * t263;
  t343 = inertiaTensor_5[1] * cosVector[4] * sinVector[3];
  t344 = inertiaTensor_5[5] * sinVector[3] * sinVector[4];
  t669 = COMVector_5[2] * t274;
  t670 = COMVector_4[0] * t304;
  t671 = massVector[5] * COMVector_5[0] * t258;
  t348 = (((inertiaTensor_3[1] + cosVector[3] * (((((((t319 + t320) + t321) +
    t326) + t327) + cosVector[4] * t329) + t331) - t674)) + COMVector_3[1] *
           t303) - COMVector_3[1] * t314) - sinVector[3] * ((((((((((((((t335 +
    t336) + t337) + t338) + t339) + t340) + t341) + t342) + t343) + t344) +
    COMVector_5[0] * t260) + cosVector[5] * t295) - t669) - t670) - t671);
  t349 = cosVector[2] * t311;
  t350 = inertiaTensor_4[5] * cosVector[3];
  t351 = inertiaTensor_4[1] * sinVector[3];
  t352 = COMVector_3[1] * t311;
  t356 = t269 + t270;
  t357 = COMVector_4[2] * t263;
  t358 = COMVector_4[0] * t255;
  t359 = t156 * t268;
  t360 = sinVector[2] * t314;
  t361 = t212 + t213;
  t362 = lengthVector[3] * sinVector[4];
  t363 = cosVector[3] * cosVector[4] * lengthVector[4];
  t364 = (t203 + t362) + t363;
  t365 = cosVector[4] * lengthVector[3];
  t367 = (((t227 + t228) - t233) + cosVector[5] * t364) - sinVector[5] * t361;
  t370 = (((t223 + t224) - t230) + cosVector[5] * t361) + sinVector[5] * t364;
  t372 = massVector[4] * (((t212 + t213) + t240) - t252);
  t375 = cosVector[5] * massVector[5] * t370;
  t402 = massVector[5] * sinVector[5] * t367;
  t377 = ((t372 + massVector[3] * (t212 - t264)) + t375) - t402;
  t380 = cosVector[3] * lengthVector[4] * sinVector[4];
  t383 = cosVector[5] * massVector[5] * t367;
  t384 = massVector[5] * sinVector[5] * t370;
  t385 = (massVector[4] * ((((t203 + t236) - t245) + t362) + t363) + t383) +
    t384;
  t386 = cosVector[4] * t385;
  t390 = ((t251 - t262) + t365) - t380;
  t392 = massVector[4] * (((t247 - t257) + t365) - t380) + massVector[5] * t390;
  t394 = sinVector[4] * t392;
  t393 = (t386 + massVector[3] * (t201 - t261)) - t394;
  t395 = sinVector[4] * t385;
  t396 = cosVector[4] * t392;
  t398 = massVector[3] * ((lengthVector[3] + t300) - t306);
  t399 = (t395 + t396) + t398;
  t401 = (((t284 + t285) + t286) + massVector[5] * t88 * t370) - massVector[5] *
    COMVector_6[1] * t390;
  t405 = (((t290 + t291) + t292) + massVector[5] * t88 * t367) + massVector[5] *
    COMVector_6[0] * t390;
  t406 = t395 + t396;
  t407 = t375 - t402;
  t408 = t383 + t384;
  t409 = (t372 + t375) - t402;
  t410 = cosVector[3] * t377 - sinVector[3] * t393;
  t412 = t386 - t394;
  t417 = (((((((t282 + t296) + t297) + cosVector[5] * t401) + t114 * t409) +
            massVector[5] * COMVector_5[1] * t390) - COMVector_5[1] * t392) -
          COMVector_5[2] * t407) - sinVector[5] * t405;
  t442 = massVector[5] * COMVector_6[0] * t370;
  t443 = massVector[5] * COMVector_6[1] * t367;
  t420 = ((((((((((t272 + t276) + t277) + t278) + t279) + t280) + COMVector_5[0]
              * t407) + COMVector_5[1] * t408) - COMVector_5[1] * t385) -
           COMVector_5[0] * t409) - t442) - t443;
  t421 = sinVector[3] * t377;
  t422 = cosVector[3] * t393;
  t423 = t114 * t385;
  t424 = COMVector_5[0] * t392;
  t425 = cosVector[5] * t405;
  t426 = t127 * t393;
  t427 = sinVector[5] * t401;
  t428 = COMVector_4[0] * t399;
  t677 = COMVector_5[2] * t408;
  t678 = COMVector_4[0] * t406;
  t679 = massVector[5] * COMVector_5[0] * t390;
  t433 = ((t395 + t396) + t398) + massVector[2] * t156;
  t446 = ((((((t320 + t321) + cosVector[4] * t417) + COMVector_4[2] * t406) +
            t127 * t377) + sinVector[4] * t420) + COMVector_4[1] * t409) -
    COMVector_4[2] * t399;
  t448 = (((inertiaTensor_3[1] + COMVector_3[1] * t399) + cosVector[3] * t446) -
          COMVector_3[1] * t433) - sinVector[3] * ((((((((((((((t335 + t336) +
    t337) + t343) + t344) + t423) + t424) + t425) + t426) + t427) + t428) +
    COMVector_4[1] * t412) - t677) - t678) - t679);
  t450 = COMVector_4[0] * t377;
  t451 = t421 + t422;
  t452 = sinVector[4] * t417;
  t454 = (t421 + t422) + massVector[2] * COMVector_3[2];
  t456 = COMVector_4[2] * t393;
  t759 = cosVector[4] * t420;
  t760 = COMVector_4[0] * t409;
  t457 = (((((((((((-inertiaTensor_3[5] + t350) + t351) + t156 * t410) + t450) +
                t452) + COMVector_3[1] * t454) + t456) - t759) - t760) -
           COMVector_3[0] * t410) - COMVector_4[2] * t412) - COMVector_3[1] *
    t451;
  t462 = ((cosVector[4] * COMVector_6[0] + cosVector[5] * lengthVector[5] *
           sinVector[4]) + cosVector[5] * lengthVector[6] * sinVector[4]) +
    cosVector[5] * COMVector_6[2] * sinVector[4];
  t466 = ((lengthVector[5] * sinVector[4] * sinVector[5] + lengthVector[6] *
           sinVector[4] * sinVector[5]) + COMVector_6[2] * sinVector[4] *
          sinVector[5]) - cosVector[4] * COMVector_6[1];
  t469 = massVector[5] * sinVector[5] * t462;
  t492 = cosVector[5] * massVector[5] * t466;
  t471 = (cosVector[4] * massVector[4] * COMVector_5[1] + t469) - t492;
  t472 = cosVector[4] * t471;
  t475 = cosVector[5] * COMVector_6[1] * sinVector[4] + COMVector_6[0] *
    sinVector[4] * sinVector[5];
  t478 = massVector[5] * t475 + massVector[4] * COMVector_5[1] * sinVector[4];
  t479 = sinVector[4] * t478;
  t480 = (massVector[3] * COMVector_4[2] + t472) + t479;
  t487 = massVector[4] * ((cosVector[4] * COMVector_5[0] + lengthVector[5] *
    sinVector[4]) + COMVector_5[2] * sinVector[4]);
  t488 = cosVector[5] * massVector[5] * t462;
  t489 = massVector[5] * sinVector[5] * t466;
  t490 = ((massVector[3] * COMVector_4[0] + t487) + t488) + t489;
  t491 = sinVector[3] * t480 - cosVector[3] * t490;
  t493 = (t487 + t488) + t489;
  t497 = (((inertiaTensor_6[0] * cosVector[5] * sinVector[4] + massVector[5] *
            t88 * t462) + massVector[5] * COMVector_6[1] * t475) -
          inertiaTensor_6[2] * cosVector[4]) - inertiaTensor_6[1] * sinVector[4]
    * sinVector[5];
  t502 = (((inertiaTensor_6[5] * cosVector[4] + inertiaTensor_6[4] * sinVector[4]
            * sinVector[5]) + massVector[5] * t88 * t466) + massVector[5] *
          COMVector_6[0] * t475) - inertiaTensor_6[1] * cosVector[5] *
    sinVector[4];
  t503 = t488 + t489;
  t504 = t469 - t492;
  t507 = inertiaTensor_6[8] * cosVector[4];
  t510 = inertiaTensor_6[5] * sinVector[4] * sinVector[5];
  t511 = massVector[5] * COMVector_6[0] * t462;
  t540 = inertiaTensor_6[2] * cosVector[5] * sinVector[4];
  t541 = massVector[5] * COMVector_6[1] * t466;
  t512 = (((((((((inertiaTensor_5[8] * cosVector[4] + t507) + COMVector_5[1] *
                 t471) + COMVector_5[0] * t493) + t510) + t511) -
             inertiaTensor_5[2] * sinVector[4]) - COMVector_5[0] * t503) -
           COMVector_5[1] * t504) - t540) - t541;
  t521 = ((((((inertiaTensor_5[0] * sinVector[4] + COMVector_5[1] * t478) + t114
              * t493) + cosVector[5] * t497) + sinVector[5] * t502) -
           inertiaTensor_5[2] * cosVector[4]) - COMVector_5[2] * t503) -
    massVector[5] * COMVector_5[1] * t475;
  t522 = t472 + t479;
  t523 = inertiaTensor_5[1] * sinVector[4];
  t524 = t114 * t471;
  t526 = sinVector[5] * t497;
  t528 = massVector[5] * COMVector_5[0] * t475;
  t684 = inertiaTensor_5[5] * cosVector[4];
  t685 = COMVector_5[0] * t478;
  t686 = COMVector_5[2] * t504;
  t687 = cosVector[5] * t502;
  t529 = (((((((((inertiaTensor_4[5] + t523) + t524) + t127 * t480) + t526) +
              COMVector_4[1] * t522) + t528) - t684) - t685) - t686) - t687;
  t542 = (((inertiaTensor_4[1] + t127 * t490) + COMVector_4[1] * t493) +
          cosVector[4] * t521) - sinVector[4] * t512;
  t543 = sinVector[3] * t529 - cosVector[3] * t542;
  t544 = COMVector_4[2] * t480;
  t546 = cosVector[4] * t512;
  t547 = sinVector[4] * t521;
  t548 = COMVector_4[0] * t490;
  t761 = COMVector_4[0] * t493;
  t762 = COMVector_4[2] * t522;
  t549 = (((((((inertiaTensor_4[4] + t544) + COMVector_3[0] * t491) + t546) +
             t547) + t548) - t761) - t762) - t156 * t491;
  t553 = (cosVector[5] * lengthVector[5] + cosVector[5] * lengthVector[6]) +
    cosVector[5] * COMVector_6[2];
  t554 = cosVector[5] * massVector[5] * t553;
  t558 = (lengthVector[5] * sinVector[5] + lengthVector[6] * sinVector[5]) +
    COMVector_6[2] * sinVector[5];
  t559 = massVector[5] * sinVector[5] * t558;
  t561 = cosVector[5] * COMVector_6[0] - COMVector_6[1] * sinVector[5];
  t562 = cosVector[5] * massVector[5] * t558;
  t565 = massVector[5] * sinVector[5] * t553;
  t564 = t562 - t565;
  t568 = massVector[4] * COMVector_5[0] + massVector[5] * t561;
  t570 = (t554 + t559) + massVector[4] * t114;
  t575 = ((inertiaTensor_6[4] * cosVector[5] + inertiaTensor_6[1] * sinVector[5])
          + massVector[5] * COMVector_6[0] * t561) + massVector[5] * t88 * t553;
  t579 = ((inertiaTensor_6[1] * cosVector[5] + inertiaTensor_6[0] * sinVector[5])
          + massVector[5] * t88 * t558) - massVector[5] * COMVector_6[1] * t561;
  t580 = t554 + t559;
  t581 = cosVector[4] * t570;
  t587 = sinVector[4] * t568;
  t582 = t581 - t587;
  t583 = inertiaTensor_6[5] * cosVector[5];
  t584 = inertiaTensor_6[2] * sinVector[5];
  t596 = massVector[5] * COMVector_6[1] * t553;
  t597 = massVector[5] * COMVector_6[0] * t558;
  t586 = (((((inertiaTensor_5[5] + t583) + t584) + COMVector_5[1] * t580) -
           COMVector_5[1] * t570) - t596) - t597;
  t588 = cosVector[3] * t564;
  t590 = cosVector[5] * t579;
  t591 = massVector[5] * COMVector_5[1] * t561;
  t599 = COMVector_5[1] * t568;
  t600 = sinVector[5] * t575;
  t601 = COMVector_5[2] * t564;
  t593 = (((((inertiaTensor_5[1] + t590) + t591) + t114 * t564) - t599) - t600)
    - t601;
  t594 = t588 - sinVector[3] * t582;
  t598 = sinVector[4] * t586;
  t602 = COMVector_5[0] * t568;
  t603 = cosVector[5] * t575;
  t604 = t114 * t570;
  t605 = sinVector[5] * t579;
  t700 = COMVector_5[2] * t580;
  t701 = massVector[5] * COMVector_5[0] * t561;
  t614 = sinVector[3] * ((((((((inertiaTensor_5[4] + t602) + t603) + t604) +
    t605) + COMVector_4[1] * t582) + t127 * t582) - t700) - t701) - cosVector[3]
    * (((t598 + cosVector[4] * t593) + COMVector_4[1] * t564) + t127 * t564);
  t616 = cosVector[4] * t586;
  t618 = ((t616 + COMVector_3[0] * t594) - sinVector[4] * t593) - t156 * t594;
  t620 = cosVector[5] * massVector[5] * COMVector_6[0] - massVector[5] *
    COMVector_6[1] * sinVector[5];
  t624 = cosVector[5] * massVector[5] * COMVector_6[1] + massVector[5] *
    COMVector_6[0] * sinVector[5];
  t625 = cosVector[3] * t620 - cosVector[4] * sinVector[3] * t624;
  t628 = inertiaTensor_6[5] - massVector[5] * COMVector_6[1] * t88;
  t629 = inertiaTensor_6[2] - massVector[5] * COMVector_6[0] * t88;
  t634 = (inertiaTensor_6[8] + massVector[5] * (COMVector_6[0] * COMVector_6[0]))
    + massVector[5] * (COMVector_6[1] * COMVector_6[1]);
  t639 = ((COMVector_5[2] * t620 + cosVector[5] * t629) - t114 * t620) -
    sinVector[5] * t628;
  t641 = cosVector[4] * t634;
  t763 = sinVector[4] * t639;
  t644 = ((t156 * t625 + t641) - t763) - COMVector_3[0] * t625;
  t645 = COMVector_5[2] * t624;
  t646 = cosVector[5] * t628;
  t647 = sinVector[5] * t629;
  t714 = t114 * t624;
  t715 = cosVector[4] * t127 * t624;
  t716 = cosVector[4] * COMVector_4[1] * t624;
  t649 = sinVector[4] * t634;
  t650 = cosVector[4] * t639;
  t717 = COMVector_4[1] * t620;
  t718 = t127 * t620;
  t653 = sinVector[3] * (((((t645 + t646) + t647) - t714) - t715) - t716) -
    cosVector[3] * (((t649 + t650) - t717) - t718);
  t654 = t185 + t186;
  t666 = (t316 + t317) + massVector[1] * t315;
  t667 = t316 + t317;
  t668 = t349 - t360;
  t673 = (((t290 + t291) + t292) + t293) + massVector[5] * COMVector_6[0] *
    (((t219 - t250) + t251) - t262);
  t676 = (-t349 + t360) + massVector[1] * COMVector_2[1];
  t683 = cosVector[2] * t433 + sinVector[2] * t454;
  t693 = cosVector[4] * t478 - sinVector[4] * t471;
  t694 = sinVector[2] * (cosVector[3] * t480 + sinVector[3] * t490) - cosVector
    [2] * t693;
  t699 = cosVector[4] * t568 + sinVector[4] * t570;
  t707 = sinVector[2] * (sinVector[3] * t564 + cosVector[3] * t582) + cosVector
    [2] * t699;
  t713 = sinVector[2] * (sinVector[3] * t620 + cosVector[3] * cosVector[4] *
    t624) + cosVector[2] * sinVector[4] * t624;
  t719 = inertiaTensor_3[1] * t6;
  t720 = inertiaTensor_3[5] * t4;
  t721 = COMVector_3[0] * t115;
  t722 = COMVector_3[2] * t311;
  t723 = cosVector[5] * t673;
  t724 = COMVector_5[0] * (t249 + t259);
  t726 = cosVector[3] * ((((((((((((((t335 + t336) + t337) + t338) + t339) +
    t340) + t341) + t342) + t343) + t344) - t669) - t670) - t671) + t723) + t724);
  t727 = (((((((t282 + t283) + t289) + t296) + t297) + t328) - t353) - t355) -
    sinVector[5] * t673;
  t730 = sinVector[3] * (((((((t319 + t320) + t321) + t326) + t327) + t331) -
    t674) + cosVector[4] * t727);
  t731 = t156 * t314;
  t732 = t156 * t433;
  t735 = cosVector[3] * ((((((((((((((t335 + t336) + t337) + t343) + t344) +
    t423) + t424) + t425) + t426) + t427) + t428) - t677) - t678) - t679) +
    COMVector_4[1] * (t386 - t394));
  t736 = COMVector_3[2] * t454;
  t737 = sinVector[3] * t446;
  t738 = t156 * t693;
  t741 = (((((inertiaTensor_5[1] + t590) + t591) - t599) - t600) - t601) + t114 *
    (t562 - t565);
  t745 = sinVector[3] * (((t598 + COMVector_4[1] * (t562 - t565)) + cosVector[4]
    * t741) + t127 * (t562 - t565));
  t746 = t156 * t699;
  t750 = cosVector[3] * ((((((((inertiaTensor_5[4] + t602) + t603) + t604) +
    t605) - t700) - t701) + t127 * (t581 - t587)) + COMVector_4[1] * (t581 -
    t587));
  t751 = cosVector[3] * (((((t645 + t646) + t647) - t714) - t715) - t716);
  t752 = sinVector[3] * (((t649 + t650) - t717) - t718);
  t753 = COMVector_3[0] * sinVector[4] * t624;
  inertia[0] = (((((inertiaTensor_1[4] - COMVector_1[2] * (t198 + t200)) - t197 *
                   ((((t82 + t92) + t95) + t190) - massVector[0] * t197)) +
                  COMVector_1[0] * t191) + COMVector_1[2] * ((t198 + t200) +
    massVector[0] * COMVector_1[2])) + cosVector[1] * (((((((inertiaTensor_2[0] *
    cosVector[1] - inertiaTensor_2[1] * sinVector[1]) + cosVector[2] * t184) -
    COMVector_2[1] * t96) + COMVector_2[1] * t191) + COMVector_2[2] * t193) -
    COMVector_2[2] * t654) + sinVector[2] * t160)) - sinVector[1] *
    (((((((inertiaTensor_2[1] * cosVector[1] + COMVector_2[2] * (cosVector[2] *
            ((t86 + sinVector[3] * (((t67 + t71) + t74) + cosVector[5] *
    massVector[5] * t37)) - cosVector[3] * ((t60 + t63) - cosVector[4] * t138))
            - sinVector[2] * (((t98 + t113) + t116) + sinVector[4] * t138))) -
          inertiaTensor_2[4] * sinVector[1]) - cosVector[2] * t160) -
        COMVector_2[2] * t196) + sinVector[2] * t184) - t191 * t315) +
     COMVector_2[0] * ((t79 + t82) + t92));
  inertia[1] = ((cosVector[1] * ((((inertiaTensor_2[2] + cosVector[2] * t348) -
    COMVector_2[2] * t666) + COMVector_2[2] * t667) - sinVector[2] *
    ((((((((((((-inertiaTensor_3[5] + t350) + t351) + t352) + t357) + t358) +
           t359) - cosVector[4] * t281) - COMVector_4[0] * t266) - COMVector_3[0]
        * t268) - COMVector_4[2] * t305) - COMVector_3[1] * t356) + sinVector[4]
     * ((((((((t282 + t283) + t289) + t296) + t297) - COMVector_5[1] * t260) -
          COMVector_5[2] * t271) - sinVector[5] * t295) + massVector[5] *
        COMVector_5[1] * t258))) + t197 * (t256 - sinVector[3] * ((t244 + t246)
    - sinVector[4] * (t249 + massVector[5] * (((t219 + t251) - COMVector_6[1] *
    t218) - sinVector[4] * t207))))) - COMVector_1[0] * t268) - sinVector[1] *
    ((((((inertiaTensor_2[5] + cosVector[2] * ((((((((((((-inertiaTensor_3[5] +
    t350) + t351) + t352) + t357) + t358) + t359) - cosVector[4] * t281) -
    COMVector_4[0] * t266) - COMVector_3[0] * t268) - COMVector_4[2] * t305) -
            COMVector_3[1] * t356) + sinVector[4] * t329)) - COMVector_2[0] *
         t268) - COMVector_2[2] * t668) - COMVector_2[2] * t676) + sinVector[2] *
      t348) + t268 * t315);
  inertia[2] = ((-sinVector[1] * (((cosVector[2] * t457 - COMVector_2[0] * t410)
    + sinVector[2] * t448) + t315 * t410) - COMVector_1[0] * t410) + t197 * t410)
    + cosVector[1] * (cosVector[2] * t448 - sinVector[2] * t457);
  inertia[3] = ((sinVector[1] * (((cosVector[2] * t549 + COMVector_2[0] * t491)
    - sinVector[2] * t543) - t315 * t491) - COMVector_1[0] * t491) + t197 * t491)
    + cosVector[1] * (cosVector[2] * t543 + sinVector[2] * t549);
  inertia[4] = ((sinVector[1] * (((-t315 * (t588 - sinVector[3] * (t581 - t587))
    + cosVector[2] * t618) + COMVector_2[0] * t594) + sinVector[2] * t614) +
                 t197 * (t588 - sinVector[3] * (t581 - t587))) - COMVector_1[0] *
                t594) - cosVector[1] * (cosVector[2] * t614 - sinVector[2] *
    t618);
  inertia[5] = ((sinVector[1] * (((cosVector[2] * t644 - COMVector_2[0] * t625)
    + sinVector[2] * t653) + t315 * t625) + COMVector_1[0] * t625) - t197 * t625)
    - cosVector[1] * (cosVector[2] * t653 - sinVector[2] * t644);
  inertia[6] = ((((((((((((t719 + t720) + t721) + inertiaTensor_2[2] *
    cosVector[1]) - inertiaTensor_2[5] * sinVector[1]) - cosVector[3] * t173) -
                      COMVector_3[2] * t136) + COMVector_2[1] * t196) +
                    COMVector_2[0] * t654) - COMVector_3[2] * t655) - sinVector
                  [3] * t183) - t137 * t156) - t193 * t315) - COMVector_2[1] *
    (t194 - t199);
  inertia[7] = ((((((((((inertiaTensor_3[4] + inertiaTensor_2[8]) + t722) + t726)
                      + t730) + t731) - COMVector_3[0] * t303) - COMVector_3[2] *
                   t356) - COMVector_2[0] * t667) + COMVector_2[1] * t668) +
                COMVector_2[1] * t676) + t315 * t666;
  inertia[8] = (((((((inertiaTensor_3[4] + t732) + t735) + t736) + t737) -
                  COMVector_3[0] * t399) - COMVector_3[2] * t451) - COMVector_2
                [0] * t683) + t315 * t683;
  inertia[9] = ((((t738 - cosVector[3] * t529) + COMVector_2[0] * t694) -
                 COMVector_3[0] * t693) - sinVector[3] * t542) - t315 * t694;
  inertia[10] = ((((t745 + t746) + t750) - COMVector_3[0] * t699) - COMVector_2
                 [0] * t707) + t315 * t707;
  inertia[11] = ((((t751 + t752) + t753) + COMVector_2[0] * t713) - t315 * t713)
    - sinVector[4] * t156 * t624;
  inertia[12] = ((((((t719 + t720) + t721) - cosVector[3] * t173) - COMVector_3
                   [2] * t136) - COMVector_3[2] * t655) - sinVector[3] * t183) -
    t137 * t156;
  inertia[13] = (((((inertiaTensor_3[4] + t722) + t726) + t730) + t731) -
                 COMVector_3[0] * t303) - COMVector_3[2] * t356;
  inertia[14] = (((((inertiaTensor_3[4] + t732) + t735) + t736) + t737) -
                 COMVector_3[0] * t399) - COMVector_3[2] * t451;
  inertia[15] = ((t738 - cosVector[3] * t529) - COMVector_3[0] * t693) -
    sinVector[3] * t542;
  inertia[16] = ((t745 + t746) + t750) - COMVector_3[0] * t699;
  inertia[17] = ((t751 + t752) + t753) - sinVector[4] * t156 * t624;
  inertia[18] = (((((((t145 + t147) + t149) + t158) - t754) - t755) - t756) -
                 t757) + COMVector_4[2] * (t60 - t84);
  inertia[19] = ((((((-t350 - t351) - t357) - t358) + cosVector[4] * t281) +
                  COMVector_4[0] * t266) + COMVector_4[2] * t305) - sinVector[4]
    * t727;
  inertia[20] = ((((((-t350 - t351) - t450) - t452) - t456) + t759) + t760) +
    COMVector_4[2] * (t386 - t394);
  inertia[21] = (((((inertiaTensor_4[4] + t544) + t546) + t547) + t548) - t761)
    - t762;
  inertia[22] = t616 - sinVector[4] * t741;
  inertia[23] = t641 - t763;
  inertia[24] = (((((((-t164 - t166) - t167) - t169) - t170) - t171) + t660) +
                 t661) + COMVector_5[2] * (t75 - t83);
  inertia[25] = (((((((t335 + t338) + t341) + t343) + t344) - t669) - t671) +
                 t723) + t724;
  inertia[26] = (((((((t335 + t343) + t344) + t423) + t424) + t425) + t427) -
                 t677) - t679;
  inertia[27] = ((((((-t523 - t524) - t526) - t528) + t684) + t685) + t686) +
    t687;
  inertia[28] = (((((inertiaTensor_5[4] + t602) + t603) + t604) + t605) - t700)
    - t701;
  inertia[29] = ((t645 + t646) + t647) - t714;
  inertia[30] = (((-t131 - t133) + t153) + t154) + t155;
  inertia[31] = (((t276 + t277) + t280) - t324) - t325;
  inertia[32] = (((t276 + t277) + t280) - t442) - t443;
  inertia[33] = (((t507 + t510) + t511) - t540) - t541;
  inertia[34] = ((t583 + t584) - t596) - t597;
  inertia[35] = t634;
}

//
// File trailer for inertiaMatrix.cpp
//
// [EOF]
//
