function gravity = gravityVector(lengthVector, massVector, g, inertiaTensor_1, inertiaTensor_2, inertiaTensor_3, inertiaTensor_4, inertiaTensor_5, inertiaTensor_6,  COMVector_1, COMVector_2, COMVector_3, COMVector_4, COMVector_5, COMVector_6, angleVector, angleVelocityVector, angularAccelerationVector, sinVector, cosVector, tiltVector)
% length vector
l1 = lengthVector(1);
l2 = lengthVector(2);
l3 = lengthVector(3);
l4 = lengthVector(4);
l5 = lengthVector(5);
l6 = lengthVector(6);

% mass vector
m1 = massVector(1);
m2 = massVector(2);
m3 = massVector(3);
m4 = massVector(4);
m5 = massVector(5);
m6 = massVector(6);

% gravity has only one

% inertia vector
I1xx = inertiaTensor_1(1);
I1xy = inertiaTensor_1(2);
I1xz = inertiaTensor_1(3);
I1yx = inertiaTensor_1(4);
I1yy = inertiaTensor_1(5);
I1yz = inertiaTensor_1(6);
I1zx = inertiaTensor_1(7);
I1zy = inertiaTensor_1(8);
I1zz = inertiaTensor_1(9);

I2xx = inertiaTensor_2(1);
I2xy = inertiaTensor_2(2);
I2xz = inertiaTensor_2(3);
I2yx = inertiaTensor_2(4);
I2yy = inertiaTensor_2(5);
I2yz = inertiaTensor_2(6);
I2zx = inertiaTensor_2(7);
I2zy = inertiaTensor_2(8);
I2zz = inertiaTensor_2(9);

I3xx = inertiaTensor_3(1);
I3xy = inertiaTensor_3(2);
I3xz = inertiaTensor_3(3);
I3yx = inertiaTensor_3(4);
I3yy = inertiaTensor_3(5);
I3yz = inertiaTensor_3(6);
I3zx = inertiaTensor_3(7);
I3zy = inertiaTensor_3(8);
I3zz = inertiaTensor_3(9);

I4xx = inertiaTensor_4(1);
I4xy = inertiaTensor_4(2);
I4xz = inertiaTensor_4(3);
I4yx = inertiaTensor_4(4);
I4yy = inertiaTensor_4(5);
I4yz = inertiaTensor_4(6);
I4zx = inertiaTensor_4(7);
I4zy = inertiaTensor_4(8);
I4zz = inertiaTensor_4(9);

I5xx = inertiaTensor_5(1);
I5xy = inertiaTensor_5(2);
I5xz = inertiaTensor_5(3);
I5yx = inertiaTensor_5(4);
I5yy = inertiaTensor_5(5);
I5yz = inertiaTensor_5(6);
I5zx = inertiaTensor_5(7);
I5zy = inertiaTensor_5(8);
I5zz = inertiaTensor_5(9);

I6xx = inertiaTensor_6(1);
I6xy = inertiaTensor_6(2);
I6xz = inertiaTensor_6(3);
I6yx = inertiaTensor_6(4);
I6yy = inertiaTensor_6(5);
I6yz = inertiaTensor_6(6);
I6zx = inertiaTensor_6(7);
I6zy = inertiaTensor_6(8);
I6zz = inertiaTensor_6(9);

% center of mass vector
r1cx = COMVector_1(1);
r1cy = COMVector_1(2);
r1cz = COMVector_1(3);

r2cx = COMVector_2(1);
r2cy = COMVector_2(2);
r2cz = COMVector_2(3);

r3cx = COMVector_3(1);
r3cy = COMVector_3(2);
r3cz = COMVector_3(3);

r4cx = COMVector_4(1);
r4cy = COMVector_4(2);
r4cz = COMVector_4(3);

r5cx = COMVector_5(1);
r5cy = COMVector_5(2);
r5cz = COMVector_5(3);

r6cx = COMVector_6(1);
r6cy = COMVector_6(2);
r6cz = COMVector_6(3);

% input angle vector
q1 = angleVector(1);
q2 = angleVector(2);
q3 = angleVector(3);
q4 = angleVector(4);
q5 = angleVector(5);
q6 = angleVector(6);

% input angular velocity vector
dq1 = angleVelocityVector(1);
dq2 = angleVelocityVector(2);
dq3 = angleVelocityVector(3);
dq4 = angleVelocityVector(4);
dq5 = angleVelocityVector(5);
dq6 = angleVelocityVector(6);

% input angular acceleration vector
ddq1 = angularAccelerationVector(1);
ddq2 = angularAccelerationVector(2);
ddq3 = angularAccelerationVector(3);
ddq4 = angularAccelerationVector(4);
ddq5 = angularAccelerationVector(5);
ddq6 = angularAccelerationVector(6);

% sin vector
s1 = sinVector(1);
s2 = sinVector(2);
s3 = sinVector(3);
s4 = sinVector(4);
s5 = sinVector(5);
s6 = sinVector(6);

% cos vector
c1 = cosVector(1);
c2 = cosVector(2);
c3 = cosVector(3);
c4 = cosVector(4);
c5 = cosVector(5);
c6 = cosVector(6);

