//
// File: coriolisMatrix.cpp
//
// MATLAB Coder version            : 3.1
// C/C++ source code generated on  : 16-Dec-2017 18:21:45
//

// Include Files
#include "coriolisMatrix.h"

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
//                double coriolis[36]
// Return Type  : void
//
void coriolisMatrix(const double lengthVector[7], const double massVector[6],
                    double, const double [9], const double inertiaTensor_2[9],
                    const double inertiaTensor_3[9], const double
                    inertiaTensor_4[9], const double inertiaTensor_5[9], const
                    double inertiaTensor_6[9], const double COMVector_1[3],
                    const double COMVector_2[3], const double COMVector_3[3],
                    const double COMVector_4[3], const double COMVector_5[3],
                    const double COMVector_6[3], const double [6], const double
                    angleVelocityVector[6], const double [6], const double
                    sinVector[6], const double cosVector[6], const double [4],
                    double coriolis[36])
{
  double t3;
  double t6;
  double t10;
  double t11;
  double t12;
  double t14;
  double t15;
  double t17;
  double t18;
  double t19;
  double t20;
  double t21;
  double t22;
  double t23;
  double t25;
  double t28;
  double t31;
  double t32;
  double t49;
  double t33;
  double t34;
  double t37;
  double t38;
  double t39;
  double t40;
  double t41;
  double t43;
  double t44;
  double t198;
  double t48;
  double t50;
  double t51;
  double t52;
  double t53;
  double t199;
  double t56;
  double t200;
  double t57;
  double t58;
  double t59;
  double t60;
  double t63;
  double t64;
  double t65;
  double t204;
  double t205;
  double t67;
  double t68;
  double t69;
  double t70;
  double t72;
  double t73;
  double t74;
  double t75;
  double t76;
  double t87;
  double t77;
  double t78;
  double t81;
  double t83;
  double t86;
  double t88;
  double t89;
  double t96;
  double t90;
  double t93;
  double t94;
  double t103;
  double t104;
  double t98;
  double t99;
  double t100;
  double t101;
  double t102;
  double t105;
  double t106;
  double t107;
  double t113;
  double t108;
  double t109;
  double t112;
  double t141;
  double t120;
  double t121;
  double t122;
  double t123;
  double t125;
  double t138;
  double t128;
  double t132;
  double t134;
  double t136;
  double t137;
  double t139;
  double t140;
  double t144;
  double t145;
  double t146;
  double t147;
  double t151;
  double t148;
  double t149;
  double t150;
  double t152;
  double t153;
  double t154;
  double t155;
  double t158;
  double t159;
  double t160;
  double t183;
  double t165;
  double t180;
  double t169;
  double t170;
  double t171;
  double t172;
  double t176;
  double t177;
  double t181;
  double t184;
  double t259;
  double t186;
  double t187;
  double t188;
  double t266;
  double t196;
  double t197;
  double t201;
  double t203;
  double t207;
  double t208;
  double t206;
  double t209;
  double t210;
  double t211;
  double t212;
  double t213;
  double t214;
  double t215;
  double t216;
  double t217;
  double t221;
  double t222;
  double t223;
  double t224;
  double t225;
  double t226;
  double t241;
  double t229;
  double t230;
  double t231;
  double t238;
  double t239;
  double t234;
  double t235;
  double t236;
  double t243;
  double t315;
  double t318;
  double t245;
  double t247;
  double t248;
  double t249;
  double t252;
  double t324;
  double t325;
  double t253;
  double t254;
  double t343;
  double t255;
  double t256;
  double t261;
  double t262;
  double t263;
  double t264;
  double t270;
  double t272;
  double t273;
  double t274;
  double t275;
  double t276;
  double t281;
  double t445;
  double t565;
  double t287;
  double t288;
  double t289;
  double t290;
  double t292;
  double t296;
  double t413;
  double t297;
  double t299;
  double t300;
  double t302;
  double t303;
  double t304;
  double t305;
  double t306;
  double t307;
  double t308;
  double t309;
  double t310;
  double t311;
  double t312;
  double t680;
  double t682;
  double t688;
  double t1623;
  double t1624;
  double t1625;
  double t1626;
  double t2459;
  double t322;
  double t328;
  double t676;
  double t329;
  double t331;
  double t332;
  double t333;
  double t334;
  double t335;
  double t336;
  double t337;
  double t338;
  double t339;
  double t340;
  double t341;
  double t342;
  double t344;
  double t345;
  double t346;
  double t347;
  double t352;
  double t357;
  double t359;
  double t361;
  double t362;
  double t367;
  double t370;
  double t371;
  double t379;
  double t375;
  double t378;
  double t385;
  double t389;
  double t390;
  double t391;
  double t398;
  double t409;
  double t412;
  double t414;
  double t415;
  double t426;
  double t433;
  double t434;
  double t435;
  double t436;
  double t2132;
  double t2133;
  double t437;
  double t438;
  double t439;
  double t440;
  double t448;
  double t441;
  double t442;
  double t444;
  double t443;
  double t450;
  double t451;
  double t446;
  double t449;
  double t453;
  double t457;
  double t458;
  double t459;
  double t461;
  double t464;
  double t467;
  double t473;
  double t474;
  double t468;
  double t469;
  double t472;
  double t475;
  double t476;
  double t477;
  double t2274;
  double t2276;
  double t478;
  double t479;
  double t480;
  double t2277;
  double t2278;
  double t482;
  double t483;
  double t484;
  double t2272;
  double t2273;
  double t486;
  double t488;
  double t489;
  double t490;
  double t499;
  double t491;
  double t492;
  double t493;
  double t496;
  double t498;
  double t506;
  double t507;
  double t511;
  double t517;
  double t512;
  double t518;
  double t519;
  double t521;
  double t523;
  double t528;
  double t529;
  double t531;
  double t534;
  double t535;
  double t539;
  double t542;
  double t547;
  double t548;
  double t549;
  double t554;
  double t555;
  double t560;
  double t575;
  double t578;
  double t589;
  double t579;
  double t588;
  double t604;
  double t605;
  double t607;
  double t608;
  double t609;
  double t610;
  double t611;
  double t612;
  double t613;
  double t614;
  double t615;
  double t616;
  double t617;
  double t618;
  double t619;
  double t620;
  double t2063;
  double t622;
  double t623;
  double t624;
  double t625;
  double t626;
  double t627;
  double t628;
  double t629;
  double t630;
  double t631;
  double t632;
  double t634;
  double t637;
  double t640;
  double t641;
  double t642;
  double t643;
  double t646;
  double t649;
  double t665;
  double t651;
  double t652;
  double t654;
  double t656;
  double t659;
  double t660;
  double t661;
  double t662;
  double t664;
  double t667;
  double t668;
  double t670;
  double t669;
  double t671;
  double t672;
  double t673;
  double t674;
  double t675;
  double t679;
  double t681;
  double t683;
  double t684;
  double t687;
  double t689;
  double t690;
  double t697;
  double t691;
  double t692;
  double t693;
  double t694;
  double t695;
  double t696;
  double t702;
  double t706;
  double t709;
  double t710;
  double t719;
  double t720;
  double t721;
  double t726;
  double t728;
  double t729;
  double t739;
  double t742;
  double t743;
  double t744;
  double t745;
  double t746;
  double t747;
  double t748;
  double t1372;
  double t1373;
  double t1374;
  double t1375;
  double t2581;
  double t751;
  double t752;
  double t753;
  double t754;
  double t755;
  double t756;
  double t757;
  double t758;
  double t759;
  double t1380;
  double t1381;
  double t1382;
  double t1383;
  double t1384;
  double t761;
  double t764;
  double t765;
  double t766;
  double t767;
  double t768;
  double t769;
  double t770;
  double t771;
  double t772;
  double t773;
  double t774;
  double t775;
  double t776;
  double t777;
  double t779;
  double t780;
  double t782;
  double t783;
  double t790;
  double t791;
  double t784;
  double t785;
  double t786;
  double t787;
  double t788;
  double t793;
  double t789;
  double t792;
  double t794;
  double t795;
  double t796;
  double t804;
  double t799;
  double t800;
  double t801;
  double t817;
  double t803;
  double t805;
  double t806;
  double t809;
  double t813;
  double t808;
  double t810;
  double t824;
  double t812;
  double t822;
  double t814;
  double t815;
  double t816;
  double t826;
  double t819;
  double t821;
  double t820;
  double t823;
  double t828;
  double t825;
  double t827;
  double t829;
  double t830;
  double t831;
  double t908;
  double t832;
  double t833;
  double t835;
  double t837;
  double t838;
  double t839;
  double t840;
  double t841;
  double t842;
  double t843;
  double t844;
  double t845;
  double t846;
  double t847;
  double t849;
  double t850;
  double t851;
  double t852;
  double t853;
  double t854;
  double t856;
  double t857;
  double t858;
  double t859;
  double t860;
  double t861;
  double t867;
  double t863;
  double t864;
  double t865;
  double t866;
  double t872;
  double t875;
  double t876;
  double t877;
  double t878;
  double t879;
  double t880;
  double t885;
  double t886;
  double t887;
  double t913;
  double t914;
  double t915;
  double t888;
  double t889;
  double t890;
  double t1093;
  double t891;
  double t893;
  double t894;
  double t895;
  double t896;
  double t897;
  double t898;
  double t899;
  double t900;
  double t901;
  double t902;
  double t903;
  double t905;
  double t1094;
  double t1095;
  double t1096;
  double t906;
  double t1098;
  double t907;
  double t909;
  double t910;
  double t911;
  double t912;
  double t916;
  double t917;
  double t918;
  double t919;
  double t920;
  double t921;
  double t922;
  double t924;
  double t928;
  double t929;
  double t932;
  double t933;
  double t938;
  double t939;
  double t941;
  double t995;
  double t996;
  double t943;
  double t944;
  double t947;
  double t951;
  double t952;
  double t953;
  double t955;
  double t959;
  double t961;
  double t962;
  double t963;
  double t965;
  double t966;
  double t967;
  double t972;
  double t969;
  double t970;
  double t975;
  double t976;
  double t977;
  double t971;
  double t974;
  double t979;
  double t2303;
  double t980;
  double t981;
  double t982;
  double t983;
  double t984;
  double t2304;
  double t2305;
  double t987;
  double t988;
  double t2306;
  double t992;
  double t994;
  double t1716;
  double t997;
  double t998;
  double t999;
  double t1000;
  double t1718;
  double t1719;
  double t1720;
  double t1001;
  double t1002;
  double t1003;
  double t1005;
  double t1006;
  double t1008;
  double t1011;
  double t1015;
  double t1017;
  double t1019;
  double t1021;
  double t1100;
  double t1022;
  double t1026;
  double t1027;
  double t1029;
  double t1030;
  double t1031;
  double t1101;
  double t1033;
  double t1034;
  double t1035;
  double t1036;
  double t1037;
  double t1038;
  double t1039;
  double t1040;
  double t1047;
  double t1041;
  double t1043;
  double t1042;
  double t1048;
  double t1049;
  double t1050;
  double t1051;
  double t1052;
  double t1053;
  double t1056;
  double t1057;
  double t1058;
  double t1059;
  double t1061;
  double t1062;
  double t1064;
  double t1067;
  double t1068;
  double t1069;
  double t1071;
  double t1074;
  double t1072;
  double t1073;
  double t1075;
  double t1077;
  double t1079;
  double t1083;
  double t1080;
  double t1081;
  double t1082;
  double t1131;
  double t1084;
  double t1086;
  double t1090;
  double t1091;
  double t1092;
  double t1099;
  double t1103;
  double t1104;
  double t1105;
  double t1106;
  double t1107;
  double t1108;
  double t1109;
  double t1110;
  double t1111;
  double t1113;
  double t1117;
  double t1121;
  double t1122;
  double t1123;
  double t1124;
  double t1125;
  double t1127;
  double t1128;
  double t1170;
  double t1171;
  double t1129;
  double t1130;
  double t1134;
  double t1136;
  double t1138;
  double t1141;
  double t1156;
  double t1143;
  double t1149;
  double t1157;
  double t1159;
  double t1642;
  double t1162;
  double t1163;
  double t1277;
  double t1661;
  double t1662;
  double t1663;
  double t1664;
  double t1164;
  double t1165;
  double t1168;
  double t1176;
  double t1178;
  double t1179;
  double t1180;
  double t1181;
  double t1182;
  double t1184;
  double t1185;
  double t1192;
  double t1193;
  double t1655;
  double t1656;
  double t1196;
  double t1197;
  double t1199;
  double t1202;
  double t1203;
  double t1207;
  double t1208;
  double t1212;
  double t1213;
  double t1215;
  double t1216;
  double t1219;
  double t1218;
  double t1222;
  double t1224;
  double t1226;
  double t1228;
  double t1229;
  double t1230;
  double t1232;
  double t1233;
  double t1234;
  double t1235;
  double t1241;
  double t1236;
  double t1240;
  double t1242;
  double t1244;
  double t1245;
  double t1325;
  double t1326;
  double t1327;
  double t1247;
  double t1248;
  double t1266;
  double t1267;
  double t1249;
  double t1253;
  double t1254;
  double t1255;
  double t1256;
  double t1257;
  double t1258;
  double t1259;
  double t1260;
  double t1261;
  double t1262;
  double t1263;
  double t1271;
  double t1269;
  double t1276;
  double t1272;
  double t1274;
  double t1297;
  double t1275;
  double t1279;
  double t1280;
  double t1281;
  double t1282;
  double t1287;
  double t1288;
  double t1289;
  double t1291;
  double t1313;
  double t1292;
  double t1294;
  double t1295;
  double t1316;
  double t1296;
  double t1299;
  double t1298;
  double t1301;
  double t1303;
  double t1307;
  double t1308;
  double t1309;
  double t1351;
  double t1317;
  double t1319;
  double t1348;
  double t1320;
  double t1324;
  double t1328;
  double t1329;
  double t1330;
  double t1331;
  double t1824;
  double t1825;
  double t1340;
  double t1342;
  double t1828;
  double t1344;
  double t1353;
  double t1354;
  double t2194;
  double t2195;
  double t1355;
  double t1356;
  double t1357;
  double t1358;
  double t1359;
  double t1360;
  double t1361;
  double t2191;
  double t2192;
  double t1362;
  double t1366;
  double t1364;
  double t1365;
  double t1367;
  double t1368;
  double t1377;
  double t1378;
  double t1379;
  double t1385;
  double t1388;
  double t1389;
  double t1394;
  double t1399;
  double t1395;
  double t1396;
  double t1397;
  double t1398;
  double t1401;
  double t1402;
  double t1403;
  double t1404;
  double t1405;
  double t1408;
  double t1409;
  double t1410;
  double t1411;
  double t1413;
  double t1416;
  double t1417;
  double t1418;
  double t1419;
  double t1422;
  double t1423;
  double t1424;
  double t1425;
  double t1426;
  double t1427;
  double t1428;
  double t1429;
  double t1447;
  double t1430;
  double t1431;
  double t1432;
  double t1433;
  double t1436;
  double t1438;
  double t1439;
  double t1440;
  double t1441;
  double t1451;
  double t1443;
  double t1444;
  double t1452;
  double t1445;
  double t1450;
  double t1455;
  double t1448;
  double t1449;
  double t1493;
  double t1453;
  double t1454;
  double t1456;
  double t1457;
  double t1458;
  double t1474;
  double t1460;
  double t1461;
  double t1462;
  double t1473;
  double t1465;
  double t1466;
  double t1467;
  double t1471;
  double t1488;
  double t1472;
  double t1478;
  double t1479;
  double t1598;
  double t1481;
  double t1482;
  double t1483;
  double t1484;
  double t1485;
  double t1486;
  double t1487;
  double t1592;
  double t1593;
  double t1594;
  double t1595;
  double t1596;
  double t1490;
  double t1491;
  double t1492;
  double t1495;
  double t1497;
  double t1498;
  double t1499;
  double t1500;
  double t1501;
  double t1502;
  double t1503;
  double t1504;
  double t1505;
  double t1514;
  double t1506;
  double t1509;
  double t1511;
  double t1512;
  double t1515;
  double t1516;
  double t1521;
  double t1522;
  double t1523;
  double t1524;
  double t1553;
  double t1528;
  double t1555;
  double t1533;
  double t1534;
  double t1535;
  double t1537;
  double t1539;
  double t1540;
  double t1559;
  double t1541;
  double t1574;
  double t1548;
  double t1554;
  double t1556;
  double t1570;
  double t1557;
  double t1558;
  double t1563;
  double t1783;
  double t1566;
  double t1567;
  double t1573;
  double t1784;
  double t1579;
  double t1785;
  double t1580;
  double t1581;
  double t1582;
  double t1583;
  double t1584;
  double t1786;
  double t1787;
  double t1788;
  double t1586;
  double t1587;
  double t1589;
  double t1603;
  double t1590;
  double t1591;
  double t1601;
  double t1602;
  double t1604;
  double t1605;
  double t1606;
  double t1607;
  double t1608;
  double t1609;
  double t1610;
  double t1611;
  double t1612;
  double t1613;
  double t1614;
  double t1616;
  double t1617;
  double t1618;
  double t1619;
  double t1620;
  double t1629;
  double t1630;
  double t1631;
  double t1638;
  double t1644;
  double t1646;
  double t1647;
  double t1649;
  double t1665;
  double t1668;
  double t1669;
  double t1670;
  double t1671;
  double t1673;
  double t1674;
  double t1675;
  double t1676;
  double t1677;
  double t1681;
  double t1683;
  double t1686;
  double t1688;
  double t1691;
  double t1692;
  double t1698;
  double t1699;
  double t1700;
  double t1693;
  double t1695;
  double t1703;
  double t1708;
  double t2427;
  double t1714;
  double t1717;
  double t1724;
  double t1727;
  double t1728;
  double t1729;
  double t1730;
  double t1731;
  double t1733;
  double t1736;
  double t1739;
  double t1741;
  double t1742;
  double t1743;
  double t1746;
  double t1747;
  double t1754;
  double t1748;
  double t1750;
  double t1751;
  double t1755;
  double t1752;
  double t1756;
  double t1757;
  double t1758;
  double t1759;
  double t1763;
  double t1765;
  double t1769;
  double t1770;
  double t1771;
  double t1772;
  double t1773;
  double t1774;
  double t1775;
  double t1776;
  double t1777;
  double t1798;
  double t1799;
  double t1779;
  double t1789;
  double t1790;
  double t1814;
  double t1815;
  double t1791;
  double t1792;
  double t1793;
  double t1796;
  double t1797;
  double t1800;
  double t2079;
  double t2080;
  double t1809;
  double t1810;
  double t2076;
  double t2081;
  double t1813;
  double t1816;
  double t1817;
  double t1818;
  double t2071;
  double t2072;
  double t2073;
  double t2074;
  double t2075;
  double t1820;
  double t1823;
  double t1827;
  double t1830;
  double t1833;
  double t1834;
  double t1835;
  double t1837;
  double t1839;
  double t1840;
  double t1841;
  double t1842;
  double t1852;
  double t1845;
  double t1846;
  double t1850;
  double t1851;
  double t1853;
  double t1855;
  double t1858;
  double t1860;
  double t1864;
  double t1865;
  double t1871;
  double t1873;
  double t1872;
  double t1881;
  double t1882;
  double t2212;
  double t2213;
  double t1883;
  double t2190;
  double t1889;
  double t1891;
  double t1893;
  double t1894;
  double t1895;
  double t1896;
  double t1900;
  double t1903;
  double t1905;
  double t1910;
  double t1911;
  double t1916;
  double t1917;
  double t1918;
  double t1923;
  double t1920;
  double t1922;
  double t1925;
  double t1929;
  double t1926;
  double t1927;
  double t1934;
  double t1938;
  double t1947;
  double t1948;
  double t1949;
  double t1950;
  double t1951;
  double t1952;
  double t1953;
  double t1954;
  double t1959;
  double t1960;
  double t1962;
  double t1966;
  double t1968;
  double t2103;
  double t1970;
  double t1973;
  double t1974;
  double t1975;
  double t1983;
  double t1993;
  double t1996;
  double t1997;
  double t1998;
  double t2000;
  double t2001;
  double t2002;
  double t2009;
  double t2010;
  double t2003;
  double t2006;
  double t2008;
  double t2013;
  double t2017;
  double t2020;
  double t2022;
  double t2023;
  double t2024;
  double t2027;
  double t2031;
  double t2032;
  double t2033;
  double t2034;
  double t2235;
  double t2236;
  double t2035;
  double t2045;
  double t2047;
  double t2050;
  double t2053;
  double t2056;
  double t2062;
  double t2064;
  double t2066;
  double t2067;
  double t2068;
  double t2069;
  double t2070;
  double t2095;
  double t2082;
  double t2084;
  double t2646;
  double t2085;
  double t2087;
  double t2088;
  double t2089;
  double t2090;
  double t2091;
  double t2093;
  double t2094;
  double t2097;
  double t2389;
  double t2390;
  double t2391;
  double t2637;
  double t2100;
  double t2632;
  double t2633;
  double t2634;
  double t2101;
  double t2102;
  double t2104;
  double t2105;
  double t2109;
  double t2110;
  double t2111;
  double t2112;
  double t2116;
  double t2117;
  double t2650;
  double t2122;
  double t2124;
  double t2131;
  double t2134;
  double t2135;
  double t2137;
  double t2140;
  double t2143;
  double t2146;
  double t2147;
  double t2150;
  double t2153;
  double t2155;
  double t2156;
  double t2157;
  double t2250;
  double t2158;
  double t2164;
  double t2169;
  double t2171;
  double t2175;
  double t2178;
  double t2180;
  double t2183;
  double t2188;
  double t2185;
  double t2187;
  double t2189;
  double t2193;
  double t2196;
  double t2198;
  double t2199;
  double t2208;
  double t2209;
  double t2200;
  double t2201;
  double t2202;
  double t2203;
  double t2204;
  double t2205;
  double t2206;
  double t2210;
  double t2211;
  double t2218;
  double t2221;
  double t2224;
  double t2225;
  double t2354;
  double t2226;
  double t2230;
  double t2233;
  double t2234;
  double t2243;
  double t2244;
  double t2248;
  double t2251;
  double t2252;
  double t2705;
  double t2706;
  double t2261;
  double t2267;
  double t2268;
  double t2269;
  double t2707;
  double t2821;
  double t2822;
  double t2271;
  double t2282;
  double t2285;
  double t2286;
  double t2289;
  double t2293;
  double t2295;
  double t2298;
  double t2299;
  double t2302;
  double t2308;
  double t2311;
  double t2783;
  double t2313;
  double t2320;
  double t2321;
  double t2326;
  double t2328;
  double t2334;
  double t2337;
  double t2338;
  double t2341;
  double t2342;
  double t2343;
  double t2344;
  double t2345;
  double t2346;
  double t2348;
  double t2352;
  double t2353;
  double t2356;
  double t2357;
  double t2364;
  double t2358;
  double t2359;
  double t2362;
  double t2363;
  double t2366;
  double t2368;
  double t2369;
  double t2371;
  double t2373;
  double t2374;
  double t2376;
  double t2571;
  double t2379;
  double t2381;
  double t2386;
  double t2387;
  double t2422;
  double t2388;
  double t2395;
  double t2397;
  double t2398;
  double t2401;
  double t2400;
  double t2404;
  double t2405;
  double t2406;
  double t2411;
  double t2412;
  double t2413;
  double t2414;
  double t2418;
  double t2420;
  double t2421;
  double t2423;
  double t2424;
  double t2425;
  double t2430;
  double t2426;
  double t2431;
  double t2433;
  double t2436;
  double t2442;
  double t2443;
  double t2521;
  double t2444;
  double t2448;
  double t2452;
  double t2453;
  double t2454;
  double t2456;
  double t2457;
  double t2458;
  double t2461;
  double t2462;
  double t2460;
  double t2463;
  double t2467;
  double t2468;
  double t2469;
  double t2470;
  double t2526;
  double t2471;
  double t2473;
  double t2477;
  double t2478;
  double t2479;
  double t2481;
  double t2482;
  double t2483;
  double t2484;
  double t2485;
  double t2487;
  double t2486;
  double t2488;
  double t2491;
  double t2492;
  double t2493;
  double t2494;
  double t2495;
  double t2498;
  double t2499;
  double t2591;
  double t2603;
  double t2604;
  double t2605;
  double t2661;
  double t2500;
  double t2501;
  double t2502;
  double t2503;
  double t2504;
  double t2505;
  double t2506;
  double t2606;
  double t2607;
  double t2668;
  double t2507;
  double t2508;
  double t2746;
  double t2509;
  double t2511;
  double t2513;
  double t2515;
  double t2516;
  double t2517;
  double t2518;
  double t2519;
  double t2520;
  double t2522;
  double t2523;
  double t2524;
  double t2525;
  double t2585;
  double t2527;
  double t2528;
  double t2530;
  double t2531;
  double t2533;
  double t2534;
  double t2535;
  double t2536;
  double t2537;
  double t2620;
  double t2621;
  double t2622;
  double t2747;
  double t2830;
  double t2538;
  double t2690;
  double t2540;
  double t2541;
  double t2543;
  double t2544;
  double t2545;
  double t2547;
  double t2548;
  double t2549;
  double t2550;
  double t2551;
  double t2555;
  double t2553;
  double t2556;
  double t2557;
  double t2558;
  double t2559;
  double t2564;
  double t2570;
  double t2572;
  double t2574;
  double t2575;
  double t2576;
  double t2577;
  double t2578;
  double t2579;
  double t2580;
  double t2582;
  double t2583;
  double t2586;
  double t2587;
  double t2589;
  double t2590;
  double t2592;
  double t2598;
  double t2600;
  double t2595;
  double t2596;
  double t2597;
  double t2601;
  double t2602;
  double t2608;
  double t2609;
  double t2610;
  double t2612;
  double t2613;
  double t2614;
  double t2615;
  double t2616;
  double t2617;
  double t2618;
  double t2619;
  double t2825;
  double t2826;
  double t2623;
  double t2624;
  double t2625;
  double t2626;
  double t2627;
  double t2628;
  double t2631;
  double t2636;
  double t2638;
  double t2640;
  double t2641;
  double t2642;
  double t2643;
  double t2644;
  double t2645;
  double t2647;
  double t2648;
  double t2649;
  double t2651;
  double t2653;
  double t2655;
  double t2659;
  double t2660;
  double t2662;
  double t2663;
  double t2670;
  double t2671;
  double t2672;
  double t2665;
  double t2666;
  double t2667;
  double t2669;
  double t2673;
  double t2674;
  double t2675;
  double t2676;
  double t2677;
  double t2678;
  double t2679;
  double t2682;
  double t2683;
  double t2684;
  double t2685;
  double t2686;
  double t2687;
  double t2688;
  double t2689;
  double t2691;
  double t2692;
  double t2693;
  double t2695;
  double t2696;
  double t2697;
  double t2698;
  double t2699;
  double t2700;
  double t2701;
  double t2702;
  double t2703;
  double t2704;
  double t2713;
  double t2715;
  double t2716;
  double t2717;
  double t2718;
  double t2719;
  double t2720;
  double t2721;
  double t2722;
  double t2725;
  double t2729;
  double t2730;
  double t2731;
  double t2734;
  double t2735;
  double t2736;
  double t2737;
  double t2738;
  double t2739;
  double t2740;
  double t2741;
  double t2742;
  double t2749;
  double t2745;
  double t2748;
  double t2750;
  double t2751;
  double t2752;
  double t2753;
  double t2754;
  double t2755;
  double t2756;
  double t2757;
  double t2758;
  double t2761;
  double t2763;
  double t2766;
  double t2767;
  double t2768;
  double t2769;
  double t2770;
  double t2771;
  double t2772;
  double t2773;
  double t2774;
  double t2775;
  double t2776;
  double t2777;
  double t2778;
  double t2780;
  double t2781;
  double t2782;
  double t2785;
  double t2788;
  double t2789;
  double t2791;
  double t2792;
  double t2790;
  double t2793;
  double t2794;
  double t2795;
  double t2796;
  double t2799;
  double t2802;
  double t2806;
  double t2809;
  double t2810;
  double t2811;
  double t2814;
  double t2815;
  double t2817;
  double t2819;
  double t2820;
  double t2827;
  double t2828;
  double t2829;
  double t2831;
  double t2833;
  double t2834;
  double t2835;
  double t2838;
  double t2839;
  double t2840;
  double t2841;
  double t2842;
  double t2843;
  double t2845;
  double t2847;
  double t2848;
  double t2849;
  double t2850;
  double t2851;
  double t2852;
  double t2853;
  double t2854;
  double t2855;
  double t2856;
  double t2857;
  double t2859;
  double t2860;
  double t2863;
  double t2865;
  double t2864;
  double t2867;
  double t2869;

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
  t6 = cosVector[1] * sinVector[2] + cosVector[2] * sinVector[1];
  t10 = sinVector[4] * t3 + cosVector[3] * cosVector[4] * t6;
  t11 = cosVector[3] * lengthVector[3] * t3;
  t12 = cosVector[3] * lengthVector[4] * t6;
  t14 = cosVector[4] * t3 - cosVector[3] * sinVector[4] * t6;
  t15 = lengthVector[5] * t10;
  t17 = cosVector[5] * t10 - sinVector[3] * sinVector[5] * t6;
  t18 = lengthVector[3] * sinVector[3] * t3;
  t19 = lengthVector[4] * sinVector[3] * t6;
  t20 = t18 + t19;
  t21 = cosVector[4] * t20;
  t22 = lengthVector[5] * sinVector[3] * t6;
  t23 = t21 + t22;
  t25 = (t11 + t12) + t15;
  t28 = sinVector[5] * t10 + cosVector[5] * sinVector[3] * t6;
  t31 = lengthVector[6] * t28;
  t32 = COMVector_6[2] * t28;
  t49 = COMVector_6[1] * t14;
  t33 = (((cosVector[5] * t23 + sinVector[5] * t25) + t31) + t32) - t49;
  t34 = COMVector_6[0] * t14;
  t37 = lengthVector[6] * t17;
  t38 = COMVector_6[2] * t17;
  t39 = (((t34 + cosVector[5] * t25) + t37) + t38) - sinVector[5] * t23;
  t40 = COMVector_5[0] * t14;
  t41 = COMVector_5[2] * t10;
  t43 = massVector[4] * ((((t11 + t12) + t15) + t40) + t41);
  t44 = COMVector_4[0] * t3;
  t198 = cosVector[3] * COMVector_4[1] * t6;
  t48 = cosVector[5] * massVector[5] * t39;
  t50 = massVector[5] * sinVector[5] * t33;
  t51 = ((t43 + massVector[3] * (((t11 + t12) + t44) - t198)) + t48) + t50;
  t52 = cosVector[3] * t51;
  t53 = COMVector_5[2] * sinVector[3] * t6;
  t199 = COMVector_5[1] * t14;
  t56 = cosVector[5] * massVector[5] * t33;
  t200 = massVector[5] * sinVector[5] * t39;
  t57 = (massVector[4] * (((t21 + t22) + t53) - t199) + t56) - t200;
  t58 = cosVector[4] * t57;
  t59 = COMVector_5[1] * t10;
  t60 = COMVector_5[0] * sinVector[3] * t6;
  t63 = sinVector[4] * t20;
  t64 = COMVector_6[0] * t28;
  t65 = COMVector_6[1] * t17;
  t204 = COMVector_4[2] * t3;
  t205 = COMVector_4[1] * sinVector[3] * t6;
  t67 = massVector[3] * (((t18 + t19) - t204) - t205);
  t68 = lengthVector[3] * t3;
  t69 = COMVector_3[0] * t3;
  t70 = COMVector_3[2] * t6;
  t72 = massVector[2] * ((t68 + t69) + t70);
  t73 = lengthVector[2] * sinVector[1];
  t74 = lengthVector[3] * t6;
  t75 = (-lengthVector[1] + t73) + t74;
  t76 = sinVector[3] * t75;
  t87 = lengthVector[4] * sinVector[3] * t3;
  t77 = t76 - t87;
  t78 = lengthVector[5] * sinVector[3] * t3;
  t81 = cosVector[4] * t6 + cosVector[3] * sinVector[4] * t3;
  t83 = sinVector[4] * t6 - cosVector[3] * cosVector[4] * t3;
  t86 = sinVector[5] * t83 - cosVector[5] * sinVector[3] * t3;
  t88 = lengthVector[5] * t83;
  t89 = cosVector[3] * t75;
  t96 = cosVector[3] * lengthVector[4] * t3;
  t90 = (t88 + t89) - t96;
  t93 = cosVector[5] * t83 + sinVector[3] * sinVector[5] * t3;
  t94 = sinVector[4] * t77;
  t103 = cosVector[4] * t77;
  t104 = t78 - t103;
  t98 = cosVector[5] * t90;
  t99 = COMVector_6[0] * t81;
  t100 = lengthVector[6] * t93;
  t101 = COMVector_6[2] * t93;
  t102 = (((sinVector[5] * t104 + t98) + t99) + t100) + t101;
  t105 = sinVector[5] * t90;
  t106 = lengthVector[6] * t86;
  t107 = COMVector_6[2] * t86;
  t113 = cosVector[5] * t104;
  t108 = (((t105 + t106) + t107) - t113) - COMVector_6[1] * t81;
  t109 = COMVector_5[1] * t81;
  t112 = massVector[4] * (((t78 - t103) + t109) + COMVector_5[2] * sinVector[3] *
    t3);
  t141 = COMVector_5[1] * t83;
  t120 = (-t94 + COMVector_6[0] * t86) + COMVector_6[1] * t93;
  t121 = massVector[4] * ((t94 + COMVector_5[0] * sinVector[3] * t3) - t141) -
    massVector[5] * t120;
  t122 = sinVector[4] * t121;
  t123 = COMVector_4[1] * sinVector[3] * t3;
  t125 = massVector[3] * (((t76 - t87) + t123) - COMVector_4[2] * t6);
  t138 = cosVector[5] * massVector[5] * t108;
  t128 = (t122 + t125) - cosVector[4] * ((t112 + massVector[5] * sinVector[5] *
    t102) - t138);
  t132 = massVector[4] * ((((t88 + t89) - t96) + COMVector_5[0] * t81) +
    COMVector_5[2] * t83);
  t134 = cosVector[3] * COMVector_4[1] * t3;
  t136 = massVector[3] * (((t89 - t96) + COMVector_4[0] * t6) + t134);
  t137 = massVector[5] * sinVector[5] * t108;
  t139 = sinVector[5] * (t78 - t103);
  t140 = (((t98 + t99) + t100) + t101) + t139;
  t144 = cosVector[5] * massVector[5] * t140;
  t145 = ((t132 + t136) + t137) + t144;
  t146 = massVector[5] * sinVector[5] * t140;
  t147 = (t112 - t138) + t146;
  t151 = cosVector[4] * t147;
  t148 = (t122 + t125) - t151;
  t149 = (t132 + t137) + t144;
  t150 = lengthVector[6] + COMVector_6[2];
  t152 = t137 + t144;
  t153 = sinVector[3] * t145;
  t154 = sinVector[3] * t148;
  t155 = cosVector[3] * t145;
  t158 = massVector[2] * ((((-lengthVector[1] + t73) + t74) + COMVector_3[0] *
    t6) - COMVector_3[2] * t3);
  t159 = t138 - t146;
  t160 = t122 - t151;
  t183 = inertiaTensor_6[1] * t93;
  t165 = (((inertiaTensor_6[5] * t81 + inertiaTensor_6[4] * t86) + massVector[5]
           * COMVector_6[0] * t120) + massVector[5] * t108 * t150) - t183;
  t180 = inertiaTensor_6[1] * t86;
  t169 = (((inertiaTensor_6[0] * t93 + massVector[5] * COMVector_6[1] * t120) +
           massVector[5] * t140 * t150) - inertiaTensor_6[2] * t81) - t180;
  t170 = sinVector[4] * t147;
  t171 = cosVector[4] * t121;
  t172 = lengthVector[5] + COMVector_5[2];
  t176 = massVector[3] * (COMVector_4[0] * sinVector[3] * t3 + cosVector[3] *
    COMVector_4[2] * t3);
  t177 = (t170 + t171) + t176;
  t181 = cosVector[5] * t169;
  t184 = sinVector[5] * t165;
  t259 = inertiaTensor_5[2] * t81;
  t186 = (((((((t149 * t172 + t181) + inertiaTensor_5[0] * t83) + t184) +
             inertiaTensor_5[1] * sinVector[3] * t3) - COMVector_5[2] * t152) -
           COMVector_5[1] * t121) - t259) - massVector[5] * COMVector_5[1] *
    t120;
  t187 = t170 + t171;
  t188 = lengthVector[4] - COMVector_4[1];
  t266 = inertiaTensor_5[2] * t83;
  t196 = ((((((((((COMVector_5[1] * t147 + COMVector_5[1] * t159) + COMVector_5
                  [0] * t149) + inertiaTensor_5[8] * t81) + inertiaTensor_6[8] *
                t81) + inertiaTensor_6[5] * t86) + massVector[5] * COMVector_6[0]
              * t140) - COMVector_5[0] * t152) - t266) - inertiaTensor_6[2] *
           t93) - inertiaTensor_5[5] * sinVector[3] * t3) - massVector[5] *
    COMVector_6[1] * t108;
  t197 = (t154 + t155) + t158;
  t201 = (-t63 + t64) + t65;
  t203 = massVector[4] * ((t59 + t60) - t63) + massVector[5] * t201;
  t207 = sinVector[4] * t203;
  t208 = (t58 + t67) - t207;
  t206 = sinVector[3] * t208;
  t209 = cosVector[3] * t208;
  t210 = massVector[2] * COMVector_3[1] * t3;
  t211 = (t43 + t48) + t50;
  t212 = inertiaTensor_3[2] * t6;
  t213 = t48 + t50;
  t214 = lengthVector[3] + COMVector_3[0];
  t215 = sinVector[3] * ((t58 + t67) - t207);
  t216 = (t52 + t72) + t215;
  t217 = sinVector[4] * t57;
  t221 = massVector[3] * (COMVector_4[0] * sinVector[3] * t6 + cosVector[3] *
    COMVector_4[2] * t6);
  t222 = cosVector[4] * t203;
  t223 = massVector[2] * COMVector_3[1] * t6;
  t224 = inertiaTensor_3[2] * t3;
  t225 = inertiaTensor_6[5] * t14;
  t226 = inertiaTensor_6[4] * t28;
  t241 = inertiaTensor_6[1] * t17;
  t229 = (((t225 + t226) + massVector[5] * t33 * t150) + massVector[5] *
          COMVector_6[0] * t201) - t241;
  t230 = (t217 + t221) + t222;
  t231 = inertiaTensor_6[0] * t17;
  t238 = inertiaTensor_6[2] * t14;
  t239 = inertiaTensor_6[1] * t28;
  t234 = (((t231 + massVector[5] * t39 * t150) + massVector[5] * COMVector_6[1] *
           t201) - t238) - t239;
  t235 = t56 - t200;
  t236 = t217 + t222;
  t243 = inertiaTensor_5[0] * t10;
  t315 = inertiaTensor_5[2] * t14;
  t318 = inertiaTensor_5[1] * sinVector[3] * t6;
  t245 = (((((((t172 * t211 + cosVector[5] * t234) + sinVector[5] * t229) + t243)
             + COMVector_5[1] * t203) - t315) - COMVector_5[2] * t213) -
          massVector[5] * COMVector_5[1] * t201) - t318;
  t247 = inertiaTensor_5[8] * t14;
  t248 = inertiaTensor_6[8] * t14;
  t249 = inertiaTensor_6[5] * t28;
  t252 = inertiaTensor_5[5] * sinVector[3] * t6;
  t324 = inertiaTensor_5[2] * t10;
  t325 = inertiaTensor_6[2] * t17;
  t253 = ((((((((((COMVector_5[0] * t211 + t247) + t248) + t249) + COMVector_5[1]
                * t235) + massVector[5] * COMVector_6[0] * t39) + t252) -
             COMVector_5[1] * t57) - t324) - t325) - COMVector_5[0] * t213) -
    massVector[5] * COMVector_6[1] * t33;
  t254 = t154 + t155;
  t343 = cosVector[3] * t148;
  t255 = (t153 + t223) - t343;
  t256 = COMVector_3[1] * t255;
  t261 = sinVector[4] * t186;
  t262 = inertiaTensor_4[4] * t6;
  t263 = inertiaTensor_3[8] * t6;
  t264 = COMVector_4[0] * t145;
  t270 = cosVector[4] * t196;
  t272 = inertiaTensor_4[5] * sinVector[3] * t3;
  t273 = COMVector_3[2] * t254;
  t274 = sinVector[3] * ((t122 + t125) - t151);
  t275 = (t155 + t158) + t274;
  t276 = inertiaTensor_3[0] * t3;
  t281 = sinVector[5] * t169;
  t445 = cosVector[5] * t165;
  t565 = inertiaTensor_4[2] * cosVector[3] * t3;
  t287 = ((((((((((((((COMVector_5[2] * t159 + COMVector_5[0] * t121) +
                      inertiaTensor_4[5] * t6) + inertiaTensor_5[1] * t83) +
                    t281) + COMVector_4[0] * t177) + t147 * t172) + massVector[5]
                 * COMVector_5[0] * t120) + inertiaTensor_5[4] * sinVector[3] *
                t3) + inertiaTensor_4[8] * sinVector[3] * t3) - t445) - t148 *
             t188) - COMVector_4[0] * t187) - COMVector_4[1] * t160) -
          inertiaTensor_5[5] * t81) - t565;
  t288 = sinVector[3] * t287;
  t289 = ((t170 + t171) + t176) + t210;
  t290 = COMVector_3[1] * t289;
  t292 = cosVector[4] * t186;
  t296 = inertiaTensor_4[2] * sinVector[3] * t3;
  t413 = sinVector[4] * t196;
  t297 = (((((((COMVector_4[1] * t149 + t292) + inertiaTensor_4[1] * t6) +
              COMVector_4[2] * t187) + t145 * t188) + t296) - t413) -
          COMVector_4[2] * t177) - inertiaTensor_4[0] * cosVector[3] * t3;
  t299 = t52 + t215;
  t300 = ((t217 + t221) + t222) + t223;
  t302 = inertiaTensor_3[0] * t6;
  t303 = t58 - t207;
  t304 = COMVector_4[1] * t303;
  t305 = t188 * t208;
  t306 = cosVector[5] * t229;
  t307 = COMVector_4[0] * t230;
  t308 = inertiaTensor_5[5] * t14;
  t309 = COMVector_5[0] * t203;
  t310 = t57 * t172;
  t311 = inertiaTensor_5[4] * sinVector[3] * t6;
  t312 = inertiaTensor_4[8] * sinVector[3] * t6;
  t680 = inertiaTensor_4[5] * t3;
  t682 = inertiaTensor_5[1] * t10;
  t688 = inertiaTensor_4[2] * cosVector[3] * t6;
  t1623 = COMVector_4[0] * t236;
  t1624 = sinVector[5] * t234;
  t1625 = COMVector_5[2] * t235;
  t1626 = massVector[5] * COMVector_5[0] * t201;
  t2459 = ((((((((((((((t304 + t305) + t306) + t307) + t308) + t309) + t310) +
                  t311) + t312) - t680) - t682) - t688) - t1623) - t1624) -
           t1625) - t1626;
  t322 = inertiaTensor_4[1] * t3;
  t328 = inertiaTensor_4[0] * cosVector[3] * t6;
  t676 = inertiaTensor_4[2] * sinVector[3] * t6;
  t329 = (((((((t51 * t188 + cosVector[4] * t245) + COMVector_4[2] * t230) +
              COMVector_4[1] * t211) + t322) + t328) - t676) - COMVector_4[2] *
          t236) - sinVector[4] * t253;
  t331 = ((((((-t224 + COMVector_3[2] * t216) + COMVector_3[1] * t300) + t302) +
            sinVector[3] * t2459) + cosVector[3] * t329) - COMVector_3[2] * t299)
    - COMVector_3[1] * t230;
  t332 = COMVector_4[0] * t51;
  t333 = sinVector[3] * t51;
  t334 = (-t209 + t210) + t333;
  t335 = COMVector_3[1] * t334;
  t336 = sinVector[4] * t245;
  t337 = inertiaTensor_4[4] * t3;
  t338 = inertiaTensor_3[8] * t3;
  t339 = cosVector[4] * t253;
  t340 = t214 * t216;
  t341 = inertiaTensor_4[1] * cosVector[3] * t6;
  t342 = COMVector_4[2] * t160;
  t344 = (t52 + t72) + t206;
  t345 = t209 - t333;
  t346 = COMVector_3[1] * t345;
  t347 = COMVector_4[2] * t303;
  t352 = (((cosVector[5] * lengthVector[5] * t81 + cosVector[5] * lengthVector[6]
            * t81) + cosVector[5] * COMVector_6[2] * t81) + sinVector[4] *
          sinVector[5] * t77) - COMVector_6[0] * t83;
  t357 = (((COMVector_6[1] * t83 + lengthVector[5] * sinVector[5] * t81) +
           lengthVector[6] * sinVector[5] * t81) + COMVector_6[2] * sinVector[5]
          * t81) - cosVector[5] * sinVector[4] * t77;
  t359 = cosVector[5] * massVector[5] * t352;
  t361 = massVector[5] * sinVector[5] * t357;
  t362 = massVector[5] * sinVector[5] * t352;
  t367 = (t359 + t361) + massVector[4] * ((lengthVector[5] * t81 + COMVector_5[2]
    * t81) - COMVector_5[0] * t83);
  t370 = (-t103 + cosVector[5] * COMVector_6[1] * t81) + COMVector_6[0] *
    sinVector[5] * t81;
  t371 = t359 + t361;
  t379 = cosVector[5] * massVector[5] * t357;
  t375 = (t362 + massVector[4] * (t94 - t141)) - t379;
  t378 = massVector[5] * t370 - massVector[4] * (t103 - t109);
  t385 = (((inertiaTensor_6[2] * t83 + massVector[5] * COMVector_6[1] * t370) +
           inertiaTensor_6[0] * cosVector[5] * t81) + massVector[5] * t150 *
          t352) - inertiaTensor_6[1] * sinVector[5] * t81;
  t389 = (((inertiaTensor_6[4] * sinVector[5] * t81 + massVector[5] * t150 *
            t357) + massVector[5] * COMVector_6[0] * t370) - inertiaTensor_6[5] *
          t83) - inertiaTensor_6[1] * cosVector[5] * t81;
  t390 = ((t170 + t171) - cosVector[4] * t375) - sinVector[4] * t378;
  t391 = t362 - t379;
  t398 = (((((((((t259 + inertiaTensor_5[8] * t83) + inertiaTensor_6[8] * t83) +
                COMVector_5[0] * t371) + COMVector_5[1] * t391) + massVector[5] *
              COMVector_6[1] * t357) + inertiaTensor_6[2] * cosVector[5] * t81)
            - COMVector_5[1] * t375) - COMVector_5[0] * t367) - inertiaTensor_6
          [5] * sinVector[5] * t81) - massVector[5] * COMVector_6[0] * t352;
  t409 = ((((((t266 + COMVector_5[1] * t378) + inertiaTensor_5[0] * t81) +
             cosVector[5] * t385) + sinVector[5] * t389) + t172 * t367) -
          COMVector_5[2] * t371) - massVector[5] * COMVector_5[1] * t370;
  t412 = sinVector[3] * t390 + cosVector[3] * t367;
  t414 = lengthVector[2] + COMVector_2[0];
  t415 = lengthVector[1] + COMVector_1[0];
  t426 = ((((-t261 - t270) + t188 * t367) + sinVector[4] * t398) + cosVector[4] *
          t409) + COMVector_4[1] * t367;
  t433 = ((((((((t172 * t375 + inertiaTensor_5[1] * t81) + inertiaTensor_5[5] *
                t83) + sinVector[5] * t385) + massVector[5] * COMVector_5[0] *
              t370) - COMVector_5[0] * t378) - COMVector_4[1] * t390) -
           COMVector_5[2] * t391) - cosVector[5] * t389) - t188 * t390;
  t434 = cosVector[3] * t426 - sinVector[3] * t433;
  t435 = t214 * t412;
  t436 = sinVector[4] * t409;
  t2132 = cosVector[4] * t398;
  t2133 = COMVector_3[0] * t412;
  t437 = ((((t292 - t413) + t435) + t436) - t2132) - t2133;
  t438 = ((t98 + t100) + t101) + t139;
  t439 = ((t105 + t106) + t107) - t113;
  t440 = COMVector_6[1] * t86;
  t448 = COMVector_6[0] * t93;
  t441 = t440 - t448;
  t442 = massVector[5] * sinVector[5] * t438;
  t444 = cosVector[5] * massVector[5] * t439;
  t443 = ((t138 - t146) + t442) - t444;
  t450 = cosVector[5] * massVector[5] * t438;
  t451 = massVector[5] * sinVector[5] * t439;
  t446 = ((t137 + t144) - t450) - t451;
  t449 = cosVector[4] * t446 - massVector[5] * sinVector[4] * t441;
  t453 = sinVector[3] * t449;
  t457 = ((t180 + inertiaTensor_6[4] * t93) + massVector[5] * t150 * t438) -
    massVector[5] * COMVector_6[0] * t441;
  t458 = inertiaTensor_6[0] * t86;
  t459 = massVector[5] * t150 * t439;
  t461 = ((t183 + t458) + t459) + massVector[5] * COMVector_6[1] * t441;
  t464 = ((inertiaTensor_6[2] * t86 + inertiaTensor_6[5] * t93) - massVector[5] *
          COMVector_6[0] * t439) - massVector[5] * COMVector_6[1] * t438;
  t467 = COMVector_5[2] * t443;
  t473 = sinVector[5] * t457;
  t474 = t172 * t443;
  t468 = ((((t281 - t445) + cosVector[5] * t461) + t467) - t473) - t474;
  t469 = t453 - cosVector[3] * t443;
  t472 = cosVector[4] * t464;
  t475 = COMVector_4[1] * t449;
  t476 = t188 * t449;
  t477 = t172 * t446;
  t2274 = cosVector[5] * t457;
  t2276 = COMVector_5[2] * t446;
  t478 = ((((((t181 + t184) + t475) + t476) + t477) - t2274) - sinVector[5] *
          t461) - t2276;
  t479 = sinVector[3] * t478;
  t480 = sinVector[4] * t464;
  t2277 = COMVector_4[1] * t443;
  t2278 = t188 * t443;
  t482 = ((t480 + cosVector[4] * t468) - t2277) - t2278;
  t483 = cosVector[3] * t482;
  t484 = t479 + t483;
  t2272 = t214 * t469;
  t2273 = sinVector[4] * t468;
  t486 = ((t472 + COMVector_3[0] * t469) - t2272) - t2273;
  t488 = cosVector[3] * cosVector[5] * t3 - cosVector[4] * sinVector[3] *
    sinVector[5] * t3;
  t489 = t89 - t96;
  t490 = cosVector[4] * t489;
  t499 = cosVector[3] * lengthVector[5] * t3;
  t491 = t490 - t499;
  t492 = cosVector[4] * lengthVector[5] * sinVector[3] * t3;
  t493 = (-t76 + t87) + t492;
  t496 = cosVector[3] * sinVector[5] * t3 + cosVector[4] * cosVector[5] *
    sinVector[3] * t3;
  t498 = sinVector[4] * t489;
  t506 = (((sinVector[5] * t493 + cosVector[5] * t491) + COMVector_6[1] *
           sinVector[3] * sinVector[4] * t3) - lengthVector[6] * t488) -
    COMVector_6[2] * t488;
  t507 = cosVector[5] * massVector[5] * t506;
  t511 = (((cosVector[5] * t493 + lengthVector[6] * t496) + COMVector_6[2] *
           t496) - sinVector[5] * t491) - COMVector_6[0] * sinVector[3] *
    sinVector[4] * t3;
  t517 = massVector[5] * sinVector[5] * t511;
  t512 = (massVector[4] * (((t490 - t499) + COMVector_5[1] * sinVector[3] *
            sinVector[4] * t3) - cosVector[3] * COMVector_5[2] * t3) + t507) -
    t517;
  t518 = cosVector[5] * massVector[5] * t511;
  t519 = massVector[5] * sinVector[5] * t506;
  t521 = cosVector[4] * t512;
  t523 = (t498 + COMVector_6[0] * t488) - COMVector_6[1] * t496;
  t528 = massVector[5] * t523 + massVector[4] * ((t498 + cosVector[3] *
    COMVector_5[0] * t3) - cosVector[4] * COMVector_5[1] * sinVector[3] * t3);
  t529 = sinVector[4] * t528;
  t531 = t518 + t519;
  t534 = massVector[4] * ((((-t76 + t87) + t492) + cosVector[4] * COMVector_5[2]
    * sinVector[3] * t3) - COMVector_5[0] * sinVector[3] * sinVector[4] * t3);
  t535 = (t518 + t519) + t534;
  t539 = (t521 + t529) + massVector[3] * ((t89 - t96) + t134);
  t542 = ((t518 + t519) + t534) - massVector[3] * ((t76 - t87) + t123);
  t547 = ((-t153 + sinVector[3] * t539) + cosVector[3] * ((t122 + t125) - t151))
    + cosVector[3] * t542;
  t548 = t521 + t529;
  t549 = cosVector[4] * t528;
  t554 = (((inertiaTensor_6[1] * t496 + inertiaTensor_6[4] * t488) + massVector
           [5] * COMVector_6[0] * t523) + inertiaTensor_6[5] * sinVector[3] *
          sinVector[4] * t3) - massVector[5] * t150 * t506;
  t555 = t507 - t517;
  t560 = (((inertiaTensor_6[0] * t496 + inertiaTensor_6[1] * t488) + massVector
           [5] * t150 * t511) + inertiaTensor_6[2] * sinVector[3] * sinVector[4]
          * t3) - massVector[5] * COMVector_6[1] * t523;
  t575 = ((((((((((COMVector_5[1] * t512 + inertiaTensor_6[2] * t496) +
                  inertiaTensor_6[5] * t488) + COMVector_5[0] * t531) +
                massVector[5] * COMVector_6[1] * t506) + inertiaTensor_5[5] *
               cosVector[3] * t3) + inertiaTensor_5[2] * cosVector[4] *
              sinVector[3] * t3) + inertiaTensor_5[8] * sinVector[3] *
             sinVector[4] * t3) + inertiaTensor_6[8] * sinVector[3] * sinVector
            [4] * t3) - COMVector_5[1] * t555) - COMVector_5[0] * t535) -
    massVector[5] * COMVector_6[0] * t511;
  t578 = massVector[3] * (cosVector[3] * COMVector_4[0] * t3 - COMVector_4[2] *
    sinVector[3] * t3);
  t589 = sinVector[4] * t512;
  t579 = (t549 + t578) - t589;
  t588 = (((((((cosVector[5] * t560 + t172 * t535) + massVector[5] *
               COMVector_5[1] * t523) + inertiaTensor_5[1] * cosVector[3] * t3)
             + inertiaTensor_5[0] * cosVector[4] * sinVector[3] * t3) +
            inertiaTensor_5[2] * sinVector[3] * sinVector[4] * t3) -
           COMVector_5[2] * t531) - sinVector[5] * t554) - COMVector_5[1] * t528;
  t604 = ((((((((COMVector_4[2] * t548 + sinVector[4] * t588) + t214 * t547) +
               COMVector_4[0] * t542) + inertiaTensor_4[5] * cosVector[3] * t3)
             + inertiaTensor_4[1] * sinVector[3] * t3) - COMVector_4[2] * t539)
           - cosVector[4] * t575) - COMVector_4[0] * t535) - COMVector_3[0] *
    t547;
  t605 = t549 - t589;
  t607 = cosVector[5] * t554;
  t608 = COMVector_5[2] * t555;
  t609 = sinVector[5] * t560;
  t610 = COMVector_5[0] * t528;
  t611 = inertiaTensor_5[4] * cosVector[3] * t3;
  t612 = inertiaTensor_4[8] * cosVector[3] * t3;
  t613 = inertiaTensor_5[1] * cosVector[4] * sinVector[3] * t3;
  t614 = inertiaTensor_5[5] * sinVector[3] * sinVector[4] * t3;
  t615 = cosVector[3] * t287;
  t616 = sinVector[4] * t575;
  t617 = t188 * t542;
  t618 = cosVector[4] * t588;
  t619 = COMVector_4[1] * t535;
  t620 = inertiaTensor_4[0] * sinVector[3] * t3;
  t2063 = COMVector_4[2] * t579;
  t622 = ((((((t565 + t616) + t617) + t618) + t619) + t620) + COMVector_4[2] *
          t605) - t2063;
  t623 = sinVector[3] * t297;
  t624 = COMVector_4[0] * t579;
  t625 = cosVector[1] * lengthVector[2];
  t626 = t68 + t625;
  t627 = sinVector[3] * t626;
  t628 = t19 + t627;
  t629 = cosVector[4] * t628;
  t630 = t22 + t629;
  t631 = cosVector[3] * t626;
  t632 = (t12 + t15) + t631;
  t634 = (((t34 + t37) + t38) + cosVector[5] * t632) - sinVector[5] * t630;
  t637 = (((t31 + t32) - t49) + cosVector[5] * t630) + sinVector[5] * t632;
  t640 = ((((((t212 + t273) + t276) + t288) + t290) - COMVector_3[2] * t275) -
          COMVector_3[1] * t177) - cosVector[3] * t297;
  t641 = sinVector[2] * t640;
  t642 = cosVector[2] * t255;
  t643 = (((((((((((((t224 + t256) + t261) + t262) + t263) + t264) + t270) +
                t272) + t342) + t214 * t275) - COMVector_3[0] * t254) -
            COMVector_3[1] * (t153 - t343)) - COMVector_4[0] * t149) -
          COMVector_4[2] * t148) - inertiaTensor_4[1] * cosVector[3] * t3;
  t646 = sinVector[4] * t628;
  t649 = cosVector[5] * massVector[5] * t637;
  t665 = massVector[5] * sinVector[5] * t634;
  t651 = (massVector[4] * (((t22 + t53) - t199) + t629) + t649) - t665;
  t652 = cosVector[4] * t651;
  t654 = massVector[3] * (((t19 - t204) - t205) + t627);
  t656 = massVector[4] * ((((t12 + t15) + t40) + t41) + t631);
  t659 = cosVector[5] * massVector[5] * t634;
  t660 = massVector[5] * sinVector[5] * t637;
  t661 = ((t656 + massVector[3] * (((t12 + t44) - t198) + t631)) + t659) + t660;
  t662 = (t64 + t65) - t646;
  t664 = massVector[4] * ((t59 + t60) - t646) + massVector[5] * t662;
  t667 = massVector[2] * (((t68 + t69) + t70) + t625);
  t668 = cosVector[3] * t661;
  t670 = sinVector[4] * t664;
  t669 = (t652 + t654) - t670;
  t671 = sinVector[3] * t669;
  t672 = cosVector[4] * t664;
  t673 = sinVector[4] * t651;
  t674 = t659 + t660;
  t675 = (t656 + t659) + t660;
  t679 = (((t231 - t238) - t239) + massVector[5] * t150 * t634) + massVector[5] *
    COMVector_6[1] * t662;
  t681 = t672 + t673;
  t683 = t649 - t665;
  t684 = (t221 + t672) + t673;
  t687 = (((t225 + t226) - t241) + massVector[5] * t150 * t637) + massVector[5] *
    COMVector_6[0] * t662;
  t689 = ((t221 + t223) + t672) + t673;
  t690 = sinVector[3] * t661;
  t697 = cosVector[3] * t669;
  t691 = (t210 + t690) - t697;
  t692 = cosVector[2] * t691;
  t693 = sinVector[2] * t689;
  t694 = sinVector[3] * ((t652 + t654) - t670);
  t695 = (t667 + t668) + t694;
  t696 = t668 + t671;
  t702 = (((((((t243 - t315) - t318) + sinVector[5] * t687) + COMVector_5[1] *
             t664) + t172 * t675) + cosVector[5] * t679) - COMVector_5[2] * t674)
    - massVector[5] * COMVector_5[1] * t662;
  t706 = ((((((((((t247 + t248) + t249) + t252) - t324) - t325) + COMVector_5[1]
              * t683) + COMVector_5[0] * t675) + massVector[5] * COMVector_6[0] *
            t634) - COMVector_5[0] * t674) - COMVector_5[1] * t651) -
    massVector[5] * COMVector_6[1] * t637;
  t709 = massVector[1] * ((t625 + cosVector[1] * COMVector_2[0]) - COMVector_2[1]
    * sinVector[1]);
  t710 = inertiaTensor_2[1] * sinVector[1];
  t719 = sinVector[2] * t255;
  t720 = cosVector[2] * t289;
  t721 = cosVector[1] * massVector[1] * COMVector_2[2];
  t726 = ((t155 + t158) + t274) + massVector[1] * (((-lengthVector[1] + t73) +
    cosVector[1] * COMVector_2[1]) + COMVector_2[0] * sinVector[1]);
  t728 = ((t667 + t668) + t694) + t709;
  t729 = inertiaTensor_2[1] * cosVector[1];
  t739 = (((((((t322 + t328) - t676) + t188 * t661) + COMVector_4[2] * t684) +
            cosVector[4] * t702) + COMVector_4[1] * t675) - sinVector[4] * t706)
    - COMVector_4[2] * t681;
  t742 = t188 * t669;
  t743 = t652 - t670;
  t744 = COMVector_4[1] * t743;
  t745 = COMVector_5[0] * t664;
  t746 = t172 * t651;
  t747 = COMVector_4[0] * t684;
  t748 = cosVector[5] * t687;
  t1372 = sinVector[5] * t679;
  t1373 = COMVector_4[0] * t681;
  t1374 = COMVector_5[2] * t683;
  t1375 = massVector[5] * COMVector_5[0] * t662;
  t2581 = ((((((((((((((t308 + t311) + t312) - t680) - t682) - t688) + t742) +
                  t744) + t745) + t746) + t747) + t748) - t1372) - t1373) -
           t1374) - t1375;
  t751 = ((((((-t224 + t302) + cosVector[3] * t739) + COMVector_3[2] * t695) +
            sinVector[3] * t2581) + COMVector_3[1] * t689) - COMVector_3[2] *
          t696) - COMVector_3[1] * t684;
  t752 = cosVector[2] * t689;
  t753 = massVector[1] * COMVector_2[2] * sinVector[1];
  t754 = t214 * t695;
  t755 = t690 - t697;
  t756 = COMVector_3[1] * t691;
  t757 = COMVector_4[0] * t661;
  t758 = sinVector[4] * t702;
  t759 = cosVector[4] * t706;
  t1380 = COMVector_3[0] * t696;
  t1381 = COMVector_3[1] * t755;
  t1382 = COMVector_4[2] * t669;
  t1383 = COMVector_4[0] * t675;
  t1384 = inertiaTensor_4[5] * sinVector[3] * t6;
  t761 = (((((((((((((-t212 + t337) + t338) + t341) + t754) + t756) + t757) +
                t758) + t759) + COMVector_4[2] * t743) - t1380) - t1381) - t1382)
          - t1383) - t1384;
  t764 = cosVector[3] * sinVector[5] + cosVector[4] * cosVector[5] * sinVector[3];
  t765 = cosVector[3] * lengthVector[5];
  t766 = cosVector[2] * lengthVector[2];
  t767 = lengthVector[3] + t766;
  t768 = sinVector[4] * t767;
  t769 = cosVector[3] * lengthVector[4];
  t770 = cosVector[3] * lengthVector[2] * sinVector[2];
  t771 = t769 + t770;
  t772 = cosVector[4] * t771;
  t773 = (t765 + t768) + t772;
  t774 = lengthVector[4] * sinVector[3];
  t775 = cosVector[4] * lengthVector[5] * sinVector[3];
  t776 = lengthVector[2] * sinVector[2] * sinVector[3];
  t777 = (t774 + t775) + t776;
  t779 = cosVector[3] * cosVector[5] - cosVector[4] * sinVector[3] * sinVector[5];
  t780 = cosVector[5] * t773;
  t782 = lengthVector[6] * t779;
  t783 = COMVector_6[2] * t779;
  t790 = sinVector[5] * t777;
  t791 = COMVector_6[1] * sinVector[3] * sinVector[4];
  t784 = (((t780 + t782) + t783) - t790) - t791;
  t785 = sinVector[5] * t773;
  t786 = cosVector[5] * t777;
  t787 = lengthVector[6] * t764;
  t788 = COMVector_6[2] * t764;
  t793 = COMVector_6[0] * sinVector[3] * sinVector[4];
  t789 = (((t785 + t786) + t787) + t788) - t793;
  t792 = cosVector[5] * massVector[5] * t784;
  t794 = massVector[5] * sinVector[5] * t789;
  t795 = cosVector[5] * massVector[5] * t789;
  t796 = cosVector[3] * COMVector_5[2];
  t804 = COMVector_5[1] * sinVector[3] * sinVector[4];
  t799 = (t792 + t794) + massVector[4] * ((((t765 + t768) + t772) + t796) - t804);
  t800 = cosVector[4] * t767;
  t801 = cosVector[4] * COMVector_5[2] * sinVector[3];
  t817 = COMVector_5[0] * sinVector[3] * sinVector[4];
  t803 = massVector[4] * ((((t774 + t775) + t776) + t801) - t817);
  t805 = cosVector[4] * t799;
  t806 = cosVector[3] * COMVector_5[0];
  t809 = sinVector[4] * t771;
  t813 = cosVector[4] * COMVector_5[1] * sinVector[3];
  t808 = massVector[4] * (((t800 + t806) - t809) - t813);
  t810 = COMVector_6[0] * t779;
  t824 = cosVector[3] * COMVector_4[1];
  t812 = massVector[3] * ((t769 + t770) - t824);
  t822 = COMVector_6[1] * t764;
  t814 = ((t800 - t809) + t810) - t822;
  t815 = massVector[5] * t814;
  t816 = t808 + t815;
  t826 = COMVector_4[1] * sinVector[3];
  t819 = massVector[3] * ((t774 + t776) - t826);
  t821 = massVector[5] * sinVector[5] * t784;
  t820 = ((t795 + t803) + t819) - t821;
  t823 = (t795 + t803) - t821;
  t828 = sinVector[4] * t816;
  t825 = (t805 + t812) - t828;
  t827 = cosVector[3] * t820;
  t829 = cosVector[3] * t825;
  t830 = sinVector[3] * t820;
  t831 = t795 - t821;
  t908 = sinVector[3] * t825;
  t832 = t827 - t908;
  t833 = inertiaTensor_5[5] * cosVector[3];
  t835 = t792 + t794;
  t837 = inertiaTensor_6[2] * t764;
  t838 = inertiaTensor_6[5] * t779;
  t839 = inertiaTensor_5[2] * cosVector[4] * sinVector[3];
  t840 = inertiaTensor_5[8] * sinVector[3] * sinVector[4];
  t841 = inertiaTensor_6[8] * sinVector[3] * sinVector[4];
  t842 = ((((((((((t833 + COMVector_5[0] * t831) + COMVector_5[1] * t835) + t837)
                + t838) + t839) + t840) + t841) - COMVector_5[1] * t799) -
           COMVector_5[0] * t823) - massVector[5] * COMVector_6[0] * t789) -
    massVector[5] * COMVector_6[1] * t784;
  t843 = inertiaTensor_5[1] * cosVector[3];
  t844 = t172 * t823;
  t845 = inertiaTensor_6[0] * t764;
  t846 = inertiaTensor_6[1] * t779;
  t847 = inertiaTensor_6[2] * sinVector[3] * sinVector[4];
  t849 = (((t845 + t846) + t847) + massVector[5] * t150 * t789) - massVector[5] *
    COMVector_6[1] * t814;
  t850 = cosVector[5] * t849;
  t851 = inertiaTensor_6[1] * t764;
  t852 = inertiaTensor_6[4] * t779;
  t853 = inertiaTensor_6[5] * sinVector[3] * sinVector[4];
  t854 = massVector[5] * t150 * t784;
  t856 = (((t851 + t852) + t853) + t854) + massVector[5] * COMVector_6[0] * t814;
  t857 = inertiaTensor_5[0] * cosVector[4] * sinVector[3];
  t858 = inertiaTensor_5[2] * sinVector[3] * sinVector[4];
  t859 = sinVector[4] * t799;
  t860 = cosVector[4] * (t808 + t815);
  t861 = cosVector[3] * COMVector_4[0];
  t867 = COMVector_4[2] * sinVector[3];
  t863 = massVector[3] * (((lengthVector[3] + t766) + t861) - t867);
  t864 = (t859 + t860) + t863;
  t865 = t859 + t860;
  t866 = t805 - t828;
  t872 = (t829 + t830) + massVector[2] * (COMVector_3[2] + lengthVector[2] *
    sinVector[2]);
  t875 = ((t859 + t860) + t863) + massVector[2] * ((lengthVector[3] +
    COMVector_3[0]) + t766);
  t876 = sinVector[2] * t872;
  t877 = cosVector[2] * t875;
  t878 = t188 * t820;
  t879 = inertiaTensor_4[2] * cosVector[3];
  t880 = inertiaTensor_4[0] * sinVector[3];
  t885 = sinVector[4] * t842;
  t886 = COMVector_4[2] * t865;
  t887 = massVector[5] * COMVector_5[1] * (((t800 - t809) + t810) - t822);
  t913 = COMVector_5[2] * t831;
  t914 = sinVector[5] * t856;
  t915 = COMVector_5[1] * t816;
  t888 = (((((((t843 + t844) + t850) + t857) + t858) + t887) - t913) - t914) -
    t915;
  t889 = cosVector[4] * t888;
  t890 = COMVector_4[1] * t823;
  t1093 = COMVector_4[2] * t864;
  t891 = ((((((t878 + t879) + t880) + t885) + t886) + t889) + t890) - t1093;
  t893 = COMVector_3[1] * t864;
  t894 = inertiaTensor_5[4] * cosVector[3];
  t895 = inertiaTensor_4[8] * cosVector[3];
  t896 = inertiaTensor_4[2] * sinVector[3];
  t897 = t172 * t799;
  t898 = COMVector_4[1] * t866;
  t899 = COMVector_4[0] * t864;
  t900 = sinVector[5] * t849;
  t901 = t188 * t825;
  t902 = inertiaTensor_5[1] * cosVector[4] * sinVector[3];
  t903 = inertiaTensor_5[5] * sinVector[3] * sinVector[4];
  t905 = cosVector[5] * t856;
  t1094 = COMVector_5[2] * t835;
  t1095 = COMVector_4[0] * t865;
  t1096 = massVector[5] * COMVector_5[0] * t814;
  t906 = (((((((((((((t894 + t895) + t896) + t897) + t898) + t899) + t900) +
                t901) + t902) + t903) + COMVector_5[0] * t816) + t905) - t1094)
          - t1095) - t1096;
  t1098 = COMVector_3[1] * t875;
  t907 = (((inertiaTensor_3[1] + cosVector[3] * t891) + t893) - sinVector[3] *
          t906) - t1098;
  t909 = cosVector[2] * t872;
  t910 = inertiaTensor_4[5] * cosVector[3];
  t911 = inertiaTensor_4[1] * sinVector[3];
  t912 = COMVector_3[1] * t872;
  t916 = t829 + t830;
  t917 = COMVector_4[2] * t825;
  t918 = COMVector_4[0] * t820;
  t919 = sinVector[2] * t875;
  t920 = t214 * t832;
  t921 = ((t785 + t786) + t787) + t788;
  t922 = ((t780 + t782) + t783) - t790;
  t924 = cosVector[5] * massVector[5] * COMVector_6[0] - massVector[5] *
    COMVector_6[1] * sinVector[5];
  t928 = cosVector[5] * massVector[5] * COMVector_6[1] + massVector[5] *
    COMVector_6[0] * sinVector[5];
  t929 = cosVector[3] * t924 - cosVector[4] * sinVector[3] * t928;
  t932 = inertiaTensor_6[5] - massVector[5] * COMVector_6[1] * t150;
  t933 = inertiaTensor_6[2] - massVector[5] * COMVector_6[0] * t150;
  t938 = (inertiaTensor_6[8] + massVector[5] * (COMVector_6[0] * COMVector_6[0]))
    + massVector[5] * (COMVector_6[1] * COMVector_6[1]);
  t939 = COMVector_5[2] * t924;
  t941 = cosVector[5] * t933;
  t995 = t172 * t924;
  t996 = sinVector[5] * t932;
  t943 = ((t939 + t941) - t995) - t996;
  t944 = ((t792 + t794) - cosVector[5] * massVector[5] * t922) - massVector[5] *
    sinVector[5] * t921;
  t947 = ((t795 - t821) + massVector[5] * sinVector[5] * t922) - cosVector[5] *
    massVector[5] * t921;
  t951 = COMVector_6[0] * t764 + COMVector_6[1] * t779;
  t952 = massVector[5] * sinVector[4] * t951;
  t953 = cosVector[4] * t947 + t952;
  t955 = cosVector[3] * t944 + sinVector[3] * t953;
  t959 = inertiaTensor_6[4] * t764;
  t961 = massVector[5] * COMVector_6[0] * t951;
  t962 = ((-t846 + t959) + massVector[5] * t150 * t921) + t961;
  t963 = inertiaTensor_6[0] * t779;
  t965 = massVector[5] * COMVector_6[1] * t951;
  t966 = ((-t851 + t963) + massVector[5] * t150 * t922) + t965;
  t967 = inertiaTensor_6[2] * t779;
  t972 = inertiaTensor_6[5] * t764;
  t969 = ((t967 + massVector[5] * COMVector_6[1] * t921) - t972) - massVector[5]
    * COMVector_6[0] * t922;
  t970 = t172 * t944;
  t975 = COMVector_5[2] * t944;
  t976 = cosVector[5] * t966;
  t977 = sinVector[5] * t962;
  t971 = ((((t900 + t905) + t970) - t975) - t976) - t977;
  t974 = cosVector[4] * t969;
  t979 = t214 * t955;
  t2303 = COMVector_3[0] * t955;
  t980 = ((t974 + sinVector[4] * t971) + t979) - t2303;
  t981 = t188 * t953;
  t982 = sinVector[5] * t966;
  t983 = COMVector_4[1] * t953;
  t984 = t172 * t947;
  t2304 = COMVector_5[2] * t947;
  t2305 = cosVector[5] * t962;
  t987 = COMVector_4[1] * t944;
  t988 = t188 * t944;
  t2306 = sinVector[4] * t969;
  t992 = sinVector[3] * (((((((t850 - t914) + t981) + t982) + t983) + t984) -
    t2304) - t2305) + cosVector[3] * (((t987 + t988) + cosVector[4] * t971) -
    t2306);
  t994 = cosVector[4] * t938;
  t1716 = sinVector[4] * t943;
  t997 = ((t214 * t929 + t994) - COMVector_3[0] * t929) - t1716;
  t998 = COMVector_5[2] * t928;
  t999 = cosVector[5] * t932;
  t1000 = sinVector[5] * t933;
  t1718 = t172 * t928;
  t1719 = cosVector[4] * t188 * t928;
  t1720 = cosVector[4] * COMVector_4[1] * t928;
  t1001 = ((((t998 + t999) + t1000) - t1718) - t1719) - t1720;
  t1002 = sinVector[4] * t938;
  t1003 = cosVector[4] * t943;
  t1005 = ((t1002 + t1003) - COMVector_4[1] * t924) - t188 * t924;
  t1006 = sinVector[3] * t1001 - cosVector[3] * t1005;
  t1008 = lengthVector[2] * sinVector[2] * sinVector[4] - cosVector[2] *
    cosVector[3] * cosVector[4] * lengthVector[2];
  t1011 = cosVector[4] * lengthVector[2] * sinVector[2] + cosVector[2] *
    cosVector[3] * lengthVector[2] * sinVector[4];
  t1015 = cosVector[5] * t1008 + cosVector[2] * lengthVector[2] * sinVector[3] *
    sinVector[5];
  t1017 = sinVector[5] * t1008 - cosVector[2] * cosVector[5] * lengthVector[2] *
    sinVector[3];
  t1019 = massVector[5] * sinVector[5] * t1015;
  t1021 = cosVector[2] * lengthVector[2] * massVector[4] * sinVector[3];
  t1100 = cosVector[5] * massVector[5] * t1017;
  t1022 = ((t1019 + cosVector[2] * lengthVector[2] * massVector[3] * sinVector[3])
           + t1021) - t1100;
  t1026 = massVector[4] * t1011 + massVector[5] * t1011;
  t1027 = sinVector[4] * t1026;
  t1029 = cosVector[5] * massVector[5] * t1015;
  t1030 = massVector[5] * sinVector[5] * t1017;
  t1031 = (massVector[4] * t1008 + t1029) + t1030;
  t1101 = cosVector[4] * t1031;
  t1033 = (t1027 + cosVector[2] * cosVector[3] * lengthVector[2] * massVector[3])
    - t1101;
  t1034 = cosVector[3] * t1022 - sinVector[3] * t1033;
  t1035 = lengthVector[3] * sinVector[4];
  t1036 = cosVector[3] * cosVector[4] * lengthVector[4];
  t1037 = t774 + t775;
  t1038 = (t765 + t1035) + t1036;
  t1039 = cosVector[4] * lengthVector[3];
  t1040 = cosVector[5] * t1038;
  t1047 = sinVector[5] * t1037;
  t1041 = (((t782 + t783) - t791) + t1040) - t1047;
  t1043 = cosVector[3] * lengthVector[4] * sinVector[4];
  t1042 = ((t810 - t822) + t1039) - t1043;
  t1048 = cosVector[5] * massVector[5] * t1041;
  t1049 = cosVector[5] * t1037;
  t1050 = sinVector[5] * t1038;
  t1051 = (((t787 + t788) - t793) + t1049) + t1050;
  t1052 = massVector[5] * sinVector[5] * t1051;
  t1053 = (massVector[4] * ((((t765 + t796) - t804) + t1035) + t1036) + t1048) +
    t1052;
  t1056 = massVector[5] * t1042 + massVector[4] * (((t806 - t813) + t1039) -
    t1043);
  t1057 = cosVector[4] * t1053;
  t1058 = sinVector[4] * t1053;
  t1059 = cosVector[4] * t1056;
  t1061 = massVector[3] * ((lengthVector[3] + t861) - t867);
  t1062 = (t1058 + t1059) + t1061;
  t1064 = (((t845 + t846) + t847) + massVector[5] * t150 * t1051) - massVector[5]
    * COMVector_6[1] * t1042;
  t1067 = (((t851 + t852) + t853) + massVector[5] * t150 * t1041) + massVector[5]
    * COMVector_6[0] * t1042;
  t1068 = cosVector[5] * massVector[5] * t1051;
  t1069 = t1058 + t1059;
  t1071 = massVector[4] * (((t774 + t775) + t801) - t817);
  t1074 = massVector[5] * sinVector[5] * t1041;
  t1072 = t1068 - t1074;
  t1073 = t1048 + t1052;
  t1075 = (t1068 + t1071) - t1074;
  t1077 = massVector[3] * (t774 - t826);
  t1079 = massVector[3] * (t769 - t824);
  t1083 = sinVector[4] * t1056;
  t1080 = (t1057 + t1079) - t1083;
  t1081 = ((t1068 + t1071) - t1074) + t1077;
  t1082 = cosVector[3] * t1081;
  t1131 = sinVector[3] * t1080;
  t1084 = t1082 - t1131;
  t1086 = cosVector[5] * t1064;
  t1090 = ((((((((((t833 + t837) + t838) + t839) + t840) + t841) + COMVector_5[0]
               * t1072) + COMVector_5[1] * t1073) - COMVector_5[1] * t1053) -
            COMVector_5[0] * t1075) - massVector[5] * COMVector_6[0] * t1051) -
    massVector[5] * COMVector_6[1] * t1041;
  t1091 = sinVector[3] * t1081;
  t1092 = cosVector[3] * t1080;
  t1099 = sinVector[2] * t907;
  t1103 = (t1019 + t1021) - t1100;
  t1104 = t1019 - t1100;
  t1105 = sinVector[3] * t1022;
  t1106 = cosVector[3] * t1033;
  t1107 = COMVector_5[0] * t1104;
  t1108 = t1029 + t1030;
  t1109 = COMVector_5[1] * t1031;
  t1110 = massVector[5] * COMVector_6[0] * t1017;
  t1111 = massVector[5] * COMVector_6[1] * t1015;
  t1113 = massVector[5] * COMVector_6[1] * t1011 - massVector[5] * t150 * t1017;
  t1117 = massVector[5] * COMVector_6[0] * t1011 + massVector[5] * t150 * t1015;
  t1121 = ((((cosVector[5] * t1113 + sinVector[5] * t1117) + COMVector_5[1] *
             t1026) + t172 * t1103) - COMVector_5[2] * t1104) - massVector[5] *
    COMVector_5[1] * t1011;
  t1122 = cosVector[4] * t1026;
  t1123 = sinVector[4] * t1031;
  t1124 = lengthVector[2] * massVector[3] * sinVector[2];
  t1125 = (t1122 + t1123) + t1124;
  t1127 = t1122 + t1123;
  t1128 = t1027 - t1101;
  t1170 = COMVector_5[1] * t1108;
  t1171 = COMVector_5[0] * t1103;
  t1129 = ((((t1107 + t1109) + t1110) + t1111) - t1170) - t1171;
  t1130 = sinVector[4] * t888;
  t1134 = cosVector[5] * t1067;
  t1136 = sinVector[5] * t1064;
  t1138 = t1057 - t1083;
  t1141 = ((t1058 + t1059) + t1061) + massVector[2] * t214;
  t1156 = sinVector[5] * t1067;
  t1143 = (((((((t843 + t857) + t858) + t1086) + massVector[5] * COMVector_5[1] *
              t1042) + t172 * t1075) - COMVector_5[1] * t1056) - COMVector_5[2] *
           t1072) - t1156;
  t1149 = sinVector[4] * t1090;
  t1157 = sinVector[4] * t1143;
  t1159 = (t1091 + t1092) + massVector[2] * COMVector_3[2];
  t1642 = cosVector[4] * t1090;
  t1162 = (((((((((((-inertiaTensor_3[5] + t910) + t911) + t214 * t1084) +
                  COMVector_4[0] * t1081) + t1157) + COMVector_3[1] * t1159) +
               COMVector_4[2] * t1080) - COMVector_3[0] * t1084) - COMVector_3[1]
             * (t1091 + t1092)) - COMVector_4[2] * t1138) - t1642) -
    COMVector_4[0] * t1075;
  t1163 = t214 * (t827 - t908);
  t1277 = cosVector[4] * t842;
  t1661 = COMVector_4[2] * t866;
  t1662 = COMVector_4[0] * t823;
  t1663 = COMVector_3[0] * t832;
  t1664 = COMVector_3[1] * t916;
  t1164 = (((((((((((-inertiaTensor_3[5] + t910) + t911) + t912) + t917) + t918)
                + t1130) + t1163) - t1277) - t1661) - t1662) - t1663) - t1664;
  t1165 = cosVector[2] * t907;
  t1168 = t1105 + t1106;
  t1176 = (t1105 + t1106) + cosVector[2] * lengthVector[2] * massVector[2];
  t1178 = ((((((((COMVector_4[0] * t1103 + COMVector_3[0] * t1034) +
                 COMVector_3[1] * t1168) + cosVector[4] * t1129) + COMVector_4[2]
               * t1128) - t214 * t1034) - COMVector_4[0] * t1022) - sinVector[4]
            * t1121) - COMVector_3[1] * t1176) - COMVector_4[2] * t1033;
  t1179 = COMVector_4[1] * t1103;
  t1180 = t188 * t1022;
  t1181 = COMVector_4[2] * t1125;
  t1182 = cosVector[4] * t1121;
  t1184 = ((t1122 + t1123) + t1124) + lengthVector[2] * massVector[2] *
    sinVector[2];
  t1185 = COMVector_3[1] * t1125;
  t1192 = ((((((((t188 * t1033 + COMVector_5[2] * t1108) + sinVector[5] * t1113)
                + COMVector_4[0] * t1127) + COMVector_4[1] * t1128) +
              massVector[5] * COMVector_5[0] * t1011) - COMVector_4[0] * t1125)
            - cosVector[5] * t1117) - t172 * t1031) - COMVector_5[0] * t1026;
  t1193 = sinVector[3] * t1192;
  t1655 = COMVector_4[2] * t1127;
  t1656 = COMVector_3[1] * t1184;
  t1196 = ((t1185 + t1193) - t1656) - cosVector[3] * (((((t1179 + t1180) + t1181)
    + t1182) + sinVector[4] * t1129) - t1655);
  t1197 = cosVector[4] * t1143;
  t1199 = ((((((t879 + t880) + COMVector_4[2] * t1069) + t1149) + COMVector_4[1]
             * t1075) + t1197) + t188 * t1081) - COMVector_4[2] * t1062;
  t1202 = (((((((((((((t894 + t895) + t896) + t902) + t903) + t172 * t1053) +
                  COMVector_5[0] * t1056) + t1134) + t188 * t1080) + t1136) +
              COMVector_4[0] * t1062) + COMVector_4[1] * t1138) - COMVector_5[2]
            * t1073) - COMVector_4[0] * t1069) - massVector[5] * COMVector_5[0] *
    t1042;
  t1203 = (((inertiaTensor_3[1] + COMVector_3[1] * t1062) + cosVector[3] * t1199)
           - sinVector[3] * t1202) - COMVector_3[1] * t1141;
  t1207 = (cosVector[5] * lengthVector[5] + cosVector[5] * lengthVector[6]) +
    cosVector[5] * COMVector_6[2];
  t1208 = cosVector[5] * massVector[5] * t1207;
  t1212 = (lengthVector[5] * sinVector[5] + lengthVector[6] * sinVector[5]) +
    COMVector_6[2] * sinVector[5];
  t1213 = massVector[5] * sinVector[5] * t1212;
  t1215 = cosVector[5] * COMVector_6[0] - COMVector_6[1] * sinVector[5];
  t1216 = cosVector[5] * massVector[5] * t1212;
  t1219 = massVector[5] * sinVector[5] * t1207;
  t1218 = t1216 - t1219;
  t1222 = massVector[4] * COMVector_5[0] + massVector[5] * t1215;
  t1224 = (t1208 + t1213) + massVector[4] * t172;
  t1226 = inertiaTensor_6[1] * sinVector[5];
  t1228 = massVector[5] * t150 * t1207;
  t1229 = ((inertiaTensor_6[4] * cosVector[5] + t1226) + massVector[5] *
           COMVector_6[0] * t1215) + t1228;
  t1230 = inertiaTensor_6[1] * cosVector[5];
  t1232 = massVector[5] * t150 * t1212;
  t1233 = ((t1230 + inertiaTensor_6[0] * sinVector[5]) + t1232) - massVector[5] *
    COMVector_6[1] * t1215;
  t1234 = t1208 + t1213;
  t1235 = cosVector[4] * t1224;
  t1241 = sinVector[4] * t1222;
  t1236 = t1235 - t1241;
  t1240 = (((((inertiaTensor_5[5] + inertiaTensor_6[5] * cosVector[5]) +
              inertiaTensor_6[2] * sinVector[5]) + COMVector_5[1] * t1234) -
            COMVector_5[1] * t1224) - massVector[5] * COMVector_6[1] * t1207) -
    massVector[5] * COMVector_6[0] * t1212;
  t1242 = cosVector[3] * t1218;
  t1244 = cosVector[5] * t1233;
  t1245 = massVector[5] * COMVector_5[1] * t1215;
  t1325 = COMVector_5[1] * t1222;
  t1326 = sinVector[5] * t1229;
  t1327 = COMVector_5[2] * t1218;
  t1247 = (((((inertiaTensor_5[1] + t1244) + t1245) + t172 * t1218) - t1325) -
           t1326) - t1327;
  t1248 = t1242 - sinVector[3] * t1236;
  t1266 = cosVector[5] * COMVector_6[1] * sinVector[3] * sinVector[4];
  t1267 = COMVector_6[0] * sinVector[3] * sinVector[4] * sinVector[5];
  t1249 = ((t768 + t772) - t1266) - t1267;
  t1253 = massVector[5] * t1249 + massVector[4] * ((t768 + t772) - t804);
  t1254 = t800 - t809;
  t1255 = cosVector[4] * COMVector_6[0] * sinVector[3];
  t1256 = cosVector[5] * lengthVector[5] * sinVector[3] * sinVector[4];
  t1257 = cosVector[5] * lengthVector[6] * sinVector[3] * sinVector[4];
  t1258 = cosVector[5] * COMVector_6[2] * sinVector[3] * sinVector[4];
  t1259 = (((t1255 + t1256) + t1257) + t1258) - sinVector[5] * t1254;
  t1260 = massVector[5] * sinVector[5] * t1259;
  t1261 = lengthVector[5] * sinVector[3] * sinVector[4] * sinVector[5];
  t1262 = lengthVector[6] * sinVector[3] * sinVector[4] * sinVector[5];
  t1263 = COMVector_6[2] * sinVector[3] * sinVector[4] * sinVector[5];
  t1271 = cosVector[4] * COMVector_6[1] * sinVector[3];
  t1269 = massVector[4] * ((-t800 + t809) + t813);
  t1276 = cosVector[5] * massVector[5] * ((((t1261 + t1262) + t1263) +
    cosVector[5] * t1254) - t1271);
  t1272 = (t1260 + t1269) - t1276;
  t1274 = cosVector[4] * t816;
  t1297 = sinVector[4] * t1253;
  t1275 = ((t859 + cosVector[4] * t1272) + t1274) - t1297;
  t1279 = (((t1261 + t1262) + t1263) - t1271) + cosVector[5] * (t800 - t809);
  t1280 = cosVector[5] * massVector[5] * t1259;
  t1281 = massVector[5] * sinVector[5] * t1279;
  t1282 = t1280 + t1281;
  t1287 = massVector[4] * ((cosVector[4] * COMVector_5[0] * sinVector[3] +
    lengthVector[5] * sinVector[3] * sinVector[4]) + COMVector_5[2] * sinVector
    [3] * sinVector[4]);
  t1288 = (t1280 + t1281) + t1287;
  t1289 = inertiaTensor_6[2] * cosVector[4] * sinVector[3];
  t1291 = inertiaTensor_6[1] * sinVector[3] * sinVector[4] * sinVector[5];
  t1313 = inertiaTensor_6[0] * cosVector[5] * sinVector[3] * sinVector[4];
  t1292 = (((t1289 + massVector[5] * COMVector_6[1] * t1249) + t1291) -
           massVector[5] * t150 * t1259) - t1313;
  t1294 = inertiaTensor_6[5] * cosVector[4] * sinVector[3];
  t1295 = inertiaTensor_6[4] * sinVector[3] * sinVector[4] * sinVector[5];
  t1316 = inertiaTensor_6[1] * cosVector[5] * sinVector[3] * sinVector[4];
  t1296 = (((massVector[5] * t150 * t1279 + t1294) + t1295) - massVector[5] *
           COMVector_6[0] * t1249) - t1316;
  t1299 = cosVector[5] * massVector[5] * t1279;
  t1298 = (t1260 + t1269) - t1299;
  t1301 = ((t859 + t1274) - t1297) + cosVector[4] * t1298;
  t1303 = cosVector[3] * t1288 - sinVector[3] * t1301;
  t1307 = inertiaTensor_5[8] * cosVector[4] * sinVector[3];
  t1308 = inertiaTensor_6[8] * cosVector[4] * sinVector[3];
  t1309 = inertiaTensor_6[5] * sinVector[3] * sinVector[4] * sinVector[5];
  t1351 = inertiaTensor_5[0] * sinVector[3] * sinVector[4];
  t1317 = ((((((t839 + COMVector_5[1] * t1253) + COMVector_5[2] * t1282) +
              cosVector[5] * t1292) - t172 * t1288) - sinVector[5] * t1296) -
           t1351) - massVector[5] * COMVector_5[1] * t1249;
  t1319 = t1260 - t1299;
  t1348 = inertiaTensor_6[2] * cosVector[5] * sinVector[3] * sinVector[4];
  t1320 = (((((((((-t858 + COMVector_5[0] * t1288) + COMVector_5[1] * t1298) +
                 massVector[5] * COMVector_6[0] * t1259) + t1307) + t1308) +
              t1309) - COMVector_5[0] * t1282) - COMVector_5[1] * t1319) -
           massVector[5] * COMVector_6[1] * t1279) - t1348;
  t1324 = sinVector[4] * t1240;
  t1328 = COMVector_5[0] * t1222;
  t1329 = cosVector[5] * t1229;
  t1330 = t172 * t1224;
  t1331 = sinVector[5] * t1233;
  t1824 = COMVector_5[2] * t1234;
  t1825 = massVector[5] * COMVector_5[0] * t1215;
  t1340 = sinVector[3] * ((((((((inertiaTensor_5[4] + t1328) + t1329) + t1330) +
    t1331) + COMVector_4[1] * t1236) + t188 * t1236) - t1824) - t1825) -
    cosVector[3] * (((t1324 + cosVector[4] * t1247) + COMVector_4[1] * t1218) +
                    t188 * t1218);
  t1342 = cosVector[4] * t1240;
  t1828 = t214 * t1248;
  t1344 = ((t1342 + COMVector_3[0] * t1248) - t1828) - sinVector[4] * t1247;
  t1353 = sinVector[4] * t1317;
  t1354 = COMVector_3[0] * t1303;
  t2194 = cosVector[4] * t1320;
  t2195 = t214 * t1303;
  t1355 = ((((t885 + t889) + t1353) + t1354) - t2194) - t2195;
  t1356 = sinVector[5] * t1292;
  t1357 = cosVector[5] * t1296;
  t1358 = inertiaTensor_5[5] * cosVector[4] * sinVector[3];
  t1359 = massVector[5] * COMVector_5[0] * t1249;
  t1360 = COMVector_4[1] * t1288;
  t1361 = t188 * t1288;
  t2191 = sinVector[4] * t1320;
  t2192 = cosVector[4] * t1317;
  t1362 = cosVector[3] * (((((t1130 - t1277) + t1360) + t1361) - t2191) - t2192);
  t1366 = sinVector[2] * t289;
  t1364 = COMVector_2[2] * (t642 - t1366);
  t1365 = COMVector_2[0] * t275;
  t1367 = t692 + t693;
  t1368 = inertiaTensor_2[4] * cosVector[1];
  t1377 = sinVector[2] * t751;
  t1378 = (t692 + t693) + t721;
  t1379 = COMVector_2[2] * t1378;
  t1385 = t414 * t728;
  t1388 = sinVector[2] * t643;
  t1389 = cosVector[2] * t640;
  t1394 = sinVector[1] * (((((((-t710 + inertiaTensor_2[0] * cosVector[1]) +
    t1388) + t1389) + COMVector_2[2] * ((t719 + t720) + t721)) + COMVector_2[1] *
    t726) - COMVector_2[2] * (t719 + t720)) - COMVector_2[1] * t275) * 0.5;
  t1399 = sinVector[2] * t691;
  t1395 = t752 - t1399;
  t1396 = inertiaTensor_2[0] * sinVector[1];
  t1397 = COMVector_2[1] * t695;
  t1398 = cosVector[2] * t751;
  t1401 = (((((((((((((-t212 + t337) + t338) + t341) + t754) + t756) + t757) +
                 t758) + t759) - t1380) - t1381) - t1382) - t1383) - t1384) +
    COMVector_4[2] * (t652 - t670);
  t1402 = t415 * t728 * 0.5;
  t1403 = t774 + t776;
  t1404 = cosVector[4] * t1403;
  t1405 = lengthVector[5] * sinVector[3];
  t1408 = cosVector[5] * sinVector[3] + cosVector[3] * cosVector[4] * sinVector
    [5];
  t1409 = t1404 + t1405;
  t1410 = cosVector[3] * cosVector[4] * lengthVector[5];
  t1411 = (t769 + t770) + t1410;
  t1413 = sinVector[3] * sinVector[5] - cosVector[3] * cosVector[4] * cosVector
    [5];
  t1416 = lengthVector[6] * t1413;
  t1417 = COMVector_6[2] * t1413;
  t1418 = cosVector[3] * COMVector_6[0] * sinVector[4];
  t1419 = (((sinVector[5] * t1409 + t1416) + t1417) + t1418) - cosVector[5] *
    t1411;
  t1422 = lengthVector[6] * t1408;
  t1423 = COMVector_6[2] * t1408;
  t1424 = cosVector[3] * COMVector_6[1] * sinVector[4];
  t1425 = (((cosVector[5] * t1409 + sinVector[5] * t1411) + t1422) + t1423) +
    t1424;
  t1426 = sinVector[4] * t1403;
  t1427 = COMVector_5[0] * sinVector[3];
  t1428 = cosVector[3] * cosVector[4] * COMVector_5[1];
  t1429 = COMVector_6[1] * t1413;
  t1447 = COMVector_6[0] * t1408;
  t1430 = (t1426 + t1429) - t1447;
  t1431 = massVector[5] * t1430;
  t1432 = COMVector_5[2] * sinVector[3];
  t1433 = cosVector[3] * COMVector_5[1] * sinVector[4];
  t1436 = cosVector[5] * massVector[5] * t1425;
  t1438 = massVector[5] * sinVector[5] * t1419;
  t1439 = (massVector[4] * (((t1404 + t1405) + t1432) + t1433) + t1436) + t1438;
  t1440 = cosVector[4] * t1439;
  t1441 = cosVector[3] * cosVector[4] * COMVector_5[2];
  t1451 = cosVector[3] * COMVector_5[0] * sinVector[4];
  t1443 = massVector[4] * ((((t769 + t770) + t1410) + t1441) - t1451);
  t1444 = massVector[5] * sinVector[5] * t1425;
  t1452 = cosVector[5] * massVector[5] * t1419;
  t1445 = ((t812 + t1443) + t1444) - t1452;
  t1450 = massVector[4] * ((-t1426 + t1427) + t1428);
  t1455 = t1431 - t1450;
  t1448 = sinVector[4] * t1455;
  t1449 = (t819 + t1440) + t1448;
  t1493 = cosVector[3] * t1445;
  t1453 = ((t829 + t830) - t1493) - sinVector[3] * t1449;
  t1454 = (t1443 + t1444) - t1452;
  t1456 = t1444 - t1452;
  t1457 = inertiaTensor_6[1] * t1413;
  t1458 = inertiaTensor_6[4] * t1408;
  t1474 = inertiaTensor_6[5] * cosVector[3] * sinVector[4];
  t1460 = (((t1457 + t1458) + massVector[5] * t150 * t1425) - t1474) -
    massVector[5] * COMVector_6[0] * t1430;
  t1461 = inertiaTensor_6[0] * t1413;
  t1462 = inertiaTensor_6[1] * t1408;
  t1473 = inertiaTensor_6[2] * cosVector[3] * sinVector[4];
  t1465 = (((t1461 + t1462) + massVector[5] * t150 * t1419) + massVector[5] *
           COMVector_6[1] * t1430) - t1473;
  t1466 = t1436 + t1438;
  t1467 = sinVector[4] * t1439;
  t1471 = massVector[3] * (cosVector[3] * COMVector_4[2] + COMVector_4[0] *
    sinVector[3]);
  t1488 = cosVector[4] * t1455;
  t1472 = (t1467 + t1471) - t1488;
  t1478 = inertiaTensor_5[0] * cosVector[3] * cosVector[4];
  t1479 = inertiaTensor_5[2] * cosVector[3] * sinVector[4];
  t1598 = inertiaTensor_5[1] * sinVector[3];
  t1481 = (((((((sinVector[5] * t1460 + t172 * t1454) + t1478) + t1479) +
              massVector[5] * COMVector_5[1] * t1430) - cosVector[5] * t1465) -
            t1598) - COMVector_5[1] * t1455) - COMVector_5[2] * t1456;
  t1482 = COMVector_5[1] * t1439;
  t1483 = massVector[5] * COMVector_6[1] * t1425;
  t1484 = massVector[5] * COMVector_6[0] * t1419;
  t1485 = inertiaTensor_5[2] * cosVector[3] * cosVector[4];
  t1486 = inertiaTensor_5[8] * cosVector[3] * sinVector[4];
  t1487 = inertiaTensor_6[8] * cosVector[3] * sinVector[4];
  t1592 = inertiaTensor_5[5] * sinVector[3];
  t1593 = COMVector_5[0] * t1454;
  t1594 = COMVector_5[1] * t1466;
  t1595 = inertiaTensor_6[2] * t1413;
  t1596 = inertiaTensor_6[5] * t1408;
  t1490 = ((((((((((t1482 + t1483) + t1484) + t1485) + t1486) + t1487) +
               COMVector_5[0] * t1456) - t1592) - t1593) - t1594) - t1595) -
    t1596;
  t1491 = t1440 + t1448;
  t1492 = t1467 - t1488;
  t1495 = cosVector[4] * massVector[4] * COMVector_5[1];
  t1497 = cosVector[5] * lengthVector[5] * sinVector[4];
  t1498 = cosVector[5] * lengthVector[6] * sinVector[4];
  t1499 = cosVector[5] * COMVector_6[2] * sinVector[4];
  t1500 = ((cosVector[4] * COMVector_6[0] + t1497) + t1498) + t1499;
  t1501 = massVector[5] * sinVector[5] * t1500;
  t1502 = lengthVector[5] * sinVector[4] * sinVector[5];
  t1503 = lengthVector[6] * sinVector[4] * sinVector[5];
  t1504 = COMVector_6[2] * sinVector[4] * sinVector[5];
  t1505 = ((t1502 + t1503) + t1504) - cosVector[4] * COMVector_6[1];
  t1514 = cosVector[5] * massVector[5] * t1505;
  t1506 = (t1495 + t1501) - t1514;
  t1509 = cosVector[5] * COMVector_6[1] * sinVector[4] + COMVector_6[0] *
    sinVector[4] * sinVector[5];
  t1511 = massVector[4] * COMVector_5[1] * sinVector[4];
  t1512 = massVector[5] * t1509 + t1511;
  t1515 = cosVector[4] * t1506;
  t1516 = sinVector[4] * t1512;
  t1521 = massVector[4] * ((cosVector[4] * COMVector_5[0] + lengthVector[5] *
    sinVector[4]) + COMVector_5[2] * sinVector[4]);
  t1522 = cosVector[5] * massVector[5] * t1500;
  t1523 = massVector[5] * sinVector[5] * t1505;
  t1524 = (t1521 + t1522) + t1523;
  t1553 = inertiaTensor_6[1] * sinVector[4] * sinVector[5];
  t1528 = (((inertiaTensor_6[0] * cosVector[5] * sinVector[4] + massVector[5] *
             t150 * t1500) + massVector[5] * COMVector_6[1] * t1509) -
           inertiaTensor_6[2] * cosVector[4]) - t1553;
  t1555 = inertiaTensor_6[1] * cosVector[5] * sinVector[4];
  t1533 = (((inertiaTensor_6[5] * cosVector[4] + inertiaTensor_6[4] * sinVector
             [4] * sinVector[5]) + massVector[5] * t150 * t1505) + massVector[5]
           * COMVector_6[0] * t1509) - t1555;
  t1534 = t1522 + t1523;
  t1535 = t1501 - t1514;
  t1537 = (t1515 + t1516) + massVector[3] * COMVector_4[2];
  t1539 = ((t1521 + t1522) + t1523) + massVector[3] * COMVector_4[0];
  t1540 = cosVector[3] * t1539;
  t1559 = sinVector[3] * t1537;
  t1541 = t1540 - t1559;
  t1574 = inertiaTensor_5[2] * sinVector[4];
  t1548 = (((((((((inertiaTensor_5[8] * cosVector[4] + inertiaTensor_6[8] *
                   cosVector[4]) + COMVector_5[1] * t1506) + COMVector_5[0] *
                 t1524) + inertiaTensor_6[5] * sinVector[4] * sinVector[5]) +
               massVector[5] * COMVector_6[0] * t1500) - t1574) - COMVector_5[0]
             * t1534) - COMVector_5[1] * t1535) - inertiaTensor_6[2] *
           cosVector[5] * sinVector[4]) - massVector[5] * COMVector_6[1] * t1505;
  t1554 = cosVector[5] * t1528;
  t1556 = sinVector[5] * t1533;
  t1570 = inertiaTensor_5[2] * cosVector[4];
  t1557 = ((((((inertiaTensor_5[0] * sinVector[4] + COMVector_5[1] * t1512) +
               t172 * t1524) + t1554) + t1556) - t1570) - COMVector_5[2] * t1534)
    - massVector[5] * COMVector_5[1] * t1509;
  t1558 = t1515 + t1516;
  t1563 = sinVector[5] * t1528;
  t1783 = cosVector[5] * t1533;
  t1566 = (((((((((inertiaTensor_4[5] + inertiaTensor_5[1] * sinVector[4]) +
                  t172 * t1506) + t188 * t1537) + t1563) + COMVector_4[1] *
               t1558) + massVector[5] * COMVector_5[0] * t1509) -
             inertiaTensor_5[5] * cosVector[4]) - COMVector_5[0] * t1512) -
           COMVector_5[2] * t1535) - t1783;
  t1567 = sinVector[3] * t1566;
  t1573 = cosVector[4] * t1557;
  t1784 = sinVector[4] * t1548;
  t1579 = (((inertiaTensor_4[1] + t188 * t1539) + COMVector_4[1] * t1524) +
           t1573) - t1784;
  t1785 = cosVector[3] * t1579;
  t1580 = t1567 - t1785;
  t1581 = COMVector_4[2] * t1537;
  t1582 = cosVector[4] * t1548;
  t1583 = sinVector[4] * t1557;
  t1584 = COMVector_4[0] * t1539;
  t1786 = COMVector_3[0] * t1541;
  t1787 = COMVector_4[0] * t1524;
  t1788 = COMVector_4[2] * t1558;
  t1586 = (((((((inertiaTensor_4[4] + t1581) + t1582) + t1583) + t1584) + t214 *
             t1541) - t1786) - t1787) - t1788;
  t1587 = inertiaTensor_4[1] * cosVector[3];
  t1589 = (t819 + t1440) + sinVector[4] * (t1431 - t1450);
  t1603 = sinVector[3] * t1589;
  t1590 = ((t829 + t830) - t1493) - t1603;
  t1591 = COMVector_4[0] * t1445;
  t1601 = sinVector[4] * t1481;
  t1602 = COMVector_4[2] * t1491;
  t1604 = cosVector[5] * t1460;
  t1605 = inertiaTensor_5[4] * sinVector[3];
  t1606 = inertiaTensor_4[8] * sinVector[3];
  t1607 = sinVector[5] * t1465;
  t1608 = COMVector_4[0] * t1472;
  t1609 = t172 * t1439;
  t1610 = massVector[5] * COMVector_5[0] * t1430;
  t1611 = inertiaTensor_4[0] * cosVector[3];
  t1612 = COMVector_4[1] * t1454;
  t1613 = COMVector_4[2] * t1472;
  t1614 = cosVector[4] * t1481;
  t1616 = ((((((((((t1482 + t1483) + t1484) + t1485) + t1486) + t1487) - t1592)
              - t1593) - t1594) - t1595) - t1596) + COMVector_5[0] * (t1444 -
    t1452);
  t1617 = t188 * t1445;
  t1618 = cosVector[3] * t906;
  t1619 = sinVector[3] * t891;
  t1620 = COMVector_4[1] * t1491;
  t1629 = cosVector[2] * t331;
  t1630 = (((((((((((((-t212 + t332) + t335) + t336) + t337) + t338) + t339) +
                 t340) + t341) + t346) + t347) - t1384) - COMVector_3[0] * t299)
           - COMVector_4[0] * t211) - COMVector_4[2] * t208;
  t1631 = t216 * t415 * 0.5;
  t1638 = sinVector[2] * t1203;
  t1644 = cosVector[2] * t1162;
  t1646 = cosVector[2] * t1203 - sinVector[2] * t1162;
  t1647 = COMVector_1[0] * t1034 * 0.5;
  t1649 = sinVector[1] * t1646 * 0.5;
  t1665 = cosVector[2] * t1164;
  t1668 = cosVector[1] * (((t1638 + t1644) + t414 * t1084) - COMVector_2[0] *
    t1084) * 0.5;
  t1669 = sinVector[2] * t1164;
  t1670 = COMVector_2[0] * t1034;
  t1671 = cosVector[2] * t1178;
  t1673 = ((((t1179 + t1180) + t1181) + t1182) - t1655) + sinVector[4] *
    (((((t1107 + t1109) + t1110) + t1111) - t1170) - t1171);
  t1674 = ((t1185 + t1193) - t1656) - cosVector[3] * t1673;
  t1675 = ((t782 + t783) + t1040) - t1047;
  t1676 = ((t787 + t788) + t1049) + t1050;
  t1677 = ((t1048 + t1052) - cosVector[5] * massVector[5] * t1675) - massVector
    [5] * sinVector[5] * t1676;
  t1681 = ((t1068 - t1074) + massVector[5] * sinVector[5] * t1675) - cosVector[5]
    * massVector[5] * t1676;
  t1683 = t952 + cosVector[4] * t1681;
  t1686 = sinVector[3] * t1683 + cosVector[3] * t1677;
  t1688 = ((-t851 + t963) + t965) + massVector[5] * t150 * t1675;
  t1691 = ((-t846 + t959) + t961) + massVector[5] * t150 * t1676;
  t1692 = t172 * t1677;
  t1698 = sinVector[5] * t1691;
  t1699 = COMVector_5[2] * t1677;
  t1700 = cosVector[5] * t1688;
  t1693 = ((((t1134 + t1136) + t1692) - t1698) - t1699) - t1700;
  t1695 = ((t967 - t972) + massVector[5] * COMVector_6[1] * t1676) - massVector
    [5] * COMVector_6[0] * t1675;
  t1703 = ((cosVector[4] * t1695 + sinVector[4] * t1693) + t214 * t1686) -
    COMVector_3[0] * t1686;
  t1708 = ((((((t1086 - t1156) + sinVector[5] * t1688) + COMVector_4[1] * t1683)
             + t172 * t1681) + t188 * t1683) - COMVector_5[2] * t1681) -
    cosVector[5] * t1691;
  t2427 = ((cosVector[4] * t1693 + COMVector_4[1] * t1677) + t188 * t1677) -
    sinVector[4] * t1695;
  t1714 = sinVector[3] * t1708 + cosVector[3] * t2427;
  t1717 = cosVector[2] * t997;
  t1724 = sinVector[2] * t1006;
  t1727 = sinVector[1] * (cosVector[2] * t1006 - sinVector[2] * t997) * 0.5;
  t1728 = cosVector[4] * lengthVector[4] * sinVector[3];
  t1729 = t1405 + t1728;
  t1730 = t769 + t1410;
  t1731 = lengthVector[4] * sinVector[3] * sinVector[4];
  t1733 = (((t1416 + t1417) + t1418) + sinVector[5] * t1729) - cosVector[5] *
    t1730;
  t1736 = (((t1422 + t1423) + t1424) + cosVector[5] * t1729) + sinVector[5] *
    t1730;
  t1739 = cosVector[5] * massVector[5] * t1736;
  t1741 = massVector[5] * sinVector[5] * t1733;
  t1742 = (massVector[4] * (((t1405 + t1432) + t1433) + t1728) + t1739) + t1741;
  t1743 = cosVector[4] * t1742;
  t1746 = (t1429 - t1447) + t1731;
  t1747 = massVector[4] * ((t1427 + t1428) - t1731) - massVector[5] * t1746;
  t1754 = sinVector[4] * t1747;
  t1748 = (t1077 + t1743) - t1754;
  t1750 = massVector[4] * (((t769 + t1410) + t1441) - t1451);
  t1751 = massVector[5] * sinVector[5] * t1736;
  t1755 = cosVector[5] * massVector[5] * t1733;
  t1752 = ((t1079 + t1750) + t1751) - t1755;
  t1756 = (t1750 + t1751) - t1755;
  t1757 = t1751 - t1755;
  t1758 = sinVector[4] * t1742;
  t1759 = cosVector[4] * t1747;
  t1763 = (((t1461 + t1462) - t1473) + massVector[5] * COMVector_6[1] * t1746) +
    massVector[5] * t150 * t1733;
  t1765 = (((t1457 + t1458) - t1474) + massVector[5] * t150 * t1736) -
    massVector[5] * COMVector_6[0] * t1746;
  t1769 = (((((((t1478 + t1479) - t1598) + t172 * t1756) + sinVector[5] * t1765)
             + COMVector_5[1] * t1747) + massVector[5] * COMVector_5[1] * t1746)
           - COMVector_5[2] * t1757) - cosVector[5] * t1763;
  t1770 = COMVector_5[1] * t1742;
  t1771 = COMVector_5[0] * t1757;
  t1772 = t1739 + t1741;
  t1773 = massVector[5] * COMVector_6[1] * t1736;
  t1774 = massVector[5] * COMVector_6[0] * t1733;
  t1775 = (t1471 + t1758) + t1759;
  t1776 = t1758 + t1759;
  t1777 = t1743 - t1754;
  t1798 = COMVector_5[1] * t1772;
  t1799 = COMVector_5[0] * t1756;
  t1779 = ((((((((((t1485 + t1486) + t1487) - t1592) - t1595) - t1596) + t1770)
              + t1771) + t1773) + t1774) - t1798) - t1799;
  t1789 = cosVector[2] * t1586;
  t1790 = cosVector[2] * t1580;
  t1814 = sinVector[3] * t1748;
  t1815 = cosVector[3] * t1752;
  t1791 = ((t1091 + t1092) - t1814) - t1815;
  t1792 = COMVector_4[2] * t1775;
  t1793 = t188 * t1752;
  t1796 = cosVector[4] * t1769;
  t1797 = COMVector_4[1] * t1756;
  t1800 = cosVector[3] * t1202;
  t2079 = inertiaTensor_5[1] * cosVector[3] * cosVector[4];
  t2080 = inertiaTensor_5[5] * cosVector[3] * sinVector[4];
  t1809 = (((((((((((((-t879 + t1605) + t1606) + COMVector_4[0] * t1775) + t188 *
                    t1748) + t172 * t1742) + COMVector_4[1] * t1777) +
                 cosVector[5] * t1765) + sinVector[5] * t1763) + COMVector_5[0] *
               t1747) + massVector[5] * COMVector_5[0] * t1746) - COMVector_4[0]
             * t1776) - COMVector_5[2] * t1772) - t2079) - t2080;
  t1810 = sinVector[3] * t1199;
  t2076 = COMVector_4[2] * t1776;
  t2081 = sinVector[3] * t1809;
  t1813 = ((t1800 + t1810) - t2081) - cosVector[3] * (((((((-t896 + t1611) +
    t1792) + t1793) + t1796) + t1797) + sinVector[4] * t1779) - t2076);
  t1816 = COMVector_4[0] * t1752;
  t1817 = COMVector_4[2] * t1777;
  t1818 = sinVector[4] * t1769;
  t2071 = COMVector_4[2] * t1748;
  t2072 = inertiaTensor_4[5] * sinVector[3];
  t2073 = t214 * t1791;
  t2074 = COMVector_4[0] * t1756;
  t2075 = cosVector[4] * t1779;
  t1820 = ((((((((t1587 + t1816) + t1817) + t1818) + COMVector_3[0] * t1791) -
              t2071) - t2072) - t2073) - t2074) - t2075;
  t1823 = sinVector[1] * (t1790 + sinVector[2] * t1586) * 0.5;
  t1827 = sinVector[2] * t1340;
  t1830 = cosVector[2] * t1344;
  t1833 = sinVector[1] * (cosVector[2] * t1340 - sinVector[2] * t1344) * 0.5;
  t1834 = t1039 - t1043;
  t1835 = (((t1255 + t1256) + t1257) + t1258) - sinVector[5] * t1834;
  t1837 = (((t1261 + t1262) + t1263) - t1271) + cosVector[5] * t1834;
  t1839 = cosVector[5] * massVector[5] * t1835;
  t1840 = massVector[5] * sinVector[5] * t1837;
  t1841 = massVector[5] * sinVector[5] * t1835;
  t1842 = (t1287 + t1839) + t1840;
  t1852 = cosVector[5] * massVector[5] * t1837;
  t1845 = (t1841 + massVector[4] * ((t813 - t1039) + t1043)) - t1852;
  t1846 = ((t1035 + t1036) - t1266) - t1267;
  t1850 = massVector[5] * t1846 + massVector[4] * ((-t804 + t1035) + t1036);
  t1851 = t1839 + t1840;
  t1853 = t1841 - t1852;
  t1855 = ((t1058 + t1059) + cosVector[4] * t1845) - sinVector[4] * t1850;
  t1858 = (((t1289 + t1291) - t1313) + massVector[5] * COMVector_6[1] * t1846) -
    massVector[5] * t150 * t1835;
  t1860 = (((t1294 + t1295) - t1316) + massVector[5] * t150 * t1837) -
    massVector[5] * COMVector_6[0] * t1846;
  t1864 = (((((((((-t858 + t1307) + t1308) + t1309) - t1348) + COMVector_5[0] *
               t1842) + COMVector_5[1] * t1845) + massVector[5] * COMVector_6[0]
             * t1835) - COMVector_5[0] * t1851) - COMVector_5[1] * t1853) -
    massVector[5] * COMVector_6[1] * t1837;
  t1865 = cosVector[3] * t1842;
  t1871 = ((((((t839 - t1351) + COMVector_5[1] * t1850) + COMVector_5[2] * t1851)
             + cosVector[5] * t1858) - t172 * t1842) - sinVector[5] * t1860) -
    massVector[5] * COMVector_5[1] * t1846;
  t1873 = sinVector[3] * t1855;
  t1872 = t1865 - t1873;
  t1881 = COMVector_4[1] * t1842;
  t1882 = t188 * t1842;
  t2212 = sinVector[4] * t1864;
  t2213 = cosVector[4] * t1871;
  t1883 = ((((t1157 - t1642) + t1881) + t1882) - t2212) - t2213;
  t2190 = inertiaTensor_5[1] * sinVector[3] * sinVector[4];
  t1889 = ((((((((t1358 + COMVector_5[2] * t1853) + sinVector[5] * t1858) +
                cosVector[5] * t1860) + massVector[5] * COMVector_5[0] * t1846)
              - t2190) - COMVector_5[0] * t1850) - COMVector_4[1] * t1855) -
           t188 * t1855) - t172 * t1845;
  t1891 = cosVector[3] * t1883 + sinVector[3] * t1889;
  t1893 = ((((t1149 + t1197) + sinVector[4] * t1871) + COMVector_3[0] * t1872) -
           cosVector[4] * t1864) - t214 * t1872;
  t1894 = sinVector[3] * t1218;
  t1895 = cosVector[3] * t1236;
  t1896 = t1894 + t1895;
  t1900 = ((cosVector[4] * cosVector[5] * lengthVector[5] + cosVector[4] *
            cosVector[5] * lengthVector[6]) + cosVector[4] * cosVector[5] *
           COMVector_6[2]) - COMVector_6[0] * sinVector[4];
  t1903 = cosVector[4] * cosVector[5] * COMVector_6[1] + cosVector[4] *
    COMVector_6[0] * sinVector[5];
  t1905 = cosVector[5] * massVector[5] * t1900;
  t1910 = ((COMVector_6[1] * sinVector[4] + cosVector[4] * lengthVector[5] *
            sinVector[5]) + cosVector[4] * lengthVector[6] * sinVector[5]) +
    cosVector[4] * COMVector_6[2] * sinVector[5];
  t1911 = massVector[5] * sinVector[5] * t1910;
  t1916 = (t1905 + t1911) + massVector[4] * ((cosVector[4] * lengthVector[5] +
    cosVector[4] * COMVector_5[2]) - COMVector_5[0] * sinVector[4]);
  t1917 = t1905 + t1911;
  t1918 = cosVector[5] * massVector[5] * t1910;
  t1923 = massVector[5] * sinVector[5] * t1900;
  t1920 = (t1511 + t1918) - t1923;
  t1922 = t1495 + massVector[5] * t1903;
  t1925 = cosVector[4] * t1512;
  t1929 = sinVector[4] * t1506;
  t1926 = ((sinVector[4] * t1922 + t1925) - cosVector[4] * t1920) - t1929;
  t1927 = cosVector[3] * t1916 - sinVector[3] * t1926;
  t1934 = (((inertiaTensor_6[2] * sinVector[4] + massVector[5] * t150 * t1900) +
            inertiaTensor_6[0] * cosVector[4] * cosVector[5]) + massVector[5] *
           COMVector_6[1] * t1903) - inertiaTensor_6[1] * cosVector[4] *
    sinVector[5];
  t1938 = (((inertiaTensor_6[4] * cosVector[4] * sinVector[5] + massVector[5] *
             t150 * t1910) + massVector[5] * COMVector_6[0] * t1903) -
           inertiaTensor_6[5] * sinVector[4]) - inertiaTensor_6[1] * cosVector[4]
    * cosVector[5];
  t1947 = ((((((t1574 + inertiaTensor_5[0] * cosVector[4]) + t172 * t1916) +
              COMVector_5[1] * t1922) + cosVector[5] * t1934) + sinVector[5] *
            t1938) - COMVector_5[2] * t1917) - massVector[5] * COMVector_5[1] *
    t1903;
  t1948 = inertiaTensor_5[8] * sinVector[4];
  t1949 = inertiaTensor_6[8] * sinVector[4];
  t1950 = COMVector_5[1] * t1920;
  t1951 = COMVector_5[0] * t1917;
  t1952 = t1918 - t1923;
  t1953 = inertiaTensor_6[2] * cosVector[4] * cosVector[5];
  t1954 = massVector[5] * COMVector_6[1] * t1910;
  t1959 = (((((inertiaTensor_5[1] + t1244) + t1245) - t1325) - t1326) - t1327) +
    t172 * (t1216 - t1219);
  t1960 = cosVector[4] * t1959;
  t1962 = ((t1324 + COMVector_4[1] * (t1216 - t1219)) + t1960) + t188 * (t1216 -
    t1219);
  t1966 = (((((((inertiaTensor_5[4] + t1328) + t1329) + t1330) + t1331) - t1824)
            - t1825) + t188 * (t1235 - t1241)) + COMVector_4[1] * (t1235 - t1241);
  t1968 = sinVector[3] * t1962 + cosVector[3] * t1966;
  t2103 = t214 * t1896;
  t1970 = COMVector_3[0] * t1896 - t2103;
  t1973 = sinVector[4] * t1947;
  t1974 = (((((((((t1570 + t1948) + t1949) + t1950) + t1951) + t1953) + t1954) -
             COMVector_5[0] * t1916) - COMVector_5[1] * t1952) -
           inertiaTensor_6[5] * cosVector[4] * sinVector[5]) - massVector[5] *
    COMVector_6[0] * t1900;
  t1975 = t214 * t1927;
  t1983 = ((((((((inertiaTensor_5[1] * cosVector[4] + inertiaTensor_5[5] *
                  sinVector[4]) + COMVector_4[1] * t1926) + sinVector[5] * t1934)
               + COMVector_5[2] * t1952) + t188 * t1926) + massVector[5] *
             COMVector_5[0] * t1903) - t172 * t1920) - COMVector_5[0] * t1922) -
    cosVector[5] * t1938;
  t1993 = ((((-t1582 - t1583) + cosVector[4] * t1947) + COMVector_4[1] * t1916)
           + sinVector[4] * t1974) + t188 * t1916;
  t1996 = sinVector[3] * t924 + cosVector[3] * cosVector[4] * t928;
  t1997 = (t1497 + t1498) + t1499;
  t1998 = (t1502 + t1503) + t1504;
  t2000 = COMVector_3[0] * t1996 - t214 * t1996;
  t2001 = cosVector[3] * t1001;
  t2002 = sinVector[3] * t1005;
  t2009 = cosVector[5] * massVector[5] * t1997;
  t2010 = massVector[5] * sinVector[5] * t1998;
  t2003 = ((t1522 + t1523) - t2009) - t2010;
  t2006 = cosVector[5] * COMVector_6[0] * sinVector[4] - COMVector_6[1] *
    sinVector[4] * sinVector[5];
  t2008 = cosVector[4] * t2003 + massVector[5] * sinVector[4] * t2006;
  t2013 = ((t1501 - t1514) + cosVector[5] * massVector[5] * t1998) - massVector
    [5] * sinVector[5] * t1997;
  t2017 = ((t1553 + massVector[5] * t150 * t1997) + inertiaTensor_6[4] *
           cosVector[5] * sinVector[4]) + massVector[5] * COMVector_6[0] * t2006;
  t2020 = ((t1555 + massVector[5] * t150 * t1998) + inertiaTensor_6[0] *
           sinVector[4] * sinVector[5]) - massVector[5] * COMVector_6[1] * t2006;
  t2022 = sinVector[3] * t2008;
  t2023 = cosVector[3] * t2013;
  t2024 = t2022 + t2023;
  t2027 = ((inertiaTensor_6[5] * cosVector[5] * sinVector[4] + inertiaTensor_6[2]
            * sinVector[4] * sinVector[5]) - massVector[5] * COMVector_6[1] *
           t1997) - massVector[5] * COMVector_6[0] * t1998;
  t2031 = ((((t1563 - t1783) + cosVector[5] * t2020) + t172 * t2013) -
           sinVector[5] * t2017) - COMVector_5[2] * t2013;
  t2032 = COMVector_4[1] * t2008;
  t2033 = t188 * t2008;
  t2034 = t172 * t2003;
  t2235 = cosVector[5] * t2017;
  t2236 = sinVector[5] * t2020;
  t2035 = ((((((t1554 + t1556) + t2032) + t2033) + t2034) - t2235) - t2236) -
    COMVector_5[2] * t2003;
  t2045 = ((t188 * t2013 + sinVector[4] * t2027) + cosVector[4] * t2031) +
    COMVector_4[1] * t2013;
  t2047 = sinVector[3] * t2035 + cosVector[3] * t2045;
  t2050 = ((cosVector[4] * t2027 + COMVector_3[0] * t2024) - t214 * t2024) -
    sinVector[4] * t2031;
  t2053 = cosVector[3] * t1537 + sinVector[3] * t1539;
  t2056 = cosVector[3] * t1566 + sinVector[3] * t1579;
  t2062 = sinVector[2] * t604;
  t2064 = cosVector[2] * t604;
  t2066 = (((((((((((((t296 + t607) + t608) + t609) + t610) + t611) + t612) +
                 t613) + t614) + COMVector_4[0] * ((t549 + t578) - t589)) -
              COMVector_4[0] * t605) - COMVector_4[1] * t548) - t188 * t539) -
           t172 * t512) - massVector[5] * COMVector_5[0] * t523;
  t2067 = sinVector[3] * t2066;
  t2068 = ((t615 + t623) + t2067) - cosVector[3] * t622;
  t2069 = t414 * t547;
  t2070 = COMVector_1[0] * t547 * 0.5;
  t2095 = sinVector[2] * t1580;
  t2082 = t1789 - t2095;
  t2084 = ((((((-t896 + t1611) + t1792) + t1793) + t1796) + t1797) - t2076) +
    sinVector[4] * (((((((((((t1485 + t1486) + t1487) - t1592) - t1595) - t1596)
    + t1770) + t1771) + t1773) + t1774) - t1798) - t1799);
  t2646 = cosVector[3] * t2084;
  t2085 = ((t1800 + t1810) - t2081) - t2646;
  t2087 = ((((((((t1587 + t1816) + t1817) + t1818) - t2071) - t2072) - t2073) -
            t2074) - t2075) + COMVector_3[0] * (((t1091 + t1092) - t1814) -
    t1815);
  t2088 = COMVector_2[0] * t1791;
  t2089 = t415 * t1791 * 0.5;
  t2090 = COMVector_3[0] * t1590;
  t2091 = t188 * t1589;
  t2093 = ((((((-t896 + t1611) + t1612) + t1613) + t1614) + t1617) + sinVector[4]
           * t1616) - COMVector_4[2] * t1492;
  t2094 = t414 * t1541;
  t2097 = (((((((inertiaTensor_4[4] + t1581) + t1582) + t1583) + t1584) - t1786)
            - t1787) - t1788) + t214 * (t1540 - t1559);
  t2389 = COMVector_5[0] * t1455;
  t2390 = COMVector_5[2] * t1466;
  t2391 = COMVector_4[0] * t1492;
  t2637 = cosVector[3] * t2093;
  t2100 = ((t1618 + t1619) - t2637) - sinVector[3] * ((((((((((((((-t879 + t1604)
    + t1605) + t1606) + t1607) + t1608) + t1609) + t1610) + t1620) - t2079) -
    t2080) + t2091) - t2389) - t2390) - t2391);
  t2632 = COMVector_4[2] * t1589;
  t2633 = COMVector_4[0] * t1454;
  t2634 = cosVector[4] * t1616;
  t2101 = ((((((((t1587 + t1591) + t1601) + t1602) - t2072) + t2090) - t2632) -
            t2633) - t2634) - t214 * t1590;
  t2102 = sinVector[2] * t1968;
  t2104 = t414 * (t1894 + t1895);
  t2105 = ((((t1573 - t1784) + t1973) + t1975) - cosVector[4] * t1974) -
    COMVector_3[0] * t1927;
  t2109 = sinVector[3] * t1983 - cosVector[3] * t1993;
  t2110 = sinVector[2] * t2109;
  t2111 = COMVector_2[0] * t1927;
  t2112 = t415 * t1896 * 0.5;
  t2116 = cosVector[1] * (cosVector[2] * t1968 + sinVector[2] * t1970) * 0.5;
  t2117 = t415 * t1927 * 0.5;
  t2650 = COMVector_2[0] * t1896;
  t2122 = ((t2102 + t2104) - t2650) - cosVector[2] * t1970;
  t2124 = sinVector[2] * t2105 + cosVector[2] * t2109;
  t2131 = sinVector[2] * t434;
  t2134 = t412 * t414;
  t2135 = COMVector_1[0] * t412 * 0.5;
  t2137 = cosVector[2] * t434 - sinVector[2] * t437;
  t2140 = cosVector[5] * COMVector_6[1] + COMVector_6[0] * sinVector[5];
  t2143 = ((-t1226 + t1228) + inertiaTensor_6[0] * cosVector[5]) + massVector[5]
    * COMVector_6[1] * t2140;
  t2146 = ((-t1230 + t1232) + inertiaTensor_6[4] * sinVector[5]) + massVector[5]
    * COMVector_6[0] * t2140;
  t2147 = ((t1329 + t1331) - cosVector[5] * t2143) - sinVector[5] * t2146;
  t2150 = ((inertiaTensor_6[2] * cosVector[5] + massVector[5] * COMVector_6[1] *
            t1212) - inertiaTensor_6[5] * sinVector[5]) - massVector[5] *
    COMVector_6[0] * t1207;
  t2153 = sinVector[4] * t188 * t928 + COMVector_4[1] * sinVector[4] * t928;
  t2155 = t994 - t1716;
  t2156 = sinVector[3] * t2153 - cosVector[3] * t2155;
  t2157 = COMVector_3[0] * sinVector[3] * sinVector[4] * t928;
  t2250 = sinVector[3] * sinVector[4] * t214 * t928;
  t2158 = ((t1002 + t1003) + t2157) - t2250;
  t2164 = cosVector[4] * t2147 - sinVector[4] * t2150;
  t2169 = ((((t1244 - t1326) + sinVector[5] * t2143) + massVector[5] *
            COMVector_4[1] * sinVector[4] * t2140) + massVector[5] * sinVector[4]
           * t188 * t2140) - cosVector[5] * t2146;
  t2171 = cosVector[3] * t2164 + sinVector[3] * t2169;
  t2175 = ((sinVector[4] * t2147 + cosVector[4] * t2150) + massVector[5] *
           sinVector[3] * sinVector[4] * t214 * t2140) - massVector[5] *
    COMVector_3[0] * sinVector[3] * sinVector[4] * t2140;
  t2178 = cosVector[4] * t1222 + sinVector[4] * t1224;
  t2180 = ((t1324 + t1960) + sinVector[3] * t214 * t2178) - COMVector_3[0] *
    sinVector[3] * t2178;
  t2183 = t188 * t2178 + COMVector_4[1] * t2178;
  t2188 = sinVector[4] * t1959;
  t2185 = t1342 - t2188;
  t2187 = sinVector[3] * t2183 + cosVector[3] * t2185;
  t2189 = COMVector_5[2] * t1319;
  t2193 = COMVector_2[0] * t1303;
  t2196 = cosVector[2] * t1355;
  t2198 = cosVector[3] * t1962 - sinVector[3] * t1966;
  t2199 = COMVector_2[0] * t1248;
  t2208 = sinVector[3] * (t1235 - t1241);
  t2209 = t1242 - t2208;
  t2200 = COMVector_3[0] * t2209;
  t2201 = ((t1342 - t1828) - t2188) + t2200;
  t2202 = COMVector_1[0] * t1303 * 0.5;
  t2203 = sinVector[2] * t1355;
  t2204 = ((((((((t1356 + t1357) + t1358) + t1359) + t2189) - t2190) -
             COMVector_5[0] * t1253) - COMVector_4[1] * t1301) - t188 * t1301) -
    t172 * t1298;
  t2205 = sinVector[3] * t2204;
  t2206 = t1362 + t2205;
  t2210 = cosVector[2] * t2198;
  t2211 = COMVector_1[0] * t1872 * 0.5;
  t2218 = cosVector[2] * t1891;
  t2221 = sinVector[2] * t1893;
  t2224 = ((COMVector_2[0] * t1872 + cosVector[2] * t1893) - sinVector[2] *
           t1891) - t414 * t1872;
  t2225 = t2218 + t2221;
  t2354 = t214 * t2209;
  t2226 = ((t1342 - t2188) + t2200) - t2354;
  t2230 = t2001 + t2002;
  t2233 = sinVector[1] * (((cosVector[2] * t2000 + COMVector_2[0] * t1996) +
    sinVector[2] * t2230) - t414 * t1996) * 0.5;
  t2234 = t415 * t2024 * 0.5;
  t2243 = cosVector[1] * (cosVector[2] * t2047 + sinVector[2] * t2050) * 0.5;
  t2244 = t415 * t1996 * 0.5;
  t2248 = sinVector[1] * (((COMVector_2[0] * t2024 + cosVector[2] * t2050) -
    t414 * t2024) - sinVector[2] * t2047) * 0.5;
  t2251 = cosVector[2] * t2158;
  t2252 = COMVector_2[0] * sinVector[3] * sinVector[4] * t928;
  t2705 = sinVector[2] * t2156;
  t2706 = sinVector[3] * sinVector[4] * t414 * t928;
  t2261 = cosVector[2] * t2156;
  t2267 = cosVector[1] * (cosVector[2] * t2171 - sinVector[2] * t2175) * 0.5;
  t2268 = sinVector[3] * sinVector[4] * t415 * t928 * 0.5;
  t2269 = massVector[5] * sinVector[3] * sinVector[4] * t415 * t2140 * 0.5;
  t2707 = COMVector_1[0] * sinVector[3] * sinVector[4] * t928 * 0.5;
  t2821 = massVector[5] * COMVector_1[0] * sinVector[3] * sinVector[4] * t2140 *
    0.5;
  t2822 = sinVector[1] * (((sinVector[2] * t2171 + cosVector[2] * t2175) +
    massVector[5] * sinVector[3] * sinVector[4] * t414 * t2140) - massVector[5] *
    COMVector_2[0] * sinVector[3] * sinVector[4] * t2140) * 0.5;
  t2271 = ((((((sinVector[1] * (((t2251 + t2252) - t2705) - t2706) * 0.5 +
                cosVector[1] * (t2261 + sinVector[2] * t2158) * 0.5) + t2267) +
              t2268) + t2269) - t2707) - t2821) - t2822;
  t2282 = sinVector[1] * (((COMVector_2[0] * t469 + cosVector[2] * t486) -
    sinVector[2] * t484) - t414 * t469) * 0.5;
  t2285 = cosVector[3] * t928 + cosVector[4] * sinVector[3] * t924;
  t2286 = ((t998 + t999) + t1000) - t1718;
  t2289 = (COMVector_4[1] * t928 + t188 * t928) - cosVector[4] * t2286;
  t2293 = ((((-t939 - t941) + t995) + t996) + cosVector[4] * t188 * t924) +
    cosVector[4] * COMVector_4[1] * t924;
  t2295 = cosVector[3] * t2289 + sinVector[3] * t2293;
  t2298 = (COMVector_3[0] * t2285 + sinVector[4] * t2286) - t214 * t2285;
  t2299 = COMVector_1[0] * t955 * 0.5;
  t2302 = cosVector[1] * (((t1717 + t1724) + t414 * t929) - COMVector_2[0] *
    t929) * 0.5;
  t2308 = cosVector[2] * t992 - sinVector[2] * t980;
  t2311 = t414 * t955;
  t2783 = COMVector_2[0] * t955;
  t2313 = sinVector[1] * (((cosVector[2] * t980 + sinVector[2] * t992) + t2311)
    - t2783) * 0.5;
  t2320 = cosVector[2] * t1714 - sinVector[2] * t1703;
  t2321 = COMVector_1[0] * t1686 * 0.5;
  t2326 = sinVector[1] * (((cosVector[2] * t1703 + t414 * t1686) + sinVector[2] *
    t1714) - COMVector_2[0] * t1686) * 0.5;
  t2328 = cosVector[1] * (t1717 + t1724) * 0.5;
  t2334 = cosVector[2] * t579;
  t2337 = sinVector[2] * (((t154 + t155) + sinVector[3] * t542) - cosVector[3] *
    t539);
  t2338 = t2334 + t2337;
  t2341 = sinVector[1] * (t1790 + sinVector[2] * t2097) * 0.5;
  t2342 = cosVector[2] * t2097;
  t2343 = ((t2094 - t2095) + t2342) - COMVector_2[0] * t1541;
  t2344 = sinVector[4] * t446;
  t2345 = cosVector[4] * massVector[5] * t441;
  t2346 = t2344 + t2345;
  t2348 = cosVector[2] * t2346;
  t2352 = sinVector[2] * (cosVector[3] * t449 + sinVector[3] * t443);
  t2353 = t2348 + t2352;
  t2356 = ((t1342 - t2188) - t2354) + COMVector_3[0] * (t1242 - t2208);
  t2357 = cosVector[4] * t378;
  t2364 = sinVector[4] * t375;
  t2358 = ((t122 - t151) + t2357) - t2364;
  t2359 = cosVector[2] * t2358;
  t2362 = sinVector[2] * (cosVector[3] * t390 - sinVector[3] * t367);
  t2363 = t2359 + t2362;
  t2366 = ((t642 - t1366) + sinVector[2] * t334) - cosVector[2] * t300;
  t2368 = inertiaTensor_3[5] * t3 * 0.5;
  t2369 = (t752 + t753) - t1399;
  t2371 = COMVector_2[2] * (t876 + t877);
  t2373 = (t876 + t877) + massVector[1] * t414;
  t2374 = t909 - t919;
  t2376 = (-t909 + t919) + massVector[1] * COMVector_2[1];
  t2571 = cosVector[2] * t643;
  t2379 = cosVector[1] * (((((((t641 + t729) + t1364) + t1365) - t2571) -
    inertiaTensor_2[4] * sinVector[1]) - COMVector_2[2] * ((t642 + t753) - t1366))
    - t414 * t726) * 0.5;
  t2381 = ((((((t710 + t1368) + t1377) + t1379) + t1385) + cosVector[2] * t1401)
           - COMVector_2[0] * t695) - COMVector_2[2] * t1367;
  t2386 = cosVector[1] * (((((((t729 + t1396) + t1397) + t1398) + COMVector_2[2]
    * t2369) - COMVector_2[1] * t728) - COMVector_2[2] * t1395) - sinVector[2] *
    t1401) * 0.5;
  t2387 = sinVector[2] * t1176;
  t2422 = cosVector[2] * t1184;
  t2388 = ((t909 - t919) + t2387) - t2422;
  t2395 = cosVector[2] * t1472 - sinVector[2] * (((t827 - t908) + sinVector[3] *
    t1445) - cosVector[3] * t1589);
  t2397 = (((t851 + t852) + t853) + t854) + massVector[5] * COMVector_6[0] *
    (((t800 - t809) + t810) - t822);
  t2398 = cosVector[5] * t2397;
  t2401 = cosVector[4] * massVector[5] * t951;
  t2400 = sinVector[4] * t947 - t2401;
  t2404 = sinVector[2] * (cosVector[3] * t953 - sinVector[3] * t944);
  t2405 = cosVector[2] * t2400;
  t2406 = t2404 + t2405;
  t2411 = sinVector[4] * t1298;
  t2412 = cosVector[4] * t1253;
  t2413 = ((-t805 + t828) + t2411) + t2412;
  t2414 = cosVector[2] * t2413;
  t2418 = sinVector[2] * (cosVector[3] * t1301 + sinVector[3] * t1288);
  t2420 = cosVector[2] * t1159 - sinVector[2] * t1141;
  t2421 = sinVector[3] * t1673 * 0.5;
  t2423 = COMVector_3[0] * t1125 * 0.5;
  t2424 = cosVector[3] * t1192 * 0.5;
  t2425 = COMVector_3[2] * t1176 * 0.5;
  t2430 = sinVector[4] * t1681;
  t2426 = t2401 - t2430;
  t2431 = cosVector[2] * t2426;
  t2433 = cosVector[2] * t1996 - sinVector[2] * sinVector[4] * t928;
  t2436 = ((-t1057 + t1083) + cosVector[4] * t1850) + sinVector[4] * t1845;
  t2442 = sinVector[2] * (cosVector[3] * t1855 + sinVector[3] * t1842) +
    cosVector[2] * t2436;
  t2443 = cosVector[2] * t1896;
  t2521 = sinVector[2] * t2178;
  t2444 = t2443 - t2521;
  t2448 = cosVector[2] * t2053 + sinVector[2] * (t1925 - t1929);
  t2452 = cosVector[2] * t1775 - sinVector[2] * (((t1082 - t1131) + sinVector[3]
    * t1752) - cosVector[3] * t1748);
  t2453 = COMVector_3[2] * t755 * 0.5;
  t2454 = t214 * t300 * 0.5;
  t2456 = cosVector[3] * (((((((((((((((t308 + t311) + t312) - t680) - t682) -
    t688) + t742) + t744) + t745) + t746) + t747) + t748) - t1372) - t1373) -
    t1374) - t1375) * 0.5;
  t2457 = COMVector_2[0] * t2366 * 0.5;
  t2458 = t214 * t689 * 0.5;
  t2461 = cosVector[4] * t1922;
  t2462 = sinVector[4] * t1920;
  t2460 = ((t1515 + t1516) - t2461) - t2462;
  t2463 = cosVector[2] * t2460;
  t2467 = sinVector[2] * (cosVector[3] * t1926 + sinVector[3] * t1916);
  t2468 = t2463 + t2467;
  t2469 = sinVector[3] * t2093 * 0.5;
  t2470 = COMVector_3[0] * t1472 * 0.5;
  t2526 = sinVector[5] * t2397;
  t2471 = (((((((t843 + t844) + t850) + t857) + t858) + t887) - t913) - t915) -
    t2526;
  t2473 = (((((((((((((t894 + t895) + t896) + t897) + t898) + t899) + t900) +
                 t901) + t902) + t903) - t1094) - t1095) - t1096) + t2398) +
    COMVector_5[0] * (t808 + t815);
  t2477 = (((((((((((((-t879 + t1604) + t1605) + t1606) + t1607) + t1608) +
                  t1609) + t1610) - t2079) - t2080) + t2091) - t2389) - t2390) -
           t2391) + COMVector_4[1] * (t1440 + t1448);
  t2478 = COMVector_2[0] * t2395 * 0.5;
  t2479 = cosVector[3] * t2066 * 0.5;
  t2481 = cosVector[3] * t297 * 0.5;
  t2482 = t414 * t2338 * 0.5;
  t2483 = sinVector[3] * t622 * 0.5;
  t2484 = t214 * t579 * 0.5;
  t2485 = sinVector[4] * t2003;
  t2487 = cosVector[4] * massVector[5] * t2006;
  t2486 = t2485 - t2487;
  t2488 = cosVector[2] * t2486;
  t2491 = sinVector[2] * (cosVector[3] * t2008 - sinVector[3] * t2013);
  t2492 = t2488 + t2491;
  t2493 = COMVector_3[0] * t1775 * 0.5;
  t2494 = sinVector[3] * t2084 * 0.5;
  t2495 = COMVector_2[0] * t2448 * 0.5;
  t2498 = COMVector_2[0] * t2452 * 0.5;
  t2499 = cosVector[3] * t1199 * 0.5;
  t2591 = t414 * t2448 * 0.5;
  t2603 = sinVector[3] * t1202 * 0.5;
  t2604 = cosVector[3] * t1809 * 0.5;
  t2605 = t214 * t1775 * 0.5;
  t2661 = t414 * t2452 * 0.5;
  t2500 = ((((((((t2493 + t2494) + t2495) + t2498) + t2499) - t2591) - t2603) -
            t2604) - t2605) - t2661;
  t2501 = cosVector[3] * t1983 * 0.5;
  t2502 = t214 * t2460 * 0.5;
  t2503 = t414 * t2468 * 0.5;
  t2504 = sinVector[3] * t1993 * 0.5;
  t2505 = sinVector[3] * t1966 * 0.5;
  t2506 = COMVector_2[0] * sinVector[2] * t2209 * 0.5;
  t2606 = cosVector[3] * t1962 * 0.5;
  t2607 = COMVector_3[0] * t2460 * 0.5;
  t2668 = sinVector[2] * t414 * t2209 * 0.5;
  t2507 = ((((((((t2501 + t2502) + t2503) + t2504) + t2505) + t2506) - t2606) -
            t2607) - t2668) - COMVector_2[0] * t2468 * 0.5;
  t2508 = cosVector[2] * t1236;
  t2746 = cosVector[3] * sinVector[2] * t2178;
  t2509 = t2508 - t2746;
  t2511 = cosVector[2] * cosVector[4] * t928 - cosVector[3] * sinVector[2] *
    sinVector[4] * t928;
  t2513 = cosVector[2] * cosVector[4] * massVector[5] * t2140 - cosVector[3] *
    massVector[5] * sinVector[2] * sinVector[4] * t2140;
  t2515 = sinVector[3] * t426 * 0.5;
  t2516 = cosVector[3] * t433 * 0.5;
  t2517 = COMVector_2[0] * t2363 * 0.5;
  t2518 = COMVector_3[0] * t2358 * 0.5;
  t2519 = COMVector_3[0] * t2436 * 0.5;
  t2520 = cosVector[3] * t1889 * 0.5;
  t2522 = t414 * t2444 * 0.5;
  t2523 = COMVector_2[0] * t2442 * 0.5;
  t2524 = cosVector[3] * t2204 * 0.5;
  t2525 = t2414 + t2418;
  t2585 = sinVector[4] * t2471;
  t2527 = ((((t1277 - t1360) - t1361) + t2191) + t2192) - t2585;
  t2528 = sinVector[3] * t2527 * 0.5;
  t2530 = cosVector[3] * t2153 * 0.5;
  t2531 = cosVector[3] * t2169 * 0.5;
  t2533 = COMVector_2[0] * t2511 * 0.5;
  t2534 = COMVector_2[0] * t2513 * 0.5;
  t2535 = sinVector[3] * t2155 * 0.5;
  t2536 = cosVector[4] * COMVector_3[0] * t928 * 0.5;
  t2537 = cosVector[4] * massVector[5] * COMVector_3[0] * t2140 * 0.5;
  t2620 = sinVector[3] * t2164 * 0.5;
  t2621 = cosVector[4] * t214 * t928 * 0.5;
  t2622 = cosVector[4] * massVector[5] * t214 * t2140 * 0.5;
  t2747 = t414 * t2511 * 0.5;
  t2830 = t414 * t2513 * 0.5;
  t2538 = ((((((((((t2530 + t2531) + t2533) + t2534) + t2535) + t2536) + t2537)
              - t2620) - t2621) - t2622) - t2747) - t2830;
  t2690 = ((((t900 + t970) - t975) - t976) - t977) + t2398;
  t2540 = ((t987 + t988) - t2306) + cosVector[4] * t2690;
  t2541 = sinVector[3] * t2540 * 0.5;
  t2543 = COMVector_3[0] * t2400 * 0.5;
  t2544 = COMVector_2[0] * t2406 * 0.5;
  t2545 = COMVector_3[0] * t2486 * 0.5;
  t2547 = COMVector_2[0] * t2492 * 0.5;
  t2548 = sinVector[3] * t2045 * 0.5;
  t2549 = cosVector[3] * t1005 * 0.5;
  t2550 = COMVector_2[0] * sinVector[2] * t929 * 0.5;
  t2551 = cosVector[3] * t1708 * 0.5;
  t2555 = sinVector[2] * (cosVector[3] * t1683 - sinVector[3] * t1677);
  t2553 = t2431 - t2555;
  t2556 = COMVector_2[0] * t2433 * 0.5;
  t2557 = cosVector[3] * t478 * 0.5;
  t2558 = t214 * t2346 * 0.5;
  t2559 = t414 * t2353 * 0.5;
  t2564 = sinVector[2] * (sinVector[3] * t928 - cosVector[3] * cosVector[4] *
    t924) - cosVector[2] * sinVector[4] * t924;
  t2570 = sinVector[1] * (((((t1388 + t1389) + COMVector_2[0] * t216) -
    cosVector[2] * t1630) - sinVector[2] * t331) - t216 * t414) * 0.5;
  t2572 = cosVector[2] * t2356;
  t2574 = t2210 + sinVector[2] * t2356;
  t2575 = COMVector_3[2] * t345 * 0.5;
  t2576 = COMVector_3[2] * t334 * 0.5;
  t2577 = COMVector_3[0] * t230 * 0.5;
  t2578 = t1638 + t1644;
  t2579 = cosVector[3] * (((((((((((((((t304 + t305) + t306) + t307) + t308) +
    t309) + t310) + t311) + t312) - t680) - t682) - t688) - t1623) - t1624) -
    t1625) - t1626) * 0.5;
  t2580 = sinVector[3] * t329 * 0.5;
  t2582 = cosVector[4] * t2471;
  t2583 = ((((((t878 + t879) + t880) + t885) + t886) + t890) - t1093) + t2582;
  t2586 = cosVector[2] * t1674;
  t2587 = (((((((((((-inertiaTensor_3[5] + t910) + t911) + t912) + t917) + t918)
                + t1163) - t1277) - t1661) - t1662) - t1663) - t1664) + t2585;
  t2589 = (((inertiaTensor_3[1] + t893) - t1098) + cosVector[3] * t2583) -
    sinVector[3] * t2473;
  t2590 = sinVector[2] * t1674;
  t2592 = cosVector[3] * t2583 * 0.5;
  t2598 = t214 * t1184 * 0.5;
  t2600 = COMVector_3[2] * t1168 * 0.5;
  t2595 = angleVelocityVector[1] * (((((((t2421 + t2423) + t2424) + t2425) +
    t414 * (((t909 - t919) + t2387) - t2422) * 0.5) - t2598) - t2600) -
    COMVector_2[0] * t2388 * 0.5);
  t2596 = ((((((t850 + t981) + t982) + t983) + t984) - t2304) - t2305) - t2526;
  t2597 = COMVector_3[0] * (((-t805 + t828) + t2411) + t2412) * 0.5;
  t2601 = t414 * t2366 * 0.5;
  t2602 = COMVector_3[0] * (t2401 - t2430) * 0.5;
  t2608 = COMVector_3[0] * t579 * 0.5;
  t2609 = inertiaTensor_4[4] * t3 * 0.5;
  t2610 = sinVector[3] * t287 * 0.5;
  t2612 = ((((((t565 + t616) + t617) + t618) + t619) + t620) - t2063) +
    COMVector_4[2] * (t549 - t589);
  t2613 = inertiaTensor_4[1] * cosVector[3] * t6 * 0.5;
  t2614 = ((((t2493 + t2494) + t2499) - t2603) - t2604) - t2605;
  t2615 = ((((t2501 + t2502) + t2504) + t2505) - t2606) - t2607;
  t2616 = inertiaTensor_5[5] * t14 * 0.5;
  t2617 = inertiaTensor_5[4] * sinVector[3] * t6 * 0.5;
  t2618 = cosVector[3] * t2183;
  t2619 = COMVector_3[0] * t1236;
  t2825 = t214 * t2426 * 0.5;
  t2826 = sinVector[3] * t2427 * 0.5;
  t2623 = ((t2551 + t2602) - t2825) - t2826;
  t2624 = ((((((t2530 + t2531) + t2535) + t2536) + t2537) - t2620) - t2621) -
    t2622;
  t2625 = cosVector[3] * t2293;
  t2626 = sinVector[4] * t214 * t924;
  t2627 = inertiaTensor_6[8] * t14 * 0.5;
  t2628 = inertiaTensor_6[5] * t28 * 0.5;
  t2631 = cosVector[2] * (t2001 + t2002) - sinVector[2] * t2000;
  t2636 = sinVector[2] * t2101;
  t2638 = COMVector_4[0] * t661 * 0.5;
  t2640 = ((t2637 + sinVector[3] * t2477) - cosVector[3] * t2473) - sinVector[3]
    * t2583;
  t2641 = sinVector[4] * t702 * 0.5;
  t2642 = cosVector[4] * t706 * 0.5;
  t2643 = COMVector_4[0] * t51 * 0.5;
  t2644 = COMVector_4[2] * t303 * 0.5;
  t2645 = sinVector[2] * t2087;
  t2647 = sinVector[4] * t245 * 0.5;
  t2648 = cosVector[4] * t253 * 0.5;
  t2649 = cosVector[2] * t2087;
  t2651 = ((t615 + t623) + t2067) - cosVector[3] * t2612;
  t2653 = COMVector_3[0] * t2053 - t214 * t2053;
  t2655 = ((COMVector_2[0] * t2053 + cosVector[2] * t2653) - sinVector[2] *
           t2056) - t414 * t2053;
  t2659 = cosVector[2] * t2056 + sinVector[2] * t2653;
  t2660 = COMVector_4[0] * t1022 * 0.5;
  t2662 = sinVector[4] * t1121 * 0.5;
  t2663 = COMVector_4[2] * t1033 * 0.5;
  t2670 = t214 * t1472 * 0.5;
  t2671 = sinVector[3] * t2473 * 0.5;
  t2672 = cosVector[3] * t2477 * 0.5;
  t2665 = angleVelocityVector[1] * (((((((t2469 + t2470) + t2478) + t2592) -
    t2670) - t2671) - t2672) - t414 * t2395 * 0.5);
  t2666 = COMVector_4[2] * (t652 - t670) * 0.5;
  t2667 = sinVector[3] * t2612 * 0.5;
  t2669 = t214 * ((t549 + t578) - t589) * 0.5;
  t2673 = sinVector[3] * (((((t998 + t999) + t1000) - t1718) - t1719) - t1720) *
    0.5;
  t2674 = angleVelocityVector[2] * t2614;
  t2675 = inertiaTensor_4[1] * cosVector[3] * 0.5;
  t2676 = sinVector[3] * t1566 * 0.5;
  t2677 = sinVector[4] * t1871 * 0.5;
  t2678 = cosVector[4] * t1143 * 0.5;
  t2679 = sinVector[4] * t1090 * 0.5;
  t2682 = ((sinVector[4] * t1947 * 0.5 + cosVector[4] * t1557 * 0.5) -
           cosVector[4] * t1974 * 0.5) - sinVector[4] * t1548 * 0.5;
  t2683 = cosVector[4] * t186 * 0.5;
  t2684 = sinVector[4] * t409 * 0.5;
  t2685 = inertiaTensor_5[4] * sinVector[3] * 0.5;
  t2686 = sinVector[4] * t842 * 0.5;
  t2687 = cosVector[4] * t2471 * 0.5;
  t2688 = sinVector[4] * t1317 * 0.5;
  t2689 = cosVector[4] * t969 * 0.5;
  t2691 = cosVector[4] * t1695 * 0.5;
  t2692 = inertiaTensor_6[2] * t1413 * 0.5;
  t2693 = inertiaTensor_6[5] * t1408 * 0.5;
  t2695 = cosVector[4] * t2027 * 0.5 - sinVector[4] * t2031 * 0.5;
  t2696 = sinVector[4] * t2147 * 0.5;
  t2697 = cosVector[4] * t2150 * 0.5;
  t2698 = sinVector[4] * t468 * 0.5;
  t2699 = t415 * t1303 * 0.5;
  t2700 = COMVector_5[0] * t664 * 0.5;
  t2701 = t172 * t651 * 0.5;
  t2702 = ((((t885 + t1353) + t1354) - t2194) - t2195) + t2582;
  t2703 = t2205 - cosVector[3] * t2527;
  t2704 = cosVector[5] * t687 * 0.5;
  t2713 = angleVelocityVector[0] * (((t2135 + sinVector[1] * (((t2131 + t2134) +
    cosVector[2] * (((((t292 - t413) + t435) + t436) - t2132) - t2133)) -
    COMVector_2[0] * t412) * 0.5) - cosVector[1] * t2137 * 0.5) - t412 * t415 *
    0.5);
  t2715 = sinVector[1] * (((t2110 + t2111) - cosVector[2] * t2105) - t414 *
    t1927) * 0.5;
  t2716 = cosVector[5] * t554 * 0.5;
  t2717 = COMVector_5[2] * t555 * 0.5;
  t2718 = sinVector[5] * t560 * 0.5;
  t2719 = COMVector_5[0] * t528 * 0.5;
  t2720 = inertiaTensor_5[4] * cosVector[3] * t3 * 0.5;
  t2721 = inertiaTensor_5[1] * cosVector[4] * sinVector[3] * t3 * 0.5;
  t2722 = inertiaTensor_5[5] * sinVector[3] * sinVector[4] * t3 * 0.5;
  t2725 = cosVector[2] * t2187 - sinVector[2] * t2180;
  t2729 = ((cosVector[2] * t2180 + sinVector[2] * t2187) + sinVector[3] * t414 *
           t2178) - COMVector_2[0] * sinVector[3] * t2178;
  t2730 = cosVector[5] * t229 * 0.5;
  t2731 = COMVector_5[0] * t203 * 0.5;
  t2734 = sinVector[1] * t2224 * 0.5;
  t2735 = t57 * t172 * 0.5;
  t2736 = COMVector_5[0] * t1455 * 0.5;
  t2737 = COMVector_5[2] * t1466 * 0.5;
  t2738 = inertiaTensor_5[1] * cosVector[3] * cosVector[4] * 0.5;
  t2739 = inertiaTensor_5[5] * cosVector[3] * sinVector[4] * 0.5;
  t2740 = cosVector[5] * t1117 * 0.5;
  t2741 = t172 * t1031 * 0.5;
  t2742 = COMVector_5[0] * t1026 * 0.5;
  t2749 = t214 * t2413 * 0.5;
  t2745 = angleVelocityVector[1] * (((((t2524 + t2528) + t2597) + COMVector_2[0]
    * (t2414 + t2418) * 0.5) - t2749) - t414 * t2525 * 0.5);
  t2748 = COMVector_3[0] * (((t122 - t151) + t2357) - t2364) * 0.5;
  t2750 = t172 * t1742 * 0.5;
  t2751 = cosVector[5] * t1765 * 0.5;
  t2752 = sinVector[5] * t1763 * 0.5;
  t2753 = COMVector_5[0] * t1747 * 0.5;
  t2754 = massVector[5] * COMVector_5[0] * t1746 * 0.5;
  t2755 = cosVector[3] * t2183 * 0.5;
  t2756 = COMVector_3[0] * (t1235 - t1241) * 0.5;
  t2757 = inertiaTensor_5[5] * cosVector[4] * sinVector[3] * 0.5;
  t2758 = cosVector[4] * t1864 * 0.5;
  t2761 = angleVelocityVector[3] * t2682;
  t2763 = angleVelocityVector[0] * ((((((((((((t2683 + t2684) + t2716) + t2717)
    + t2718) + t2719) + t2720) + t2721) + t2722) - cosVector[4] * t398 * 0.5) -
    sinVector[4] * t196 * 0.5) - t172 * t512 * 0.5) - massVector[5] *
    COMVector_5[0] * t523 * 0.5);
  t2766 = ((sinVector[5] * t2143 * 0.5 + cosVector[5] * t1233 * 0.5) -
           sinVector[5] * t1229 * 0.5) - cosVector[5] * t2146 * 0.5;
  t2767 = sinVector[5] * t1067 * 0.5;
  t2768 = COMVector_5[2] * t1681 * 0.5;
  t2769 = cosVector[5] * t1691 * 0.5;
  t2770 = COMVector_5[2] * t947 * 0.5;
  t2771 = cosVector[5] * t962 * 0.5;
  t2772 = sinVector[5] * t2397 * 0.5;
  t2773 = inertiaTensor_6[8] * cosVector[4] * sinVector[3] * 0.5;
  t2774 = inertiaTensor_6[5] * sinVector[3] * sinVector[4] * sinVector[5] * 0.5;
  t2775 = cosVector[5] * t2017 * 0.5;
  t2776 = sinVector[5] * t2020 * 0.5;
  t2777 = COMVector_5[2] * (((t1522 + t1523) - t2009) - t2010) * 0.5;
  t2778 = cosVector[5] * t457 * 0.5;
  t2780 = ((t183 + t458) + t459) + massVector[5] * COMVector_6[1] * (t440 - t448);
  t2781 = sinVector[5] * t2780 * 0.5;
  t2782 = COMVector_5[2] * (((t137 + t144) - t450) - t451) * 0.5;
  t2785 = ((t974 + t979) - t2303) + sinVector[4] * t2690;
  t2788 = sinVector[3] * t2596 + cosVector[3] * t2540;
  t2789 = massVector[5] * COMVector_6[0] * t634 * 0.5;
  t2791 = cosVector[3] * (((t138 - t146) + t442) - t444);
  t2792 = t453 - t2791;
  t2790 = COMVector_3[0] * t2792;
  t2793 = cosVector[5] * t2780;
  t2794 = ((((t281 - t445) + t467) - t473) - t474) + t2793;
  t2795 = ((((((t181 + t184) + t475) + t476) + t477) - t2274) - t2276) -
    sinVector[5] * t2780;
  t2796 = sinVector[3] * t2795;
  t2799 = cosVector[3] * (((t480 - t2277) - t2278) + cosVector[4] * t2794);
  t2802 = massVector[5] * COMVector_6[0] * t39 * 0.5;
  t2806 = ((COMVector_2[0] * t2285 + cosVector[2] * t2298) - sinVector[2] *
           t2295) - t414 * t2285;
  t2809 = cosVector[2] * t2295 + sinVector[2] * t2298;
  t2810 = inertiaTensor_6[2] * t496 * 0.5;
  t2811 = inertiaTensor_6[5] * t488 * 0.5;
  t2814 = massVector[5] * COMVector_6[1] * t506 * 0.5;
  t2815 = inertiaTensor_6[8] * sinVector[3] * sinVector[4] * t3 * 0.5;
  t2817 = inertiaTensor_6[8] * t83 * 0.5;
  t2819 = massVector[5] * COMVector_6[1] * t357 * 0.5;
  t2820 = inertiaTensor_6[2] * cosVector[5] * t81 * 0.5;
  t2827 = COMVector_2[0] * (t2431 - t2555) * 0.5;
  t2828 = massVector[5] * COMVector_6[0] * t1017 * 0.5;
  t2829 = massVector[5] * COMVector_6[1] * t1015 * 0.5;
  t2831 = massVector[5] * COMVector_6[0] * t1259 * 0.5;
  t2833 = cosVector[3] * t2293 * 0.5;
  t2834 = inertiaTensor_6[2] * t779 * 0.5;
  t2835 = sinVector[4] * t214 * t924 * 0.5;
  t2838 = sinVector[3] * (((t987 + t988) - t2306) + cosVector[4] * (((((t900 +
    t970) - t975) - t976) - t977) + t2398)) * 0.5;
  t2839 = angleVelocityVector[2] * t2623;
  t2840 = cosVector[3] * (((((((t1554 + t1556) + t2032) + t2033) + t2034) -
    t2235) - t2236) - COMVector_5[2] * (((t1522 + t1523) - t2009) - t2010)) *
    0.5;
  t2841 = t214 * (t2485 - t2487) * 0.5;
  t2842 = inertiaTensor_6[8] * cosVector[3] * sinVector[4] * 0.5;
  t2843 = cosVector[3] * t2795 * 0.5;
  t2845 = ((((t281 - t445) - t473) - t474) + t2793) + COMVector_5[2] * (((t138 -
    t146) + t442) - t444);
  t2847 = ((t480 - t2277) - t2278) + cosVector[4] * t2845;
  t2848 = massVector[5] * COMVector_6[0] * t1835 * 0.5;
  t2849 = sinVector[4] * t2690 * 0.5;
  t2850 = massVector[5] * COMVector_6[1] * t1425 * 0.5;
  t2851 = massVector[5] * COMVector_6[0] * t1419 * 0.5;
  t2852 = sinVector[4] * t1693 * 0.5;
  t2853 = massVector[5] * COMVector_6[1] * t1736 * 0.5;
  t2854 = massVector[5] * COMVector_6[0] * t1733 * 0.5;
  t2855 = inertiaTensor_6[8] * sinVector[4] * 0.5;
  t2856 = inertiaTensor_6[2] * cosVector[4] * cosVector[5] * 0.5;
  t2857 = massVector[5] * COMVector_6[1] * t1910 * 0.5;
  t2859 = angleVelocityVector[3] * t2695;
  t2860 = cosVector[4] * t464 * 0.5;
  t2863 = angleVelocityVector[4] * t2766;
  t2865 = inertiaTensor_6[2] * cosVector[5] * sinVector[3] * sinVector[4] * 0.5;
  t2864 = (((((((((t2767 + t2768) + t2769) + t2773) + t2774) + t2848) - t2865) -
             cosVector[5] * t1064 * 0.5) - sinVector[5] * t1688 * 0.5) - t172 *
           t1681 * 0.5) - massVector[5] * COMVector_6[1] * t1837 * 0.5;
  t2867 = angleVelocityVector[3] * ((((((((((t2775 + t2776) + t2777) + t2855) +
    t2856) + t2857) - cosVector[5] * t1528 * 0.5) - sinVector[5] * t1533 * 0.5)
    - t172 * t2003 * 0.5) - inertiaTensor_6[5] * cosVector[4] * sinVector[5] *
    0.5) - massVector[5] * COMVector_6[0] * t1900 * 0.5);
  t2869 = angleVelocityVector[0] * ((((((((((t2778 + t2781) + t2782) + t2817) +
    t2819) + t2820) - cosVector[5] * t169 * 0.5) - sinVector[5] * t165 * 0.5) -
    t172 * t446 * 0.5) - inertiaTensor_6[5] * sinVector[5] * t81 * 0.5) -
    massVector[5] * COMVector_6[0] * t352 * 0.5);
  coriolis[0] = (((angleVelocityVector[3] * (((t2070 + cosVector[1] * (t2062 +
    cosVector[2] * (((t615 + t623) + sinVector[3] * ((((((((((((((t296 + t607) +
    t608) + t609) + t610) + t611) + t612) + t613) + t614) + t624) - COMVector_4
    [1] * t548) - t172 * t512) - t188 * t539) - COMVector_4[0] * (t549 -
    sinVector[4] * t512)) - massVector[5] * COMVector_5[0] * t523)) - cosVector
                    [3] * t622)) * 0.5) + sinVector[1] * (((t2064 + t2069) -
    COMVector_2[0] * t547) - sinVector[2] * (((t615 + t623) - cosVector[3] *
    t622) + sinVector[3] * ((((((((((((((t296 + t607) + t608) + t609) + t610) +
    t611) + t612) + t613) + t614) + t624) - COMVector_4[1] * t548) -
    COMVector_4[0] * t605) - t172 * t512) - t188 * t539) - massVector[5] *
    COMVector_5[0] * t523))) * 0.5) - t415 * t547 * 0.5) - angleVelocityVector[1]
                   * (((((t1394 + t1402) - COMVector_1[0] * (((t667 + t668) +
    t671) + t709) * 0.5) + cosVector[1] * (((((((t729 + t1396) + t1397) + t1398)
    - COMVector_2[1] * t728) - COMVector_2[2] * t1395) - sinVector[2] * t761) +
    COMVector_2[2] * ((t752 + t753) - sinVector[2] * t691)) * 0.5) - sinVector[1]
                       * (((((((t710 + t1368) + t1377) + t1379) + t1385) +
    cosVector[2] * t761) - COMVector_2[2] * t1367) - COMVector_2[0] * ((t667 +
    t668) + t671)) * 0.5) + cosVector[1] * (((((((t641 + t729) + t1364) + t1365)
    - inertiaTensor_2[4] * sinVector[1]) - cosVector[2] * t643) - t414 * t726) -
    COMVector_2[2] * ((t642 + t753) - sinVector[2] * t289)) * 0.5)) +
                  angleVelocityVector[4] * (((t2135 - cosVector[1] * t2137 * 0.5)
    - t412 * t415 * 0.5) + sinVector[1] * (((t2131 + t2134) + cosVector[2] *
    t437) - COMVector_2[0] * t412) * 0.5)) + angleVelocityVector[5] * (((t2282 -
    COMVector_1[0] * t469 * 0.5) + t415 * t469 * 0.5) + cosVector[1] *
    (cosVector[2] * t484 + sinVector[2] * t486) * 0.5)) - angleVelocityVector[2]
    * (((t1631 + cosVector[1] * (((t641 + t1629) - cosVector[2] * t643) -
          sinVector[2] * ((((((((((((((-t212 + t332) + t335) + t336) + t337) +
    t338) + t339) + t340) + t341) + t346) + t347) - COMVector_4[2] * t208) -
             COMVector_4[0] * t211) - COMVector_3[0] * t299) - inertiaTensor_4[5]
           * sinVector[3] * t6)) * 0.5) - COMVector_1[0] * t344 * 0.5) +
       sinVector[1] * (((((sinVector[2] * ((((((((((((((t224 + t256) + t261) +
    t262) + t263) + t264) + t270) + t272) + t342) - COMVector_4[0] * t149) -
    COMVector_4[2] * t148) + t197 * t214) - COMVector_3[0] * (cosVector[3] *
    (((t132 + t136) + t137) + cosVector[5] * massVector[5] * t102) + sinVector[3]
    * t128)) - COMVector_3[1] * (t153 - cosVector[3] * t128)) - inertiaTensor_4
             [1] * cosVector[3] * t3) + cosVector[2] * (((((((t212 + t273) +
    t276) + t288) + t290) - cosVector[3] * t297) - COMVector_3[1] * t177) -
             COMVector_3[2] * t197)) + COMVector_2[0] * t344) - sinVector[2] *
          t331) - t216 * t414) - cosVector[2] * ((((((((((((((-t212 + t332) +
    t335) + t336) + t337) + t338) + t339) + t340) + t341) + t346) + t347) -
            COMVector_3[0] * (t52 + t206)) - COMVector_4[2] * t208) -
          COMVector_4[0] * t211) - inertiaTensor_4[5] * sinVector[3] * t6)) *
       0.5);
  coriolis[1] = ((((-angleVelocityVector[3] * (((((t1823 + cosVector[1] *
    (sinVector[2] * (((((((((t1587 + t1591) + t1601) + t1602) - inertiaTensor_4
    [5] * sinVector[3]) - cosVector[4] * t1490) - COMVector_4[2] * t1449) +
                       COMVector_3[0] * t1453) - COMVector_4[0] * t1454) - t214 *
                     t1453) + cosVector[2] * (((t1618 + t1619) - sinVector[3] *
    ((((((((((((((-t879 + t1604) + t1605) + t1606) + t1607) + t1608) + t1609) +
    t1610) + t1620) - COMVector_5[0] * t1455) - COMVector_5[2] * t1466) -
        COMVector_4[0] * t1492) + t188 * t1449) - inertiaTensor_5[1] *
      cosVector[3] * cosVector[4]) - inertiaTensor_5[5] * cosVector[3] *
     sinVector[4])) - cosVector[3] * (((((((-t896 + t1611) + t1612) + t1613) +
    t1614) + t1617) - COMVector_4[2] * t1492) + sinVector[4] * t1490))) * 0.5) -
    COMVector_1[0] * t1453 * 0.5) + t415 * t1453 * 0.5) - sinVector[1] *
    (((sinVector[2] * (((t1618 + t1619) - cosVector[3] * t2093) - sinVector[3] *
                       ((((((((((((((-t879 + t1604) + t1605) + t1606) + t1607) +
    t1608) + t1609) + t1610) + t1620) + t2091) - COMVector_5[0] * t1455) -
    COMVector_5[2] * t1466) - COMVector_4[0] * t1492) - inertiaTensor_5[1] *
    cosVector[3] * cosVector[4]) - inertiaTensor_5[5] * cosVector[3] *
                        sinVector[4])) - COMVector_2[0] * t1590) + t414 * t1453)
     - cosVector[2] * (((((((((t1587 + t1591) + t1601) + t1602) + t2090) -
    inertiaTensor_4[5] * sinVector[3]) - cosVector[4] * t1616) - COMVector_4[0] *
    t1454) - COMVector_4[2] * t1589) - t214 * t1590)) * 0.5) - cosVector[1] *
    (((t1789 + t2094) - COMVector_2[0] * t1541) - sinVector[2] * t1580) * 0.5) -
                    angleVelocityVector[2] * (((((t1647 + t1649) + t1668) - t415
    * t1034 * 0.5) + cosVector[1] * (((t1099 + t1665) + cosVector[2] * t1196) -
    sinVector[2] * t1178) * 0.5) - sinVector[1] * (((((-t1165 + t1669) + t1670)
    + t1671) + sinVector[2] * t1196) - t414 * t1034) * 0.5)) +
                   angleVelocityVector[5] * (((((t1727 + t2299) + t2302) + t2313)
    - cosVector[1] * t2308 * 0.5) - t415 * t955 * 0.5)) - angleVelocityVector[0]
                  * (((((t1394 + t1402) + t2379) + t2386) - COMVector_1[0] *
                      t728 * 0.5) - sinVector[1] * t2381 * 0.5)) -
                 angleVelocityVector[1] * (sinVector[1] * ((((inertiaTensor_2[2]
    + t1165) + t2371) - COMVector_2[2] * t2373) - sinVector[2] *
    ((((((((((((-inertiaTensor_3[5] + t910) + t911) + t912) + t917) + t918) +
           t920) - cosVector[4] * t842) - COMVector_4[0] * t823) - COMVector_3[0]
        * t832) - COMVector_4[2] * t866) - COMVector_3[1] * t916) + sinVector[4]
     * ((((((((t843 + t844) + t850) + t857) + t858) - t913) - t914) - t915) +
        massVector[5] * COMVector_5[1] * t814))) + cosVector[1] *
    ((((((inertiaTensor_2[5] + t1099) + cosVector[2] *
         ((((((((((((-inertiaTensor_3[5] + t910) + t911) + t912) + t917) + t918)
                + t920) + t1130) - cosVector[4] * t842) - COMVector_4[0] * t823)
            - COMVector_3[0] * t832) - COMVector_4[2] * t866) - COMVector_3[1] *
          t916)) - COMVector_2[0] * t832) - COMVector_2[2] * t2374) -
      COMVector_2[2] * t2376) + t414 * t832))) + angleVelocityVector[4] *
    (((((t1833 + t2202) - sinVector[1] * (((t2193 + t2196) - t414 * t1303) -
         sinVector[2] * (t1362 + sinVector[3] * (((((((((t1356 + t1357) + t1358)
    + t1359) - COMVector_5[0] * t1253) - COMVector_4[1] * t1275) - t172 * t1272)
             - t188 * t1275) + COMVector_5[2] * (t1260 - t1276)) -
           inertiaTensor_5[1] * sinVector[3] * sinVector[4]))) * 0.5) - t415 *
       t1303 * 0.5) - cosVector[1] * (t2203 + cosVector[2] * (t1362 + sinVector
        [3] * (((((((((t1356 + t1357) + t1358) + t1359) + t2189) - COMVector_5[0]
                   * t1253) - COMVector_4[1] * t1301) - t172 * t1298) - t188 *
                t1301) - inertiaTensor_5[1] * sinVector[3] * sinVector[4]))) *
      0.5) + cosVector[1] * (((t1827 + t1830) + t2199) - t414 * t1248) * 0.5);
  coriolis[2] = ((((angleVelocityVector[4] * (((((t1833 + t2211) + cosVector[1] *
    (t1827 + t1830) * 0.5) - cosVector[1] * t2225 * 0.5) - sinVector[1] * t2224 *
    0.5) - t415 * (t1865 - t1873) * 0.5) + angleVelocityVector[5] * (((((t1727 +
    t2321) + t2326) + t2328) - cosVector[1] * t2320 * 0.5) - t415 * t1686 * 0.5))
                   - angleVelocityVector[3] * (((((t1823 + t2089) - cosVector[1]
    * t2082 * 0.5) - COMVector_1[0] * t1791 * 0.5) + sinVector[1] * (((t2088 +
    cosVector[2] * t1820) - sinVector[2] * t1813) - t414 * t1791) * 0.5) +
    cosVector[1] * (cosVector[2] * t1813 + sinVector[2] * t1820) * 0.5)) -
                  angleVelocityVector[2] * (cosVector[1] * t2578 + sinVector[1] *
    t1646)) - angleVelocityVector[1] * (((((t1647 + t1649) + t1668) - sinVector
    [1] * (((((-t1165 + t1669) + t1670) + t1671) + t2590) - t414 * t1034) * 0.5)
    - t415 * t1034 * 0.5) + cosVector[1] * (((t1099 + t1665) + t2586) -
    sinVector[2] * t1178) * 0.5)) - angleVelocityVector[0] * (((t1631 + t2570) -
    COMVector_1[0] * t216 * 0.5) + cosVector[1] * (((t641 + t1629) - cosVector[2]
    * t643) - sinVector[2] * t1630) * 0.5);
  coriolis[3] = ((((angleVelocityVector[3] * (((cosVector[1] * t2659 -
    COMVector_1[0] * t2053) + sinVector[1] * t2655) + t415 * t2053) +
                    angleVelocityVector[0] * (((t2070 - t415 * t547 * 0.5) +
    sinVector[1] * (((t2064 + t2069) - COMVector_2[0] * t547) - sinVector[2] *
                    t2068) * 0.5) + cosVector[1] * (t2062 + cosVector[2] * t2068)
    * 0.5)) - angleVelocityVector[1] * (((((t2341 - cosVector[1] * t2343 * 0.5)
    + sinVector[1] * (((cosVector[2] * t2101 + COMVector_2[0] * t1590) -
                       sinVector[2] * t2100) - t414 * t1590) * 0.5) -
    COMVector_1[0] * t1590 * 0.5) + t415 * t1590 * 0.5) + cosVector[1] * (t2636
    + cosVector[2] * t2100) * 0.5)) + angleVelocityVector[5] * (((((((t2233 +
    t2234) + t2243) + t2244) + t2248) - COMVector_1[0] * (t2022 + t2023) * 0.5)
    - COMVector_1[0] * t1996 * 0.5) - cosVector[1] * (cosVector[2] * t2230 -
    sinVector[2] * t2000) * 0.5)) - angleVelocityVector[4] * (((((((t2112 +
    t2116) + t2117) + sinVector[1] * (((t2110 + t2111) - t414 * t1927) -
    cosVector[2] * (((((t1573 - t1784) + t1973) + t1975) - cosVector[4] *
                     ((((((((((t1570 + t1948) + t1949) + t1950) + t1951) + t1953)
    + t1954) - COMVector_5[0] * t1916) - COMVector_5[1] * (t1918 - massVector[5]
    * sinVector[5] * t1900)) - inertiaTensor_6[5] * cosVector[4] * sinVector[5])
                      - massVector[5] * COMVector_6[0] * t1900)) - COMVector_3[0]
                    * t1927)) * 0.5) - COMVector_1[0] * (t1894 + t1895) * 0.5) -
    cosVector[1] * t2124 * 0.5) - COMVector_1[0] * t1927 * 0.5) - sinVector[1] *
    t2122 * 0.5)) - angleVelocityVector[2] * (((((t1823 + t2089) - cosVector[1] *
    t2082 * 0.5) - COMVector_1[0] * t1791 * 0.5) + sinVector[1] * (((t2088 +
    t2649) - sinVector[2] * t2085) - t414 * t1791) * 0.5) + cosVector[1] *
    (t2645 + cosVector[2] * t2085) * 0.5);
  coriolis[4] = ((((t2713 + angleVelocityVector[4] * (((cosVector[1] * t2725 -
    sinVector[1] * t2729) - COMVector_1[0] * sinVector[3] * t2178) + sinVector[3]
    * t415 * t2178)) - angleVelocityVector[1] * (((((-t2202 + t2699) -
    cosVector[1] * (((t2199 + cosVector[2] * t2201) - sinVector[2] * t2198) -
                    t414 * t1248) * 0.5) + sinVector[1] * (((t2193 + t2196) -
    sinVector[2] * t2206) - t414 * t1303) * 0.5) + cosVector[1] * (t2203 +
    cosVector[2] * t2206) * 0.5) + sinVector[1] * (t2210 + sinVector[2] * t2201)
    * 0.5)) - angleVelocityVector[5] * t2271) - angleVelocityVector[2] *
                 (((((-t2211 + t2734) + cosVector[1] * t2225 * 0.5) + t415 *
                    t1872 * 0.5) - cosVector[1] * (cosVector[2] * t2226 -
    sinVector[2] * t2198) * 0.5) + sinVector[1] * (t2210 + sinVector[2] * t2226)
                  * 0.5)) - angleVelocityVector[3] * (((((((t2112 + t2116) +
    t2117) + t2715) - cosVector[1] * t2124 * 0.5) - COMVector_1[0] * t1896 * 0.5)
    - COMVector_1[0] * t1927 * 0.5) - sinVector[1] * t2122 * 0.5);
  coriolis[5] = ((((angleVelocityVector[0] * (((t2282 - COMVector_1[0] * t469 *
    0.5) + t415 * (t453 - cosVector[3] * (((t138 - t146) + t442) - t444)) * 0.5)
    + cosVector[1] * (cosVector[2] * (t479 + t483) + sinVector[2] * (((t472 -
    t2272) - t2273) + t2790)) * 0.5) + angleVelocityVector[5] * (((cosVector[1] *
    t2809 - COMVector_1[0] * t2285) + sinVector[1] * t2806) + t415 * t2285)) -
                   angleVelocityVector[4] * t2271) + angleVelocityVector[1] *
                  (((((t1727 + t2299) + t2302) + t2313) - cosVector[1] * t2308 *
                    0.5) - t415 * t955 * 0.5)) + angleVelocityVector[2] *
                 (((((t1727 + t2321) + t2326) + t2328) - cosVector[1] * t2320 *
                   0.5) - t415 * t1686 * 0.5)) + angleVelocityVector[3] *
    (((((((t2233 + t2234) + t2243) + t2244) + t2248) - COMVector_1[0] * (t2022 +
        t2023) * 0.5) - cosVector[1] * t2631 * 0.5) - COMVector_1[0] * t1996 *
     0.5);
  coriolis[6] = ((((-angleVelocityVector[4] * (((((((t2515 + t2516) + t2517) +
    t2518) - sinVector[1] * t2574 * 0.5) - t214 * t2358 * 0.5) - t414 * t2363 *
    0.5) + cosVector[1] * (((t2572 + COMVector_2[0] * t2209) - sinVector[2] *
    t2198) - t414 * t2209) * 0.5) - angleVelocityVector[5] * (((((((t1727 +
    t2302) + t2557) + t2558) + t2559) - COMVector_3[0] * t2346 * 0.5) -
    COMVector_2[0] * t2353 * 0.5) - sinVector[3] * t482 * 0.5)) +
                   angleVelocityVector[1] * (((((((((((((((t2368 + t2453) +
    t2456) + t2458) - inertiaTensor_2[5] * cosVector[1] * 0.5) -
    inertiaTensor_2[2] * sinVector[1] * 0.5) - inertiaTensor_3[1] * t6 * 0.5) -
    COMVector_3[0] * t684 * 0.5) - COMVector_3[2] * t691 * 0.5) - COMVector_2[1]
    * t1367 * 0.5) + COMVector_2[1] * t1378 * 0.5) - COMVector_2[0] * t1395 *
    0.5) - sinVector[3] * t739 * 0.5) + t414 * t2369 * 0.5) + sinVector[1] *
    ((((inertiaTensor_2[2] + t1165) - t1669) + t2371) - COMVector_2[2] * t2373) *
    0.5) + cosVector[1] * ((((((inertiaTensor_2[5] + t1099) + t1665) -
    COMVector_2[0] * t832) - COMVector_2[2] * t2374) - COMVector_2[2] * t2376) +
    t414 * (t827 - t908)) * 0.5)) - angleVelocityVector[3] * (((((((((-t2341 +
    t2479) + t2481) + t2482) + t2483) + t2484) + cosVector[1] * t2343 * 0.5) -
    COMVector_3[0] * t579 * 0.5) - COMVector_2[0] * t2338 * 0.5) - sinVector[3] *
    t287 * 0.5)) + angleVelocityVector[2] * (((((((((((t1649 + t1668) + t2368) +
    t2454) + t2457) + t2579) - inertiaTensor_3[1] * t6 * 0.5) - COMVector_3[0] *
    t230 * 0.5) - COMVector_3[2] * t334 * 0.5) - COMVector_3[2] * t345 * 0.5) -
    sinVector[3] * t329 * 0.5) - t414 * t2366 * 0.5)) + angleVelocityVector[0] *
    (((((t1394 + t1402) + t2379) + t2386) - COMVector_1[0] * t728 * 0.5) -
     sinVector[1] * t2381 * 0.5);
  coriolis[7] = ((angleVelocityVector[2] * (((((((t2421 + t2423) + t2424) +
    t2425) - COMVector_3[2] * t1168 * 0.5) - COMVector_2[0] * t2388 * 0.5) -
    t214 * t1184 * 0.5) + t414 * t2388 * 0.5) + angleVelocityVector[4] *
                  (((((t2524 + t2528) + COMVector_3[0] * t2413 * 0.5) +
                     COMVector_2[0] * t2525 * 0.5) - t214 * t2413 * 0.5) - t414 *
                   t2525 * 0.5)) - angleVelocityVector[5] * (((((t2541 + t2543)
    + t2544) - t214 * t2400 * 0.5) - t414 * t2406 * 0.5) - cosVector[3] *
    (((((((t850 + t981) + t982) + t983) + t984) - t2304) - t2305) - sinVector[5]
     * t2397) * 0.5)) + angleVelocityVector[3] * (((((((t2469 + t2470) + t2478)
    + cosVector[3] * t891 * 0.5) - cosVector[3] * t2477 * 0.5) - sinVector[3] *
    t2473 * 0.5) - t214 * t1472 * 0.5) - t414 * t2395 * 0.5);
  coriolis[8] = ((((t2595 + angleVelocityVector[4] * (((((((t2519 + t2520) +
    t2522) + t2523) - COMVector_2[0] * t2444 * 0.5) - sinVector[3] * t1883 * 0.5)
    - t214 * t2436 * 0.5) - t414 * t2442 * 0.5)) + angleVelocityVector[3] *
                   t2500) - angleVelocityVector[0] * (((((((((((((t2453 - t2454)
    + t2456) - t2457) + t2458) + t2575) + t2576) + t2577) + t2580) + t2601) -
    cosVector[3] * t2459 * 0.5) - COMVector_3[0] * t684 * 0.5) - COMVector_3[2] *
    t691 * 0.5) - sinVector[3] * t739 * 0.5)) - angleVelocityVector[2] *
                 (COMVector_2[0] * t2420 - t414 * t2420)) + angleVelocityVector
    [5] * (((((((t2551 + t2556) + COMVector_3[0] * t2426 * 0.5) + COMVector_2[0]
               * t2553 * 0.5) - sinVector[3] * t2427 * 0.5) - t214 * t2426 * 0.5)
            - t414 * t2433 * 0.5) - t414 * t2553 * 0.5);
  coriolis[9] = ((((t2665 + angleVelocityVector[3] * (((t1567 - t1785) -
    sinVector[2] * t414 * t1541) + COMVector_2[0] * sinVector[2] * (t1540 -
    t1559))) + angleVelocityVector[5] * (((((((((t2545 + t2547) + t2548) + t2549)
    + t2550) - cosVector[3] * t2035 * 0.5) - sinVector[3] * t1001 * 0.5) - t214 *
    t2486 * 0.5) - t414 * t2492 * 0.5) - sinVector[2] * t414 * t929 * 0.5)) +
                  angleVelocityVector[2] * t2500) - angleVelocityVector[4] *
                 t2507) - angleVelocityVector[0] * ((((((((((((((((t2479 + t2481)
    + t2482) + t2483) + t2484) + t2609) + t2613) + t2638) + t2641) + t2642) -
    COMVector_3[0] * t579 * 0.5) - COMVector_4[2] * t669 * 0.5) - COMVector_4[0]
    * t675 * 0.5) + COMVector_4[2] * t743 * 0.5) - COMVector_2[0] * t2338 * 0.5)
    - sinVector[3] * t287 * 0.5) - inertiaTensor_4[5] * sinVector[3] * t6 * 0.5);
  coriolis[10] = ((((t2745 + angleVelocityVector[2] * (((((((t2519 + t2520) +
    t2522) + t2523) - sinVector[3] * (((((t1157 - t1642) + t1881) + t1882) -
    t2212) - t2213) * 0.5) - t214 * t2436 * 0.5) - t414 * t2442 * 0.5) -
    COMVector_2[0] * (t2443 - t2521) * 0.5)) - angleVelocityVector[0] *
                    ((((((((((((((t2515 + t2516) + t2517) + t2518) + t2616) +
    t2617) + t2700) + t2701) + t2704) - inertiaTensor_5[1] * t10 * 0.5) -
    COMVector_5[2] * t683 * 0.5) - sinVector[5] * t679 * 0.5) - t214 * t2358 *
                       0.5) - t414 * t2363 * 0.5) - massVector[5] * COMVector_5
                     [0] * t662 * 0.5)) - angleVelocityVector[4] * (((((t2618 +
    t2619) + COMVector_2[0] * t2509) - sinVector[3] * t2185) - t214 * t1236) -
    t414 * t2509)) - angleVelocityVector[3] * t2507) + angleVelocityVector[5] *
    t2538;
  coriolis[11] = ((((angleVelocityVector[2] * (((((((t2551 + t2556) + t2602) +
    t2827) - sinVector[3] * t2427 * 0.5) - t214 * t2426 * 0.5) - t414 * t2433 *
    0.5) - t414 * t2553 * 0.5) + angleVelocityVector[4] * t2538) -
                    angleVelocityVector[1] * (((((t2541 + t2543) + t2544) -
    cosVector[3] * t2596 * 0.5) - t214 * t2400 * 0.5) - t414 * t2406 * 0.5)) -
                   angleVelocityVector[0] * ((((((((((t2557 + t2558) + t2559) +
    t2627) + t2628) + t2789) - inertiaTensor_6[2] * t17 * 0.5) - COMVector_3[0] *
    t2346 * 0.5) - COMVector_2[0] * t2353 * 0.5) - sinVector[3] * t482 * 0.5) -
    massVector[5] * COMVector_6[1] * t637 * 0.5)) + angleVelocityVector[3] *
                  (((((((((t2545 + t2547) + t2548) + t2549) + t2550) -
                       sinVector[3] * (((((t998 + t999) + t1000) - t1718) -
    t1719) - t1720) * 0.5) - t414 * (t2488 + t2491) * 0.5) - t214 * (t2485 -
    t2487) * 0.5) - cosVector[3] * (((((((t1554 + t1556) + t2032) + t2033) +
    t2034) - t2235) - t2236) - COMVector_5[2] * (((t1522 + t1523) - t2009) -
    t2010)) * 0.5) - sinVector[2] * t414 * t929 * 0.5)) - angleVelocityVector[5]
    * (((((t2625 + t2626) + COMVector_2[0] * t2564) - sinVector[3] * t2289) -
        t414 * t2564) - COMVector_3[0] * sinVector[4] * t924);
  coriolis[12] = ((((angleVelocityVector[1] * (((((((((((t1647 + t2368) + t2453)
    + t2458) - inertiaTensor_3[1] * t6 * 0.5) + cosVector[3] * t2581 * 0.5) -
    COMVector_3[0] * t684 * 0.5) - COMVector_3[2] * t691 * 0.5) - sinVector[3] *
    t739 * 0.5) - t415 * t1034 * 0.5) - sinVector[1] * (((((t1670 + t1671) +
    t2590) - cosVector[2] * t2589) + sinVector[2] * t2587) - t414 * t1034) * 0.5)
    + cosVector[1] * (((t2586 + cosVector[2] * t2587) - sinVector[2] * t1178) +
                      sinVector[2] * t2589) * 0.5) + angleVelocityVector[0] *
                     (((t1631 + t2570) + cosVector[1] * (((t641 + t1629) - t2571)
    - sinVector[2] * t1630) * 0.5) - COMVector_1[0] * t216 * 0.5)) -
                    angleVelocityVector[5] * (((((t1727 + t2328) + t2557) +
    t2558) - COMVector_3[0] * t2346 * 0.5) - sinVector[3] * t482 * 0.5)) +
                   angleVelocityVector[2] * (((((((((t1649 + t2368) + t2454) -
    t2575) - t2576) - t2577) + t2579) - t2580) - inertiaTensor_3[1] * t6 * 0.5)
    + cosVector[1] * t2578 * 0.5)) + angleVelocityVector[3] * (((((((t2341 -
    t2479) - t2481) + t2608) + t2610) - sinVector[3] * t2612 * 0.5) + cosVector
    [1] * (t2095 - t2342) * 0.5) - t214 * ((t549 + t578) - t589) * 0.5)) -
    angleVelocityVector[4] * (((((t2515 + t2516) + t2518) - sinVector[1] * t2574
    * 0.5) - t214 * t2358 * 0.5) + cosVector[1] * (t2572 - sinVector[2] * t2198)
    * 0.5);
  coriolis[13] = ((((-t2595 + angleVelocityVector[4] * (((((-t2522 + t2524) +
    t2528) + t2597) - t214 * t2413 * 0.5) + COMVector_2[0] * (t2443 - t2521) *
    0.5)) + angleVelocityVector[2] * (((((((t2421 + t2423) + t2424) + t2425) -
    t2598) - t2600) + COMVector_2[0] * t2420 * 0.5) - t414 * t2420 * 0.5)) -
                   angleVelocityVector[5] * (((((t2541 + t2543) + t2556) -
    cosVector[3] * t2596 * 0.5) - t214 * t2400 * 0.5) - t414 * t2433 * 0.5)) +
                  angleVelocityVector[0] * (((((((((((((t2453 - t2454) + t2456)
    - t2457) + t2458) + t2576) + t2577) + t2580) + t2601) - cosVector[3] * t2459
    * 0.5) - COMVector_3[0] * t684 * 0.5) - COMVector_3[2] * t691 * 0.5) -
    sinVector[3] * t739 * 0.5) + COMVector_3[2] * (t209 - t333) * 0.5)) +
    angleVelocityVector[3] * (((((((t2469 + t2470) - t2495) + t2591) + t2592) -
    cosVector[3] * t2477 * 0.5) - sinVector[3] * t2473 * 0.5) - t214 * t1472 *
    0.5);
  coriolis[14] = (angleVelocityVector[3] * t2614 + angleVelocityVector[5] *
                  t2623) + angleVelocityVector[4] * (((t2519 + t2520) -
    sinVector[3] * (((((t1157 - t1642) + t1881) + t1882) - t2212) - t2213) * 0.5)
    - t214 * t2436 * 0.5);
  coriolis[15] = ((((t2674 + angleVelocityVector[3] * t1580) -
                    angleVelocityVector[4] * t2615) + angleVelocityVector[1] *
                   (((((((((((t2469 + t2470) + t2592) + t2660) + t2662) + t2663)
    - cosVector[4] * t1129 * 0.5) - cosVector[3] * t2477 * 0.5) - COMVector_4[0]
                       * t1103 * 0.5) - COMVector_4[2] * t1128 * 0.5) -
                     sinVector[3] * t2473 * 0.5) - t214 * t1472 * 0.5)) -
                  angleVelocityVector[0] * ((((((((((((((t2479 + t2481) + t2484)
    - t2608) + t2609) - t2610) + t2613) + t2643) + t2644) + t2647) + t2648) +
    t2667) - COMVector_4[2] * t208 * 0.5) - COMVector_4[0] * t211 * 0.5) -
    inertiaTensor_4[5] * sinVector[3] * t6 * 0.5)) + angleVelocityVector[5] *
    (((((t2545 + t2548) + t2549) - sinVector[3] * (((((t998 + t999) + t1000) -
          t1718) - t1719) - t1720) * 0.5) - t214 * (t2485 - t2487) * 0.5) -
     cosVector[3] * (((((((t1554 + t1556) + t2032) + t2033) + t2034) - t2235) -
                      t2236) - COMVector_5[2] * (((t1522 + t1523) - t2009) -
       t2010)) * 0.5);
  coriolis[16] = ((((-angleVelocityVector[3] * t2615 + angleVelocityVector[5] *
                     t2624) + angleVelocityVector[2] * (((t2519 + t2520) -
    sinVector[3] * (((((t1157 - t1642) + t1881) + t1882) - t2212) - t2213) * 0.5)
    - t214 * t2436 * 0.5)) + angleVelocityVector[1] * (((((((((t2524 + t2528) +
    t2597) + t2740) + t2741) + t2742) - COMVector_5[2] * t1108 * 0.5) -
    sinVector[5] * t1113 * 0.5) - t214 * t2413 * 0.5) - massVector[5] *
    COMVector_5[0] * t1011 * 0.5)) - angleVelocityVector[0] * ((((((((((((t2515
    + t2516) + t2518) + t2616) + t2617) + t2730) + t2731) + t2735) -
    inertiaTensor_5[1] * t10 * 0.5) - COMVector_5[2] * t235 * 0.5) - sinVector[5]
    * t234 * 0.5) - t214 * t2358 * 0.5) - massVector[5] * COMVector_5[0] * t201 *
    0.5)) - angleVelocityVector[4] * (((t2618 + t2619) - sinVector[3] * t2185) -
    t214 * t1236);
  coriolis[17] = ((((t2839 - angleVelocityVector[5] * (((t2625 + t2626) -
    sinVector[3] * t2289) - COMVector_3[0] * sinVector[4] * t924)) +
                    angleVelocityVector[4] * t2624) - angleVelocityVector[1] *
                   (((((t2541 + t2543) + t2828) + t2829) - cosVector[3] * t2596 *
                     0.5) - t214 * t2400 * 0.5)) - angleVelocityVector[0] *
                  ((((((((t2557 + t2558) + t2627) + t2628) + t2802) -
                      inertiaTensor_6[2] * t17 * 0.5) - COMVector_3[0] * t2346 *
                     0.5) - sinVector[3] * t482 * 0.5) - massVector[5] *
                   COMVector_6[1] * t33 * 0.5)) + angleVelocityVector[3] *
    (((((t2545 + t2548) + t2549) - sinVector[3] * (((((t998 + t999) + t1000) -
          t1718) - t1719) - t1720) * 0.5) - t214 * (t2485 - t2487) * 0.5) -
     cosVector[3] * (((((((t1554 + t1556) + t2032) + t2033) + t2034) - t2235) -
                      t2236) - COMVector_5[2] * (((t1522 + t1523) - t2009) -
       t2010)) * 0.5);
  coriolis[18] = ((((angleVelocityVector[4] * (((((((t2112 + t2116) + t2683) +
    t2684) - COMVector_1[0] * (t1894 + t1895) * 0.5) - cosVector[4] * t398 * 0.5)
    - sinVector[4] * t196 * 0.5) - sinVector[1] * (((t2102 + t2104) - t2650) +
    cosVector[2] * (t2103 - COMVector_3[0] * (t1894 + t1895))) * 0.5) -
                     angleVelocityVector[5] * (((((t2233 + t2244) + t2698) -
    cosVector[4] * t464 * 0.5) - cosVector[1] * t2631 * 0.5) - COMVector_1[0] *
    t1996 * 0.5)) + angleVelocityVector[2] * ((((((((((((t2609 + t2613) + t2643)
    + t2644) + t2647) + t2648) - COMVector_4[2] * t208 * 0.5) - COMVector_4[0] *
    t211 * 0.5) - COMVector_1[0] * t1791 * 0.5) + cosVector[1] * (t2645 +
    cosVector[2] * (((t1800 + t1810) - t2081) - t2646)) * 0.5) + t415 * (((t1091
    + t1092) - t1814) - t1815) * 0.5) + sinVector[1] * (((t2649 - sinVector[2] *
    t2085) - t414 * t1791) + COMVector_2[0] * (((t1091 + t1092) - t1814) - t1815))
    * 0.5) - inertiaTensor_4[5] * sinVector[3] * t6 * 0.5)) -
                   angleVelocityVector[0] * (((t2070 - t415 * t547 * 0.5) +
    sinVector[1] * (((t2064 + t2069) - COMVector_2[0] * t547) - sinVector[2] *
                    t2651) * 0.5) + cosVector[1] * (t2062 + cosVector[2] * t2651)
    * 0.5)) + angleVelocityVector[1] * ((((((((((((t2609 + t2613) + t2638) +
    t2641) + t2642) + t2666) - COMVector_4[2] * t669 * 0.5) - COMVector_4[0] *
    t675 * 0.5) - COMVector_1[0] * t1590 * 0.5) + t415 * (((t829 + t830) - t1493)
    - t1603) * 0.5) + cosVector[1] * (t2636 - cosVector[2] * t2640) * 0.5) +
    sinVector[1] * (((sinVector[2] * t2640 - t414 * t1590) + cosVector[2] *
                     (((((((((t1587 + t1591) + t1601) + t1602) - t2072) + t2090)
    - t2632) - t2633) - t2634) - t214 * (((t829 + t830) - t1493) - t1603))) +
                    COMVector_2[0] * (((t829 + t830) - t1493) - t1603)) * 0.5) -
    inertiaTensor_4[5] * sinVector[3] * t6 * 0.5)) - angleVelocityVector[3] *
    (((((((((((cosVector[4] * t575 * 0.5 + cosVector[1] * t2659 * 0.5) +
              COMVector_4[0] * t535 * 0.5) + COMVector_4[2] * t539 * 0.5) -
            COMVector_4[0] * t542 * 0.5) - COMVector_4[2] * t548 * 0.5) -
          COMVector_1[0] * t2053 * 0.5) - sinVector[4] * t588 * 0.5) +
        sinVector[1] * t2655 * 0.5) + t415 * t2053 * 0.5) - inertiaTensor_4[5] *
      cosVector[3] * t3 * 0.5) - inertiaTensor_4[1] * sinVector[3] * t3 * 0.5);
  coriolis[19] = ((((-t2665 - angleVelocityVector[4] * (((((((-t2505 - t2506) +
    t2606) + t2668) + t2686) + t2687) + t2688) - cosVector[4] * t1320 * 0.5)) -
                    angleVelocityVector[2] * (((((((((((((t2493 + t2494) + t2498)
    + t2499) - t2603) - t2604) - t2605) + t2660) - t2661) + t2662) + t2663) -
    cosVector[4] * t1129 * 0.5) - COMVector_4[0] * t1103 * 0.5) - COMVector_4[2]
    * t1128 * 0.5)) - angleVelocityVector[3] * (((((((((((t2675 + t2676) -
    inertiaTensor_4[5] * sinVector[3] * 0.5) - cosVector[3] * t1579 * 0.5) -
    cosVector[4] * t1616 * 0.5) + COMVector_4[0] * t1445 * 0.5) - COMVector_4[0]
    * t1454 * 0.5) + COMVector_4[2] * t1491 * 0.5) - COMVector_4[2] * t1589 *
    0.5) + sinVector[4] * t1481 * 0.5) + COMVector_2[0] * sinVector[2] * t1541 *
    0.5) - sinVector[2] * t414 * t1541 * 0.5)) + angleVelocityVector[5] *
                  (((((-t2549 - t2550) + t2673) + t2689) + sinVector[4] *
                    (((((t900 + t970) - t975) - t976) - t977) + t2398) * 0.5) +
                   sinVector[2] * t414 * t929 * 0.5)) + angleVelocityVector[0] *
    ((((((((((((((((t2479 + t2481) - t2608) + t2609) - t2610) + t2613) + t2638)
              + t2641) + t2642) + t2666) + t2667) + t2669) + t414 * (t2334 +
          t2337) * 0.5) - COMVector_4[2] * t669 * 0.5) - COMVector_4[0] * t675 *
       0.5) - COMVector_2[0] * t2338 * 0.5) - inertiaTensor_4[5] * sinVector[3] *
     t6 * 0.5);
  coriolis[20] = ((((-t2674 - angleVelocityVector[1] * (((((((((((t2469 + t2470)
    + t2592) + t2660) + t2662) + t2663) - t2670) - t2671) - t2672) - cosVector[4]
    * t1129 * 0.5) - COMVector_4[0] * t1103 * 0.5) - COMVector_4[2] * t1128 *
    0.5)) + angleVelocityVector[0] * ((((((((((((((t2479 + t2481) - t2608) +
    t2609) - t2610) + t2613) + t2643) + t2644) + t2647) + t2648) + t2667) +
    t2669) - COMVector_4[2] * t208 * 0.5) - COMVector_4[0] * t211 * 0.5) -
    inertiaTensor_4[5] * sinVector[3] * t6 * 0.5)) + angleVelocityVector[5] *
                   (((-t2549 + t2673) + t2691) + sinVector[4] * (((((t1134 +
    t1136) + t1692) - t1698) - t1699) - t1700) * 0.5)) - angleVelocityVector[3] *
                  (((((((((t2675 + t2676) - inertiaTensor_4[5] * sinVector[3] *
    0.5) - cosVector[3] * t1579 * 0.5) - cosVector[4] * t1779 * 0.5) -
                       COMVector_4[2] * t1748 * 0.5) + COMVector_4[0] * t1752 *
                      0.5) - COMVector_4[0] * t1756 * 0.5) + COMVector_4[2] *
                    t1777 * 0.5) + sinVector[4] * t1769 * 0.5)) -
    angleVelocityVector[4] * (((((-t2505 + t2606) + t2677) + t2678) + t2679) -
    cosVector[4] * t1864 * 0.5);
  coriolis[21] = angleVelocityVector[4] * t2682 + angleVelocityVector[5] * t2695;
  coriolis[22] = ((((t2761 + t2763) + angleVelocityVector[5] * (((t2696 + t2697)
    - sinVector[4] * t938 * 0.5) - cosVector[4] * (((t939 + t941) - t995) - t996)
    * 0.5)) - angleVelocityVector[4] * (t1324 + t1960)) - angleVelocityVector[1]
                  * ((((((((((((-t2685 + t2686) + t2687) + t2688) + t2736) +
    t2737) + t2738) + t2739) - cosVector[4] * t1320 * 0.5) - cosVector[5] *
                        t1460 * 0.5) - sinVector[5] * t1465 * 0.5) - t172 *
                      t1439 * 0.5) - massVector[5] * COMVector_5[0] * t1430 *
                     0.5)) + angleVelocityVector[2] * ((((((((((((-t2677 - t2678)
    - t2679) + t2685) + t2750) + t2751) + t2752) + t2753) + t2754) + t2758) -
    COMVector_5[2] * t1772 * 0.5) - inertiaTensor_5[1] * cosVector[3] *
    cosVector[4] * 0.5) - inertiaTensor_5[5] * cosVector[3] * sinVector[4] * 0.5);
  coriolis[23] = ((((t2859 + angleVelocityVector[4] * (((t2696 + t2697) -
    sinVector[4] * t938 * 0.5) - cosVector[4] * (((t939 + t941) - t995) - t996) *
    0.5)) + angleVelocityVector[1] * ((((((t2689 + t2692) + t2693) + t2849) -
    inertiaTensor_6[8] * cosVector[3] * sinVector[4] * 0.5) - massVector[5] *
    COMVector_6[0] * t1419 * 0.5) - massVector[5] * COMVector_6[1] * t1425 * 0.5))
                   + angleVelocityVector[2] * ((((((t2691 + t2692) + t2693) +
    t2852) - inertiaTensor_6[8] * cosVector[3] * sinVector[4] * 0.5) -
    massVector[5] * COMVector_6[0] * t1733 * 0.5) - massVector[5] * COMVector_6
    [1] * t1736 * 0.5)) + angleVelocityVector[0] * ((((((-t2698 + t2810) + t2811)
    + t2814) + t2815) + t2860) - massVector[5] * COMVector_6[0] * t511 * 0.5)) +
    angleVelocityVector[5] * sinVector[4] * t2286;
  coriolis[24] = ((((-t2713 + angleVelocityVector[1] * ((((((((((((-t2202 +
    t2616) + t2617) + t2699) + t2700) + t2701) + t2704) - inertiaTensor_5[1] *
    t10 * 0.5) - COMVector_5[2] * t683 * 0.5) - sinVector[5] * t679 * 0.5) +
    sinVector[1] * (((t2193 + cosVector[2] * t2702) - sinVector[2] * t2703) -
                    t414 * t1303) * 0.5) + cosVector[1] * (cosVector[2] * t2703
    + sinVector[2] * t2702) * 0.5) - massVector[5] * COMVector_5[0] * t662 * 0.5))
                    - angleVelocityVector[4] * (((((((((((inertiaTensor_5[1] *
    t81 * 0.5 + inertiaTensor_5[5] * t83 * 0.5) - cosVector[5] * t389 * 0.5) +
    cosVector[1] * t2725 * 0.5) - COMVector_5[0] * t378 * 0.5) - COMVector_5[2] *
    t391 * 0.5) + sinVector[5] * t385 * 0.5) - sinVector[1] * t2729 * 0.5) +
    t172 * t375 * 0.5) + massVector[5] * COMVector_5[0] * t370 * 0.5) -
    COMVector_1[0] * sinVector[3] * t2178 * 0.5) + sinVector[3] * t415 * t2178 *
    0.5)) - angleVelocityVector[3] * ((((((((((((-t2117 - t2715) + t2716) +
    t2717) + t2718) + t2719) + t2720) + t2721) + t2722) + cosVector[1] * t2124 *
    0.5) + COMVector_1[0] * t1927 * 0.5) - t172 * t512 * 0.5) - massVector[5] *
    COMVector_5[0] * t523 * 0.5)) + angleVelocityVector[5] * (((((((((t2268 -
    t2707) + t2778) + t2781) + t2782) + cosVector[1] * (t2261 + sinVector[2] *
    (((t1002 + t2157) - t2250) + cosVector[4] * (((t939 + t941) - t995) - t996)))
    * 0.5) - cosVector[5] * t169 * 0.5) - sinVector[5] * t165 * 0.5) - t172 *
    t446 * 0.5) + sinVector[1] * (((t2251 + t2252) - t2705) - t2706) * 0.5)) +
    angleVelocityVector[2] * ((((((((((((-t2211 + t2616) + t2617) + t2730) +
    t2731) + t2734) + t2735) + cosVector[1] * (t2218 + t2221) * 0.5) -
    inertiaTensor_5[1] * t10 * 0.5) - COMVector_5[2] * t235 * 0.5) - sinVector[5]
    * t234 * 0.5) + t415 * (t1865 - t1873) * 0.5) - massVector[5] * COMVector_5
    [0] * t201 * 0.5);
  coriolis[25] = ((((-t2745 + angleVelocityVector[4] * (((((((((((((t2755 +
    t2756) + t2757) + cosVector[5] * t1296 * 0.5) - COMVector_5[0] * t1253 * 0.5)
    + COMVector_5[2] * t1319 * 0.5) + sinVector[5] * t1292 * 0.5) - sinVector[3]
    * t2185 * 0.5) - t214 * t1236 * 0.5) - t172 * t1298 * 0.5) - t414 * t2509 *
    0.5) + COMVector_2[0] * (t2508 - t2746) * 0.5) - inertiaTensor_5[1] *
    sinVector[3] * sinVector[4] * 0.5) + massVector[5] * COMVector_5[0] * t1249 *
    0.5)) - angleVelocityVector[5] * (((((((((((t2530 + t2533) + t2535) + t2536)
    - t2621) - t2747) + t2770) + t2771) + t2772) - cosVector[5] * t849 * 0.5) -
    sinVector[5] * t966 * 0.5) - t172 * t947 * 0.5)) + angleVelocityVector[0] *
                   ((((((((((((((t2515 + t2516) + t2616) + t2617) + t2700) +
    t2701) + t2704) + t2748) + COMVector_2[0] * (t2359 + t2362) * 0.5) -
    inertiaTensor_5[1] * t10 * 0.5) - COMVector_5[2] * t683 * 0.5) - sinVector[5]
                       * t679 * 0.5) - t214 * t2358 * 0.5) - t414 * t2363 * 0.5)
                    - massVector[5] * COMVector_5[0] * t662 * 0.5)) +
                  angleVelocityVector[3] * ((((((((((((((t2501 + t2502) + t2503)
    + t2504) - t2685) + t2736) + t2737) + t2738) + t2739) - COMVector_2[0] *
    (t2463 + t2467) * 0.5) - cosVector[5] * t1460 * 0.5) - sinVector[5] * t1465 *
    0.5) - t172 * t1439 * 0.5) - COMVector_3[0] * (((t1515 + t1516) - t2461) -
    t2462) * 0.5) - massVector[5] * COMVector_5[0] * t1430 * 0.5)) -
    angleVelocityVector[2] * (((((((((((t2519 + t2520) + t2523) + t2740) + t2741)
    + t2742) - COMVector_5[2] * t1108 * 0.5) - sinVector[5] * t1113 * 0.5) -
    sinVector[3] * t1883 * 0.5) - t214 * t2436 * 0.5) - t414 * t2442 * 0.5) -
    massVector[5] * COMVector_5[0] * t1011 * 0.5);
  coriolis[26] = ((((angleVelocityVector[0] * ((((((((((((t2515 + t2516) + t2616)
    + t2617) + t2730) + t2731) + t2735) + t2748) - inertiaTensor_5[1] * t10 *
    0.5) - COMVector_5[2] * t235 * 0.5) - sinVector[5] * t234 * 0.5) - t214 *
    t2358 * 0.5) - massVector[5] * COMVector_5[0] * t201 * 0.5) -
                     angleVelocityVector[5] * (((((((((t2530 + t2535) + t2536) -
    t2621) + t2767) + t2768) + t2769) - cosVector[5] * t1064 * 0.5) - sinVector
    [5] * t1688 * 0.5) - t172 * t1681 * 0.5)) - angleVelocityVector[2] *
                    (((t2519 + t2520) - sinVector[3] * t1883 * 0.5) - t214 *
                     t2436 * 0.5)) + angleVelocityVector[4] * (((((((((((t2755 +
    t2756) + t2757) + cosVector[5] * t1860 * 0.5) - COMVector_5[0] * t1850 * 0.5)
    + COMVector_5[2] * t1853 * 0.5) + sinVector[5] * t1858 * 0.5) - sinVector[3]
    * t2185 * 0.5) - t214 * t1236 * 0.5) - t172 * t1845 * 0.5) -
    inertiaTensor_5[1] * sinVector[3] * sinVector[4] * 0.5) + massVector[5] *
    COMVector_5[0] * t1846 * 0.5)) - angleVelocityVector[3] * ((((((((((((-t2501
    - t2502) - t2504) + t2607) + t2685) - t2738) - t2739) + t2750) + t2751) +
    t2752) + t2753) + t2754) - COMVector_5[2] * t1772 * 0.5)) -
    angleVelocityVector[1] * (((((((((t2524 + t2528) + t2597) + t2740) + t2741)
    + t2742) - t2749) - COMVector_5[2] * t1108 * 0.5) - sinVector[5] * t1113 *
    0.5) - massVector[5] * COMVector_5[0] * t1011 * 0.5);
  coriolis[27] = ((((-t2761 - t2763) + angleVelocityVector[5] * (((((((t2775 +
    t2776) + t2777) - cosVector[5] * t1528 * 0.5) + sinVector[4] * t938 * 0.5) -
    sinVector[5] * t1533 * 0.5) - t172 * t2003 * 0.5) + cosVector[4] * (((t939 +
    t941) - t995) - t996) * 0.5)) - angleVelocityVector[2] * ((((((((((((-t2677
    - t2678) - t2679) + t2685) - t2738) - t2739) + t2750) + t2751) + t2752) +
    t2753) + t2754) + t2758) - COMVector_5[2] * t1772 * 0.5)) -
                  angleVelocityVector[4] * (((((((((inertiaTensor_5[1] *
    cosVector[4] * 0.5 + inertiaTensor_5[5] * sinVector[4] * 0.5) - cosVector[5]
    * t1938 * 0.5) - cosVector[4] * t1959 * 0.5) - COMVector_5[0] * t1922 * 0.5)
    + COMVector_5[2] * t1952 * 0.5) - sinVector[4] * t1240 * 0.5) + sinVector[5]
    * t1934 * 0.5) - t172 * t1920 * 0.5) + massVector[5] * COMVector_5[0] *
    t1903 * 0.5)) + angleVelocityVector[1] * ((((((((((((-t2685 + t2686) + t2687)
    + t2688) + t2736) + t2737) + t2738) + t2739) - cosVector[4] * t1320 * 0.5) -
    cosVector[5] * t1460 * 0.5) - sinVector[5] * t1465 * 0.5) - t172 * t1439 *
    0.5) - massVector[5] * COMVector_5[0] * t1430 * 0.5);
  coriolis[28] = angleVelocityVector[5] * t2766;
  coriolis[29] = ((((t2863 + t2867) + t2869) - angleVelocityVector[2] * t2864) -
                  angleVelocityVector[1] * ((((((((((t2770 + t2771) + t2772) +
    t2773) + t2774) + t2831) - cosVector[5] * t849 * 0.5) - sinVector[5] * t966 *
    0.5) - t172 * t947 * 0.5) - massVector[5] * COMVector_6[1] * t1279 * 0.5) -
    inertiaTensor_6[2] * cosVector[5] * sinVector[3] * sinVector[4] * 0.5)) +
    angleVelocityVector[5] * (((t939 + t941) - t995) - t996);
  coriolis[30] = ((((-angleVelocityVector[3] * ((((((((t2234 + t2243) + t2248) +
    t2810) + t2811) + t2814) + t2815) - COMVector_1[0] * t2024 * 0.5) -
    massVector[5] * COMVector_6[0] * t511 * 0.5) - angleVelocityVector[4] *
                     ((((((((-t2267 - t2269) + t2817) + t2819) + t2820) + t2821)
                        + t2822) - inertiaTensor_6[5] * sinVector[5] * t81 * 0.5)
                      - massVector[5] * COMVector_6[0] * t352 * 0.5)) +
                    angleVelocityVector[2] * ((((((((-t2321 - t2326) + t2627) +
    t2628) + t2802) - inertiaTensor_6[2] * t17 * 0.5) + cosVector[1] * t2320 *
    0.5) + t415 * t1686 * 0.5) - massVector[5] * COMVector_6[1] * t33 * 0.5)) +
                   angleVelocityVector[0] * (((COMVector_1[0] * t2792 * 0.5 -
    t415 * (t453 - t2791) * 0.5) - cosVector[1] * (cosVector[2] * (t2796 + t2799)
    + sinVector[2] * (((t472 - sinVector[4] * t2794) - t214 * t2792) +
                      COMVector_3[0] * (t453 - t2791))) * 0.5) + sinVector[1] *
    (((sinVector[2] * (t2796 + t2799) - cosVector[2] * (((t472 - t2272) + t2790)
    - sinVector[4] * t2794)) - COMVector_2[0] * t2792) + t414 * t2792) * 0.5)) -
                  angleVelocityVector[5] * (((((((inertiaTensor_6[2] * t86 *
    -0.5 - inertiaTensor_6[5] * t93 * 0.5) + cosVector[1] * t2809 * 0.5) -
    COMVector_1[0] * t2285 * 0.5) + sinVector[1] * t2806 * 0.5) + t415 * t2285 *
    0.5) + massVector[5] * COMVector_6[0] * t439 * 0.5) + massVector[5] *
    COMVector_6[1] * t438 * 0.5)) + angleVelocityVector[1] * ((((((((-t2299 +
    t2627) + t2628) + t2789) - inertiaTensor_6[2] * t17 * 0.5) + t415 * t955 *
    0.5) + cosVector[1] * (cosVector[2] * t2788 - sinVector[2] * t2785) * 0.5) -
    sinVector[1] * (((t2311 - t2783) + cosVector[2] * t2785) + sinVector[2] *
                    t2788) * 0.5) - massVector[5] * COMVector_6[1] * t637 * 0.5);
  coriolis[31] = ((((angleVelocityVector[0] * ((((((((((t2558 + t2559) + t2627)
    + t2628) + t2789) + t2843) - COMVector_3[0] * (t2344 + t2345) * 0.5) -
    COMVector_2[0] * (t2348 + t2352) * 0.5) - inertiaTensor_6[2] * t17 * 0.5) -
    sinVector[3] * t2847 * 0.5) - massVector[5] * COMVector_6[1] * t637 * 0.5) +
                     angleVelocityVector[5] * (((((((((t2833 + t2834) + t2835) -
    inertiaTensor_6[5] * t764 * 0.5) + COMVector_2[0] * t2564 * 0.5) -
    sinVector[3] * t2289 * 0.5) - t414 * t2564 * 0.5) - massVector[5] *
    COMVector_6[0] * t922 * 0.5) + massVector[5] * COMVector_6[1] * t921 * 0.5)
    - COMVector_3[0] * sinVector[4] * t924 * 0.5)) + angleVelocityVector[3] *
                    ((((((((((-t2545 - t2547) - t2548) - t2692) - t2693) + t2840)
    + t2841) + t2842) + t2850) + t2851) + t414 * (t2488 + t2491) * 0.5)) +
                   angleVelocityVector[2] * (((((((-t2551 - t2602) + t2825) +
    t2826) - t2827) + t2828) + t2829) + t414 * t2553 * 0.5)) +
                  angleVelocityVector[1] * (((((t2543 + t2838) + COMVector_2[0] *
    (t2404 + t2405) * 0.5) - cosVector[3] * t2596 * 0.5) - t214 * t2400 * 0.5) -
    t414 * t2406 * 0.5)) + angleVelocityVector[4] * ((((((((((-t2531 - t2534) -
    t2537) + t2620) + t2622) + t2773) + t2774) + t2830) + t2831) - massVector[5]
    * COMVector_6[1] * t1279 * 0.5) - inertiaTensor_6[2] * cosVector[5] *
    sinVector[3] * sinVector[4] * 0.5);
  coriolis[32] = ((((-t2839 + angleVelocityVector[1] * (((((t2543 + t2828) +
    t2829) + t2838) - cosVector[3] * t2596 * 0.5) - t214 * t2400 * 0.5)) +
                    angleVelocityVector[0] * ((((((((t2558 + t2627) + t2628) +
    t2802) + t2843) - COMVector_3[0] * (t2344 + t2345) * 0.5) - inertiaTensor_6
    [2] * t17 * 0.5) - sinVector[3] * t2847 * 0.5) - massVector[5] *
    COMVector_6[1] * t33 * 0.5)) + angleVelocityVector[4] * ((((((((-t2531 -
    t2537) + t2620) + t2622) + t2773) + t2774) + t2848) - massVector[5] *
    COMVector_6[1] * t1837 * 0.5) - inertiaTensor_6[2] * cosVector[5] *
    sinVector[3] * sinVector[4] * 0.5)) + angleVelocityVector[3] *
                  ((((((((-t2545 - t2548) - t2692) - t2693) + t2840) + t2841) +
                     t2842) + t2853) + t2854)) + angleVelocityVector[5] *
    (((((((t2833 + t2834) + t2835) - inertiaTensor_6[5] * t764 * 0.5) -
        sinVector[3] * t2289 * 0.5) - massVector[5] * COMVector_6[0] * t1675 *
       0.5) + massVector[5] * COMVector_6[1] * t1676 * 0.5) - COMVector_3[0] *
     sinVector[4] * t924 * 0.5);
  coriolis[33] = ((((-t2859 - angleVelocityVector[0] * ((((((t2810 + t2811) +
    t2814) + t2815) + t2860) - sinVector[4] * t2845 * 0.5) - massVector[5] *
    COMVector_6[0] * t511 * 0.5)) - angleVelocityVector[1] * ((((((t2689 + t2692)
    + t2693) - t2842) + t2849) - t2850) - t2851)) - angleVelocityVector[2] *
                   ((((((t2691 + t2692) + t2693) - t2842) + t2852) - t2853) -
                    t2854)) - angleVelocityVector[4] * ((((((t2696 + t2697) +
    t2855) + t2856) + t2857) - inertiaTensor_6[5] * cosVector[4] * sinVector[5] *
    0.5) - massVector[5] * COMVector_6[0] * t1900 * 0.5)) - angleVelocityVector
    [5] * ((((sinVector[4] * t2286 * 0.5 - inertiaTensor_6[5] * cosVector[5] *
              sinVector[4] * 0.5) - inertiaTensor_6[2] * sinVector[4] *
             sinVector[5] * 0.5) + massVector[5] * COMVector_6[0] * t1998 * 0.5)
           + massVector[5] * COMVector_6[1] * t1997 * 0.5);
  coriolis[34] = ((((-t2863 - t2867) - t2869) + angleVelocityVector[1] *
                   ((((((((((t2770 + t2771) + t2772) + t2773) + t2774) + t2831)
                        - t2865) - cosVector[5] * t849 * 0.5) - sinVector[5] *
                      t966 * 0.5) - t172 * t947 * 0.5) - massVector[5] *
                    COMVector_6[1] * t1279 * 0.5)) + angleVelocityVector[2] *
                  t2864) + angleVelocityVector[5] * (((((((inertiaTensor_6[2] *
    cosVector[5] * 0.5 - inertiaTensor_6[5] * sinVector[5] * 0.5) - cosVector[5]
    * t933 * 0.5) - COMVector_5[2] * t924 * 0.5) + sinVector[5] * t932 * 0.5) +
    t172 * t924 * 0.5) - massVector[5] * COMVector_6[0] * t1207 * 0.5) +
    massVector[5] * COMVector_6[1] * t1212 * 0.5);
  coriolis[35] = 0.0;
}

//
// File trailer for coriolisMatrix.cpp
//
// [EOF]
//
