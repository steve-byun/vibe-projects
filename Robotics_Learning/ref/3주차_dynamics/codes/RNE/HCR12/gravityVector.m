function gravity = gravityVector(lengthVector, massVector, g, inertiaTensor_1, inertiaTensor_2, inertiaTensor_3, inertiaTensor_4, inertiaTensor_5, inertiaTensor_6,  COMVector_1, COMVector_2, COMVector_3, COMVector_4, COMVector_5, COMVector_6, angleVector, angleVelocityVector, angularAccelerationVector, sinVector, cosVector, tiltVector)
% length vector
l1 = lengthVector(1);
l2 = lengthVector(2);
l3 = lengthVector(3);
l4 = lengthVector(4);
l5 = lengthVector(5);
l6 = lengthVector(6);
l7 = lengthVector(7);

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
  t5 = s2*t3;
  t11 = c2*cx_axis*cy_axis;
  t6 = t5-t11;
  t7 = c2*t3;
  t8 = cx_axis*cy_axis*s2;
  t9 = t7+t8;
  t10 = c3*t9;
  t25 = s3*t6;
  t12 = t10-t25;
  t13 = s5*t12;
  t14 = c1*sx_axis;
  t15 = cx_axis*s1*sy_axis;
  t16 = t14+t15;
  t17 = s4*t16;
  t18 = c3*t6;
  t19 = s3*t9;
  t20 = t18+t19;
  t21 = c4*t20;
  t22 = t17+t21;
  t23 = c5*t22;
  t24 = t13+t23;
  t26 = c4*t16;
  t30 = s4*t20;
  t27 = t26-t30;
  t28 = c5*t12;
  t40 = s5*t22;
  t29 = t28-t40;
  t31 = c6*t27;
  t32 = c6*t24;
  t33 = s6*t27;
  t34 = t32+t33;
  t38 = s6*t24;
  t35 = t31-t38;
  t36 = m5*t24;
  t37 = c6*m6*t34;
  t44 = m6*s6*t35;
  t39 = t36+t37-t44;
  t41 = m5*t29;
  t42 = m6*t29;
  t43 = t41+t42;
  t45 = c5*t39;
  t46 = m4*t22;
  t61 = s5*t43;
  t47 = t45+t46-t61;
  t48 = c4*t47;
  t49 = m4*t27;
  t50 = m5*t27;
  t51 = m6*s6*t34;
  t52 = c6*m6*t35;
  t53 = t49+t50+t51+t52;
  t54 = m3*t20;
  t62 = s4*t53;
  t55 = t48+t54-t62;
  t56 = s5*t39;
  t57 = c5*t43;
  t58 = m3*t12;
  t59 = m4*t12;
  t60 = t56+t57+t58+t59;
  t63 = c3*t55;
  t64 = m2*t6;
  t66 = s3*t60;
  t65 = t63+t64-t66;
  t67 = l7+r6cz;
  t68 = t56+t57+t59;
  t69 = c6*m6*(t31-t38);
  t70 = t50+t51+t69;
  t71 = t49+t50+t51+t69;
  t72 = s4*t47;
  t73 = c4*t71;
  t74 = l6+r5cz;
  t75 = t56+t57;
  t76 = l5-r4cy;
  t77 = m6*t34*t67;
  t78 = m6*r6cx*t29;
  t79 = t77+t78;
  t80 = m6*t35*t67;
  t81 = m6*r6cy*t29;
  t82 = t80+t81;
  t83 = t37-t44;
  t84 = t51+t52;
  t85 = m3*t16;
  t86 = r5cy*t39;
  t87 = m6*r6cy*t34;
  t88 = t70*t74;
  t89 = s6*t79;
  t90 = r5cy*t43;
  t91 = c6*t82;
  t105 = r5cz*t84;
  t106 = m6*r5cy*t29;
  t92 = t88+t89+t90+t91-t105-t106;
  t93 = t45-t61;
  t94 = t72+t73+t85;
  t95 = t72+t73;
  t96 = r5cx*t84;
  t108 = r5cx*t70;
  t109 = r5cy*t83;
  t110 = m6*r6cx*t35;
  t97 = t86+t87+t96-t108-t109-t110;
  t101 = s4*t71;
  t98 = t48+t54-t101;
  t99 = c3*t60;
  t100 = m2*t9;
  t102 = s3*t98;
  t103 = t99+t100+t102;
  t104 = r3cy*t60;
  t107 = r4cz*t68;
  t111 = r4cy*t70;
  t112 = t71*t76;
  t113 = r3cz*t94;
  t114 = r4cx*t68;
  t115 = t39*t74;
  t116 = r4cy*t93;
  t117 = t47*t76;
  t118 = c6*t79;
  t119 = r5cx*t43;
  t136 = r4cx*t75;
  t137 = s6*t82;
  t138 = r5cz*t83;
  t139 = m6*r5cx*t29;
  t120 = t114+t115+t116+t117+t118+t119-t136-t137-t138-t139;
  t121 = s4*t120;
  t122 = r5cx*(t51+t52);
  t123 = t86+t87-t108-t109-t110+t122;
  t124 = c6*(t80+t81);
  t125 = t88+t89+t90-t105-t106+t124;
  t126 = r4cz*t93;
  t127 = r4cx*t71;
  t128 = l4+r3cx;
  t129 = t94*t128;
  t130 = m2*t16;
  t131 = t72+t73+t85+t130;
  t132 = c3*t98;
  t133 = t64-t66+t132;
  t134 = t99+t102;
  t135 = t48-t101;
  t140 = c5*t125;
  t141 = s5*t123;
  t146 = r4cz*t75;
  t142 = t107+t111+t112+t140+t141-t146;
  t143 = l3+r2cx;
  t144 = r3cx*t68;
  t145 = r3cz*t135;
  t147 = s4*t142;
  t148 = s5*t125;

A0 =  -g*(c2*(c3*(t104+t113+t121+c4*t142-r3cy*t68-r3cz*t95)+r2cy*t94+r2cz*t103-r2cy*t131-r2cz*t134-s3*(t126+t127+t129+t148-c5*t123-r4cz*t47-r4cx*t70-r3cx*t95-r3cy*t98+r3cy*t135))+(l2+r1cx)*(t72+t73+t85+t130+m1*t16)-r1cx*t131-r1cz*(s2*t65+c2*(t99+t100+s3*t55))-s2*(-r2cz*t65-r2cx*t94+t131*t143+s3*(t104+t113+t121+c4*(t107+t111+t112+c5*t92-r4cz*t75+s5*t97)-r3cy*t68-r3cz*t95)+r2cz*(t63-t66)+c3*(t126+t127+t129-c5*t97-r4cz*t47-r4cx*t70-r3cx*t95-r3cy*t98+s5*t92+r3cy*(t48-s4*t71)))+r1cz*(c2*t103+m1*t3+s2*t133));
A1 =  -g*(t144+t145+t147-c4*t120-r3cz*t98+r2cx*t134+r2cy*t133-t60*t128-t103*t143+r2cy*(t66-t132));
A2 =  -g*(t144+t145+t147-c4*t120-r3cz*t98-t60*t128);
A3 =  g*(t126+t127+t148-c5*t123-r4cz*t47-r4cx*t70);
A4 =  g*(t115+t118+t119-t137-t138-t139);
A5 =  -g*(t87-t110);

gravity = [A0 A1 A2 A3 A4 A5];
end