% tilt vector
sx_axis = tiltVector(1);
sy_axis = tiltVector(2);
cx_axis = tiltVector(3);
cy_axis = tiltVector(4);
  t2 = s1*sx_axis;
  t4 = c1*cx_axis*sy_axis;
  t3 = t2-t4;
  t5 = c2*t3;
  t6 = cx_axis*cy_axis*s2;
  t7 = t5+t6;
  t8 = s2*t3;
  t10 = c2*cx_axis*cy_axis;
  t9 = t8-t10;
  t11 = c3*t9;
  t12 = s3*t7;
  t13 = t11+t12;
  t14 = c4*t13;
  t15 = c3*t7;
  t19 = s3*t9;
  t16 = t15-t19;
  t17 = s4*t16;
  t18 = t14+t17;
  t20 = c1*sx_axis;
  t21 = cx_axis*s1*sy_axis;
  t22 = t20+t21;
  t23 = s5*t22;
  t24 = c4*t16;
  t27 = s4*t13;
  t25 = t24-t27;
  t28 = c5*t25;
  t26 = t23-t28;
  t29 = s6*t18;
  t30 = c6*t26;
  t31 = t29+t30;
  t32 = c6*t18;
  t40 = s6*t26;
  t33 = t32-t40;
  t34 = c5*t22;
  t35 = s5*t25;
  t36 = t34+t35;
  t37 = m4*t25;
  t38 = m5*t26;
  t39 = c6*m6*t31;
  t53 = m6*s6*t33;
  t41 = t38+t39-t53;
  t42 = m5*t36;
  t43 = m6*t36;
  t44 = t42+t43;
  t45 = s5*t44;
  t54 = c5*t41;
  t46 = t37+t45-t54;
  t47 = m4*t18;
  t48 = m5*t18;
  t49 = c6*m6*t33;
  t50 = m6*s6*t31;
  t51 = t47+t48+t49+t50;
  t52 = c4*t51;
  t55 = m3*t13;
  t66 = s4*t46;
  t56 = t52+t55-t66;
  t57 = c3*t56;
  t58 = c4*t46;
  t59 = s4*t51;
  t60 = m3*t16;
  t61 = t58+t59+t60;
  t62 = l6+r6cz;
  t63 = c5*t44;
  t64 = s5*t41;
  t65 = m4*t22;
  t67 = m6*r6cy*t36;
  t81 = m6*t33*t62;
  t68 = t67-t81;
  t69 = m6*r6cx*t36;
  t83 = m6*t31*t62;
  t70 = t69-t83;
  t71 = t48+t49+t50;
  t72 = t49+t50;
  t73 = t39-t53;
  t74 = l5-r5cy;
  t75 = t63+t64;
  t76 = t63+t64+t65;
  t77 = l4+r4cy;
  t78 = m3*t22;
  t79 = t63+t64+t65+t78;
  t80 = r5cz*t72;
  t82 = c6*t68;
  t84 = s6*t70;
  t112 = r5cz*t71;
  t113 = t44*t74;
  t114 = m6*r5cy*t36;
  t85 = t80+t82+t84-t112-t113-t114;
  t86 = c5*t85;
  t87 = r4cy*t71;
  t88 = r5cy*t73;
  t89 = r5cx*t71;
  t90 = t41*t74;
  t91 = m6*r6cx*t33;
  t115 = r5cx*t72;
  t116 = m6*r6cy*t31;
  t92 = t88+t89+t90+t91-t115-t116;
  t93 = r4cz*t75;
  t117 = s5*t92;
  t118 = r4cz*t76;
  t119 = t51*t77;
  t94 = t86+t87+t93-t117-t118-t119;
  t95 = r5cz*t73;
  t96 = c6*t70;
  t97 = t45-t54;
  t98 = r4cx*t76;
  t99 = r5cx*t44;
  t100 = t46*t77;
  t104 = s6*t68;
  t105 = r4cx*t75;
  t106 = r4cy*t97;
  t107 = r5cz*t41;
  t108 = m6*r5cx*t36;
  t101 = t95+t96+t98+t99+t100-t104-t105-t106-t107-t108;
  t102 = c3*t61;
  t103 = s3*t56;
  t109 = s4*t101;
  t110 = t52-t66;
  t111 = r3cz*t110;
  t120 = c4*t94;
  t121 = r3cy*t79;
  t122 = t109+t111+t120+t121-r3cz*t56-r3cy*t76;
  t123 = t58+t59;
  t124 = r3cz*t123;
  t125 = s4*t94;
  t126 = r3cx*t76;
  t127 = l3-r3cx;
  t128 = t79*t127;
  t129 = t124+t125+t126+t128-c4*t101-r3cz*t61;
  t130 = m2*t22;
  t131 = t63+t64+t65+t78+t130;
  t132 = m2*t7;
  t133 = t102+t103+t132;
  t134 = m2*t9;
  t137 = s3*t61;
  t135 = t57+t134-t137;
  t136 = c2*t133;
  t138 = s2*t135;
  t139 = l2-r2cx;
  t140 = t102+t103;
  t141 = r4cz*t46;
  t142 = t56*t127;
  t143 = r3cx*t110;
  t144 = r3cy*t123;
  t145 = r4cx*t71;

A0 =  g*(r1cz*(t136+t138)+r1cx*t131-r1cz*(t136+t138+m1*t3)+s2*(c3*t122-r2cy*t79+r2cy*t131-r2cz*t135-s3*t129+r2cz*(t57-s3*t61))-r1cx*(t63+t64+t65+t78+t130+m1*t22)+c2*(c3*t129+r2cx*t79-r2cz*t133+r2cz*t140+s3*t122+t131*t139));
A1 =  -g*(t141+t142+t143+t144+t145-c5*t92-r4cx*t51-r3cy*t61-r4cz*t97-r2cy*t133+r2cy*t140-s5*t85+t135*t139+r2cx*(t57-t137));
A2 =  -g*(t141+t142+t143+t144+t145-c5*t92-r4cx*t51-r3cy*t61-r4cz*t97-s5*t85);
A3 =  g*(-t141-t145+c5*t92+r4cx*t51+s5*t85+r4cz*(t45-t54));
A4 =  g*(t95+t96+t99-t104-t107-t108);
A5 =  g*(t91-t116);

gravity = [A0 A1 A2 A3 A4 A5];
end