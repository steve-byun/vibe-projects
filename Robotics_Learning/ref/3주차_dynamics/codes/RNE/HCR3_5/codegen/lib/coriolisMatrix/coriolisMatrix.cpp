//
// File: coriolisMatrix.cpp
//
// MATLAB Coder version            : 3.1
// C/C++ source code generated on  : 05-Aug-2016 00:55:52
//

// Include Files
#include "rt_nonfinite.h"
#include "coriolisMatrix.h"

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
//                double coriolis[36]
// Return Type  : void
//
void coriolisMatrix(const double lengthVector[6], const double massVector[6],
                    double, const double [9], const double inertiaTensor_2[9],
                    const double inertiaTensor_3[9], const double
                    inertiaTensor_4[9], const double inertiaTensor_5[9], const
                    double inertiaTensor_6[9], const double [3], const double
                    COMVector_2[3], const double COMVector_3[3], const double
                    COMVector_4[3], const double COMVector_5[3], const double
                    COMVector_6[3], const double [6], const double
                    angleVelocityVector[6], const double [6], const double
                    sinVector[6], const double cosVector[6], const double [4],
                    double coriolis[36])
{
  double t4;
  double t6;
  double t9;
  double t13;
  double t15;
  double t18;
  double t19;
  double t20;
  double t21;
  double t22;
  double t23;
  double t27;
  double t24;
  double t25;
  double t26;
  double t28;
  double t29;
  double t31;
  double t32;
  double t33;
  double t35;
  double t36;
  double t49;
  double t38;
  double t40;
  double t41;
  double t63;
  double t42;
  double t43;
  double t46;
  double t47;
  double t48;
  double t50;
  double t51;
  double t54;
  double t53;
  double t56;
  double t57;
  double t58;
  double t59;
  double t65;
  double t68;
  double t72;
  double t76;
  double t77;
  double t79;
  double t82;
  double t90;
  double t95;
  double t96;
  double t99;
  double t101;
  double t104;
  double t113;
  double t106;
  double t118;
  double t120;
  double t122;
  double t141;
  double t127;
  double t129;
  double t132;
  double t133;
  double t134;
  double t138;
  double t139;
  double t140;
  double t142;
  double t145;
  double t146;
  double t148;
  double t152;
  double t177;
  double t149;
  double t151;
  double t153;
  double t154;
  double t155;
  double t157;
  double t160;
  double t161;
  double t181;
  double t164;
  double t165;
  double t167;
  double t176;
  double t168;
  double t169;
  double t170;
  double t171;
  double t182;
  double t183;
  double t173;
  double t174;
  double t175;
  double t180;
  double t184;
  double t185;
  double t186;
  double t187;
  double t188;
  double t189;
  double t193;
  double t194;
  double t234;
  double t196;
  double t222;
  double t197;
  double t210;
  double t198;
  double t199;
  double t200;
  double t202;
  double t203;
  double t204;
  double t205;
  double t208;
  double t209;
  double t212;
  double t218;
  double t213;
  double t216;
  double t217;
  double t219;
  double t220;
  double t221;
  double t223;
  double t224;
  double t225;
  double t226;
  double t227;
  double t228;
  double t229;
  double t230;
  double t231;
  double t232;
  double t233;
  double t236;
  double t237;
  double t238;
  double t239;
  double t240;
  double t241;
  double t242;
  double t243;
  double t244;
  double t248;
  double t249;
  double t315;
  double t250;
  double t251;
  double t252;
  double t253;
  double t254;
  double t255;
  double t256;
  double t318;
  double t319;
  double t320;
  double t258;
  double t316;
  double t317;
  double t321;
  double t260;
  double t263;
  double t272;
  double t296;
  double t279;
  double t286;
  double t287;
  double t289;
  double t291;
  double t307;
  double t308;
  double t309;
  double t310;
  double t311;
  double t293;
  double t294;
  double t306;
  double t328;
  double t330;
  double t331;
  double t332;
  double t333;
  double t334;
  double t335;
  double t337;
  double t341;
  double t342;
  double t346;
  double t360;
  double t347;
  double t350;
  double t354;
  double t355;
  double t358;
  double t359;
  double t363;
  double t364;
  double t371;
  double t375;
  double t376;
  double t378;
  double t386;
  double t389;
  double t390;
  double t391;
  double t392;
  double t393;
  double t394;
  double t413;
  double t414;
  double t415;
  double t396;
  double t399;
  double t407;
  double t424;
  double t426;
  double t427;
  double t428;
  double t429;
  double t430;
  double t432;
  double t436;
  double t437;
  double t439;
  double t440;
  double t441;
  double t442;
  double t443;
  double t445;
  double t451;
  double t446;
  double t447;
  double t448;
  double t452;
  double t450;
  double t454;
  double t459;
  double t455;
  double t456;
  double t457;
  double t458;
  double t460;
  double t461;
  double t463;
  double t465;
  double t468;
  double t469;
  double t470;
  double t471;
  double t472;
  double t475;
  double t476;
  double t478;
  double t508;
  double t509;
  double t510;
  double t479;
  double t483;
  double t485;
  double t486;
  double t487;
  double t488;
  double t489;
  double t490;
  double t491;
  double t492;
  double t493;
  double t494;
  double t497;
  double t498;
  double t499;
  double t500;
  double t501;
  double t502;
  double t503;
  double t504;
  double t505;
  double t515;
  double t516;
  double t517;
  double t519;
  double t520;
  double t521;
  double t523;
  double t522;
  double t524;
  double t528;
  double t529;
  double t533;
  double t532;
  double t537;
  double t539;
  double t541;
  double t542;
  double t543;
  double t544;
  double t545;
  double t546;
  double t548;
  double t550;
  double t553;
  double t554;
  double t555;
  double t556;
  double t557;
  double t559;
  double t564;
  double t565;
  double t561;
  double t562;
  double t571;
  double t563;
  double t567;
  double t568;
  double t570;
  double t572;
  double t573;
  double t574;
  double t575;
  double t577;
  double t576;
  double t578;
  double t579;
  double t581;
  double t584;
  double t585;
  double t586;
  double t587;
  double t588;
  double t613;
  double t589;
  double t592;
  double t593;
  double t594;
  double t596;
  double t618;
  double t619;
  double t620;
  double t597;
  double t601;
  double t603;
  double t609;
  double t612;
  double t617;
  double t624;
  double t625;
  double t626;
  double t630;
  double t638;
  double t639;
  double t649;
  double t650;
  double t651;
  double t652;
  double t640;
  double t641;
  double t643;
  double t647;
  double t648;
  double t653;
  double t654;
  double t655;
  double t656;
  double t657;
  double t658;
  double t659;
  double t660;
  double t661;
  double t662;
  double t663;
  double t664;
  double t665;
  double t666;
  double t667;
  double t670;
  double t668;
  double t669;
  double t671;
  double t678;
  double t672;
  double t673;
  double t674;
  double t687;
  double t688;
  double t675;
  double t676;
  double t677;
  double t679;
  double t680;
  double t682;
  double t684;
  double t713;
  double t686;
  double t689;
  double t712;
  double t691;
  double t693;
  double t694;
  double t695;
  double t698;
  double t697;
  double t699;
  double t700;
  double t702;
  double t704;
  double t705;
  double t707;
  double t711;
  double t710;
  double t714;
  double t715;
  double t717;
  double t718;
  double t719;
  double t722;
  double t723;
  double t724;
  double t725;
  double t726;
  double t727;
  double t728;
  double t729;
  double t731;
  double t742;
  double t733;
  double t735;
  double t744;
  double t745;
  double t737;
  double t738;
  double t739;
  double t740;
  double t746;
  double t777;
  double t778;
  double t779;
  double t750;
  double t751;
  double t752;
  double t753;
  double t754;
  double t755;
  double t756;
  double t757;
  double t784;
  double t785;
  double t786;
  double t759;
  double t760;
  double t761;
  double t762;
  double t788;
  double t789;
  double t790;
  double t765;
  double t766;
  double t787;
  double t767;
  double t768;
  double t773;
  double t769;
  double t770;
  double t772;
  double t771;
  double t774;
  double t775;
  double t776;
  double t782;
  double t791;
  double t792;
  double t794;
  double t795;
  double t797;
  double t798;
  double t799;
  double t800;
  double t801;
  double t803;
  double t806;
  double t810;
  double t811;
  double t812;
  double t815;
  double t826;
  double t816;
  double t835;
  double t817;
  double t818;
  double t819;
  double t820;
  double t821;
  double t839;
  double t840;
  double t822;
  double t828;
  double t829;
  double t830;
  double t833;
  double t834;
  double t837;
  double t838;
  double t851;
  double t854;
  double t856;
  double t857;
  double t858;
  double t860;
  double t862;
  double t864;
  double t871;
  double t873;
  double t881;
  double t874;
  double t875;
  double t884;
  double t885;
  double t1606;
  double t888;
  double t889;
  double t890;
  double t891;
  double t893;
  double t894;
  double t895;
  double t896;
  double t899;
  double t900;
  double t905;
  double t901;
  double t902;
  double t903;
  double t904;
  double t908;
  double t909;
  double t912;
  double t910;
  double t911;
  double t919;
  double t922;
  double t925;
  double t928;
  double t931;
  double t932;
  double t937;
  double t934;
  double t935;
  double t939;
  double t941;
  double t942;
  double t943;
  double t944;
  double t945;
  double t946;
  double t947;
  double t948;
  double t950;
  double t952;
  double t953;
  double t954;
  double t955;
  double t960;
  double t961;
  double t963;
  double t971;
  double t989;
  double t990;
  double t973;
  double t974;
  double t976;
  double t977;
  double t978;
  double t979;
  double t980;
  double t981;
  double t991;
  double t992;
  double t993;
  double t994;
  double t982;
  double t986;
  double t988;
  double t983;
  double t1121;
  double t996;
  double t997;
  double t998;
  double t1001;
  double t1002;
  double t1003;
  double t1004;
  double t1007;
  double t1005;
  double t1006;
  double t1008;
  double t1009;
  double t1010;
  double t1011;
  double t1013;
  double t1014;
  double t1016;
  double t1028;
  double t1017;
  double t1019;
  double t1020;
  double t1021;
  double t1024;
  double t1027;
  double t1029;
  double t1030;
  double t1031;
  double t1032;
  double t1036;
  double t1033;
  double t1034;
  double t1035;
  double t1037;
  double t1038;
  double t1039;
  double t1040;
  double t1041;
  double t1042;
  double t1050;
  double t1043;
  double t1044;
  double t1045;
  double t1047;
  double t1048;
  double t1049;
  double t1052;
  double t1053;
  double t1054;
  double t1060;
  double t1056;
  double t1057;
  double t1058;
  double t1063;
  double t1064;
  double t1464;
  double t1465;
  double t1068;
  double t1070;
  double t1069;
  double t1072;
  double t1074;
  double t1075;
  double t1076;
  double t1078;
  double t1080;
  double t1081;
  double t1083;
  double t1084;
  double t1085;
  double t1086;
  double t1087;
  double t1088;
  double t1089;
  double t1090;
  double t1091;
  double t1095;
  double t1092;
  double t1093;
  double t1094;
  double t1097;
  double t1100;
  double t1103;
  double t1104;
  double t1105;
  double t1106;
  double t1107;
  double t1108;
  double t1109;
  double t1113;
  double t1114;
  double t1115;
  double t1116;
  double t2032;
  double t1118;
  double t1119;
  double t1227;
  double t1228;
  double t1229;
  double t1230;
  double t1120;
  double t1122;
  double t1129;
  double t1123;
  double t1125;
  double t1126;
  double t1128;
  double t1130;
  double t1131;
  double t1132;
  double t1133;
  double t1134;
  double t1136;
  double t1135;
  double t1138;
  double t1139;
  double t1140;
  double t1141;
  double t1142;
  double t1144;
  double t1145;
  double t1148;
  double t1149;
  double t1150;
  double t1151;
  double t1154;
  double t1156;
  double t1157;
  double t1160;
  double t1163;
  double t1164;
  double t1187;
  double t1165;
  double t1166;
  double t1170;
  double t1188;
  double t1173;
  double t1178;
  double t1180;
  double t1181;
  double t1182;
  double t1184;
  double t1185;
  double t1186;
  double t1195;
  double t1204;
  double t1206;
  double t1208;
  double t1210;
  double t1212;
  double t1214;
  double t1235;
  double t1236;
  double t1215;
  double t1234;
  double t1220;
  double t1244;
  double t1222;
  double t1223;
  double t1225;
  double t1226;
  double t1231;
  double t1232;
  double t1233;
  double t1237;
  double t1240;
  double t1241;
  double t1625;
  double t1242;
  double t1628;
  double t1243;
  double t1630;
  double t1245;
  double t1246;
  double t1426;
  double t1247;
  double t1248;
  double t1249;
  double t1250;
  double t1251;
  double t1253;
  double t1254;
  double t1255;
  double t1256;
  double t1257;
  double t1258;
  double t1263;
  double t1264;
  double t1267;
  double t1259;
  double t1262;
  double t1266;
  double t1268;
  double t1269;
  double t1270;
  double t1274;
  double t1275;
  double t1277;
  double t1276;
  double t1278;
  double t1279;
  double t1280;
  double t1304;
  double t1305;
  double t1283;
  double t1284;
  double t1285;
  double t1306;
  double t1287;
  double t1288;
  double t1289;
  double t1293;
  double t1294;
  double t1295;
  double t1296;
  double t1297;
  double t1298;
  double t1299;
  double t1387;
  double t1388;
  double t1389;
  double t1390;
  double t1300;
  double t1302;
  double t1303;
  double t1308;
  double t1392;
  double t1393;
  double t1394;
  double t1395;
  double t2040;
  double t1311;
  double t1312;
  double t1313;
  double t1314;
  double t1315;
  double t1317;
  double t1320;
  double t1324;
  double t1325;
  double t1326;
  double t1329;
  double t1331;
  double t1334;
  double t1335;
  double t1337;
  double t1339;
  double t1340;
  double t1341;
  double t1343;
  double t1344;
  double t1345;
  double t1347;
  double t1350;
  double t1352;
  double t1355;
  double t1357;
  double t1356;
  double t1359;
  double t1374;
  double t1361;
  double t1362;
  double t1367;
  double t1368;
  double t1377;
  double t1369;
  double t1373;
  double t1379;
  double t1562;
  double t1563;
  double t1380;
  double t1381;
  double t1564;
  double t1382;
  double t1401;
  double t1403;
  double t1405;
  double t1386;
  double t1397;
  double t1398;
  double t1399;
  double t1407;
  double t1410;
  double t1412;
  double t1413;
  double t1415;
  double t1416;
  double t1419;
  double t1418;
  double t1420;
  double t1421;
  double t1424;
  double t1425;
  double t1427;
  double t1428;
  double t1429;
  double t1431;
  double t1433;
  double t1435;
  double t1437;
  double t1438;
  double t1439;
  double t1440;
  double t1472;
  double t1473;
  double t1441;
  double t1449;
  double t1452;
  double t1454;
  double t1455;
  double t1456;
  double t1458;
  double t1459;
  double t1460;
  double t1461;
  double t1466;
  double t1468;
  double t1467;
  double t1469;
  double t1470;
  double t1471;
  double t1482;
  double t1483;
  double t1484;
  double t1485;
  double t1486;
  double t1479;
  double t1480;
  double t1481;
  double t1487;
  double t1488;
  double t1489;
  double t1491;
  double t1492;
  double t1493;
  double t1496;
  double t1497;
  double t1498;
  double t1499;
  double t1501;
  double t1503;
  double t1504;
  double t1505;
  double t1506;
  double t1507;
  double t1508;
  double t1510;
  double t1512;
  double t1511;
  double t1514;
  double t1517;
  double t1520;
  double t1521;
  double t1524;
  double t1526;
  double t1527;
  double t1528;
  double t1529;
  double t1545;
  double t1546;
  double t1547;
  double t2085;
  double t1531;
  double t1532;
  double t1538;
  double t1540;
  double t1541;
  double t1548;
  double t1542;
  double t1554;
  double t1555;
  double t1559;
  double t1560;
  double t1862;
  double t1561;
  double t1565;
  double t1567;
  double t1568;
  double t1569;
  double t1573;
  double t1574;
  double t1575;
  double t1576;
  double t1577;
  double t1578;
  double t1579;
  double t1584;
  double t1586;
  double t1587;
  double t1590;
  double t1591;
  double t1592;
  double t1593;
  double t1594;
  double t1597;
  double t1600;
  double t1603;
  double t1604;
  double t1605;
  double t1607;
  double t1608;
  double t1609;
  double t1618;
  double t1621;
  double t1622;
  double t1623;
  double t1637;
  double t1624;
  double t1627;
  double t1629;
  double t1631;
  double t1633;
  double t1634;
  double t1636;
  double t1640;
  double t1641;
  double t1642;
  double t1644;
  double t1645;
  double t1646;
  double t1647;
  double t1648;
  double t1649;
  double t1650;
  double t1652;
  double t1653;
  double t1654;
  double t1655;
  double t1656;
  double t1661;
  double t1657;
  double t1658;
  double t1659;
  double t1660;
  double t1662;
  double t1663;
  double t1664;
  double t1665;
  double t1669;
  double t1671;
  double t1673;
  double t1674;
  double t1676;
  double t1679;
  double t1680;
  double t1681;
  double t1682;
  double t1683;
  double t1684;
  double t1687;
  double t1691;
  double t1699;
  double t1703;
  double t1704;
  double t1705;
  double t1706;
  double t1708;
  double t1713;
  double t1709;
  double t1710;
  double t1711;
  double t1715;
  double t1716;
  double t1717;
  double t1718;
  double t1719;
  double t1720;
  double t1723;
  double t1726;
  double t1727;
  double t1730;
  double t1731;
  double t1732;
  double t1737;
  double t1738;
  double t1739;
  double t1744;
  double t1745;
  double t1746;
  double t1757;
  double t1760;
  double t1747;
  double t1749;
  double t1752;
  double t1753;
  double t1754;
  double t1751;
  double t1761;
  double t1763;
  double t1765;
  double t1766;
  double t1767;
  double t1768;
  double t1770;
  double t1771;
  double t1774;
  double t1776;
  double t1777;
  double t1778;
  double t1781;
  double t1783;
  double t1787;
  double t1789;
  double t1792;
  double t1795;
  double t1798;
  double t1801;
  double t1804;
  double t1808;
  double t1810;
  double t1819;
  double t1823;
  double t1826;
  double t1827;
  double t1830;
  double t1828;
  double t1831;
  double t1832;
  double t1833;
  double t1834;
  double t1836;
  double t1846;
  double t1848;
  double t1850;
  double t1851;
  double t1852;
  double t1853;
  double t1855;
  double t1856;
  double t1859;
  double t1861;
  double t1857;
  double t1858;
  double t1860;
  double t1864;
  double t1867;
  double t1868;
  double t1870;
  double t1871;
  double t1872;
  double t1874;
  double t1875;
  double t1876;
  double t1877;
  double t1878;
  double t1880;
  double t1881;
  double t1885;
  double t1898;
  double t1903;
  double t1905;
  double t1906;
  double t1907;
  double t1908;
  double t1910;
  double t1916;
  double t1919;
  double t1922;
  double t1925;
  double t1927;
  double t1929;
  double t1931;
  double t1937;
  double t1941;
  double t1942;
  double t1951;
  double t1955;
  double t2008;
  double t2443;
  double t1957;
  double t1963;
  double t1965;
  double t1968;
  double t1969;
  double t1970;
  double t1971;
  double t1972;
  double t1973;
  double t1974;
  double t1977;
  double t1978;
  double t1979;
  double t1980;
  double t1981;
  double t1982;
  double t1983;
  double t1989;
  double t1990;
  double t2105;
  double t2106;
  double t1991;
  double t1994;
  double t1997;
  double t1996;
  double t1999;
  double t2003;
  double t2009;
  double t2011;
  double t2014;
  double t2016;
  double t2022;
  double t2023;
  double t2025;
  double t2029;
  double t2031;
  double t2035;
  double t2039;
  double t2043;
  double t2047;
  double t2048;
  double t2051;
  double t2052;
  double t2053;
  double t2054;
  double t2055;
  double t2057;
  double t2062;
  double t2065;
  double t2070;
  double t2073;
  double t2076;
  double t2080;
  double t2084;
  double t2088;
  double t2089;
  double t2092;
  double t2095;
  double t2099;
  double t2100;
  double t2101;
  double t2102;
  double t2103;
  double t2104;
  double t2107;
  double t2108;
  double t2109;
  double t2110;
  double t2112;
  double t2117;
  double t2119;
  double t2120;
  double t2121;
  double t2269;
  double t2270;
  double t2271;
  double t2272;
  double t2122;
  double t2124;
  double t2128;
  double t2129;
  double t2130;
  double t2131;
  double t2132;
  double t2285;
  double t2286;
  double t2287;
  double t2288;
  double t2330;
  double t2331;
  double t2133;
  double t2135;
  double t2137;
  double t2136;
  double t2142;
  double t2143;
  double t2144;
  double t2145;
  double t2146;
  double t2148;
  double t2149;
  double t2150;
  double t2151;
  double t2154;
  double t2156;
  double t2157;
  double t2161;
  double t2162;
  double t2163;
  double t2165;
  double t2166;
  double t2167;
  double t2168;
  double t2169;
  double t2172;
  double t2175;
  double t2178;
  double t2181;
  double t2183;
  double t2184;
  double t2275;
  double t2276;
  double t2277;
  double t2185;
  double t2186;
  double t2187;
  double t2189;
  double t2190;
  double t2191;
  double t2192;
  double t2193;
  double t2194;
  double t2195;
  double t2196;
  double t2197;
  double t2198;
  double t2200;
  double t2201;
  double t2202;
  double t2203;
  double t2205;
  double t2206;
  double t2207;
  double t2208;
  double t2209;
  double t2210;
  double t2211;
  double t2212;
  double t2213;
  double t2214;
  double t2215;
  double t2216;
  double t2217;
  double t2218;
  double t2219;
  double t2220;
  double t2221;
  double t2295;
  double t2296;
  double t2222;
  double t2225;
  double t2228;
  double t2229;
  double t2231;
  double t2232;
  double t2292;
  double t2293;
  double t2294;
  double t2454;
  double t2455;
  double t2233;
  double t2235;
  double t2236;
  double t2237;
  double t2238;
  double t2239;
  double t2273;
  double t2240;
  double t2241;
  double t2242;
  double t2244;
  double t2245;
  double t2246;
  double t2247;
  double t2248;
  double t2249;
  double t2250;
  double t2251;
  double t2252;
  double t2260;
  double t2262;
  double t2263;
  double t2265;
  double t2266;
  double t2267;
  double t2268;
  double t2278;
  double t2279;
  double t2281;
  double t2282;
  double t2283;
  double t2284;
  double t2274;
  double t2289;
  double t2290;
  double t2291;
  double t2297;
  double t2298;
  double t2299;
  double t2300;
  double t2339;
  double t2340;
  double t2301;
  double t2302;
  double t2303;
  double t2304;
  double t2305;
  double t2341;
  double t2306;
  double t2308;
  double t2311;
  double t2312;
  double t2316;
  double t2318;
  double t2322;
  double t2324;
  double t2325;
  double t2326;
  double t2328;
  double t2329;
  double t2332;
  double t2333;
  double t2334;
  double t2335;
  double t2338;
  double t2342;
  double t2465;
  double t2343;
  double t2345;
  double t2347;
  double t2349;
  double t2350;
  double t2351;
  double t2352;
  double t2353;
  double t2354;
  double t2355;
  double t2356;
  double t2357;
  double t2358;
  double t2360;
  double t2368;
  double t2371;
  double t2373;
  double t2375;
  double t2376;
  double t2377;
  double t2378;
  double t2381;
  double t2383;
  double t2384;
  double t2385;
  double t2386;
  double t2387;
  double t2388;
  double t2389;
  double t2390;
  double t2391;
  double t2392;
  double t2393;
  double t2394;
  double t2395;
  double t2396;
  double t2397;
  double t2399;
  double t2400;
  double t2403;
  double t2404;
  double t2405;
  double t2406;
  double t2407;
  double t2408;
  double t2409;
  double t2412;
  double t2413;
  double t2414;
  double t2417;
  double t2418;
  double t2419;
  double t2420;
  double t2421;
  double t2422;
  double t2423;
  double t2424;
  double t2425;
  double t2427;
  double t2428;
  double t2431;
  double t2436;
  double t2437;
  double t2438;
  double t2439;
  double t2440;
  double t2441;
  double t2444;
  double t2446;
  double t2447;
  double t2448;
  double t2451;
  double t2452;
  double t2453;
  double t2456;
  double t2457;
  double t2461;
  double t2462;
  double t2463;
  double t2464;
  double t2466;
  double t2467;
  double t2468;
  double t2469;
  double t2470;
  double t2471;
  double t2472;
  double t2473;
  double t2475;
  double t2476;
  double t2479;
  double t2480;
  double t2482;

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
  t9 = cosVector[3] * t6 - sinVector[3] * t4;
  t13 = cosVector[3] * t4 + sinVector[3] * t6;
  t15 = sinVector[5] * t9 + cosVector[4] * cosVector[5] * t13;
  t18 = cosVector[5] * t9 - cosVector[4] * sinVector[5] * t13;
  t19 = cosVector[1] * lengthVector[1];
  t20 = lengthVector[2] * t6;
  t21 = t19 + t20;
  t22 = sinVector[4] * t21;
  t23 = cosVector[4] * lengthVector[3] * t9;
  t27 = lengthVector[4] * sinVector[4] * t13;
  t24 = (t22 + t23) - t27;
  t25 = lengthVector[5] * t15;
  t26 = COMVector_6[2] * t15;
  t28 = sinVector[5] * t24;
  t29 = cosVector[5] * lengthVector[3] * t13;
  t31 = lengthVector[5] * t18;
  t32 = COMVector_6[2] * t18;
  t33 = cosVector[5] * t24;
  t35 = (((t25 + t26) + t28) + t29) + COMVector_6[0] * sinVector[4] * t13;
  t36 = lengthVector[5] + COMVector_6[2];
  t49 = lengthVector[3] * sinVector[5] * t13;
  t38 = (((t31 + t32) + t33) + COMVector_6[1] * sinVector[4] * t13) - t49;
  t40 = cosVector[4] * lengthVector[4] * t13;
  t41 = lengthVector[3] * sinVector[4] * t9;
  t63 = cosVector[4] * t21;
  t42 = (((COMVector_6[0] * t18 + t40) + t41) - COMVector_6[1] * t15) - t63;
  t43 = inertiaTensor_6[1] * t18;
  t46 = COMVector_6[0] * t15 + COMVector_6[1] * t18;
  t47 = ((t25 + t26) + t28) + t29;
  t48 = cosVector[5] * massVector[5] * t35;
  t50 = inertiaTensor_6[1] * t15;
  t51 = ((t31 + t32) + t33) - t49;
  t54 = massVector[5] * sinVector[5] * t38;
  t53 = ((t48 + massVector[5] * sinVector[5] * t51) - t54) - cosVector[5] *
    massVector[5] * t47;
  t56 = lengthVector[3] + COMVector_4[1];
  t57 = cosVector[5] * massVector[5] * t38;
  t58 = massVector[5] * sinVector[5] * t35;
  t59 = ((t57 + t58) - cosVector[5] * massVector[5] * t51) - massVector[5] *
    sinVector[5] * t47;
  t65 = (((t50 + inertiaTensor_6[4] * t18) + massVector[5] * t36 * t38) +
         massVector[5] * COMVector_6[0] * t42) - inertiaTensor_6[5] * sinVector
    [4] * t13;
  t68 = (((t43 + inertiaTensor_6[0] * t15) + massVector[5] * t35 * t36) -
         massVector[5] * COMVector_6[1] * t42) - inertiaTensor_6[2] * sinVector
    [4] * t13;
  t72 = ((-t50 + inertiaTensor_6[0] * t18) + massVector[5] * COMVector_6[1] *
         t46) + massVector[5] * t36 * t51;
  t76 = ((-t43 + inertiaTensor_6[4] * t15) + massVector[5] * COMVector_6[0] *
         t46) + massVector[5] * t36 * t47;
  t77 = lengthVector[4] - COMVector_5[1];
  t79 = cosVector[4] * t53 - massVector[5] * sinVector[4] * t46;
  t82 = cosVector[5] * t68;
  t90 = ((((inertiaTensor_6[2] * t18 + COMVector_5[1] * t53) + t53 * t77) +
          massVector[5] * COMVector_6[1] * t47) - inertiaTensor_6[5] * t15) -
    massVector[5] * COMVector_6[0] * t51;
  t95 = cosVector[5] * t65;
  t96 = sinVector[5] * t68;
  t99 = ((((t95 + t96) + massVector[5] * COMVector_5[1] * t46) + massVector[5] *
          t46 * t77) - cosVector[5] * t72) - sinVector[5] * t76;
  t101 = ((sinVector[4] * t90 + t56 * t59) + cosVector[4] * t99) - COMVector_4[1]
    * t59;
  t104 = sinVector[4] * t53 + cosVector[4] * massVector[5] * t46;
  t113 = sinVector[5] * t65;
  t106 = ((((t82 + sinVector[5] * t72) + t56 * t79) - t113) - cosVector[5] * t76)
    - COMVector_4[1] * t79;
  t118 = lengthVector[2] - COMVector_3[0];
  t120 = ((cosVector[3] * t106 + COMVector_3[0] * t104) + t104 * t118) -
    sinVector[3] * t101;
  t122 = cosVector[3] * t101 + sinVector[3] * t106;
  t141 = cosVector[4] * COMVector_5[1] * t13;
  t127 = massVector[5] * t42 + massVector[4] * ((((t40 + t41) - t63) +
    COMVector_5[0] * t9) - t141);
  t129 = COMVector_5[1] * sinVector[4] * t13;
  t132 = (t57 + t58) + massVector[4] * ((((t22 + t23) - t27) + COMVector_5[2] *
    t9) + t129);
  t133 = t48 - t54;
  t134 = lengthVector[3] * t13;
  t138 = massVector[4] * ((t134 + cosVector[4] * COMVector_5[2] * t13) +
    COMVector_5[0] * sinVector[4] * t13);
  t139 = (t48 - t54) + t138;
  t140 = sinVector[4] * t132;
  t142 = lengthVector[3] * sinVector[4] * t13;
  t145 = cosVector[5] * t13 + cosVector[4] * sinVector[5] * t9;
  t146 = COMVector_6[0] * t145;
  t148 = sinVector[5] * t13 - cosVector[4] * cosVector[5] * t9;
  t152 = cosVector[4] * lengthVector[4] * t9;
  t177 = COMVector_6[1] * t148;
  t149 = ((t142 + t146) - t152) - t177;
  t151 = COMVector_5[0] * t13;
  t153 = cosVector[4] * COMVector_5[1] * t9;
  t154 = cosVector[4] * lengthVector[3] * t13;
  t155 = lengthVector[4] * sinVector[4] * t9;
  t157 = t154 + t155;
  t160 = massVector[3] * (t134 + COMVector_4[1] * t13);
  t161 = COMVector_5[2] * t13;
  t181 = COMVector_5[1] * sinVector[4] * t9;
  t164 = lengthVector[5] * t145;
  t165 = COMVector_6[2] * t145;
  t167 = lengthVector[3] * sinVector[5] * t9;
  t176 = COMVector_6[1] * sinVector[4] * t9;
  t168 = (((t164 + t165) + cosVector[5] * t157) + t167) - t176;
  t169 = cosVector[5] * massVector[5] * t168;
  t170 = lengthVector[5] * t148;
  t171 = COMVector_6[2] * t148;
  t182 = cosVector[5] * lengthVector[3] * t9;
  t183 = COMVector_6[0] * sinVector[4] * t9;
  t173 = (((t170 + t171) + sinVector[5] * t157) - t182) - t183;
  t174 = massVector[5] * sinVector[5] * t173;
  t175 = (massVector[4] * (((t154 + t155) + t161) - t181) + t169) + t174;
  t180 = massVector[5] * t149 + massVector[4] * (((t142 + t151) - t152) + t153);
  t184 = sinVector[4] * t175;
  t185 = sinVector[4] * t180;
  t186 = cosVector[4] * t175;
  t187 = lengthVector[3] * t9;
  t188 = massVector[5] * sinVector[5] * t168;
  t189 = t169 + t174;
  t193 = massVector[4] * ((t187 + cosVector[4] * COMVector_5[2] * t9) +
    COMVector_5[0] * sinVector[4] * t9);
  t194 = COMVector_4[2] * t9;
  t234 = COMVector_4[0] * t13;
  t196 = massVector[3] * (t194 - t234);
  t222 = cosVector[4] * t180;
  t197 = t184 - t222;
  t210 = cosVector[5] * massVector[5] * t173;
  t198 = (t188 + t193) - t210;
  t199 = inertiaTensor_6[0] * t148;
  t200 = inertiaTensor_6[1] * t145;
  t202 = inertiaTensor_6[2] * sinVector[4] * t9;
  t203 = (((t199 + t200) + massVector[5] * t36 * t173) + t202) - massVector[5] *
    COMVector_6[1] * t149;
  t204 = inertiaTensor_6[1] * t148;
  t205 = inertiaTensor_6[4] * t145;
  t208 = inertiaTensor_6[5] * sinVector[4] * t9;
  t209 = (((t204 + t205) + massVector[5] * t36 * t168) + massVector[5] *
          COMVector_6[0] * t149) + t208;
  t212 = massVector[3] * (((t19 + t20) - COMVector_4[0] * t9) - COMVector_4[2] *
    t13);
  t218 = cosVector[4] * t127;
  t213 = (t140 + t212) - t218;
  t216 = massVector[3] * (t187 + COMVector_4[1] * t9);
  t217 = inertiaTensor_4[2] * t13;
  t219 = cosVector[4] * t132;
  t220 = sinVector[4] * t127;
  t221 = t57 + t58;
  t223 = (t184 + t196) - t222;
  t224 = t188 - t210;
  t225 = inertiaTensor_4[2] * t9;
  t226 = t140 - t218;
  t227 = COMVector_5[0] * t180;
  t228 = inertiaTensor_5[4] * t13;
  t229 = inertiaTensor_4[8] * t13;
  t230 = (t160 + t185) + t186;
  t231 = t56 * t230;
  t232 = COMVector_5[2] * t175;
  t233 = cosVector[5] * t209;
  t236 = sinVector[5] * t203;
  t237 = t185 + t186;
  t238 = inertiaTensor_5[5] * sinVector[4] * t9;
  t239 = inertiaTensor_4[0] * t9;
  t240 = ((t188 + t193) - t210) + t216;
  t241 = t56 * t240;
  t242 = inertiaTensor_6[2] * t148;
  t243 = inertiaTensor_6[5] * t145;
  t244 = inertiaTensor_5[5] * t13;
  t248 = inertiaTensor_5[8] * sinVector[4] * t9;
  t249 = inertiaTensor_6[8] * sinVector[4] * t9;
  t315 = inertiaTensor_5[2] * cosVector[4] * t9;
  t250 = ((((((((((t242 + t243) + t244) + t77 * t175) + COMVector_5[1] * t189) +
               COMVector_5[0] * t198) + t248) + t249) - COMVector_5[0] * t224) -
           massVector[5] * COMVector_6[1] * t168) - massVector[5] * COMVector_6
          [0] * t173) - t315;
  t251 = sinVector[4] * t250;
  t252 = inertiaTensor_5[1] * t13;
  t253 = t77 * t180;
  t254 = cosVector[5] * t203;
  t255 = massVector[5] * COMVector_5[1] * t149;
  t256 = inertiaTensor_5[2] * sinVector[4] * t9;
  t318 = sinVector[5] * t209;
  t319 = COMVector_5[2] * t198;
  t320 = inertiaTensor_5[0] * cosVector[4] * t9;
  t258 = (((((((t252 + t253) + t254) + t255) + t256) + COMVector_5[2] * t224) -
           t318) - t319) - t320;
  t316 = COMVector_4[2] * t197;
  t317 = COMVector_4[1] * t198;
  t321 = cosVector[4] * t258;
  t260 = ((((((t217 + t239) + t241) + t251) + COMVector_4[2] * t223) - t316) -
          t317) - t321;
  t263 = (t216 + t219) + t220;
  t272 = (((((((((((((t95 + t96) - t217) + t56 * t263) + inertiaTensor_5[4] * t9)
                  + inertiaTensor_4[8] * t9) + COMVector_5[2] * t132) +
                COMVector_4[0] * t226) + COMVector_5[0] * t127) +
              inertiaTensor_5[1] * cosVector[4] * t13) - COMVector_4[0] * t213)
            - COMVector_4[1] * (t219 + t220)) - COMVector_5[2] * t221) -
          massVector[5] * COMVector_5[0] * t42) - inertiaTensor_5[5] *
    sinVector[4] * t13;
  t296 = inertiaTensor_5[2] * sinVector[4] * t13;
  t279 = (((((((t82 - t113) + t77 * t127) + inertiaTensor_5[1] * t9) +
             COMVector_5[2] * t139) + massVector[5] * COMVector_5[1] * t42) +
           inertiaTensor_5[0] * cosVector[4] * t13) - COMVector_5[2] * t133) -
    t296;
  t286 = inertiaTensor_5[2] * cosVector[4] * t13;
  t287 = ((((((((((inertiaTensor_6[2] * t15 + inertiaTensor_6[5] * t18) +
                  inertiaTensor_5[5] * t9) + t77 * t132) + COMVector_5[0] * t133)
               + COMVector_5[1] * t221) + t286) - COMVector_5[0] * t139) -
            massVector[5] * COMVector_6[0] * t35) - massVector[5] * COMVector_6
           [1] * t38) - inertiaTensor_5[8] * sinVector[4] * t13) -
    inertiaTensor_6[8] * sinVector[4] * t13;
  t289 = ((t48 - t54) + t138) + t160;
  t291 = ((((((t225 + COMVector_4[2] * t213) + sinVector[4] * t287) +
             COMVector_4[1] * t139) - cosVector[4] * t279) - inertiaTensor_4[0] *
           t13) - t56 * t289) - COMVector_4[2] * t226;
  t307 = COMVector_4[0] * t223;
  t308 = COMVector_5[2] * t189;
  t309 = COMVector_4[1] * t237;
  t310 = massVector[5] * COMVector_5[0] * t149;
  t311 = inertiaTensor_5[1] * cosVector[4] * t9;
  t293 = (((((((((((((t225 + t227) + t228) + t229) + t231) + t232) + t233) +
                t236) + t238) + COMVector_4[0] * t197) - t307) - t308) - t309) -
          t310) - t311;
  t294 = lengthVector[1] - COMVector_2[0];
  t306 = sinVector[3] * t291;
  t328 = (((((((((((((t225 + t227) + t228) + t229) + t231) + t232) + t233) +
                t236) + t238) - t307) - t308) - t309) - t310) - t311) +
    COMVector_4[0] * (t184 - t222);
  t330 = ((((((t217 + t239) + t241) + t251) - t316) - t317) - t321) +
    COMVector_4[2] * ((t184 + t196) - t222);
  t331 = sinVector[3] * t272;
  t332 = cosVector[3] * t291;
  t333 = COMVector_3[0] * t223;
  t334 = t118 * t223;
  t335 = (t40 + t41) - t63;
  t337 = massVector[4] * (((t40 + t41) - t63) - t141);
  t341 = ((sinVector[5] * t335 + cosVector[5] * lengthVector[5] * sinVector[4] *
           t13) + cosVector[5] * COMVector_6[2] * sinVector[4] * t13) -
    cosVector[4] * COMVector_6[0] * t13;
  t342 = massVector[5] * sinVector[5] * t341;
  t346 = ((cosVector[4] * COMVector_6[1] * t13 + lengthVector[5] * sinVector[4] *
           sinVector[5] * t13) + COMVector_6[2] * sinVector[4] * sinVector[5] *
          t13) - cosVector[5] * t335;
  t360 = cosVector[5] * massVector[5] * t346;
  t347 = (t337 + t342) - t360;
  t350 = (((t22 + t23) - t27) + cosVector[5] * COMVector_6[1] * sinVector[4] *
          t13) + COMVector_6[0] * sinVector[4] * sinVector[5] * t13;
  t354 = massVector[5] * t350 + massVector[4] * (((t22 + t23) - t27) + t129);
  t355 = ((t219 + t220) - sinVector[4] * t347) - cosVector[4] * t354;
  t358 = cosVector[5] * massVector[5] * t341;
  t359 = massVector[5] * sinVector[5] * t346;
  t363 = (t358 + t359) - massVector[4] * (cosVector[4] * COMVector_5[0] * t13 -
    COMVector_5[2] * sinVector[4] * t13);
  t364 = t358 + t359;
  t371 = (((massVector[5] * t36 * t341 + massVector[5] * COMVector_6[1] * t350)
           + inertiaTensor_6[2] * cosVector[4] * t13) + inertiaTensor_6[0] *
          cosVector[5] * sinVector[4] * t13) - inertiaTensor_6[1] * sinVector[4]
    * sinVector[5] * t13;
  t375 = (((massVector[5] * t36 * t346 + massVector[5] * COMVector_6[0] * t350)
           + inertiaTensor_6[4] * sinVector[4] * sinVector[5] * t13) -
          inertiaTensor_6[5] * cosVector[4] * t13) - inertiaTensor_6[1] *
    cosVector[5] * sinVector[4] * t13;
  t376 = t342 - t360;
  t378 = ((t140 - t218) + cosVector[4] * t347) - sinVector[4] * t354;
  t386 = ((((((t286 + cosVector[5] * t371) + COMVector_5[2] * t363) + sinVector
             [5] * t375) + inertiaTensor_5[0] * sinVector[4] * t13) -
           COMVector_5[2] * t364) - t77 * t354) - massVector[5] * COMVector_5[1]
    * t350;
  t389 = COMVector_5[0] * t364;
  t390 = COMVector_5[1] * t376;
  t391 = massVector[5] * COMVector_6[1] * t346;
  t392 = inertiaTensor_5[8] * cosVector[4] * t13;
  t393 = inertiaTensor_6[8] * cosVector[4] * t13;
  t394 = inertiaTensor_6[2] * cosVector[5] * sinVector[4] * t13;
  t413 = COMVector_5[0] * t363;
  t414 = massVector[5] * COMVector_6[0] * t341;
  t415 = inertiaTensor_6[5] * sinVector[4] * sinVector[5] * t13;
  t396 = (((((((((t296 + t389) + t390) + t391) + t392) + t393) + t394) + t77 *
            t347) - t413) - t414) - t415;
  t399 = ((((cosVector[4] * t386 + cosVector[4] * t287) + sinVector[4] * t279) +
           t56 * t363) - sinVector[4] * t396) - COMVector_4[1] * t363;
  t407 = ((((((((sinVector[5] * t371 + massVector[5] * COMVector_5[0] * t350) +
                inertiaTensor_5[5] * cosVector[4] * t13) + inertiaTensor_5[1] *
               sinVector[4] * t13) + t56 * t378) + COMVector_5[2] * t347) -
            COMVector_4[1] * t378) - cosVector[5] * t375) - COMVector_5[0] *
          t354) - COMVector_5[2] * t376;
  t424 = ((sinVector[3] * t399 + cosVector[3] * t407) - COMVector_3[0] * t355) -
    t118 * t355;
  t426 = cosVector[3] * t399 - sinVector[3] * t407;
  t427 = lengthVector[2] * sinVector[4] * t4;
  t428 = (t154 + t155) + t427;
  t429 = cosVector[4] * lengthVector[2] * t4;
  t430 = lengthVector[2] * t4;
  t432 = massVector[3] * ((t194 - t234) + t430);
  t436 = (((t164 + t165) + t167) - t176) + cosVector[5] * t428;
  t437 = cosVector[5] * massVector[5] * t436;
  t439 = (((t170 + t171) - t182) - t183) + sinVector[5] * t428;
  t440 = massVector[5] * sinVector[5] * t439;
  t441 = (massVector[4] * ((((t154 + t155) + t161) - t181) + t427) + t437) +
    t440;
  t442 = sinVector[4] * t441;
  t443 = (((-t142 - t146) + t152) + t177) + t429;
  t445 = massVector[4] * ((((t142 + t151) - t152) + t153) - t429);
  t451 = massVector[5] * t443;
  t446 = t445 - t451;
  t447 = COMVector_3[0] * t4;
  t448 = COMVector_3[1] * t6;
  t452 = cosVector[4] * t446;
  t450 = ((t432 + t442) - t452) - massVector[2] * ((-t430 + t447) + t448);
  t454 = massVector[5] * sinVector[5] * t436;
  t459 = cosVector[5] * massVector[5] * t439;
  t455 = ((t193 + t216) + t454) - t459;
  t456 = cosVector[3] * t455;
  t457 = cosVector[4] * t441;
  t458 = (t432 + t442) - t452;
  t460 = (t193 + t454) - t459;
  t461 = t454 - t459;
  t463 = (t160 + t457) + sinVector[4] * (t445 - t451);
  t465 = (((t204 + t205) + t208) + massVector[5] * t36 * t436) - massVector[5] *
    COMVector_6[0] * t443;
  t468 = (((t199 + t200) + t202) + massVector[5] * t36 * t439) + massVector[5] *
    COMVector_6[1] * t443;
  t469 = t437 + t440;
  t470 = t442 - t452;
  t471 = sinVector[4] * t446;
  t472 = cosVector[3] * t463;
  t475 = t77 * t446;
  t476 = cosVector[5] * t468;
  t478 = COMVector_5[2] * t461;
  t508 = sinVector[5] * t465;
  t509 = COMVector_5[2] * t460;
  t510 = massVector[5] * COMVector_5[1] * t443;
  t479 = (((((((t252 + t256) - t320) + t475) + t476) + t478) - t508) - t509) -
    t510;
  t483 = ((((((((((t242 + t243) + t244) + t248) + t249) - t315) + COMVector_5[1]
              * t469) + t77 * t441) + COMVector_5[0] * t460) - COMVector_5[0] *
           t461) - massVector[5] * COMVector_6[1] * t436) - massVector[5] *
    COMVector_6[0] * t439;
  t485 = ((((((t217 + t239) + COMVector_4[2] * t458) + t56 * t455) + sinVector[4]
            * t483) - COMVector_4[2] * t470) - COMVector_4[1] * t460) -
    cosVector[4] * t479;
  t486 = t56 * t463;
  t487 = cosVector[5] * t465;
  t488 = COMVector_5[2] * t441;
  t489 = sinVector[5] * t468;
  t490 = COMVector_4[0] * t470;
  t491 = t457 + t471;
  t492 = massVector[5] * COMVector_5[0] * t443;
  t493 = cosVector[3] * t289;
  t494 = massVector[2] * COMVector_3[2] * t4;
  t497 = massVector[2] * (((t19 + t20) + COMVector_3[1] * t4) - COMVector_3[0] *
    t6);
  t498 = ((t140 + t212) - t218) + t497;
  t499 = cosVector[3] * t263;
  t500 = sinVector[3] * t289;
  t501 = massVector[2] * COMVector_3[2] * t6;
  t502 = COMVector_3[1] * t458;
  t503 = sinVector[3] * t463;
  t504 = (t456 + t501) + t503;
  t505 = COMVector_3[2] * t504;
  t515 = cosVector[3] * t485;
  t516 = inertiaTensor_3[0] * t6;
  t517 = inertiaTensor_3[1] * t4;
  t519 = (((((((((((((t225 + t228) + t229) + t238) - t311) + t486) + t487) +
                t488) + t489) + t490) + t492) + COMVector_5[0] * (t445 - t451))
           - COMVector_4[0] * t458) - COMVector_5[2] * t469) - COMVector_4[1] *
    t491;
  t520 = COMVector_3[0] * t458;
  t521 = t118 * t450;
  t523 = sinVector[3] * t455;
  t522 = t472 - t523;
  t524 = inertiaTensor_3[4] * t4;
  t528 = cosVector[3] * t519;
  t529 = COMVector_3[1] * t213;
  t533 = sinVector[3] * t263;
  t532 = COMVector_3[2] * (t493 - t533);
  t537 = cosVector[3] * t272;
  t539 = (t499 + t500) + t501;
  t541 = ((((((-t306 + t517) + COMVector_3[0] * t213) + t118 * t498) +
            inertiaTensor_3[4] * t6) + t537) + COMVector_3[2] * t539) -
    COMVector_3[2] * (t499 + t500);
  t542 = lengthVector[1] * sinVector[1];
  t543 = t430 + t542;
  t544 = sinVector[4] * t543;
  t545 = (t154 + t155) + t544;
  t546 = cosVector[4] * t543;
  t548 = (((t170 + t171) - t182) - t183) + sinVector[5] * t545;
  t550 = (((t164 + t165) + t167) - t176) + cosVector[5] * t545;
  t553 = cosVector[5] * massVector[5] * t550;
  t554 = massVector[5] * sinVector[5] * t548;
  t555 = (massVector[4] * ((((t154 + t155) + t161) - t181) + t544) + t553) +
    t554;
  t556 = cosVector[4] * t555;
  t557 = (((-t142 - t146) + t152) + t177) + t546;
  t559 = massVector[4] * ((((t142 + t151) - t152) + t153) - t546);
  t564 = massVector[5] * t557;
  t565 = t559 - t564;
  t561 = (t160 + t556) + sinVector[4] * t565;
  t562 = massVector[5] * sinVector[5] * t550;
  t571 = cosVector[5] * massVector[5] * t548;
  t563 = ((t193 + t216) + t562) - t571;
  t567 = massVector[2] * (((t430 - t447) - t448) + t542);
  t568 = sinVector[4] * t555;
  t570 = massVector[3] * (((t194 - t234) + t430) + t542);
  t572 = cosVector[3] * t563;
  t573 = sinVector[3] * t561;
  t574 = (t193 + t562) - t571;
  t575 = t562 - t571;
  t577 = cosVector[4] * t565;
  t576 = (t568 + t570) - t577;
  t578 = sinVector[4] * (t559 - t564);
  t579 = (t160 + t556) + t578;
  t581 = (((t204 + t205) + t208) + massVector[5] * t36 * t550) - massVector[5] *
    COMVector_6[0] * t557;
  t584 = (((t199 + t200) + t202) + massVector[5] * t36 * t548) + massVector[5] *
    COMVector_6[1] * t557;
  t585 = t553 + t554;
  t586 = sinVector[3] * t579;
  t587 = (t501 + t572) + t586;
  t588 = cosVector[3] * t579;
  t613 = sinVector[3] * t563;
  t589 = (t494 + t588) - t613;
  t592 = t568 - t577;
  t593 = t77 * t565;
  t594 = cosVector[5] * t584;
  t596 = COMVector_5[2] * t575;
  t618 = sinVector[5] * t581;
  t619 = COMVector_5[2] * t574;
  t620 = massVector[5] * COMVector_5[1] * t557;
  t597 = (((((((t252 + t256) - t320) + t593) + t594) + t596) - t618) - t619) -
    t620;
  t601 = ((((((((((t242 + t243) + t244) + t248) + t249) - t315) + COMVector_5[1]
              * t585) + t77 * t555) + COMVector_5[0] * t574) - COMVector_5[0] *
           t575) - massVector[5] * COMVector_6[1] * t550) - massVector[5] *
    COMVector_6[0] * t548;
  t603 = ((t567 + t568) + t570) - t577;
  t609 = t556 + t578;
  t612 = (((((((((((((t225 + t228) + t229) + t238) - t311) + t56 * t579) +
                 cosVector[5] * t581) + COMVector_5[2] * t555) + sinVector[5] *
               t584) + COMVector_4[0] * t592) + COMVector_5[0] * (t559 - t564))
            + massVector[5] * COMVector_5[0] * t557) - COMVector_4[0] * t576) -
          COMVector_4[1] * t609) - COMVector_5[2] * t585;
  t617 = cosVector[2] * t589;
  t624 = ((((((t217 + t239) + COMVector_4[2] * t576) + t56 * t563) + sinVector[4]
            * t601) - COMVector_4[2] * t592) - COMVector_4[1] * t574) -
    cosVector[4] * t597;
  t625 = COMVector_3[2] * t587;
  t626 = COMVector_3[1] * t576;
  t630 = sinVector[3] * t612;
  t638 = (t493 + t494) - t533;
  t639 = massVector[1] * COMVector_2[2] * sinVector[1];
  t649 = COMVector_3[1] * t498;
  t650 = inertiaTensor_3[0] * t4;
  t651 = inertiaTensor_3[1] * t6;
  t652 = COMVector_3[2] * t638;
  t640 = ((((((t331 + t332) + t529) + t532) - t649) - t650) - t651) - t652;
  t641 = cosVector[2] * t638;
  t643 = sinVector[2] * t541;
  t647 = (((t140 + t212) - t218) + t497) + massVector[1] * ((t19 + COMVector_2[1]
    * sinVector[1]) - cosVector[1] * COMVector_2[0]);
  t648 = cosVector[1] * massVector[1] * COMVector_2[2];
  t653 = sinVector[2] * t640;
  t654 = cosVector[2] * t539;
  t655 = sinVector[2] * t638;
  t656 = (((t567 + t568) + t570) - t577) - massVector[1] * ((-t542 + cosVector[1]
    * COMVector_2[1]) + COMVector_2[0] * sinVector[1]);
  t657 = inertiaTensor_2[1] * sinVector[1];
  t658 = t588 - t613;
  t659 = ((((((t524 + COMVector_3[2] * t589) + COMVector_3[0] * t576) + t118 *
             t603) + cosVector[3] * t612) - t651) - COMVector_3[2] * t658) -
    sinVector[3] * t624;
  t660 = cosVector[3] * t624;
  t661 = cosVector[2] * lengthVector[1];
  t662 = lengthVector[2] + t661;
  t663 = sinVector[3] * t662;
  t664 = cosVector[3] * lengthVector[1] * sinVector[2];
  t665 = t663 + t664;
  t666 = cosVector[4] * t665;
  t667 = cosVector[3] * t662;
  t670 = lengthVector[1] * sinVector[2] * sinVector[3];
  t668 = t667 - t670;
  t669 = sinVector[4] * t665;
  t671 = cosVector[5] * t668;
  t678 = cosVector[4] * lengthVector[4];
  t672 = t666 - t678;
  t673 = cosVector[5] * lengthVector[5] * sinVector[4];
  t674 = cosVector[5] * COMVector_6[2] * sinVector[4];
  t687 = cosVector[4] * COMVector_6[0];
  t688 = sinVector[5] * t672;
  t675 = (((t671 + t673) + t674) - t687) - t688;
  t676 = cosVector[4] * COMVector_6[1];
  t677 = sinVector[5] * t668;
  t679 = lengthVector[5] * sinVector[4] * sinVector[5];
  t680 = COMVector_6[2] * sinVector[4] * sinVector[5];
  t682 = (((t676 + t677) + t679) + t680) + cosVector[5] * t672;
  t684 = COMVector_5[2] * sinVector[4];
  t713 = cosVector[4] * COMVector_5[0];
  t686 = massVector[4] * (((t667 - t670) + t684) - t713);
  t689 = cosVector[5] * massVector[5] * t675;
  t712 = massVector[3] * ((COMVector_4[0] - t667) + t670);
  t691 = ((t686 + t689) + massVector[5] * sinVector[5] * t682) - t712;
  t693 = massVector[3] * ((-COMVector_4[2] + t663) + t664);
  t694 = cosVector[4] * COMVector_5[1];
  t695 = COMVector_5[1] * sinVector[4];
  t698 = lengthVector[4] * sinVector[4];
  t697 = massVector[4] * ((t669 + t695) - t698);
  t699 = cosVector[5] * COMVector_6[1] * sinVector[4];
  t700 = COMVector_6[0] * sinVector[4] * sinVector[5];
  t702 = ((t669 - t698) + t699) + t700;
  t704 = t697 + massVector[5] * t702;
  t705 = sinVector[4] * t704;
  t707 = massVector[4] * ((t666 - t678) + t694);
  t711 = massVector[5] * sinVector[5] * t675;
  t710 = (t693 + t705) + cosVector[4] * ((cosVector[5] * massVector[5] * t682 +
    t707) - t711);
  t714 = cosVector[5] * (t666 - t678);
  t715 = (((t676 + t677) + t679) + t680) + t714;
  t717 = massVector[2] * ((lengthVector[2] - COMVector_3[0]) + t661);
  t718 = massVector[5] * sinVector[5] * t715;
  t719 = ((t686 + t689) - t712) + t718;
  t722 = massVector[2] * (COMVector_3[1] + lengthVector[1] * sinVector[2]);
  t723 = cosVector[5] * massVector[5] * t715;
  t724 = (t707 - t711) + t723;
  t725 = cosVector[4] * t724;
  t726 = (t693 + t705) + t725;
  t727 = t711 - t723;
  t728 = t689 + t718;
  t729 = inertiaTensor_6[2] * cosVector[4];
  t731 = inertiaTensor_6[0] * cosVector[5] * sinVector[4];
  t742 = inertiaTensor_6[1] * sinVector[4] * sinVector[5];
  t733 = (((t729 + massVector[5] * t36 * t675) + t731) + massVector[5] *
          COMVector_6[1] * t702) - t742;
  t735 = inertiaTensor_6[4] * sinVector[4] * sinVector[5];
  t744 = inertiaTensor_6[5] * cosVector[4];
  t745 = inertiaTensor_6[1] * cosVector[5] * sinVector[4];
  t737 = (((massVector[5] * t36 * t715 + t735) + massVector[5] * COMVector_6[0] *
           t702) - t744) - t745;
  t738 = (t686 + t689) + t718;
  t739 = sinVector[3] * t726;
  t740 = cosVector[3] * (((t686 + t689) - t712) + t718);
  t746 = cosVector[5] * t737;
  t777 = inertiaTensor_5[5] * cosVector[4];
  t778 = inertiaTensor_5[1] * sinVector[4];
  t779 = sinVector[5] * t733;
  t750 = (((((((((inertiaTensor_4[5] + COMVector_5[2] * t727) + COMVector_5[2] *
                 t724) + t746) + t56 * t726) + COMVector_5[0] * t704) - t777) -
            t778) - t779) - COMVector_4[1] * (t705 + t725)) - massVector[5] *
    COMVector_5[0] * t702;
  t751 = inertiaTensor_5[8] * cosVector[4];
  t752 = inertiaTensor_6[8] * cosVector[4];
  t753 = inertiaTensor_5[2] * sinVector[4];
  t754 = COMVector_5[0] * t728;
  t755 = COMVector_5[1] * t727;
  t756 = inertiaTensor_6[2] * cosVector[5] * sinVector[4];
  t757 = massVector[5] * COMVector_6[1] * t715;
  t784 = t77 * t724;
  t785 = inertiaTensor_6[5] * sinVector[4] * sinVector[5];
  t786 = massVector[5] * COMVector_6[0] * t675;
  t759 = inertiaTensor_5[2] * cosVector[4];
  t760 = inertiaTensor_5[0] * sinVector[4];
  t761 = cosVector[5] * t733;
  t762 = sinVector[5] * t737;
  t788 = t77 * t704;
  t789 = COMVector_5[2] * t728;
  t790 = massVector[5] * COMVector_5[1] * t702;
  t765 = cosVector[4] * (((((((t759 + t760) + t761) + t762) + COMVector_5[2] *
    t738) - t788) - t789) - t790);
  t766 = t56 * t719;
  t787 = sinVector[4] * ((((((((((t751 + t752) + t753) + t754) + t755) + t756) +
    t757) - COMVector_5[0] * t738) - t784) - t785) - t786);
  t767 = (((inertiaTensor_4[1] + t765) + t766) - t787) - COMVector_4[1] * t738;
  t768 = cosVector[4] * t704;
  t773 = sinVector[4] * t724;
  t769 = t768 - t773;
  t770 = cosVector[3] * t726;
  t772 = sinVector[3] * t719;
  t771 = (t722 + t770) - t772;
  t774 = (t717 + t739) + t740;
  t775 = cosVector[2] * t774;
  t776 = sinVector[2] * t771;
  t782 = sinVector[3] * t750;
  t791 = COMVector_3[2] * t774;
  t792 = t739 + t740;
  t794 = (t689 + t718) + massVector[4] * (((t667 - t670) + t684) - t713);
  t795 = COMVector_3[0] * t769;
  t797 = COMVector_3[2] * (t770 - t772);
  t798 = t118 * t769;
  t799 = ((t671 + t673) + t674) - t688;
  t800 = ((t677 + t679) + t680) + t714;
  t801 = ((t689 + t718) - cosVector[5] * massVector[5] * t799) - massVector[5] *
    sinVector[5] * t800;
  t803 = cosVector[5] * COMVector_6[0] * sinVector[4] - COMVector_6[1] *
    sinVector[4] * sinVector[5];
  t806 = ((t711 - t723) + cosVector[5] * massVector[5] * t800) - massVector[5] *
    sinVector[5] * t799;
  t810 = inertiaTensor_6[4] * cosVector[5] * sinVector[4];
  t811 = massVector[5] * COMVector_6[0] * t803;
  t812 = ((t742 + massVector[5] * t36 * t799) + t810) + t811;
  t815 = inertiaTensor_6[0] * sinVector[4] * sinVector[5];
  t826 = massVector[5] * COMVector_6[1] * t803;
  t816 = ((t745 + massVector[5] * t36 * t800) + t815) - t826;
  t835 = massVector[5] * sinVector[4] * t803;
  t817 = cosVector[4] * t801 - t835;
  t818 = COMVector_5[1] * t801;
  t819 = t77 * t801;
  t820 = massVector[5] * COMVector_6[1] * t799;
  t821 = massVector[5] * COMVector_6[0] * t800;
  t839 = inertiaTensor_6[5] * cosVector[5] * sinVector[4];
  t840 = inertiaTensor_6[2] * sinVector[4] * sinVector[5];
  t822 = ((((t818 + t819) + t820) + t821) - t839) - t840;
  t828 = massVector[5] * t77 * t803;
  t829 = massVector[5] * COMVector_5[1] * t803;
  t830 = ((((-t746 + t779) + cosVector[5] * t816) + t828) + t829) - sinVector[5]
    * t812;
  t833 = cosVector[4] * massVector[5] * t803;
  t834 = sinVector[4] * t801 + t833;
  t837 = ((((t761 + t762) + t56 * t817) - cosVector[5] * t812) - sinVector[5] *
          t816) - COMVector_4[1] * t817;
  t838 = ((sinVector[4] * t822 + t56 * t806) + cosVector[4] * t830) -
    COMVector_4[1] * t806;
  t851 = ((COMVector_3[0] * t834 + t118 * t834) + cosVector[3] * t837) -
    sinVector[3] * t838;
  t854 = cosVector[5] * massVector[5] * COMVector_6[1] + massVector[5] *
    COMVector_6[0] * sinVector[5];
  t856 = cosVector[5] * massVector[5] * COMVector_6[0] - massVector[5] *
    COMVector_6[1] * sinVector[5];
  t857 = inertiaTensor_6[2] - massVector[5] * COMVector_6[0] * t36;
  t858 = inertiaTensor_6[5] - massVector[5] * COMVector_6[1] * t36;
  t860 = cosVector[5] * t858;
  t862 = sinVector[5] * t857;
  t864 = ((t860 + t862) + cosVector[4] * COMVector_4[1] * t854) - cosVector[4] *
    t56 * t854;
  t871 = (((inertiaTensor_6[8] + massVector[5] * (COMVector_6[0] * COMVector_6[0]))
           + massVector[5] * (COMVector_6[1] * COMVector_6[1])) - COMVector_5[1]
          * t854) - t77 * t854;
  t873 = cosVector[5] * t857;
  t881 = sinVector[5] * t858;
  t874 = t873 - t881;
  t875 = ((t56 * t856 + sinVector[4] * t871) - COMVector_4[1] * t856) -
    cosVector[4] * t874;
  t884 = sinVector[3] * t864 + cosVector[3] * t875;
  t885 = sinVector[3] * t875;
  t1606 = cosVector[3] * t864;
  t888 = ((t885 + sinVector[4] * t118 * t854) + COMVector_3[0] * sinVector[4] *
          t854) - t1606;
  t889 = inertiaTensor_2[0] * cosVector[1];
  t890 = cosVector[2] * t587;
  t891 = sinVector[2] * t589;
  t893 = COMVector_2[1] * t603;
  t894 = t572 + t586;
  t895 = ((((((t516 - t517) + t625) + t626) + t630) + t660) - COMVector_3[2] *
          t894) - COMVector_3[1] * t603;
  t896 = t890 + t891;
  t899 = sinVector[2] * t659;
  t900 = inertiaTensor_2[4] * sinVector[1];
  t905 = sinVector[2] * t587;
  t901 = (t617 + t639) - t905;
  t902 = COMVector_2[2] * t901;
  t903 = COMVector_2[0] * t603;
  t904 = t294 * t656;
  t908 = cosVector[2] * t659;
  t909 = COMVector_2[1] * t498;
  t912 = sinVector[2] * t539;
  t910 = (t639 + t641) - t912;
  t911 = cosVector[2] * t640;
  t919 = cosVector[2] * t541;
  t922 = sinVector[1] * (((((((-t653 + t657) + inertiaTensor_2[4] * cosVector[1])
    + t294 * t647) + COMVector_2[0] * t498) + COMVector_2[2] * ((t648 + t654) +
    t655)) + t919) - COMVector_2[2] * (t654 + t655)) * 0.5;
  t925 = massVector[4] * sinVector[4] * t668 + massVector[5] * sinVector[4] *
    t668;
  t928 = sinVector[5] * t665 - cosVector[4] * cosVector[5] * t668;
  t931 = cosVector[5] * t665 + cosVector[4] * sinVector[5] * t668;
  t932 = massVector[5] * sinVector[5] * t931;
  t937 = cosVector[5] * massVector[5] * t928;
  t934 = (t932 + cosVector[4] * massVector[4] * t668) - t937;
  t935 = cosVector[4] * t925 - sinVector[4] * t934;
  t939 = (((((((((t751 + t752) + t753) + t754) + t755) + t756) + t757) - t784) -
           t785) - t786) - COMVector_5[0] * t794;
  t941 = ((((((t759 + t760) + t761) + t762) - t788) - t789) - t790) +
    COMVector_5[2] * t794;
  t942 = cosVector[4] * t941;
  t943 = massVector[4] * t665;
  t944 = cosVector[5] * massVector[5] * t931;
  t945 = massVector[5] * sinVector[5] * t928;
  t946 = (t943 + t944) + t945;
  t947 = t944 + t945;
  t948 = t932 - t937;
  t950 = massVector[5] * t36 * t928 - massVector[5] * COMVector_6[0] *
    sinVector[4] * t668;
  t952 = massVector[5] * t36 * t931 - massVector[5] * COMVector_6[1] *
    sinVector[4] * t668;
  t953 = sinVector[4] * t925;
  t954 = cosVector[4] * t934;
  t955 = COMVector_4[1] * t946;
  t960 = ((((COMVector_5[0] * t947 + COMVector_5[1] * t948) + t77 * t934) +
           massVector[5] * COMVector_6[1] * t928) - COMVector_5[0] * t946) -
    massVector[5] * COMVector_6[0] * t931;
  t961 = sinVector[4] * t960;
  t963 = ((t943 + t944) + t945) + massVector[3] * t665;
  t971 = ((((COMVector_5[2] * t946 + t77 * t925) + cosVector[5] * t952) +
           sinVector[5] * t950) + massVector[5] * COMVector_5[1] * sinVector[4] *
          t668) - COMVector_5[2] * t947;
  t989 = sinVector[4] * t939;
  t990 = COMVector_4[1] * t794;
  t973 = (((inertiaTensor_4[1] + t766) + t942) - t989) - t990;
  t974 = sinVector[3] * t973;
  t976 = (t953 + t954) + massVector[3] * t668;
  t977 = COMVector_5[2] * t948;
  t978 = cosVector[5] * t950;
  t979 = t953 + t954;
  t980 = COMVector_4[1] * t979;
  t981 = massVector[5] * COMVector_5[0] * sinVector[4] * t668;
  t991 = COMVector_5[0] * t925;
  t992 = t56 * t976;
  t993 = COMVector_5[2] * t934;
  t994 = sinVector[5] * t952;
  t982 = ((((((t977 + t978) + t980) + t981) - t991) - t992) - t993) - t994;
  t986 = t56 * t963;
  t988 = cosVector[4] * t971;
  t983 = ((t955 + t961) - t986) - t988;
  t1121 = cosVector[3] * t750;
  t996 = ((t974 + sinVector[3] * t982) - t1121) - cosVector[3] * t983;
  t997 = t118 * t935;
  t998 = COMVector_3[0] * t935;
  t1001 = cosVector[3] * t973;
  t1002 = ((((t782 + t997) + t998) + cosVector[3] * t982) + sinVector[3] * t983)
    + t1001;
  t1003 = cosVector[4] * lengthVector[4] * sinVector[5];
  t1004 = ((t673 + t674) - t687) + t1003;
  t1007 = cosVector[4] * cosVector[5] * lengthVector[4];
  t1005 = ((t676 + t679) + t680) - t1007;
  t1006 = cosVector[5] * massVector[5] * t1004;
  t1008 = massVector[5] * sinVector[5] * t1005;
  t1009 = massVector[5] * sinVector[5] * t1004;
  t1010 = massVector[4] * (t684 - t713);
  t1011 = (t1006 + t1008) + t1010;
  t1013 = t1006 + t1008;
  t1014 = (-t698 + t699) + t700;
  t1016 = massVector[4] * (t678 - t694);
  t1028 = cosVector[5] * massVector[5] * t1005;
  t1017 = (t1009 + t1016) - t1028;
  t1019 = massVector[4] * (t695 - t698);
  t1020 = massVector[5] * t1014;
  t1021 = t1019 + t1020;
  t1024 = (((t729 + t731) - t742) + massVector[5] * COMVector_6[1] * t1014) +
    massVector[5] * t36 * t1004;
  t1027 = (((t735 - t744) - t745) + massVector[5] * COMVector_6[0] * t1014) +
    massVector[5] * t36 * t1005;
  t1029 = cosVector[4] * t1017;
  t1030 = sinVector[4] * t1017;
  t1031 = cosVector[4] * (t1019 + t1020);
  t1032 = t1030 + t1031;
  t1036 = sinVector[4] * t1021;
  t1033 = t1029 - t1036;
  t1034 = sinVector[5] * t1024;
  t1035 = massVector[3] * COMVector_4[2];
  t1037 = COMVector_5[2] * t1017;
  t1038 = t1009 - t1028;
  t1039 = massVector[5] * COMVector_5[0] * t1014;
  t1040 = t77 * t1017;
  t1041 = COMVector_5[0] * t1013;
  t1042 = massVector[5] * COMVector_6[1] * t1005;
  t1050 = massVector[3] * COMVector_4[0];
  t1043 = ((t1006 + t1008) + t1010) - t1050;
  t1044 = t56 * t1043;
  t1045 = sinVector[5] * t1027;
  t1047 = (t1006 + t1008) + massVector[4] * (t684 - t713);
  t1048 = cosVector[5] * t1024;
  t1049 = COMVector_5[1] * t1038;
  t1052 = ((((((t759 + t760) + t1045) + t1048) + COMVector_5[2] * t1047) -
            COMVector_5[2] * t1013) - t77 * t1021) - massVector[5] *
    COMVector_5[1] * t1014;
  t1053 = cosVector[4] * t1052;
  t1054 = (t1029 + t1035) - t1036;
  t1060 = cosVector[5] * t1027;
  t1056 = (((((((((-inertiaTensor_4[5] + t777) + t778) + t1034) + t1037) + t1039)
              + t56 * t1054) - COMVector_4[1] * t1033) - t1060) - COMVector_5[0]
           * t1021) - COMVector_5[2] * t1038;
  t1057 = COMVector_3[0] * t1032;
  t1058 = t118 * t1032;
  t1063 = cosVector[3] * t1056;
  t1064 = (((((((((t751 + t752) + t753) + t756) - t785) + t1040) + t1041) +
             t1042) + t1049) - COMVector_5[0] * t1047) - massVector[5] *
    COMVector_6[0] * t1004;
  t1464 = sinVector[4] * t1064;
  t1465 = COMVector_4[1] * t1047;
  t1068 = (((inertiaTensor_4[1] + t1044) + t1053) - t1464) - t1465;
  t1070 = cosVector[2] * cosVector[3] * lengthVector[1];
  t1069 = t670 - t1070;
  t1072 = t664 + cosVector[2] * lengthVector[1] * sinVector[3];
  t1074 = cosVector[5] * t1072 - cosVector[4] * sinVector[5] * t1069;
  t1075 = sinVector[5] * t1072;
  t1076 = massVector[4] * t1072;
  t1078 = cosVector[5] * massVector[5] * t1074;
  t1080 = t1075 + cosVector[4] * cosVector[5] * (t670 - t1070);
  t1081 = massVector[5] * sinVector[5] * t1080;
  t1083 = ((t1076 + t1078) + t1081) + massVector[3] * t1072;
  t1084 = (t1076 + t1078) + t1081;
  t1085 = cosVector[4] * massVector[4] * t1069;
  t1086 = cosVector[5] * massVector[5] * t1080;
  t1087 = massVector[4] * sinVector[4] * t1069;
  t1088 = massVector[5] * sinVector[4] * t1069;
  t1089 = t1087 + t1088;
  t1090 = t1078 + t1081;
  t1091 = massVector[3] * t1069;
  t1095 = massVector[5] * sinVector[5] * t1074;
  t1092 = (t1085 + t1086) - t1095;
  t1093 = sinVector[4] * t1089;
  t1094 = sinVector[3] * t1083;
  t1097 = cosVector[4] * (t1087 + t1088) - sinVector[4] * t1092;
  t1100 = massVector[5] * t36 * t1080 + massVector[5] * COMVector_6[0] *
    sinVector[4] * (t670 - t1070);
  t1103 = massVector[5] * t36 * t1074 + massVector[5] * COMVector_6[1] *
    sinVector[4] * (t670 - t1070);
  t1104 = cosVector[4] * t1092;
  t1105 = (t1091 + t1093) + t1104;
  t1106 = t56 * t1083;
  t1107 = COMVector_5[0] * t1084;
  t1108 = t1086 - t1095;
  t1109 = massVector[5] * COMVector_6[0] * t1074;
  t1113 = ((((cosVector[5] * t1103 + sinVector[5] * t1100) + COMVector_5[2] *
             t1084) - t77 * t1089) - COMVector_5[2] * t1090) - massVector[5] *
    COMVector_5[1] * sinVector[4] * t1069;
  t1114 = cosVector[4] * t1113;
  t1115 = cosVector[3] * t1083;
  t1116 = sinVector[5] * t1103;
  t2032 = t1093 + t1104;
  t1118 = COMVector_5[2] * t1108;
  t1119 = massVector[5] * COMVector_5[0] * sinVector[4] * (t670 - t1070);
  t1227 = cosVector[5] * t1100;
  t1228 = COMVector_5[2] * t1092;
  t1229 = COMVector_5[0] * t1089;
  t1230 = t56 * t1105;
  t1120 = ((((((t1116 + COMVector_4[1] * t2032) + t1118) + t1119) - t1227) -
            t1228) - t1229) - t1230;
  t1122 = lengthVector[2] * sinVector[3] * sinVector[4];
  t1129 = cosVector[4] * lengthVector[2] * sinVector[3];
  t1123 = t678 - t1129;
  t1125 = massVector[4] * ((t695 - t698) + t1122);
  t1126 = ((-t698 + t699) + t700) + t1122;
  t1128 = t1125 + massVector[5] * t1126;
  t1130 = sinVector[5] * t1123;
  t1131 = cosVector[3] * cosVector[5] * lengthVector[2];
  t1132 = (((t673 + t674) - t687) + t1130) + t1131;
  t1133 = massVector[5] * sinVector[5] * t1132;
  t1134 = cosVector[3] * lengthVector[2] * sinVector[5];
  t1136 = cosVector[5] * t1123;
  t1135 = (((t676 + t679) + t680) + t1134) - t1136;
  t1138 = massVector[4] * ((-t678 + t694) + t1129);
  t1139 = cosVector[5] * massVector[5] * t1135;
  t1140 = (-t1133 + t1138) + t1139;
  t1141 = sinVector[4] * t1128;
  t1142 = cosVector[4] * t1140;
  t1144 = (t1141 + t1142) - massVector[3] * (COMVector_4[2] - lengthVector[2] *
    sinVector[3]);
  t1145 = cosVector[3] * lengthVector[2];
  t1148 = massVector[4] * ((t684 - t713) + t1145);
  t1149 = cosVector[5] * massVector[5] * t1132;
  t1150 = massVector[5] * sinVector[5] * t1135;
  t1151 = ((t1148 + t1149) + t1150) - massVector[3] * (COMVector_4[0] - t1145);
  t1154 = cosVector[3] * t1144;
  t1156 = (t1148 + t1149) + t1150;
  t1157 = t1149 + t1150;
  t1160 = (((t729 + t731) - t742) + massVector[5] * t36 * t1132) + massVector[5]
    * COMVector_6[1] * t1126;
  t1163 = (((t735 - t744) - t745) + massVector[5] * t36 * t1135) + massVector[5]
    * COMVector_6[0] * t1126;
  t1164 = cosVector[4] * t1128;
  t1187 = sinVector[4] * t1140;
  t1165 = t1164 - t1187;
  t1166 = t1133 - t1139;
  t1170 = cosVector[5] * t1163;
  t1188 = sinVector[5] * t1160;
  t1173 = (((((((((inertiaTensor_4[5] - t777) - t778) + COMVector_5[0] * t1128)
                + COMVector_5[2] * t1166) + t56 * t1144) + t1170) + COMVector_5
             [2] * t1140) - t1188) - COMVector_4[1] * (t1141 + t1142)) -
    massVector[5] * COMVector_5[0] * t1126;
  t1178 = (((((((((t751 + t752) + t753) + t756) - t785) + COMVector_5[0] * t1157)
              + COMVector_5[1] * t1166) + massVector[5] * COMVector_6[1] * t1135)
            - COMVector_5[0] * t1156) - t77 * t1140) - massVector[5] *
    COMVector_6[0] * t1132;
  t1180 = cosVector[5] * t1160;
  t1181 = sinVector[5] * t1163;
  t1182 = ((((((t759 + t760) + COMVector_5[2] * t1156) + t1180) + t1181) - t77 *
            t1128) - COMVector_5[2] * t1157) - massVector[5] * COMVector_5[1] *
    t1126;
  t1184 = (((inertiaTensor_4[1] + t56 * t1151) + cosVector[4] * t1182) -
           COMVector_4[1] * t1156) - sinVector[4] * t1178;
  t1185 = cosVector[3] * t1151;
  t1186 = sinVector[3] * t1144;
  t1195 = sinVector[3] * t1151;
  t1204 = sinVector[3] * t1184;
  t1206 = sinVector[3] * t1173;
  t1208 = cosVector[3] * t1184;
  t1210 = (t1185 + t1186) + massVector[2] * t118;
  t1212 = (((inertiaTensor_3[2] + t1206) + t1208) + COMVector_3[2] * t1210) -
    COMVector_3[2] * (t1185 + t1186);
  t1214 = COMVector_5[1] * t1108;
  t1235 = COMVector_5[0] * t1090;
  t1236 = massVector[5] * COMVector_6[1] * t1080;
  t1215 = ((((t1107 + t1109) + t77 * ((t1085 + t1086) - t1095)) + t1214) - t1235)
    - t1236;
  t1234 = COMVector_4[1] * t1084;
  t1220 = ((t1106 + t1114) + sinVector[4] * t1215) - t1234;
  t1244 = cosVector[3] * t1105;
  t1222 = (t1094 + cosVector[2] * lengthVector[1] * massVector[2]) - t1244;
  t1223 = COMVector_3[2] * t1222;
  t1225 = COMVector_3[0] * t1097;
  t1226 = t118 * t1097;
  t1231 = cosVector[3] * t1120;
  t1232 = sinVector[3] * t1105;
  t1233 = t1115 + t1232;
  t1237 = cosVector[3] * t1220;
  t1240 = (t1115 + sinVector[3] * ((t1091 + t1093) + t1104)) + lengthVector[1] *
    massVector[2] * sinVector[2];
  t1241 = COMVector_3[2] * t1240;
  t1625 = COMVector_3[2] * t1233;
  t1242 = ((t1237 + t1241) - t1625) - sinVector[3] * t1120;
  t1628 = COMVector_3[2] * t792;
  t1243 = (((inertiaTensor_3[2] + t782) + t791) + t1001) - t1628;
  t1630 = COMVector_3[2] * t771;
  t1245 = (((((inertiaTensor_3[5] + t795) + t797) + t798) + t974) - t1121) -
    t1630;
  t1246 = (t1154 + massVector[2] * COMVector_3[1]) - t1195;
  t1426 = cosVector[3] * t1173;
  t1247 = (((((inertiaTensor_3[5] + t118 * t1165) + COMVector_3[2] * (t1154 -
    t1195)) + t1204) + COMVector_3[0] * t1165) - t1426) - COMVector_3[2] * t1246;
  t1248 = t669 - t698;
  t1249 = cosVector[4] * cosVector[5] * COMVector_6[1];
  t1250 = cosVector[4] * COMVector_6[0] * sinVector[5];
  t1251 = ((t666 - t678) + t1249) + t1250;
  t1253 = t707 + massVector[5] * t1251;
  t1254 = COMVector_6[0] * sinVector[4];
  t1255 = cosVector[4] * cosVector[5] * lengthVector[5];
  t1256 = cosVector[4] * cosVector[5] * COMVector_6[2];
  t1257 = COMVector_6[1] * sinVector[4];
  t1258 = cosVector[5] * t1248;
  t1263 = cosVector[4] * lengthVector[5] * sinVector[5];
  t1264 = cosVector[4] * COMVector_6[2] * sinVector[5];
  t1267 = ((t1257 + t1258) - t1263) - t1264;
  t1259 = cosVector[5] * massVector[5] * t1267;
  t1262 = massVector[5] * sinVector[5] * (((t1254 + t1255) + t1256) + sinVector
    [5] * t1248);
  t1266 = ((t1254 + t1255) + t1256) + sinVector[5] * (t669 - t698);
  t1268 = sinVector[4] * t1253;
  t1269 = massVector[5] * sinVector[5] * t1266;
  t1270 = (t697 + t1259) + t1269;
  t1274 = massVector[4] * (cosVector[4] * COMVector_5[2] + COMVector_5[0] *
    sinVector[4]);
  t1275 = cosVector[5] * massVector[5] * t1266;
  t1277 = massVector[5] * sinVector[5] * t1267;
  t1276 = (t1274 + t1275) - t1277;
  t1278 = cosVector[5] * massVector[5] * (((t1257 + t1258) - t1263) - t1264);
  t1279 = t1275 - t1277;
  t1280 = inertiaTensor_6[0] * cosVector[4] * cosVector[5];
  t1304 = inertiaTensor_6[2] * sinVector[4];
  t1305 = inertiaTensor_6[1] * cosVector[4] * sinVector[5];
  t1283 = (((t1280 + massVector[5] * COMVector_6[1] * t1251) + massVector[5] *
            t36 * t1266) - t1304) - t1305;
  t1284 = inertiaTensor_6[5] * sinVector[4];
  t1285 = inertiaTensor_6[4] * cosVector[4] * sinVector[5];
  t1306 = inertiaTensor_6[1] * cosVector[4] * cosVector[5];
  t1287 = (((t1284 + t1285) + massVector[5] * COMVector_6[0] * t1251) - t1306) -
    massVector[5] * t36 * t1267;
  t1288 = (t697 + t1269) + t1278;
  t1289 = ((t705 + t725) - cosVector[4] * t1253) - sinVector[4] * t1288;
  t1293 = COMVector_5[0] * t1276;
  t1294 = inertiaTensor_5[8] * sinVector[4];
  t1295 = inertiaTensor_6[8] * sinVector[4];
  t1296 = t1269 + t1278;
  t1297 = massVector[5] * COMVector_6[0] * t1266;
  t1298 = massVector[5] * COMVector_6[1] * t1267;
  t1299 = inertiaTensor_6[5] * cosVector[4] * sinVector[5];
  t1387 = COMVector_5[0] * t1279;
  t1388 = COMVector_5[1] * t1296;
  t1389 = t77 * t1288;
  t1390 = inertiaTensor_6[2] * cosVector[4] * cosVector[5];
  t1300 = (((((((((-t759 + t1293) + t1294) + t1295) + t1297) + t1298) + t1299) -
             t1387) - t1388) - t1389) - t1390;
  t1302 = COMVector_5[2] * t1279;
  t1303 = t77 * t1253;
  t1308 = massVector[5] * COMVector_5[1] * t1251;
  t1392 = inertiaTensor_5[0] * cosVector[4];
  t1393 = COMVector_5[2] * t1276;
  t1394 = cosVector[5] * t1283;
  t1395 = sinVector[5] * t1287;
  t2040 = ((((((t753 + t1302) + t1303) + t1308) - t1392) - t1393) - t1394) -
    t1395;
  t1311 = ((((COMVector_4[1] * t1276 + sinVector[4] * t941) + cosVector[4] *
             t2040) + cosVector[4] * t939) - sinVector[4] * t1300) - t56 * t1276;
  t1312 = inertiaTensor_5[1] * cosVector[4];
  t1313 = sinVector[5] * t1283;
  t1314 = ((t768 - t773) + t1268) - cosVector[4] * t1288;
  t1315 = massVector[5] * COMVector_5[0] * t1251;
  t1317 = cosVector[5] * COMVector_6[0] - COMVector_6[1] * sinVector[5];
  t1320 = cosVector[5] * lengthVector[5] + cosVector[5] * COMVector_6[2];
  t1324 = lengthVector[5] * sinVector[5] + COMVector_6[2] * sinVector[5];
  t1325 = massVector[5] * sinVector[5] * t1324;
  t1326 = cosVector[5] * massVector[5] * t1320;
  t1329 = massVector[4] * COMVector_5[0] + massVector[5] * t1317;
  t1331 = (t1325 + t1326) + massVector[4] * COMVector_5[2];
  t1334 = sinVector[4] * t1329 + cosVector[4] * t1331;
  t1335 = cosVector[5] * massVector[5] * t1324;
  t1337 = inertiaTensor_6[1] * sinVector[5];
  t1339 = massVector[5] * t36 * t1320;
  t1340 = ((inertiaTensor_6[4] * cosVector[5] + t1337) + massVector[5] *
           COMVector_6[0] * t1317) + t1339;
  t1341 = inertiaTensor_6[1] * cosVector[5];
  t1343 = massVector[5] * t36 * t1324;
  t1344 = ((t1341 + inertiaTensor_6[0] * sinVector[5]) + t1343) - massVector[5] *
    COMVector_6[1] * t1317;
  t1345 = t1325 + t1326;
  t1347 = cosVector[4] * t1329 - sinVector[4] * t1331;
  t1350 = cosVector[5] * t1340;
  t1352 = sinVector[5] * t1344;
  t1355 = (((((((inertiaTensor_5[4] + COMVector_5[0] * t1329) + t1350) + t1352)
              + COMVector_5[2] * t1331) + t56 * t1334) - COMVector_5[2] * t1345)
           - COMVector_4[1] * t1334) - massVector[5] * COMVector_5[0] * t1317;
  t1357 = massVector[5] * sinVector[5] * t1320;
  t1356 = t1335 - t1357;
  t1359 = cosVector[5] * t1344;
  t1374 = sinVector[5] * t1340;
  t1361 = (((inertiaTensor_5[1] + t77 * t1329) + t1359) + massVector[5] *
           COMVector_5[1] * t1317) - t1374;
  t1362 = cosVector[4] * t1361;
  t1367 = (((((inertiaTensor_5[5] + inertiaTensor_6[5] * cosVector[5]) +
              inertiaTensor_6[2] * sinVector[5]) + COMVector_5[1] * t1345) + t77
            * t1331) - massVector[5] * COMVector_6[1] * t1320) - massVector[5] *
    COMVector_6[0] * t1324;
  t1368 = t56 * t1356;
  t1377 = sinVector[4] * t1367;
  t1369 = ((t1362 + t1368) - t1377) - COMVector_4[1] * t1356;
  t1373 = cosVector[3] * t1355;
  t1379 = sinVector[3] * t1369;
  t1562 = COMVector_3[0] * t1347;
  t1563 = t118 * t1347;
  t1380 = ((t1373 + t1379) - t1562) - t1563;
  t1381 = cosVector[3] * t1369;
  t1564 = sinVector[3] * t1355;
  t1382 = t1381 - t1564;
  t1401 = inertiaTensor_5[5] * sinVector[4];
  t1403 = COMVector_5[0] * t1253;
  t1405 = cosVector[5] * t1287;
  t1386 = ((((((((t1312 + t1313) + t1315) + COMVector_5[2] * t1288) +
               COMVector_4[1] * t1314) - t1401) - COMVector_5[2] * t1296) -
            t1403) - t56 * t1314) - t1405;
  t1397 = sinVector[3] * t1311;
  t1398 = COMVector_3[0] * t1289;
  t1399 = t118 * t1289;
  t1407 = cosVector[3] * t1311 + sinVector[3] * t1386;
  t1410 = cosVector[5] * lengthVector[2] * sinVector[3] + cosVector[3] *
    cosVector[4] * lengthVector[2] * sinVector[5];
  t1412 = lengthVector[2] * sinVector[3] * sinVector[5] - cosVector[3] *
    cosVector[4] * cosVector[5] * lengthVector[2];
  t1413 = cosVector[5] * massVector[5] * t1410;
  t1415 = massVector[5] * sinVector[5] * t1412;
  t1416 = massVector[5] * sinVector[5] * t1410;
  t1419 = cosVector[5] * massVector[5] * t1412;
  t1418 = (t1416 + cosVector[3] * cosVector[4] * lengthVector[2] * massVector[4])
    - t1419;
  t1420 = lengthVector[2] * massVector[4] * sinVector[3];
  t1421 = (t1413 + t1415) + t1420;
  t1424 = cosVector[3] * lengthVector[2] * massVector[4] * sinVector[4] +
    cosVector[3] * lengthVector[2] * massVector[5] * sinVector[4];
  t1425 = t1413 + t1415;
  t1427 = sinVector[4] * t1424;
  t1428 = cosVector[4] * t1418;
  t1429 = t1416 - t1419;
  t1431 = massVector[5] * t36 * t1412 - cosVector[3] * lengthVector[2] *
    massVector[5] * COMVector_6[0] * sinVector[4];
  t1433 = massVector[5] * t36 * t1410 - cosVector[3] * lengthVector[2] *
    massVector[5] * COMVector_6[1] * sinVector[4];
  t1435 = cosVector[4] * t1424 - sinVector[4] * t1418;
  t1437 = COMVector_5[0] * t1425;
  t1438 = COMVector_5[1] * t1429;
  t1439 = t77 * t1418;
  t1440 = massVector[5] * COMVector_6[1] * t1412;
  t1472 = COMVector_5[0] * t1421;
  t1473 = massVector[5] * COMVector_6[0] * t1410;
  t1441 = ((((t1437 + t1438) + t1439) + t1440) - t1472) - t1473;
  t1449 = ((((COMVector_5[2] * t1421 + t77 * t1424) + cosVector[5] * t1433) +
            sinVector[5] * t1431) + cosVector[3] * lengthVector[2] * massVector
           [5] * COMVector_5[1] * sinVector[4]) - COMVector_5[2] * t1425;
  t1452 = ((t1413 + t1415) + t1420) + lengthVector[2] * massVector[3] *
    sinVector[3];
  t1454 = ((cosVector[4] * t1449 + t56 * t1452) - sinVector[4] * t1441) -
    COMVector_4[1] * t1421;
  t1455 = t1427 + t1428;
  t1456 = COMVector_4[1] * t1455;
  t1458 = (t1427 + t1428) + cosVector[3] * lengthVector[2] * massVector[3];
  t1459 = COMVector_5[2] * t1429;
  t1460 = cosVector[5] * t1431;
  t1461 = cosVector[3] * lengthVector[2] * massVector[5] * COMVector_5[0] *
    sinVector[4];
  t1466 = cosVector[3] * t1068;
  t1468 = sinVector[3] * t1056;
  t1467 = t1466 - t1468;
  t1469 = sinVector[2] * t1467;
  t1470 = sinVector[3] * ((((inertiaTensor_4[1] + t1044) + t1053) - t1464) -
    t1465);
  t1471 = ((t1057 + t1058) + t1063) + t1470;
  t1482 = COMVector_5[0] * t1424;
  t1483 = t56 * t1458;
  t1484 = COMVector_5[2] * t1418;
  t1485 = sinVector[5] * t1433;
  t1486 = ((((((t1456 + t1459) + t1460) + t1461) - t1482) - t1483) - t1484) -
    t1485;
  t1479 = ((t1204 - t1426) + cosVector[3] * t1454) + sinVector[3] * t1486;
  t1480 = COMVector_3[0] * t1435;
  t1481 = t118 * t1435;
  t1487 = COMVector_2[0] * t450;
  t1488 = t294 * t450;
  t1489 = t456 + t503;
  t1491 = ((((((t502 + t505) + t515) + t516) - t517) + sinVector[3] * t519) -
           COMVector_3[1] * t450) - COMVector_3[2] * t1489;
  t1492 = (t472 + t494) - t523;
  t1493 = COMVector_3[2] * t1492;
  t1496 = cosVector[2] * t1491;
  t1497 = ((((((t520 + t521) + t524) + t528) - t651) + t1493) - COMVector_3[2] *
           t522) - sinVector[3] * t485;
  t1498 = t698 - t1122;
  t1499 = ((t1254 + t1255) + t1256) - sinVector[5] * t1498;
  t1501 = ((-t1257 + t1263) + t1264) + cosVector[5] * t1498;
  t1503 = cosVector[5] * massVector[5] * t1499;
  t1504 = massVector[5] * sinVector[5] * t1501;
  t1505 = massVector[5] * sinVector[5] * t1499;
  t1506 = (t1274 + t1503) + t1504;
  t1507 = t1503 + t1504;
  t1508 = ((-t678 + t1129) + t1249) + t1250;
  t1510 = t1138 + massVector[5] * t1508;
  t1512 = cosVector[5] * massVector[5] * t1501;
  t1511 = (t1125 + t1505) - t1512;
  t1514 = ((t1164 - t1187) + sinVector[4] * t1510) - cosVector[4] * t1511;
  t1517 = (((t1280 - t1304) - t1305) + massVector[5] * COMVector_6[1] * t1508) +
    massVector[5] * t36 * t1499;
  t1520 = (((t1284 + t1285) - t1306) + massVector[5] * t36 * t1501) +
    massVector[5] * COMVector_6[0] * t1508;
  t1521 = ((t1141 + t1142) - cosVector[4] * t1510) - sinVector[4] * t1511;
  t1524 = t1505 - t1512;
  t1526 = COMVector_4[1] * t1506;
  t1527 = COMVector_5[2] * t1507;
  t1528 = t77 * t1510;
  t1529 = massVector[5] * COMVector_5[1] * t1508;
  t1545 = COMVector_5[2] * t1506;
  t1546 = cosVector[5] * t1517;
  t1547 = sinVector[5] * t1520;
  t2085 = ((((((t753 - t1392) + t1527) + t1528) + t1529) - t1545) - t1546) -
    t1547;
  t1531 = cosVector[4] * t1178;
  t1532 = sinVector[4] * t1182;
  t1538 = ((((((((t1312 - t1401) + COMVector_4[1] * t1514) + sinVector[5] *
                t1517) + COMVector_5[2] * t1511) + massVector[5] * COMVector_5[0]
              * t1508) - t56 * t1514) - COMVector_5[2] * t1524) - COMVector_5[0]
           * t1510) - cosVector[5] * t1520;
  t1540 = (((((((((t759 - t1294) - t1295) - t1299) + t1390) + t77 * t1511) +
              COMVector_5[0] * t1507) + massVector[5] * COMVector_6[1] * t1501)
            + COMVector_5[1] * t1524) - COMVector_5[0] * t1506) - massVector[5] *
    COMVector_6[0] * t1499;
  t1541 = sinVector[4] * t1540;
  t1548 = t56 * t1506;
  t1542 = ((((t1526 + cosVector[4] * t2085) + t1531) + t1532) + t1541) - t1548;
  t1554 = sinVector[3] * t1538;
  t1555 = cosVector[3] * t1542 + t1554;
  t1559 = COMVector_3[0] * t1521;
  t1560 = t118 * t1521;
  t1862 = cosVector[3] * t1538;
  t1561 = ((sinVector[3] * t1542 + t1559) + t1560) - t1862;
  t1565 = cosVector[2] * t1382;
  t1567 = cosVector[1] * (t1565 - sinVector[2] * t1380) * 0.5;
  t1568 = cosVector[2] * t1380;
  t1569 = sinVector[2] * t1382;
  t1573 = cosVector[2] * t1212 - sinVector[2] * t1247;
  t1574 = cosVector[2] * t1247;
  t1575 = sinVector[2] * t1212;
  t1576 = ((t673 + t674) + t1130) + t1131;
  t1577 = ((t679 + t680) + t1134) - t1136;
  t1578 = ((t1149 + t1150) - cosVector[5] * massVector[5] * t1576) - massVector
    [5] * sinVector[5] * t1577;
  t1579 = t835 - cosVector[4] * t1578;
  t1584 = ((t742 + t810) + t811) + massVector[5] * t36 * t1576;
  t1586 = ((t745 + t815) - t826) + massVector[5] * t36 * t1577;
  t1587 = ((t1133 - t1139) + cosVector[5] * massVector[5] * t1577) - massVector
    [5] * sinVector[5] * t1576;
  t1590 = COMVector_5[1] * t1578;
  t1591 = t77 * t1578;
  t1592 = massVector[5] * COMVector_6[1] * t1576;
  t1593 = massVector[5] * COMVector_6[0] * t1577;
  t1594 = ((((-t839 - t840) + t1590) + t1591) + t1592) + t1593;
  t1597 = ((((t828 + t829) - t1170) + t1188) + cosVector[5] * t1586) -
    sinVector[5] * t1584;
  t1600 = t833 + sinVector[4] * t1578;
  t1603 = ((((t1180 + t1181) + COMVector_4[1] * t1579) - cosVector[5] * t1584) -
           t56 * t1579) - sinVector[5] * t1586;
  t1604 = ((t56 * t1587 + sinVector[4] * t1594) + cosVector[4] * t1597) -
    COMVector_4[1] * t1587;
  t1605 = cosVector[2] * t884;
  t1607 = t1605 - sinVector[2] * t888;
  t1608 = sinVector[2] * t884;
  t1609 = cosVector[2] * t888;
  t1618 = ((COMVector_3[0] * t1600 + t118 * t1600) + cosVector[3] * t1603) -
    sinVector[3] * t1604;
  t1621 = sinVector[3] * t1603 + cosVector[3] * t1604;
  t1622 = t1094 - t1244;
  t1623 = sinVector[3] * t1220;
  t1637 = COMVector_3[2] * t1622;
  t1624 = ((((t1223 + t1225) + t1226) + t1231) + t1623) - t1637;
  t1627 = cosVector[2] * t1242;
  t1629 = sinVector[2] * t1243;
  t1631 = cosVector[2] * t1245;
  t1633 = t294 * t1165;
  t1634 = COMVector_2[0] * t1165;
  t1636 = sinVector[1] * (((t1574 + t1575) + t1633) + t1634) * 0.5;
  t1640 = COMVector_2[0] * t1097;
  t1641 = t294 * t1097;
  t1642 = sinVector[2] * t1245;
  t1644 = cosVector[1] * (((((cosVector[2] * t1624 + sinVector[2] * t1242) +
    t1640) + t1641) + t1642) - cosVector[2] * t1243) * 0.5;
  t1645 = COMVector_2[0] * t1435;
  t1646 = t294 * t1435;
  t1647 = cosVector[2] * t1467;
  t1648 = cosVector[1] * (t1647 - sinVector[2] * t1471) * 0.5;
  t1649 = cosVector[2] * t1471;
  t1650 = t1469 + t1649;
  t1652 = ((((t1206 + t1208) + t1480) + t1481) + cosVector[3] * (((((((t1456 +
    t1459) + t1460) + t1461) - t1482) - t1483) - t1484) - t1485)) - sinVector[3]
    * t1454;
  t1653 = cosVector[2] * t1479;
  t1654 = sinVector[3] * t328;
  t1655 = cosVector[3] * t330;
  t1656 = cosVector[3] * t328;
  t1661 = sinVector[3] * t330;
  t1657 = ((((t331 + t332) + t333) + t334) + t1656) - t1661;
  t1658 = COMVector_2[0] * t223;
  t1659 = t223 * t294;
  t1660 = ((t306 - t537) + t1654) + t1655;
  t1662 = sinVector[2] * t1657;
  t1663 = (t673 + t674) + t1003;
  t1664 = (t679 + t680) - t1007;
  t1665 = ((t1006 + t1008) - cosVector[5] * massVector[5] * t1663) - massVector
    [5] * sinVector[5] * t1664;
  t1669 = ((t1009 - t1028) + cosVector[5] * massVector[5] * t1664) - massVector
    [5] * sinVector[5] * t1663;
  t1671 = ((t742 + t810) + t811) + massVector[5] * t36 * t1663;
  t1673 = ((t745 + t815) - t826) + massVector[5] * t36 * t1664;
  t1674 = t835 - cosVector[4] * t1665;
  t1676 = t833 + sinVector[4] * t1665;
  t1679 = ((((t1045 + t1048) + COMVector_4[1] * t1674) - cosVector[5] * t1671) -
           sinVector[5] * t1673) - t56 * t1674;
  t1680 = COMVector_5[1] * t1665;
  t1681 = t77 * t1665;
  t1682 = massVector[5] * COMVector_6[1] * t1663;
  t1683 = massVector[5] * COMVector_6[0] * t1664;
  t1684 = ((((-t839 - t840) + t1680) + t1681) + t1682) + t1683;
  t1687 = ((((t828 + t829) + t1034) - t1060) + cosVector[5] * t1673) -
    sinVector[5] * t1671;
  t1691 = ((sinVector[4] * t1684 + cosVector[4] * t1687) + t56 * t1669) -
    COMVector_4[1] * t1669;
  t1699 = cosVector[3] * t1691 + sinVector[3] * t1679;
  t1703 = ((t118 * t1676 + COMVector_3[0] * t1676) + cosVector[3] * t1679) -
    sinVector[3] * t1691;
  t1704 = t885 - t1606;
  t1705 = ((t1254 + t1255) + t1256) - lengthVector[4] * sinVector[4] *
    sinVector[5];
  t1706 = massVector[5] * sinVector[5] * t1705;
  t1708 = ((-t1257 + t1263) + t1264) + cosVector[5] * lengthVector[4] *
    sinVector[4];
  t1713 = cosVector[5] * massVector[5] * t1708;
  t1709 = (t1019 + t1706) - t1713;
  t1710 = (-t678 + t1249) + t1250;
  t1711 = t1016 - massVector[5] * t1710;
  t1715 = ((t1030 + t1031) - cosVector[4] * t1709) - sinVector[4] * t1711;
  t1716 = cosVector[5] * massVector[5] * t1705;
  t1717 = massVector[5] * sinVector[5] * t1708;
  t1718 = t1706 - t1713;
  t1719 = (t1274 + t1716) + t1717;
  t1720 = t1716 + t1717;
  t1723 = (((t1280 - t1304) - t1305) + massVector[5] * COMVector_6[1] * t1710) +
    massVector[5] * t36 * t1705;
  t1726 = (((t1284 + t1285) - t1306) + massVector[5] * COMVector_6[0] * t1710) +
    massVector[5] * t36 * t1708;
  t1727 = COMVector_5[0] * t1711;
  t1730 = COMVector_4[1] * t1715;
  t1731 = sinVector[5] * t1723;
  t1732 = massVector[5] * COMVector_5[0] * t1710;
  t1737 = (((((((((t759 - t1294) - t1295) - t1299) + t1390) + t77 * t1709) +
              COMVector_5[0] * t1720) + COMVector_5[1] * t1718) + massVector[5] *
            COMVector_6[1] * t1708) - COMVector_5[0] * t1719) - massVector[5] *
    COMVector_6[0] * t1705;
  t1738 = sinVector[4] * t1737;
  t1739 = COMVector_4[1] * t1719;
  t1744 = ((((((-t753 + t1392) + COMVector_5[2] * t1719) + t77 * t1711) +
             cosVector[5] * t1723) + sinVector[5] * t1726) - COMVector_5[2] *
           t1720) - massVector[5] * COMVector_5[1] * t1710;
  t1745 = sinVector[4] * t1052;
  t1746 = cosVector[4] * t1064;
  t1757 = t56 * t1719;
  t1760 = cosVector[4] * t1744;
  t1747 = ((((t1738 + t1739) + t1745) + t1746) - t1757) - t1760;
  t1749 = ((t1029 - t1036) + sinVector[4] * ((t1019 + t1706) - t1713)) -
    cosVector[4] * t1711;
  t1752 = t56 * t1715;
  t1753 = COMVector_5[2] * t1718;
  t1754 = cosVector[5] * t1726;
  t1751 = ((((((((t1312 - t1401) + t1727) + t1730) + t1731) + t1732) +
             COMVector_5[2] * t1709) - t1752) - t1753) - t1754;
  t1761 = cosVector[3] * t1747;
  t1763 = t1761 + sinVector[3] * t1751;
  t1765 = COMVector_3[0] * t1749;
  t1766 = t118 * t1749;
  t1767 = t294 * t935;
  t1768 = COMVector_2[0] * t935;
  t1770 = cosVector[2] * t996;
  t1771 = cosVector[3] * ((((inertiaTensor_4[1] + t766) + t942) - t989) - t990);
  t1774 = ((((t782 + t997) + t998) + t1771) + sinVector[3] * (((t955 + t961) -
             t986) - t988)) + cosVector[3] * (((((((t977 + t978) + t980) + t981)
    - t991) - t992) - t993) - t994);
  t1776 = COMVector_2[0] * t1032;
  t1777 = t294 * t1032;
  t1778 = t1063 + t1470;
  t1781 = sinVector[4] * t1361 + cosVector[4] * t1367;
  t1783 = COMVector_4[1] * t1347 - t56 * t1347;
  t1787 = ((sinVector[3] * t1781 + cosVector[3] * t1783) - COMVector_3[0] *
           t1334) - t118 * t1334;
  t1789 = cosVector[3] * t1781 - sinVector[3] * t1783;
  t1792 = cosVector[5] * COMVector_6[1] + COMVector_6[0] * sinVector[5];
  t1795 = ((-t1337 + t1339) + inertiaTensor_6[0] * cosVector[5]) + massVector[5]
    * COMVector_6[1] * t1792;
  t1798 = ((-t1341 + t1343) + inertiaTensor_6[4] * sinVector[5]) + massVector[5]
    * COMVector_6[0] * t1792;
  t1801 = ((((t1359 - t1374) + sinVector[5] * t1795) + massVector[5] *
            COMVector_4[1] * sinVector[4] * t1792) - cosVector[5] * t1798) -
    massVector[5] * sinVector[4] * t56 * t1792;
  t1804 = ((inertiaTensor_6[2] * cosVector[5] + massVector[5] * COMVector_6[1] *
            t1324) - inertiaTensor_6[5] * sinVector[5]) - massVector[5] *
    COMVector_6[0] * t1320;
  t1808 = ((((t1350 + t1352) + massVector[5] * COMVector_5[1] * t1792) +
            massVector[5] * t77 * t1792) - cosVector[5] * t1795) - sinVector[5] *
    t1798;
  t1810 = sinVector[4] * t1804 + cosVector[4] * t1808;
  t1819 = sinVector[3] * t1801 + cosVector[3] * t1810;
  t1823 = ((cosVector[3] * t1801 + cosVector[4] * massVector[5] * COMVector_3[0]
            * t1792) + cosVector[4] * massVector[5] * t118 * t1792) - sinVector
    [3] * t1810;
  t1826 = sinVector[4] * t874 + cosVector[4] * t871;
  t1827 = COMVector_4[1] * sinVector[4] * t854;
  t1830 = sinVector[4] * t56 * t854;
  t1828 = t1827 - t1830;
  t1831 = cosVector[3] * t1826 - sinVector[3] * t1828;
  t1832 = sinVector[3] * t1826;
  t1833 = cosVector[4] * t118 * t854;
  t1834 = cosVector[4] * COMVector_3[0] * t854;
  t1836 = ((t1832 + t1833) + t1834) + cosVector[3] * t1828;
  t1846 = sinVector[1] * (cosVector[2] * t426 - sinVector[2] * t424) * 0.5 +
    cosVector[1] * (((cosVector[2] * t424 + sinVector[2] * t426) - COMVector_2[0]
                     * t355) - t294 * t355) * 0.5;
  t1848 = ((((((((t1312 - t1401) + t1727) + t1730) + t1731) + t1732) - t1752) -
            t1753) - t1754) + COMVector_5[2] * ((t1019 + t1706) - t1713);
  t1850 = ((t1765 + t1766) + cosVector[3] * t1848) - sinVector[3] * t1747;
  t1851 = sinVector[3] * t1848;
  t1852 = t1761 + t1851;
  t1853 = COMVector_2[0] * t1749;
  t1855 = cosVector[2] * t1850;
  t1856 = t294 * t1749;
  t1859 = COMVector_4[1] * (t1335 - t1357);
  t1861 = ((t1362 + t1368) - t1377) - t1859;
  t1857 = sinVector[3] * t1861;
  t1858 = t1373 + t1857;
  t1860 = cosVector[2] * t1858;
  t1864 = sinVector[1] * (cosVector[2] * t1555 - sinVector[2] * t1561) * 0.5;
  t1867 = COMVector_2[0] * t1521;
  t1868 = t294 * t1521;
  t1870 = cosVector[1] * (((sinVector[2] * t1555 + cosVector[2] * t1561) + t1867)
    + t1868) * 0.5;
  t1871 = t1564 - cosVector[3] * t1861;
  t1872 = ((t1373 - t1562) - t1563) + t1857;
  t1874 = ((t1397 + t1398) + t1399) - cosVector[3] * t1386;
  t1875 = COMVector_2[0] * t1289;
  t1876 = sinVector[2] * t1407;
  t1877 = t294 * t1289;
  t1878 = cosVector[2] * t1872;
  t1880 = cosVector[2] * t1871;
  t1881 = sinVector[2] * t1872 + t1880;
  t1885 = sinVector[1] * (cosVector[2] * t1407 - sinVector[2] * t1874) * 0.5;
  t1898 = cosVector[2] * t1819 + sinVector[2] * t1823;
  t1903 = cosVector[1] * (((cosVector[2] * t1823 + cosVector[4] * massVector[5] *
    COMVector_2[0] * t1792) + cosVector[4] * massVector[5] * t294 * t1792) -
    sinVector[2] * t1819) * 0.5;
  t1905 = sinVector[2] * t1831;
  t1906 = cosVector[4] * t294 * t854;
  t1907 = cosVector[4] * COMVector_2[0] * t854;
  t1908 = cosVector[2] * t1831;
  t1910 = ((t1832 + t1833) + t1834) + cosVector[3] * (t1827 - t1830);
  t1916 = cosVector[1] * (((t294 * t1676 + COMVector_2[0] * t1676) + cosVector[2]
    * t1703) - sinVector[2] * t1699) * 0.5;
  t1919 = t1605 - sinVector[2] * t1704;
  t1922 = sinVector[1] * (t1608 + cosVector[2] * t1704) * 0.5;
  t1925 = COMVector_5[1] * t856 + t77 * t856;
  t1927 = t860 + t862;
  t1929 = ((COMVector_4[1] * t854 + cosVector[4] * t1927) - t56 * t854) -
    sinVector[4] * t1925;
  t1931 = ((t873 - t881) + cosVector[4] * COMVector_4[1] * t856) - cosVector[4] *
    t56 * t856;
  t1937 = cosVector[3] * t1929 + sinVector[3] * t1931;
  t1941 = ((sinVector[3] * t1929 + sinVector[4] * t118 * t856) + COMVector_3[0] *
           sinVector[4] * t856) - cosVector[3] * t1931;
  t1942 = cosVector[3] * t838 + sinVector[3] * t837;
  t1951 = cosVector[1] * t1607 * 0.5;
  t1955 = sinVector[1] * (cosVector[2] * t1942 + sinVector[2] * t851) * 0.5;
  t2008 = sinVector[1] * (((t1608 + t1609) + sinVector[4] * t294 * t854) +
    COMVector_2[0] * sinVector[4] * t854) * 0.5;
  t2443 = cosVector[1] * (((cosVector[2] * t851 + COMVector_2[0] * t834) + t294 *
    t834) - sinVector[2] * t1942) * 0.5;
  t1957 = ((t1951 + t1955) - t2008) - t2443;
  t1963 = cosVector[1] * (((cosVector[2] * t1618 + COMVector_2[0] * t1600) +
    t294 * t1600) - sinVector[2] * t1621) * 0.5;
  t1965 = sinVector[1] * (t1608 + t1609) * 0.5;
  t1968 = sinVector[2] * t1618 + cosVector[2] * t1621;
  t1969 = cosVector[2] * t771;
  t1970 = massVector[1] * COMVector_2[1];
  t1971 = COMVector_2[0] * t769;
  t1972 = t294 * t769;
  t1973 = (t648 + t890) + t891;
  t1974 = t775 + t776;
  t1977 = COMVector_2[2] * ((t775 + t776) + massVector[1] * t294);
  t1978 = (((inertiaTensor_3[2] + t782) + t791) - t1628) + t1771;
  t1979 = t617 - t905;
  t1980 = inertiaTensor_4[1] * t9 * 0.5;
  t1981 = inertiaTensor_4[5] * t13 * 0.5;
  t1982 = sinVector[2] * (t1466 - t1468);
  t1983 = ((t499 + t500) - cosVector[3] * t240) - sinVector[3] * t230;
  t1989 = cosVector[2] * t1983 + sinVector[2] * (((t493 - t533) + sinVector[3] *
    t240) - cosVector[3] * t230);
  t1990 = inertiaTensor_3[2] * t6 * 0.5;
  t2105 = cosVector[2] * t504;
  t2106 = sinVector[2] * t1492;
  t1991 = ((t654 + t655) - t2105) - t2106;
  t1994 = ((((((-t657 + t889) + t893) + t899) + COMVector_2[2] * t1973) +
            cosVector[2] * t895) - COMVector_2[1] * t656) - COMVector_2[2] *
    t896;
  t1997 = inertiaTensor_2[1] * cosVector[1];
  t1996 = cosVector[1] * (((((((t900 + t902) + t903) + t904) + t908) - t1997) -
    COMVector_2[2] * t1979) - sinVector[2] * t895) * 0.5;
  t1999 = COMVector_2[2] * (t641 - t912);
  t2003 = cosVector[3] * t59 + sinVector[3] * t79;
  t2009 = sinVector[2] * (cosVector[3] * t79 - sinVector[3] * t59) + cosVector[2]
    * t2003;
  t2011 = sinVector[2] * t1871;
  t2014 = sinVector[1] * (((-t1878 + COMVector_2[0] * t1347) + t2011) + t294 *
    t1347) * 0.5;
  t2016 = cosVector[3] * t363 - sinVector[3] * t378;
  t2022 = cosVector[2] * t2016 - sinVector[2] * (cosVector[3] * t378 +
    sinVector[3] * t363);
  t2023 = cosVector[3] * t719;
  t2025 = ((t770 - t772) + sinVector[3] * t976) - cosVector[3] * t963;
  t2029 = cosVector[2] * t2025 - sinVector[2] * (((t739 + t2023) - cosVector[3] *
    t976) - sinVector[3] * t963);
  t2031 = ((t1969 + sinVector[2] * t1222) - sinVector[2] * t774) - cosVector[2] *
    t1240;
  t2035 = sinVector[3] * t1314 + cosVector[3] * t1276;
  t2039 = cosVector[2] * t2035 + sinVector[2] * (cosVector[3] * t1314 -
    sinVector[3] * t1276);
  t2043 = cosVector[3] * t806 + sinVector[3] * t817;
  t2047 = cosVector[2] * t2043 + sinVector[2] * (cosVector[3] * t817 -
    sinVector[3] * t806);
  t2048 = COMVector_4[2] * t1105 * 0.5;
  t2051 = COMVector_2[0] * t2031 * 0.5;
  t2052 = t294 * t2031 * 0.5;
  t2053 = cosVector[4] * t1215 * 0.5;
  t2054 = COMVector_3[1] * t1222 * 0.5;
  t2055 = COMVector_4[0] * t1083 * 0.5;
  t2057 = cosVector[3] * t1587 - sinVector[3] * t1579;
  t2062 = cosVector[2] * t2057 - sinVector[2] * (sinVector[3] * t1587 +
    cosVector[3] * t1579);
  t2065 = sinVector[3] * t856 + cosVector[3] * cosVector[4] * t854;
  t2070 = cosVector[2] * t2065 + sinVector[2] * (cosVector[3] * t856 -
    cosVector[4] * sinVector[3] * t854);
  t2073 = ((t1154 - t1195) + sinVector[3] * t1458) - cosVector[3] * t1452;
  t2076 = cosVector[3] * t1054 + sinVector[3] * (((t1006 + t1008) + t1010) -
    t1050);
  t2080 = cosVector[2] * t2076 + sinVector[2] * (cosVector[3] * t1043 -
    sinVector[3] * t1054);
  t2084 = cosVector[2] * t2073 - sinVector[2] * (((t1185 + t1186) - sinVector[3]
    * t1452) - cosVector[3] * t1458);
  t2088 = sinVector[3] * t1356 + cosVector[3] * t1334;
  t2089 = cosVector[2] * t2088;
  t2092 = sinVector[2] * (cosVector[3] * t1356 - sinVector[3] * t1334);
  t2095 = cosVector[3] * t1506 + sinVector[3] * t1514;
  t2099 = cosVector[2] * t2095 + sinVector[2] * (cosVector[3] * t1514 -
    sinVector[3] * t1506);
  t2100 = COMVector_3[0] * t894 * 0.5;
  t2101 = COMVector_3[1] * t589 * 0.5;
  t2102 = COMVector_3[0] * t1489 * 0.5;
  t2103 = COMVector_3[1] * t1492 * 0.5;
  t2104 = t118 * t587 * 0.5;
  t2107 = t118 * t504 * 0.5;
  t2108 = COMVector_4[2] * t609 * 0.5;
  t2109 = COMVector_4[0] * t574 * 0.5;
  t2110 = COMVector_4[0] * t460 * 0.5;
  t2112 = cosVector[2] * t1246 - sinVector[2] * t1210;
  t2117 = t118 * t2025 * 0.5;
  t2119 = COMVector_4[0] * t963 * 0.5;
  t2120 = COMVector_4[2] * t979 * 0.5;
  t2121 = COMVector_3[0] * t2025 * 0.5;
  t2269 = sinVector[4] * t971 * 0.5;
  t2270 = COMVector_4[0] * t946 * 0.5;
  t2271 = cosVector[4] * t960 * 0.5;
  t2272 = COMVector_4[2] * t976 * 0.5;
  t2122 = ((((((((COMVector_2[0] * t2029 * 0.5 + t2117) + t294 * t2029 * 0.5) +
                t2119) + t2120) + t2121) - t2269) - t2270) - t2271) - t2272;
  t2124 = COMVector_2[0] * t2080 * 0.5;
  t2128 = t294 * t2080 * 0.5;
  t2129 = COMVector_4[0] * t1421 * 0.5;
  t2130 = sinVector[4] * t1449 * 0.5;
  t2131 = COMVector_4[2] * t1458 * 0.5;
  t2132 = cosVector[4] * t1441 * 0.5;
  t2285 = COMVector_4[0] * t1452 * 0.5;
  t2286 = t118 * t2073 * 0.5;
  t2287 = COMVector_4[2] * t1455 * 0.5;
  t2288 = COMVector_3[0] * t2073 * 0.5;
  t2330 = t294 * t2084 * 0.5;
  t2331 = COMVector_2[0] * t2084 * 0.5;
  t2133 = ((((((((((t2124 + t2128) + t2129) + t2130) + t2131) + t2132) - t2285)
              - t2286) - t2287) - t2288) - t2330) - t2331;
  t2135 = cosVector[3] * t1669;
  t2137 = sinVector[3] * t1674;
  t2136 = t2135 - t2137;
  t2142 = cosVector[2] * t2136 - sinVector[2] * (sinVector[3] * t1669 +
    cosVector[3] * t1674);
  t2143 = t118 * t1983 * 0.5;
  t2144 = cosVector[4] * t250 * 0.5;
  t2145 = COMVector_4[2] * t230 * 0.5;
  t2146 = COMVector_4[0] * t240 * 0.5;
  t2148 = COMVector_2[0] * t1989 * 0.5;
  t2149 = COMVector_3[0] * t1983 * 0.5;
  t2150 = t294 * t1989 * 0.5;
  t2151 = sinVector[4] * t258 * 0.5;
  t2154 = cosVector[3] * t1719 + sinVector[3] * t1715;
  t2156 = t2089 + t2092;
  t2157 = COMVector_2[0] * t2156 * 0.5;
  t2161 = cosVector[2] * t2154 + sinVector[2] * (cosVector[3] * t1715 -
    sinVector[3] * t1719);
  t2162 = t294 * t2156 * 0.5;
  t2163 = cosVector[4] * t1540 * 0.5;
  t2165 = COMVector_2[0] * t2099 * 0.5;
  t2166 = COMVector_3[0] * t2095 * 0.5;
  t2167 = t294 * t2099 * 0.5;
  t2168 = cosVector[4] * t1182 * 0.5;
  t2169 = t118 * t2095 * 0.5;
  t2172 = cosVector[2] * massVector[5] * sinVector[3] * sinVector[4] * t1792 +
    cosVector[3] * massVector[5] * sinVector[2] * sinVector[4] * t1792;
  t2175 = cosVector[2] * sinVector[3] * sinVector[4] * t854 + cosVector[3] *
    sinVector[2] * sinVector[4] * t854;
  t2178 = cosVector[2] * sinVector[3] * t1347 + cosVector[3] * sinVector[2] *
    t1347;
  t2181 = t118 * t2035 * 0.5;
  t2183 = cosVector[4] * t941 * 0.5;
  t2184 = COMVector_3[0] * t2035 * 0.5;
  t2275 = sinVector[4] * t939 * 0.5;
  t2276 = cosVector[4] * t1300 * 0.5;
  t2277 = sinVector[4] * t2040 * 0.5;
  t2185 = ((((((COMVector_2[0] * t2039 * 0.5 + t2181) + t294 * t2039 * 0.5) +
              t2183) + t2184) - t2275) - t2276) - t2277;
  t2186 = sinVector[4] * t386 * 0.5;
  t2187 = sinVector[4] * t287 * 0.5;
  t2189 = COMVector_2[0] * t2022 * 0.5;
  t2190 = COMVector_3[0] * t2016 * 0.5;
  t2191 = t294 * t2022 * 0.5;
  t2192 = t118 * t2016 * 0.5;
  t2193 = cosVector[4] * t396 * 0.5;
  t2194 = cosVector[4] * t1737 * 0.5;
  t2195 = COMVector_3[0] * t2154 * 0.5;
  t2196 = COMVector_3[0] * t2088 * 0.5;
  t2197 = t118 * t2154 * 0.5;
  t2198 = t118 * t2088 * 0.5;
  t2200 = COMVector_2[0] * t2161 * 0.5;
  t2201 = cosVector[4] * t1052 * 0.5;
  t2202 = sinVector[4] * t1744 * 0.5;
  t2203 = t294 * t2161 * 0.5;
  t2205 = COMVector_2[0] * t2062 * 0.5;
  t2206 = COMVector_2[0] * t2070 * 0.5;
  t2207 = t294 * t2062 * 0.5;
  t2208 = t294 * t2070 * 0.5;
  t2209 = COMVector_3[0] * t2057 * 0.5;
  t2210 = t118 * t2057 * 0.5;
  t2211 = sinVector[4] * t1597 * 0.5;
  t2212 = COMVector_2[0] * t2172 * 0.5;
  t2213 = t294 * t2175 * 0.5;
  t2214 = t294 * t2172 * 0.5;
  t2215 = cosVector[4] * t1804 * 0.5;
  t2216 = COMVector_2[0] * t2175 * 0.5;
  t2217 = sinVector[4] * t871 * 0.5;
  t2218 = COMVector_3[0] * sinVector[3] * sinVector[4] * t854 * 0.5;
  t2219 = sinVector[3] * sinVector[4] * t118 * t854 * 0.5;
  t2220 = massVector[5] * sinVector[3] * sinVector[4] * t118 * t1792 * 0.5;
  t2221 = massVector[5] * COMVector_3[0] * sinVector[3] * sinVector[4] * t1792 *
    0.5;
  t2295 = sinVector[4] * t1808 * 0.5;
  t2296 = cosVector[4] * t874 * 0.5;
  t2222 = ((((((((((t2212 + t2213) + t2214) + t2215) + t2216) + t2217) + t2218)
              + t2219) + t2220) + t2221) - t2295) - t2296;
  t2225 = cosVector[3] * t854 + cosVector[4] * sinVector[3] * t856;
  t2228 = cosVector[2] * t2225 - sinVector[2] * (sinVector[3] * t854 -
    cosVector[3] * cosVector[4] * t856);
  t2229 = COMVector_3[0] * t2065 * 0.5;
  t2231 = t118 * t2065 * 0.5;
  t2232 = cosVector[4] * (((((-t839 - t840) + t1680) + t1681) + t1682) + t1683) *
    0.5;
  t2292 = sinVector[4] * t1687 * 0.5;
  t2293 = COMVector_3[0] * t2136 * 0.5;
  t2294 = t118 * t2136 * 0.5;
  t2454 = COMVector_2[0] * t2142 * 0.5;
  t2455 = t294 * t2142 * 0.5;
  t2233 = ((((((((t2206 + t2208) + t2229) + t2231) + t2232) - t2292) - t2293) -
            t2294) - t2454) - t2455;
  t2235 = COMVector_2[0] * t2047 * 0.5;
  t2236 = t118 * t2043 * 0.5;
  t2237 = t294 * t2047 * 0.5;
  t2238 = sinVector[4] * t830 * 0.5;
  t2239 = COMVector_3[0] * t2043 * 0.5;
  t2273 = cosVector[4] * t822 * 0.5;
  t2240 = ((((t2235 + t2236) + t2237) + t2238) + t2239) - t2273;
  t2241 = COMVector_3[0] * t2003 * 0.5;
  t2242 = t118 * t2003 * 0.5;
  t2244 = COMVector_2[0] * t2009 * 0.5;
  t2245 = t294 * t2009 * 0.5;
  t2246 = sinVector[4] * t99 * 0.5;
  t2247 = COMVector_3[1] * t522 * 0.5;
  t2248 = COMVector_4[2] * t463 * 0.5;
  t2249 = COMVector_4[0] * t455 * 0.5;
  t2250 = COMVector_4[2] * (t457 + t471) * 0.5;
  t2251 = cosVector[4] * t483 * 0.5;
  t2252 = sinVector[4] * t479 * 0.5;
  t2260 = cosVector[1] * (((((t643 + t1487) + t1488) + cosVector[2] * t1497) +
    cosVector[2] * (((((((t331 + t332) + t529) + t532) - t649) - t650) - t651) -
                    t652)) - sinVector[2] * t1491) * 0.5 - sinVector[1] *
    (((t653 - t919) + t1496) + sinVector[2] * t1497) * 0.5;
  t2262 = ((((((t1116 + t1118) + t1119) - t1227) - t1228) - t1229) - t1230) +
    COMVector_4[1] * (t1093 + t1104);
  t2263 = sinVector[2] * t1978;
  t2265 = ((((t1223 + t1225) + t1226) + t1623) - t1637) + cosVector[3] * t2262;
  t2266 = ((t1237 + t1241) - t1625) - sinVector[3] * t2262;
  t2267 = cosVector[2] * t1978;
  t2268 = cosVector[1] * t1881 * 0.5;
  t2278 = COMVector_3[1] * t1622 * 0.5;
  t2279 = sinVector[4] * t1113 * 0.5;
  t2281 = COMVector_4[0] * t1084 * 0.5;
  t2282 = t118 * t1240 * 0.5;
  t2283 = COMVector_4[2] * t2032 * 0.5;
  t2284 = COMVector_3[0] * t1233 * 0.5;
  t2274 = ((((((((((t2048 + t2051) + t2052) + t2053) + t2054) + t2055) - t2278)
              - t2279) - t2281) - t2282) - t2283) - t2284;
  t2289 = ((((((t2129 + t2130) + t2131) + t2132) - t2285) - t2286) - t2287) -
    t2288;
  t2290 = t118 * t2076;
  t2291 = COMVector_3[0] * t2076;
  t2297 = inertiaTensor_5[4] * t13 * 0.5;
  t2298 = inertiaTensor_5[5] * sinVector[4] * t9 * 0.5;
  t2299 = COMVector_3[0] * sinVector[3] * t1347;
  t2300 = sinVector[3] * t118 * t1347;
  t2339 = sinVector[4] * t2085 * 0.5;
  t2340 = sinVector[4] * t1178 * 0.5;
  t2301 = ((((t2163 + t2166) + t2168) + t2169) - t2339) - t2340;
  t2302 = ((((((t2215 + t2217) + t2218) + t2219) + t2220) + t2221) - t2295) -
    t2296;
  t2303 = ((((t2229 + t2231) + t2232) - t2292) - t2293) - t2294;
  t2304 = COMVector_3[0] * t2225;
  t2305 = t118 * t2225;
  t2341 = cosVector[4] * t1594 * 0.5;
  t2306 = ((t2209 + t2210) + t2211) - t2341;
  t2308 = t1373 + sinVector[3] * (((t1362 + t1368) - t1377) - t1859);
  t2311 = cosVector[1] * (((t1658 + t1659) + cosVector[2] * t1657) - sinVector[2]
    * t1660) * 0.5;
  t2312 = cosVector[2] * t1660;
  t2316 = cosVector[1] * (((t1767 + t1768) + cosVector[2] * t1774) - sinVector[2]
    * t996) * 0.5;
  t2318 = t1770 + sinVector[2] * t1774;
  t2322 = cosVector[1] * (((t1645 + t1646) + cosVector[2] * t1652) - sinVector[2]
    * t1479) * 0.5;
  t2324 = t1653 + sinVector[2] * t1652;
  t2325 = sinVector[4] * ((((((((t252 + t256) - t320) + t475) + t476) + t478) -
    t508) - t509) - t510) * 0.5;
  t2326 = t1647 - sinVector[2] * t1778;
  t2328 = t1982 + cosVector[2] * t1778;
  t2329 = angleVelocityVector[1] * t2122;
  t2332 = COMVector_4[2] * t237 * 0.5;
  t2333 = COMVector_4[0] * t198 * 0.5;
  t2334 = t118 * t2076 * 0.5;
  t2335 = COMVector_3[0] * t2076 * 0.5;
  t2338 = sinVector[4] * ((((((((t252 + t253) + t254) + t255) + t256) - t318) -
    t319) - t320) + COMVector_5[2] * (t188 - t210)) * 0.5;
  t2342 = ((t2215 + t2217) - t2295) - t2296;
  t2465 = cosVector[4] * t1684 * 0.5;
  t2343 = t2292 - t2465;
  t2345 = ((((t1526 + t1531) + t1532) + t1541) - t1548) + cosVector[4] *
    (((((((t753 - t1392) + t1527) + t1528) + t1529) - t1545) - t1546) - t1547);
  t2347 = t1554 + cosVector[3] * t2345;
  t2349 = ((t1559 + t1560) - t1862) + sinVector[3] * t2345;
  t2350 = cosVector[5] * t465 * 0.5;
  t2351 = COMVector_5[2] * t441 * 0.5;
  t2352 = sinVector[5] * t468 * 0.5;
  t2353 = massVector[5] * COMVector_5[0] * t443 * 0.5;
  t2354 = COMVector_5[0] * t180 * 0.5;
  t2355 = sinVector[2] * t1850;
  t2356 = COMVector_5[2] * t175 * 0.5;
  t2357 = cosVector[5] * t209 * 0.5;
  t2358 = sinVector[5] * t203 * 0.5;
  t2360 = t1851 + cosVector[3] * (((((t1738 + t1739) + t1745) + t1746) - t1757)
    - t1760);
  t2368 = cosVector[2] * t1789 - sinVector[2] * t1787;
  t2371 = ((cosVector[2] * t1787 + sinVector[2] * t1789) - COMVector_2[0] *
           t1334) - t294 * t1334;
  t2373 = cosVector[1] * (((t1875 + t1876) + t1877) + cosVector[2] * t1874) *
    0.5;
  t2375 = cosVector[5] * t581 * 0.5;
  t2376 = COMVector_5[2] * t555 * 0.5;
  t2377 = sinVector[5] * t584 * 0.5;
  t2378 = massVector[5] * COMVector_5[0] * t557 * 0.5;
  t2381 = cosVector[1] * (((t1905 + t1906) + t1907) + cosVector[2] * t1910) *
    0.5;
  t2383 = sinVector[1] * (t1908 - sinVector[2] * t1910) * 0.5;
  t2384 = cosVector[5] * t1100 * 0.5;
  t2385 = COMVector_5[2] * ((t1085 + t1086) - t1095) * 0.5;
  t2386 = COMVector_5[0] * (t1087 + t1088) * 0.5;
  t2387 = COMVector_5[0] * t925 * 0.5;
  t2388 = COMVector_5[2] * t934 * 0.5;
  t2389 = sinVector[5] * t952 * 0.5;
  t2390 = angleVelocityVector[1] * t2185;
  t2391 = COMVector_5[0] * (t559 - t564) * 0.5;
  t2392 = cosVector[5] * t1431 * 0.5;
  t2393 = cosVector[3] * lengthVector[2] * massVector[5] * COMVector_5[0] *
    sinVector[4] * 0.5;
  t2394 = inertiaTensor_5[1] * cosVector[4] * 0.5;
  t2395 = sinVector[4] * t1367 * 0.5;
  t2396 = COMVector_3[0] * sinVector[3] * t1347 * 0.5;
  t2397 = sinVector[3] * t118 * t1347 * 0.5;
  t2399 = angleVelocityVector[1] * (((((((((((t2181 + t2183) + t2184) - t2275) -
    t2276) - t2277) + t2384) + t2385) + t2386) - COMVector_5[2] * t1108 * 0.5) -
    sinVector[5] * t1103 * 0.5) - massVector[5] * COMVector_5[0] * sinVector[4] *
    t1069 * 0.5);
  t2400 = COMVector_5[0] * (t445 - t451) * 0.5;
  t2403 = cosVector[4] * ((((((((((t296 + t389) + t390) + t391) + t392) + t393)
    + t394) - t413) - t414) - t415) + t77 * ((t337 + t342) - t360)) * 0.5;
  t2404 = angleVelocityVector[2] * t2301;
  t2405 = ((t2194 + t2201) + t2202) - sinVector[4] * t1064 * 0.5;
  t2406 = angleVelocityVector[3] * t2405;
  t2407 = COMVector_5[2] * t948 * 0.5;
  t2408 = cosVector[5] * t950 * 0.5;
  t2409 = massVector[5] * COMVector_5[0] * sinVector[4] * t668 * 0.5;
  t2412 = angleVelocityVector[2] * (((((((((t2163 + t2168) - t2339) - t2340) +
    t2392) + t2393) + COMVector_5[2] * (t1416 - t1419) * 0.5) - COMVector_5[2] *
    t1418 * 0.5) - COMVector_5[0] * t1424 * 0.5) - sinVector[5] * t1433 * 0.5);
  t2413 = cosVector[5] * t1584 * 0.5;
  t2414 = sinVector[5] * t1586 * 0.5;
  t2417 = ((sinVector[5] * t1795 * 0.5 + cosVector[5] * t1344 * 0.5) -
           sinVector[5] * t1340 * 0.5) - cosVector[5] * t1798 * 0.5;
  t2418 = inertiaTensor_6[8] * sinVector[4] * 0.5;
  t2419 = cosVector[5] * t812 * 0.5;
  t2420 = sinVector[5] * t816 * 0.5;
  t2421 = inertiaTensor_6[5] * cosVector[4] * sinVector[5] * 0.5;
  t2422 = sinVector[5] * t65 * 0.5;
  t2423 = cosVector[5] * t76 * 0.5;
  t2424 = cosVector[5] * t1671 * 0.5;
  t2425 = sinVector[5] * t1673 * 0.5;
  t2427 = cosVector[1] * (((COMVector_2[0] * t104 + cosVector[2] * t120) + t104 *
    t294) - sinVector[2] * t122) * 0.5 - sinVector[1] * (cosVector[2] * t122 +
    sinVector[2] * t120) * 0.5;
  t2428 = angleVelocityVector[0] * t2427;
  t2431 = cosVector[2] * t1937 - sinVector[2] * t1941;
  t2436 = ((sinVector[2] * t1937 + cosVector[2] * t1941) + sinVector[4] * t294 *
           t856) + COMVector_2[0] * sinVector[4] * t856;
  t2437 = inertiaTensor_6[2] * t148 * 0.5;
  t2438 = inertiaTensor_6[5] * t145 * 0.5;
  t2439 = massVector[5] * COMVector_6[1] * t550 * 0.5;
  t2440 = massVector[5] * COMVector_6[0] * t548 * 0.5;
  t2441 = inertiaTensor_6[8] * sinVector[4] * t9 * 0.5;
  t2444 = cosVector[2] * t1699 + sinVector[2] * t1703;
  t2446 = sinVector[1] * t1968 * 0.5;
  t2447 = massVector[5] * COMVector_6[1] * t436 * 0.5;
  t2448 = massVector[5] * COMVector_6[0] * t439 * 0.5;
  t2451 = massVector[5] * COMVector_6[1] * t346 * 0.5;
  t2452 = inertiaTensor_6[8] * cosVector[4] * t13 * 0.5;
  t2453 = inertiaTensor_6[2] * cosVector[5] * sinVector[4] * t13 * 0.5;
  t2456 = massVector[5] * COMVector_6[0] * t931 * 0.5;
  t2457 = massVector[5] * COMVector_6[0] * t1074 * 0.5;
  t2461 = massVector[5] * COMVector_6[0] * t1266 * 0.5;
  t2462 = cosVector[4] * t90 * 0.5;
  t2463 = massVector[5] * COMVector_6[0] * t1499 * 0.5;
  t2464 = inertiaTensor_6[2] * cosVector[4] * cosVector[5] * 0.5;
  t2466 = massVector[5] * COMVector_6[0] * t1410 * 0.5;
  t2467 = COMVector_3[0] * t2225 * 0.5;
  t2468 = t118 * t2225 * 0.5;
  t2469 = inertiaTensor_6[5] * cosVector[5] * sinVector[4] * 0.5;
  t2470 = inertiaTensor_6[2] * sinVector[4] * sinVector[5] * 0.5;
  t2471 = ((t2211 - t2341) + t2466) - massVector[5] * COMVector_6[1] * t1412 *
    0.5;
  t2472 = massVector[5] * COMVector_6[0] * t1705 * 0.5;
  t2473 = ((t2238 - t2273) + t2456) - massVector[5] * COMVector_6[1] * t928 *
    0.5;
  t2475 = angleVelocityVector[0] * ((((((-t2246 + t2437) + t2438) + t2441) +
    t2462) - massVector[5] * COMVector_6[1] * t168 * 0.5) - massVector[5] *
    COMVector_6[0] * t173 * 0.5);
  t2476 = massVector[5] * COMVector_6[1] * t1501 * 0.5;
  t2479 = angleVelocityVector[4] * t2417;
  t2480 = massVector[5] * COMVector_6[1] * (((t1257 + t1258) - t1263) - t1264) *
    0.5;
  t2482 = angleVelocityVector[0] * ((((((((t2422 + t2423) + t2451) + t2452) +
    t2453) - cosVector[5] * t68 * 0.5) - sinVector[5] * t72 * 0.5) - massVector
    [5] * COMVector_6[0] * t341 * 0.5) - inertiaTensor_6[5] * sinVector[4] *
    sinVector[5] * t13 * 0.5);
  coriolis[0] = (((angleVelocityVector[2] * (sinVector[1] * (((t653 + t1496) +
    sinVector[2] * (((((((t520 + t521) + t524) + t528) + t1493) -
                      inertiaTensor_3[1] * t6) - COMVector_3[2] * t522) -
                    sinVector[3] * t485)) - cosVector[2] * t541) * 0.5 -
    cosVector[1] * (((((t643 + t1487) + t1488) - sinVector[2] * (((((((t502 +
    t505) + t515) + t516) - inertiaTensor_3[1] * t4) - COMVector_3[2] * (t456 +
    sinVector[3] * ((t160 + t457) + t471))) - COMVector_3[1] * t450) +
    sinVector[3] * ((((((((((((((t225 + t228) + t229) + t238) - t311) + t486) +
    t487) + t488) + t489) + t490) + t492) + COMVector_5[0] * t446) -
                      COMVector_4[0] * t458) - COMVector_5[2] * t469) -
                    COMVector_4[1] * t491))) + cosVector[2] * (((((((t331 + t332)
    + t529) + t532) - inertiaTensor_3[0] * t4) - inertiaTensor_3[1] * t6) -
    COMVector_3[1] * t498) - COMVector_3[2] * ((t493 + t494) - sinVector[3] *
    t263))) + cosVector[2] * (((((((t520 + t521) + t524) + t528) -
    inertiaTensor_3[1] * t6) - COMVector_3[2] * t522) - sinVector[3] * t485) +
    COMVector_3[2] * ((t472 + t494) - sinVector[3] * t455))) * 0.5) -
                   angleVelocityVector[4] * t1846) + angleVelocityVector[5] *
                  t2427) + angleVelocityVector[3] * (sinVector[1] * (t1662 +
    cosVector[2] * (((t306 + t1654) + t1655) - cosVector[3] * t272)) * 0.5 -
    cosVector[1] * (((t1658 + t1659) - sinVector[2] * (((t306 + cosVector[3] *
    t260) - cosVector[3] * t272) + sinVector[3] * t293)) + cosVector[2] *
                    (((((t331 + t332) + t333) + t334) + cosVector[3] * t293) -
                     sinVector[3] * t260)) * 0.5)) - angleVelocityVector[1] *
    (((t922 + cosVector[1] * (((((((t643 + t909) + t911) - inertiaTensor_2[1] *
            cosVector[1]) - inertiaTensor_2[0] * sinVector[1]) - COMVector_2[1] *
          t647) - COMVector_2[2] * t910) + COMVector_2[2] * (t641 - sinVector[2]
         * t539)) * 0.5) - sinVector[1] * (((((((-t657 + t889) + t893) + t899) -
          COMVector_2[1] * t656) - COMVector_2[2] * t896) + cosVector[2] *
        (((((((t516 - t517) + t625) + t626) + t630) + t660) - COMVector_3[2] *
          (t572 + t573)) - COMVector_3[1] * t603)) + COMVector_2[2] * ((t648 +
         cosVector[2] * ((t501 + t572) + t573)) + sinVector[2] * ((t494 - t613)
         + cosVector[3] * t561))) * 0.5) + cosVector[1] * (((((((t900 + t902) +
           t903) + t904) + t908) - inertiaTensor_2[1] * cosVector[1]) -
       sinVector[2] * t895) - COMVector_2[2] * (t617 - sinVector[2] * t587)) *
     0.5);
  coriolis[1] = ((((-angleVelocityVector[5] * t1957 - angleVelocityVector[3] *
                    (((sinVector[1] * (((t1469 + t1776) + t1777) + cosVector[2] *
    (((t1057 + t1058) + t1063) + sinVector[3] * t1068)) * 0.5 - cosVector[1] *
                       (((t1767 + t1768) + cosVector[2] * t1002) - sinVector[2] *
                        t996) * 0.5) - cosVector[1] * (cosVector[2] *
    (cosVector[3] * ((((inertiaTensor_4[1] + t1044) - COMVector_4[1] * t1011) -
                      sinVector[4] * ((((((((((t751 + t752) + t753) + t756) -
    t785) + t1040) + t1041) + t1042) - COMVector_5[0] * t1011) + COMVector_5[1] *
    (t1009 - cosVector[5] * massVector[5] * t1005)) - massVector[5] *
    COMVector_6[0] * t1004)) + cosVector[4] * (((((((t759 + t760) + t1045) +
    t1048) + COMVector_5[2] * t1011) - COMVector_5[2] * t1013) - t77 * t1021) -
    massVector[5] * COMVector_5[1] * t1014)) - sinVector[3] *
     ((((((((((-inertiaTensor_4[5] + t777) + t778) + t1034) + t1037) + t1039) -
          cosVector[5] * t1027) - COMVector_5[0] * t1021) - COMVector_4[1] *
        t1033) - COMVector_5[2] * t1038) + t56 * ((t1029 + t1035) - sinVector[4]
    * t1021))) - sinVector[2] * (((t1057 + t1058) + t1063) + sinVector[3] *
    ((((inertiaTensor_4[1] + t1044) + t1053) - COMVector_4[1] * t1047) -
     sinVector[4] * ((((((((((t751 + t752) + t753) + t756) - t785) + t1040) +
    t1041) + t1042) + t1049) - COMVector_5[0] * t1011) - massVector[5] *
                     COMVector_6[0] * t1004)))) * 0.5) + sinVector[1] * (t1770 +
    sinVector[2] * t1002) * 0.5)) - angleVelocityVector[4] * (((t1567 + t1885) -
    sinVector[1] * (((t1568 + t1569) - COMVector_2[0] * t1347) - t294 * t1347) *
    0.5) + cosVector[1] * (((t1875 + t1876) + t1877) + cosVector[2] * (((t1397 +
    t1398) + t1399) - cosVector[3] * (((((((((t1312 + t1313) + t1315) - t1401) -
    t1403) - t1405) - COMVector_5[2] * (t1259 + t1262)) + COMVector_4[1] *
    (((t768 - t773) + t1268) - cosVector[4] * t1270)) + COMVector_5[2] * t1270)
    - t56 * (((t768 - t773) + t1268) - cosVector[4] * ((t697 + t1259) + t1262)))))
    * 0.5)) - angleVelocityVector[1] * (sinVector[1] * ((((((inertiaTensor_2[5]
    + t1971) + t1972) + COMVector_2[2] * (cosVector[2] * ((t722 + cosVector[3] *
    t710) - sinVector[3] * t691) - sinVector[2] * ((t717 + cosVector[3] * t691)
    + sinVector[3] * t710))) + cosVector[2] * ((((((inertiaTensor_3[5] + t795) +
    t797) + t798) - cosVector[3] * t750) - COMVector_3[2] * t771) + sinVector[3]
    * t767)) - COMVector_2[2] * ((t1969 + t1970) - sinVector[2] * ((t717 + t739)
    + t2023))) + sinVector[2] * ((((inertiaTensor_3[2] + t782) + t791) +
    cosVector[3] * t767) - COMVector_3[2] * t792)) - cosVector[1] *
    ((((inertiaTensor_2[2] + t1977) + cosVector[2] * ((((inertiaTensor_3[2] +
    t782) + t791) - COMVector_3[2] * t792) + cosVector[3] * ((((inertiaTensor_4
    [1] + t765) + t766) - t787) - COMVector_4[1] * t794))) - COMVector_2[2] *
      t1974) - sinVector[2] * ((((((inertiaTensor_3[5] + t795) + t797) + t798) +
    t974) - cosVector[3] * t750) - COMVector_3[2] * t771)))) -
                 angleVelocityVector[2] * (((t1636 + t1644) - cosVector[1] *
    t1573 * 0.5) + sinVector[1] * (((t1627 + t1629) + t1631) - sinVector[2] *
    (((((t1223 + t1225) + t1226) + t1231) + sinVector[3] * (((t1106 + t1114) -
    t1234) + sinVector[4] * (((((t1107 + t1109) + t1214) - t1235) - t1236) + t77
    * t1092))) - COMVector_3[2] * (t1094 - cosVector[3] * ((t1091 + t1093) +
    cosVector[4] * ((t1085 - t1095) + cosVector[5] * massVector[5] * (t1075 +
    cosVector[4] * cosVector[5] * t1069)))))) * 0.5)) - angleVelocityVector[0] *
    (((t922 + t1996) - sinVector[1] * t1994 * 0.5) + cosVector[1] * (((((((t643
            + t909) + t911) + t1999) - inertiaTensor_2[1] * cosVector[1]) -
        inertiaTensor_2[0] * sinVector[1]) - COMVector_2[1] * t647) -
      COMVector_2[2] * t910) * 0.5);
  coriolis[2] = ((((-angleVelocityVector[1] * (((t1636 + t1644) - cosVector[1] *
    t1573 * 0.5) + sinVector[1] * (((t1627 + t1629) + t1631) - sinVector[2] *
    t1624) * 0.5) - angleVelocityVector[0] * t2260) - angleVelocityVector[2] *
                   (sinVector[1] * (t1574 + t1575) - cosVector[1] * t1573)) +
                  angleVelocityVector[5] * (((t1963 + t1965) - cosVector[1] *
    t1607 * 0.5) - sinVector[1] * t1968 * 0.5)) + angleVelocityVector[3] *
                 (((t1648 - sinVector[1] * (t1653 + sinVector[2] * (((((t1206 +
    t1208) + t1480) + t1481) + cosVector[3] * t1486) - sinVector[3] * t1454)) *
                    0.5) - sinVector[1] * t1650 * 0.5) + cosVector[1] * (((t1645
    + t1646) + cosVector[2] * (((((t1206 + t1208) + t1480) + t1481) + cosVector
    [3] * (((((((t1456 + t1459) + t1460) + t1461) - COMVector_5[2] * t1418) -
             COMVector_5[0] * t1424) - sinVector[5] * t1433) - t56 * t1458)) -
    sinVector[3] * t1454)) - sinVector[2] * t1479) * 0.5)) -
    angleVelocityVector[4] * (((t1567 + t1864) + t1870) - sinVector[1] * (t1568
    + t1569) * 0.5);
  coriolis[3] = ((((angleVelocityVector[1] * (((t1648 + t2316) - sinVector[1] *
    (((t1469 + t1649) + t1776) + t1777) * 0.5) - sinVector[1] * t2318 * 0.5) +
                    angleVelocityVector[5] * (((t1916 + t1922) - cosVector[1] *
    t1919 * 0.5) - sinVector[1] * t2444 * 0.5)) + angleVelocityVector[2] *
                   (((t1648 + t2322) - sinVector[1] * t1650 * 0.5) - sinVector[1]
                    * t2324 * 0.5)) + angleVelocityVector[3] * (cosVector[1] *
    t2326 - sinVector[1] * t2328)) - angleVelocityVector[0] * (t2311 -
    sinVector[1] * (t1662 + t2312) * 0.5)) + angleVelocityVector[4] *
    (((sinVector[1] * (t1860 + sinVector[2] * (t1381 - t1564)) * 0.5 -
       cosVector[1] * (t1565 - sinVector[2] * (t1373 + t1379)) * 0.5) +
      cosVector[1] * (((t1853 + t1855) + t1856) - sinVector[2] * t1763) * 0.5) -
     sinVector[1] * (cosVector[2] * t1763 + sinVector[2] * (((t1765 + t1766) +
        cosVector[3] * t1751) - sinVector[3] * t1747)) * 0.5);
  coriolis[4] = ((((-angleVelocityVector[2] * (((t1864 + t1870) - cosVector[1] *
    t1881 * 0.5) - sinVector[1] * (t1878 - sinVector[2] * t1871) * 0.5) -
                    angleVelocityVector[0] * t1846) - angleVelocityVector[5] *
                   (((t1903 - sinVector[1] * t1898 * 0.5) + cosVector[1] *
                     (((t1905 + t1906) + t1907) + cosVector[2] * t1836) * 0.5) +
                    sinVector[1] * (t1908 - sinVector[2] * t1836) * 0.5)) +
                  angleVelocityVector[3] * (((cosVector[1] * (((t1853 + t1855) +
    t1856) - sinVector[2] * t1852) * 0.5 - cosVector[1] * (t1565 - sinVector[2] *
    t1858) * 0.5) - sinVector[1] * (t2355 + cosVector[2] * t1852) * 0.5) +
    sinVector[1] * (t1860 - sinVector[2] * t1871) * 0.5)) + angleVelocityVector
                 [4] * (cosVector[1] * t2371 + sinVector[1] * t2368)) -
    angleVelocityVector[1] * (((t1885 + t2014) + t2373) - cosVector[1] * t1881 *
    0.5);
  coriolis[5] = ((((t2428 - angleVelocityVector[1] * t1957) +
                   angleVelocityVector[3] * (((t1916 + t1922) - cosVector[1] *
    t1919 * 0.5) - sinVector[1] * t2444 * 0.5)) - angleVelocityVector[5] *
                  (cosVector[1] * t2436 + sinVector[1] * t2431)) -
                 angleVelocityVector[2] * (((t1951 - t1963) - t1965) + t2446)) -
    angleVelocityVector[4] * (((t1903 + t2381) + t2383) - sinVector[1] * t1898 *
    0.5);
  coriolis[6] = ((((-angleVelocityVector[3] * (((((((((((((t1648 - t1980) -
    t1981) + t2143) + t2144) + t2145) + t2146) + t2148) + t2149) + t2150) +
    t2151) - sinVector[1] * (((t1649 + t1776) + t1777) + t1982) * 0.5) -
    COMVector_4[0] * t198 * 0.5) - COMVector_4[2] * t237 * 0.5) +
                    angleVelocityVector[1] * (((((((((((((((((((((t1980 + t1981)
    + t1990) + t2100) + t2101) + t2104) + t2108) + t2109) + inertiaTensor_2[2] *
    cosVector[1] * 0.5) - inertiaTensor_2[5] * sinVector[1] * 0.5) -
    inertiaTensor_3[5] * t4 * 0.5) - cosVector[4] * t601 * 0.5) - COMVector_4[0]
    * t563 * 0.5) - COMVector_4[2] * t579 * 0.5) - COMVector_3[1] * t658 * 0.5)
    + COMVector_2[0] * t896 * 0.5) + COMVector_2[1] * t901 * 0.5) - COMVector_2
    [1] * t1979 * 0.5) - sinVector[4] * t597 * 0.5) + t294 * t1973 * 0.5) -
    cosVector[1] * ((((inertiaTensor_2[2] - t1642) + t1977) + t2267) -
                    COMVector_2[2] * t1974) * 0.5) + sinVector[1] *
    ((((((inertiaTensor_2[5] + t1631) + t1971) + t1972) + t2263) - COMVector_2[2]
      * ((t1969 + t1970) - sinVector[2] * t774)) + COMVector_2[2] * (t1969 -
    sinVector[2] * t774)) * 0.5)) + angleVelocityVector[0] * (((t922 + t1996) -
    sinVector[1] * t1994 * 0.5) + cosVector[1] * (((((((t643 + t909) + t911) -
    t1997) + t1999) - inertiaTensor_2[0] * sinVector[1]) - COMVector_2[1] * t647)
    - COMVector_2[2] * t910) * 0.5)) - angleVelocityVector[4] * (((((((((-t2014
    + t2186) + t2187) + t2189) + t2190) + t2191) + t2192) + t2193) + t2268) -
    cosVector[4] * t279 * 0.5)) - angleVelocityVector[5] * (((((((-t1951 + t2008)
    + t2241) + t2242) + t2244) + t2245) + t2246) - cosVector[4] * t90 * 0.5)) +
    angleVelocityVector[2] * (((((((((((((((((t1980 + t1981) + t1990) + t2102) +
    t2103) + t2107) + t2110) + t2250) + sinVector[1] * (((t1574 + t1575) + t1633)
    + t1634) * 0.5) - inertiaTensor_3[5] * t4 * 0.5) - cosVector[4] * t483 * 0.5)
    - cosVector[1] * t1573 * 0.5) - COMVector_4[0] * t455 * 0.5) - COMVector_4[2]
    * t463 * 0.5) - COMVector_3[1] * t522 * 0.5) - COMVector_2[0] * t1991 * 0.5)
    - sinVector[4] * t479 * 0.5) - t294 * t1991 * 0.5);
  coriolis[7] = ((angleVelocityVector[3] * t2122 + angleVelocityVector[4] *
                  t2185) - angleVelocityVector[5] * t2240) +
    angleVelocityVector[2] * t2274;
  coriolis[8] = ((((-angleVelocityVector[0] * (((((((((((((((((((((t2100 + t2101)
    - t2102) - t2103) + t2104) - t2107) + t2108) + t2109) - t2110) + t2247) +
    t2248) + t2249) + t2251) + t2252) - cosVector[4] * t601 * 0.5) -
    COMVector_4[2] * t491 * 0.5) - COMVector_4[0] * t563 * 0.5) - COMVector_4[2]
    * t579 * 0.5) - COMVector_3[1] * t658 * 0.5) + COMVector_2[0] * t1991 * 0.5)
    - sinVector[4] * t597 * 0.5) + t294 * t1991 * 0.5) + angleVelocityVector[1] *
                    (((((((((((t2048 + t2051) + t2052) + t2053) + t2054) + t2055)
    - COMVector_4[2] * (t1093 + t1104) * 0.5) - COMVector_3[0] * (t1115 + t1232)
    * 0.5) - COMVector_4[0] * t1084 * 0.5) - COMVector_3[1] * t1622 * 0.5) -
                      sinVector[4] * t1113 * 0.5) - t118 * t1240 * 0.5)) -
                   angleVelocityVector[5] * (((((((t2205 + t2207) + t2209) +
    t2210) + t2211) - cosVector[4] * t1594 * 0.5) - COMVector_2[0] * t2070 * 0.5)
    - t294 * t2070 * 0.5)) - angleVelocityVector[3] * t2133) +
                 angleVelocityVector[4] * (((((((((t2157 + t2162) + t2163) +
    t2165) + t2166) + t2167) + t2168) + t2169) - sinVector[4] * t1178 * 0.5) -
    sinVector[4] * t2085 * 0.5)) + angleVelocityVector[2] * (COMVector_2[0] *
    t2112 + t294 * t2112);
  coriolis[9] = ((((t2329 - angleVelocityVector[2] * t2133) +
                   angleVelocityVector[5] * t2233) - angleVelocityVector[0] *
                  (((((((((((((((t2108 + t2109) + t2143) + t2144) + t2145) +
    t2146) + t2148) + t2149) + t2150) + t2151) - cosVector[4] * t601 * 0.5) -
                       COMVector_4[0] * t198 * 0.5) - COMVector_4[2] * t237 *
                      0.5) - COMVector_4[0] * t563 * 0.5) - COMVector_4[2] *
                    t579 * 0.5) - sinVector[4] * t597 * 0.5)) +
                 angleVelocityVector[4] * (((((((((((t2157 + t2162) + t2194) +
    t2195) + t2196) + t2197) + t2198) + t2200) + t2201) + t2202) + t2203) -
    sinVector[4] * t1064 * 0.5)) - angleVelocityVector[3] * (((t2290 + t2291) +
    COMVector_2[0] * t2080) + t294 * t2080);
  coriolis[10] = ((((t2390 - angleVelocityVector[5] * t2222) -
                    angleVelocityVector[0] * ((((((((((((((((t2186 + t2187) +
    t2189) + t2190) + t2191) + t2192) + t2193) + t2297) + t2298) + t2375) +
    t2376) + t2377) + t2378) - cosVector[4] * t279 * 0.5) + COMVector_5[0] *
    t565 * 0.5) - COMVector_5[2] * t585 * 0.5) - inertiaTensor_5[1] * cosVector
    [4] * t9 * 0.5)) + angleVelocityVector[3] * (((((((((((t2157 + t2162) +
    t2194) + t2195) + t2196) + t2197) + t2198) + t2200) + t2201) + t2202) +
    t2203) - sinVector[4] * t1064 * 0.5)) + angleVelocityVector[2] *
                  (((((((((t2163 + t2165) + t2166) + t2167) + t2168) + t2169) +
                      COMVector_2[0] * (t2089 + t2092) * 0.5) + t294 * (t2089 +
    t2092) * 0.5) - sinVector[4] * t1178 * 0.5) - sinVector[4] * t2085 * 0.5)) +
    angleVelocityVector[4] * (((((-t1362 + t1377) + t2299) + t2300) +
    COMVector_2[0] * t2178) + t294 * t2178);
  coriolis[11] = ((((angleVelocityVector[5] * (((((t2304 + t2305) - cosVector[4]
    * t1925) + COMVector_2[0] * t2228) - sinVector[4] * t1927) + t294 * t2228) -
                     angleVelocityVector[4] * t2222) + angleVelocityVector[3] *
                    t2233) - angleVelocityVector[1] * t2240) -
                  angleVelocityVector[2] * (((((((t2205 - t2206) + t2207) -
    t2208) + t2209) + t2210) + t2211) - cosVector[4] * t1594 * 0.5)) -
    angleVelocityVector[0] * ((((((((((t2241 + t2242) + t2244) + t2245) + t2246)
    + t2439) + t2440) - inertiaTensor_6[2] * t148 * 0.5) - inertiaTensor_6[5] *
    t145 * 0.5) - cosVector[4] * t90 * 0.5) - inertiaTensor_6[8] * sinVector[4] *
    t9 * 0.5);
  coriolis[12] = ((((angleVelocityVector[1] * (((((((((((((((t1980 + t1981) +
    t1990) + t2100) + t2101) + t2104) + t2108) + t2109) - inertiaTensor_3[5] *
    t4 * 0.5) - cosVector[4] * t601 * 0.5) - COMVector_4[0] * t563 * 0.5) -
    COMVector_4[2] * t579 * 0.5) - COMVector_3[1] * t658 * 0.5) - sinVector[4] *
    t597 * 0.5) + cosVector[1] * (((((t1640 + t1641) - t2267) + cosVector[2] *
    t2265) + sinVector[2] * t2266) + sinVector[2] * ((((((inertiaTensor_3[5] +
    t795) + t797) + t798) + t974) - t1121) - t1630)) * 0.5) + sinVector[1] *
    (((t1631 + t2263) + cosVector[2] * t2266) - sinVector[2] * t2265) * 0.5) +
                     angleVelocityVector[0] * t2260) + angleVelocityVector[2] *
                    (((((((((((((((t1980 + t1981) + t1990) + t2102) + t2103) +
    t2107) + t2110) - t2247) - t2248) - t2249) + t2250) - t2251) - t2252) +
                       sinVector[1] * (t1574 + t1575) * 0.5) - inertiaTensor_3[5]
                      * t4 * 0.5) - cosVector[1] * t1573 * 0.5)) -
                   angleVelocityVector[4] * (((((((t2186 + t2187) + t2190) +
    t2192) + t2193) + t2268) - cosVector[4] * t279 * 0.5) + sinVector[1] *
    (t1878 - t2011) * 0.5)) - angleVelocityVector[3] * (((((((((((t1648 - t1980)
    - t1981) + t2143) + t2144) + t2145) + t2146) + t2149) + t2151) -
    COMVector_4[0] * t198 * 0.5) - COMVector_4[2] * t237 * 0.5) - sinVector[1] *
    t1650 * 0.5)) - angleVelocityVector[5] * (((((-t1951 + t1965) + t2241) +
    t2242) + t2246) - cosVector[4] * t90 * 0.5);
  coriolis[13] = ((((angleVelocityVector[0] * (((((((((((((((((((((t2100 + t2101)
    - t2102) - t2103) + t2104) - t2107) + t2108) + t2109) - t2110) + t2247) +
    t2248) + t2249) + t2251) + t2325) - cosVector[4] * t601 * 0.5) -
    COMVector_4[2] * t491 * 0.5) - COMVector_4[0] * t563 * 0.5) - COMVector_4[2]
    * t579 * 0.5) - COMVector_3[1] * t658 * 0.5) - sinVector[4] * t597 * 0.5) +
    COMVector_2[0] * (((t654 + t655) - t2105) - t2106) * 0.5) + t294 * (((t654 +
    t655) - t2105) - t2106) * 0.5) + angleVelocityVector[3] * (((((((((t2117 +
    t2119) + t2120) + t2121) + t2124) + t2128) - t2269) - t2270) - t2271) -
    t2272)) - angleVelocityVector[1] * t2274) - angleVelocityVector[5] *
                   (((((t2206 + t2208) + t2236) + t2238) + t2239) - t2273)) -
                  angleVelocityVector[2] * (((((((((((-t2048 - t2053) - t2054) -
    t2055) + t2278) + t2279) + t2281) + t2282) + t2283) + t2284) + COMVector_2[0]
    * t2112 * 0.5) + t294 * t2112 * 0.5)) - angleVelocityVector[4] *
    (((((((t2157 + t2162) - t2181) - t2183) - t2184) + t2275) + t2276) + t2277);
  coriolis[14] = (-angleVelocityVector[3] * t2289 + angleVelocityVector[4] *
                  t2301) - angleVelocityVector[5] * t2306;
  coriolis[15] = ((((-angleVelocityVector[3] * (t2290 + t2291) -
                     angleVelocityVector[1] * (((((((((((((t2048 + t2053) +
    t2055) - t2117) - t2119) - t2120) - t2121) + t2269) + t2270) + t2271) +
    t2272) - t2279) - t2281) - t2283)) - angleVelocityVector[2] * t2289) +
                   angleVelocityVector[5] * t2303) + angleVelocityVector[4] *
                  (((((((t2194 + t2195) + t2196) + t2197) + t2198) + t2201) +
                    t2202) - sinVector[4] * t1064 * 0.5)) - angleVelocityVector
    [0] * (((((((((((((t2110 + t2143) + t2144) + t2145) + t2146) + t2149) +
                  t2151) - t2248) - t2249) + t2250) - t2251) - t2252) -
            COMVector_4[0] * t198 * 0.5) - COMVector_4[2] * t237 * 0.5);
  coriolis[16] = ((((t2399 + t2404) - angleVelocityVector[5] * t2302) +
                   angleVelocityVector[4] * (((-t1362 + t1377) + t2299) + t2300))
                  - angleVelocityVector[0] * ((((((((((((((t2186 + t2187) +
    t2190) + t2192) + t2193) + t2297) + t2298) + t2350) + t2351) + t2352) +
    t2353) - cosVector[4] * t279 * 0.5) + COMVector_5[0] * t446 * 0.5) -
    COMVector_5[2] * t469 * 0.5) - inertiaTensor_5[1] * cosVector[4] * t9 * 0.5))
    + angleVelocityVector[3] * (((((((t2194 + t2195) + t2196) + t2197) + t2198)
    + t2201) + t2202) - sinVector[4] * t1064 * 0.5);
  coriolis[17] = ((((angleVelocityVector[3] * t2303 - angleVelocityVector[4] *
                     t2302) - angleVelocityVector[2] * t2306) -
                   angleVelocityVector[0] * ((((((((t2241 + t2242) + t2246) +
    t2447) + t2448) - inertiaTensor_6[2] * t148 * 0.5) - inertiaTensor_6[5] *
    t145 * 0.5) - cosVector[4] * t90 * 0.5) - inertiaTensor_6[8] * sinVector[4] *
    t9 * 0.5)) - angleVelocityVector[1] * (((((t2236 + t2238) + t2239) - t2273)
    + t2457) - massVector[5] * COMVector_6[1] * t1080 * 0.5)) +
    angleVelocityVector[5] * (((t2304 + t2305) - cosVector[4] * t1925) -
    sinVector[4] * t1927);
  coriolis[18] = ((((angleVelocityVector[2] * (((((((((t1980 + t1981) + t2110) -
    t2248) - t2249) - t2251) - t2322) - t2325) + COMVector_4[2] * t491 * 0.5) +
    sinVector[1] * t2324 * 0.5) - angleVelocityVector[4] * (((((t2186 + t2187) +
    t2193) - cosVector[4] * t279 * 0.5) + cosVector[1] * (t1880 + sinVector[2] *
    t2308) * 0.5) - sinVector[1] * (t2011 - cosVector[2] * t2308) * 0.5)) -
                    angleVelocityVector[5] * (((t1922 + t2246) - cosVector[4] *
    t90 * 0.5) - cosVector[1] * t1919 * 0.5)) + angleVelocityVector[0] * (t2311
    - sinVector[1] * (t2312 + sinVector[2] * (((((t331 + t332) + t1656) - t1661)
    + COMVector_3[0] * ((t184 + t196) - t222)) + t118 * ((t184 + t196) - t222)))
    * 0.5)) + angleVelocityVector[1] * (((((((((t1980 + t1981) + t2108) + t2109)
    - t2316) - cosVector[4] * t601 * 0.5) - COMVector_4[0] * t563 * 0.5) -
    COMVector_4[2] * t579 * 0.5) + sinVector[1] * t2318 * 0.5) - sinVector[4] *
    ((((((((t252 + t256) - t320) + t593) + t594) + t596) - t618) - t619) - t620)
    * 0.5)) + angleVelocityVector[3] * (((((((((t1980 + t1981) - t2144) - t2145)
    - t2146) - t2151) + t2332) + t2333) - cosVector[1] * t2326 * 0.5) +
    sinVector[1] * t2328 * 0.5);
  coriolis[19] = ((((-t2329 - angleVelocityVector[4] * (((((((t2157 + t2162) -
    t2183) + t2196) + t2198) + t2275) + t2276) + t2277)) + angleVelocityVector[3]
                    * (((((((((t2119 + t2120) + t2124) + t2128) - t2269) - t2270)
    - t2271) - t2272) + t2334) + t2335)) - angleVelocityVector[5] * (((((t2206 +
    t2208) + t2229) + t2231) + t2238) - t2273)) + angleVelocityVector[0] *
                  (((((((((((((((t2108 + t2109) + t2143) + t2144) + t2145) +
    t2146) + t2148) + t2149) + t2150) - t2332) - t2333) + t2338) - cosVector[4] *
                      t601 * 0.5) - COMVector_4[0] * t563 * 0.5) - COMVector_4[2]
                    * t579 * 0.5) - sinVector[4] * t597 * 0.5)) -
    angleVelocityVector[2] * (((((((((((((((-t2048 - t2053) - t2055) - t2129) -
    t2130) - t2131) - t2132) + t2279) + t2281) + t2283) + t2285) + t2286) +
    t2287) + t2288) + t2330) + t2331);
  coriolis[20] = ((((-angleVelocityVector[3] * (((((((t2129 + t2130) + t2131) +
    t2132) - t2285) - t2287) - t2334) - t2335) - angleVelocityVector[5] *
                     (((t2211 + t2229) + t2231) - t2341)) + angleVelocityVector
                    [1] * (((((((((((((t2048 + t2053) + t2055) - t2117) - t2119)
    - t2120) - t2121) + t2269) + t2270) + t2271) + t2272) - t2279) - t2281) -
    COMVector_4[2] * (t1093 + t1104) * 0.5)) + angleVelocityVector[2] *
                   (((((((t2129 + t2130) + t2131) - t2285) - t2286) - t2287) -
                     t2288) + cosVector[4] * (((((t1437 + t1438) + t1439) +
    t1440) - t1472) - t1473) * 0.5)) - angleVelocityVector[4] * (((((-t2163 -
    t2168) + t2196) + t2198) + t2339) + t2340)) + angleVelocityVector[0] *
    (((((((((((((t2110 + t2143) + t2144) + t2145) + t2146) + t2149) - t2248) -
           t2249) + t2250) - t2251) - t2252) - t2332) - t2333) + t2338);
  coriolis[21] = -angleVelocityVector[5] * t2343 + angleVelocityVector[4] *
    t2405;
  coriolis[22] = ((((t2406 + t2412) - angleVelocityVector[5] * t2342) -
                   angleVelocityVector[1] * (((((((((-t2183 + t2275) + t2276) +
    t2277) + t2387) + t2388) + t2389) - cosVector[5] * t950 * 0.5) -
    COMVector_5[2] * t948 * 0.5) - massVector[5] * COMVector_5[0] * sinVector[4]
    * t668 * 0.5)) - angleVelocityVector[4] * (t1362 - t1377)) -
    angleVelocityVector[0] * ((((((((((((t2186 + t2187) + t2193) + t2297) +
    t2298) + t2354) + t2356) + t2357) + t2358) - cosVector[4] * t279 * 0.5) -
    COMVector_5[2] * t189 * 0.5) - inertiaTensor_5[1] * cosVector[4] * t9 * 0.5)
    - massVector[5] * COMVector_5[0] * t149 * 0.5);
  coriolis[23] = ((((t2475 - angleVelocityVector[3] * t2343) -
                    angleVelocityVector[4] * t2342) - angleVelocityVector[2] *
                   t2471) - angleVelocityVector[1] * t2473) -
    angleVelocityVector[5] * (cosVector[4] * t1925 + sinVector[4] * t1927);
  coriolis[24] = ((((angleVelocityVector[0] * t1846 + angleVelocityVector[2] *
                     ((((((((((t2297 + t2298) + t2350) + t2351) + t2352) + t2353)
    + t2400) - COMVector_5[2] * t469 * 0.5) + cosVector[1] * (((t1867 + t1868) +
    cosVector[2] * t2349) + sinVector[2] * t2347) * 0.5) + sinVector[1] *
                       (cosVector[2] * t2347 - sinVector[2] * t2349) * 0.5) -
                      inertiaTensor_5[1] * cosVector[4] * t9 * 0.5)) +
                    angleVelocityVector[5] * (((((t2381 + t2383) + t2422) +
    t2423) - cosVector[5] * t68 * 0.5) - sinVector[5] * t72 * 0.5)) -
                   angleVelocityVector[4] * (((((((((cosVector[5] * t375 * 0.5 +
    cosVector[1] * t2371 * 0.5) - COMVector_5[2] * t347 * 0.5) + COMVector_5[0] *
    t354 * 0.5) + COMVector_5[2] * t376 * 0.5) - sinVector[5] * t371 * 0.5) +
    sinVector[1] * t2368 * 0.5) - inertiaTensor_5[5] * cosVector[4] * t13 * 0.5)
    - inertiaTensor_5[1] * sinVector[4] * t13 * 0.5) - massVector[5] *
    COMVector_5[0] * t350 * 0.5)) + angleVelocityVector[3] * ((((((((((t2297 +
    t2298) + t2354) + t2356) + t2357) + t2358) - COMVector_5[2] * t189 * 0.5) -
    cosVector[1] * (((t1853 + t1855) + t1856) - sinVector[2] * t2360) * 0.5) +
    sinVector[1] * (t2355 + cosVector[2] * t2360) * 0.5) - inertiaTensor_5[1] *
    cosVector[4] * t9 * 0.5) - massVector[5] * COMVector_5[0] * t149 * 0.5)) +
    angleVelocityVector[1] * ((((((((((t1885 + t2297) + t2298) + t2373) + t2375)
    + t2376) + t2377) + t2378) + t2391) - COMVector_5[2] * t585 * 0.5) -
    inertiaTensor_5[1] * cosVector[4] * t9 * 0.5);
  coriolis[25] = ((((-t2390 - angleVelocityVector[3] * (((((((((((((t2194 +
    t2195) + t2197) + t2200) + t2201) + t2202) + t2203) - t2387) - t2388) -
    t2389) + t2407) + t2408) + t2409) - sinVector[4] * t1064 * 0.5)) +
                    angleVelocityVector[0] * ((((((((((((((((t2186 + t2187) +
    t2189) + t2190) + t2191) + t2192) + t2297) + t2298) + t2375) + t2376) +
    t2377) + t2378) + t2391) + t2403) - cosVector[4] * t279 * 0.5) -
    COMVector_5[2] * t585 * 0.5) - inertiaTensor_5[1] * cosVector[4] * t9 * 0.5))
                   - angleVelocityVector[2] * (((((((((((((t2163 + t2165) +
    t2166) + t2167) + t2168) + t2169) - t2339) - t2340) + t2384) + t2385) +
    t2386) - COMVector_5[2] * t1108 * 0.5) - sinVector[5] * t1103 * 0.5) -
    massVector[5] * COMVector_5[0] * sinVector[4] * t1069 * 0.5)) +
                  angleVelocityVector[5] * (((((((((t2213 + t2216) + t2217) +
    t2218) + t2219) - t2296) + t2419) + t2420) - cosVector[5] * t733 * 0.5) -
    sinVector[5] * t737 * 0.5)) - angleVelocityVector[4] * (((((((((((((t2394 +
    t2395) + t2396) + t2397) - inertiaTensor_5[5] * sinVector[4] * 0.5) -
    cosVector[5] * t1287 * 0.5) - cosVector[4] * t1361 * 0.5) - COMVector_5[0] *
    t1253 * 0.5) + COMVector_5[2] * t1288 * 0.5) - COMVector_5[2] * t1296 * 0.5)
    + COMVector_2[0] * t2178 * 0.5) + sinVector[5] * t1283 * 0.5) + t294 * t2178
    * 0.5) + massVector[5] * COMVector_5[0] * t1251 * 0.5);
  coriolis[26] = ((((-t2399 - t2404) - angleVelocityVector[4] * (((((((((((t2394
    + t2395) + t2396) + t2397) - inertiaTensor_5[5] * sinVector[4] * 0.5) -
    cosVector[4] * t1361 * 0.5) - cosVector[5] * t1520 * 0.5) - COMVector_5[0] *
    t1510 * 0.5) + COMVector_5[2] * t1511 * 0.5) - COMVector_5[2] * t1524 * 0.5)
    + sinVector[5] * t1517 * 0.5) + massVector[5] * COMVector_5[0] * t1508 * 0.5))
                   + angleVelocityVector[0] * ((((((((((((((t2186 + t2187) +
    t2190) + t2192) + t2297) + t2298) + t2350) + t2351) + t2352) + t2353) +
    t2400) + t2403) - cosVector[4] * t279 * 0.5) - COMVector_5[2] * t469 * 0.5)
    - inertiaTensor_5[1] * cosVector[4] * t9 * 0.5)) - angleVelocityVector[3] *
                  (((((((((((t2194 + t2195) + t2197) + t2201) + t2202) + t2392)
                        + t2393) - COMVector_5[2] * t1418 * 0.5) - COMVector_5[0]
                      * t1424 * 0.5) + COMVector_5[2] * t1429 * 0.5) -
                    sinVector[4] * t1064 * 0.5) - sinVector[5] * t1433 * 0.5)) +
    angleVelocityVector[5] * (((((((t2217 + t2218) + t2219) - t2296) + t2413) +
    t2414) - cosVector[5] * t1160 * 0.5) - sinVector[5] * t1163 * 0.5);
  coriolis[27] = ((((-t2406 - t2412) - angleVelocityVector[4] * (((((((((t2394 +
    t2395) - inertiaTensor_5[5] * sinVector[4] * 0.5) - cosVector[4] * t1361 *
    0.5) - cosVector[5] * t1726 * 0.5) + COMVector_5[0] * t1711 * 0.5) +
    COMVector_5[2] * t1709 * 0.5) - COMVector_5[2] * t1718 * 0.5) + sinVector[5]
    * t1723 * 0.5) + massVector[5] * COMVector_5[0] * t1710 * 0.5)) +
                   angleVelocityVector[1] * (((((((((-t2183 + t2275) + t2387) +
    t2388) + t2389) - t2407) - t2408) - t2409) + sinVector[4] * (((((((t753 +
    t1302) + t1303) + t1308) - t1392) - t1393) - t1394) - t1395) * 0.5) +
    cosVector[4] * ((((((((((-t759 + t1293) + t1294) + t1295) + t1297) + t1298)
                        + t1299) - t1387) - t1388) - t1389) - t1390) * 0.5)) +
                  angleVelocityVector[5] * (((((t2217 - t2296) + t2424) + t2425)
    - cosVector[5] * t1024 * 0.5) - sinVector[5] * t1027 * 0.5)) +
    angleVelocityVector[0] * ((((((((((((t2186 + t2187) + t2297) + t2298) +
    t2354) + t2356) + t2357) + t2358) + t2403) - cosVector[4] * t279 * 0.5) -
    COMVector_5[2] * t189 * 0.5) - inertiaTensor_5[1] * cosVector[4] * t9 * 0.5)
    - massVector[5] * COMVector_5[0] * t149 * 0.5);
  coriolis[28] = angleVelocityVector[5] * t2417;
  coriolis[29] = ((((t2479 + t2482) + angleVelocityVector[3] * ((((((((t2418 +
    t2421) + t2424) + t2425) + t2472) - cosVector[5] * t1024 * 0.5) - sinVector
    [5] * t1027 * 0.5) - inertiaTensor_6[2] * cosVector[4] * cosVector[5] * 0.5)
    - massVector[5] * COMVector_6[1] * t1708 * 0.5)) + angleVelocityVector[2] *
                   ((((((((t2413 + t2414) + t2418) + t2421) + t2463) -
                       cosVector[5] * t1160 * 0.5) - sinVector[5] * t1163 * 0.5)
                     - inertiaTensor_6[2] * cosVector[4] * cosVector[5] * 0.5) -
                    massVector[5] * COMVector_6[1] * t1501 * 0.5)) -
                  angleVelocityVector[5] * t874) + angleVelocityVector[1] *
    ((((((((t2418 + t2419) + t2420) + t2421) + t2461) + t2480) - cosVector[5] *
       t733 * 0.5) - sinVector[5] * t737 * 0.5) - inertiaTensor_6[2] *
     cosVector[4] * cosVector[5] * 0.5);
  coriolis[30] = ((((-t2428 + angleVelocityVector[5] * (((((inertiaTensor_6[2] *
    t18 * 0.5 - inertiaTensor_6[5] * t15 * 0.5) + cosVector[1] * t2436 * 0.5) +
    sinVector[1] * t2431 * 0.5) + massVector[5] * COMVector_6[1] * t47 * 0.5) -
    massVector[5] * COMVector_6[0] * t51 * 0.5)) - angleVelocityVector[4] *
                    ((((((-t1903 + t2451) + t2452) + t2453) + sinVector[1] *
                       t1898 * 0.5) - massVector[5] * COMVector_6[0] * t341 *
                      0.5) - inertiaTensor_6[5] * sinVector[4] * sinVector[5] *
                     t13 * 0.5)) - angleVelocityVector[1] * ((((((-t1955 + t2437)
    + t2438) - t2439) - t2440) + t2441) + t2443)) - angleVelocityVector[2] *
                  ((((((t1963 + t2437) + t2438) + t2441) - t2446) - t2447) -
                   t2448)) - angleVelocityVector[3] * ((((((t1916 + t2437) +
    t2438) + t2441) - sinVector[1] * t2444 * 0.5) - massVector[5] * COMVector_6
    [1] * t168 * 0.5) - massVector[5] * COMVector_6[0] * t173 * 0.5);
  coriolis[31] = ((((angleVelocityVector[1] * (((((t2235 + t2236) + t2237) +
    t2238) + t2239) - cosVector[4] * (((((t818 + t819) + t820) + t821) - t839) -
    t840) * 0.5) + angleVelocityVector[2] * (((((((t2205 + t2207) + t2209) +
    t2210) + t2211) + t2457) - cosVector[4] * (((((-t839 - t840) + t1590) +
    t1591) + t1592) + t1593) * 0.5) - massVector[5] * COMVector_6[1] * t1080 *
    0.5)) + angleVelocityVector[3] * (((((((-t2232 + t2292) + t2293) + t2294) +
    t2454) + t2455) + t2456) - massVector[5] * COMVector_6[1] * t928 * 0.5)) -
                   angleVelocityVector[5] * (((((((((t2467 + t2468) + t2469) +
    t2470) - cosVector[4] * t1925 * 0.5) + COMVector_2[0] * t2228 * 0.5) -
    sinVector[4] * t1927 * 0.5) + t294 * t2228 * 0.5) - massVector[5] *
    COMVector_6[0] * t800 * 0.5) - massVector[5] * COMVector_6[1] * t799 * 0.5))
                  + angleVelocityVector[0] * ((((((((((t2241 + t2242) + t2244) +
    t2245) + t2246) - t2437) - t2438) + t2439) + t2440) - t2441) - t2462)) +
    angleVelocityVector[4] * ((((((((((t2212 + t2214) + t2215) + t2220) + t2221)
    - t2295) - t2418) - t2421) - t2461) + t2464) - massVector[5] * COMVector_6[1]
    * t1267 * 0.5);
  coriolis[32] = ((((angleVelocityVector[2] * (((t2209 + t2210) + t2211) -
    cosVector[4] * (((((-t839 - t840) + t1590) + t1591) + t1592) + t1593) * 0.5)
                     + angleVelocityVector[1] * (((((t2236 + t2238) + t2239) +
    t2457) - cosVector[4] * (((((t818 + t819) + t820) + t821) - t839) - t840) *
    0.5) - massVector[5] * COMVector_6[1] * t1080 * 0.5)) + angleVelocityVector
                    [3] * (((((t2292 - t2465) + t2466) + COMVector_3[0] * (t2135
    - t2137) * 0.5) + t118 * (t2135 - t2137) * 0.5) - massVector[5] *
    COMVector_6[1] * t1412 * 0.5)) + angleVelocityVector[4] * ((((((((t2215 +
    t2220) + t2221) - t2295) - t2418) - t2421) - t2463) + t2464) + t2476)) +
                  angleVelocityVector[0] * ((((((((t2241 + t2242) + t2246) -
    t2437) - t2438) - t2441) + t2447) + t2448) - t2462)) - angleVelocityVector[5]
    * (((((((t2467 + t2468) + t2469) + t2470) - cosVector[4] * t1925 * 0.5) -
         sinVector[4] * t1927 * 0.5) - massVector[5] * COMVector_6[0] * t1577 *
        0.5) - massVector[5] * COMVector_6[1] * t1576 * 0.5);
  coriolis[33] = ((((-t2475 + angleVelocityVector[3] * t2343) +
                    angleVelocityVector[2] * t2471) + angleVelocityVector[1] *
                   t2473) - angleVelocityVector[4] * ((((((-t2215 + t2295) +
    t2418) + t2421) - t2464) + t2472) - massVector[5] * COMVector_6[1] * t1708 *
    0.5)) + angleVelocityVector[5] * (((((-t2469 - t2470) + cosVector[4] * t1925
    * 0.5) + sinVector[4] * t1927 * 0.5) + massVector[5] * COMVector_6[0] *
    t1664 * 0.5) + massVector[5] * COMVector_6[1] * t1663 * 0.5);
  coriolis[34] = ((((-t2479 - t2482) - angleVelocityVector[1] * ((((((((t2418 +
    t2419) + t2420) + t2421) + t2461) - t2464) + t2480) - cosVector[5] * t733 *
    0.5) - sinVector[5] * t737 * 0.5)) - angleVelocityVector[5] *
                   (((((inertiaTensor_6[2] * cosVector[5] * 0.5 -
                        inertiaTensor_6[5] * sinVector[5] * 0.5) - cosVector[5] *
                       t857 * 0.5) + sinVector[5] * t858 * 0.5) - massVector[5] *
                     COMVector_6[0] * t1320 * 0.5) + massVector[5] *
                    COMVector_6[1] * t1324 * 0.5)) - angleVelocityVector[3] *
                  ((((((((t2418 + t2421) + t2424) + t2425) - t2464) + t2472) -
                     cosVector[5] * t1024 * 0.5) - sinVector[5] * t1027 * 0.5) -
                   massVector[5] * COMVector_6[1] * t1708 * 0.5)) -
    angleVelocityVector[2] * ((((((((t2413 + t2414) + t2418) + t2421) + t2463) -
    t2464) - t2476) - cosVector[5] * t1160 * 0.5) - sinVector[5] * t1163 * 0.5);
  coriolis[35] = 0.0;
}

//
// File trailer for coriolisMatrix.cpp
//
// [EOF]
//
