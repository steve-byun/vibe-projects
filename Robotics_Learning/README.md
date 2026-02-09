# Robotics Learning - MATLAB + RVCTools

2-Link 로봇부터 시작해서 로봇공학 기초를 배우는 프로젝트

## 폴더 구조

```
Robotics_Learning/
├── 2_link/              ← 2축 로봇 (현재 학습)
│   ├── s01_basics_robot.m          # 로봇 정의, 자세, workspace
│   ├── s02_basics_fk.m             # FK: 각도 → 위치
│   ├── s03_basics_ik.m             # IK: 위치 → 각도
│   ├── s04_kinematics_dh.m         # DH 파라미터
│   ├── s05_kinematics_jacobian.m   # 야코비안, 특이점
│   ├── s06_dynamics_xxx.m          # (예정) 동역학
│   └── _animation.m                # 애니메이션 (부록)
│
├── 6_link/              ← 6축 로봇 (나중에)
├── lib/                 ← 공통 함수
└── README.md
```

## 파일명 규칙

`s숫자_카테고리_내용.m`

- **숫자**: 학습 순서
- **카테고리**: basics / kinematics / dynamics / control
- **내용**: 구체적인 주제

## 사전 준비

1. MATLAB 설치
2. RVCTools 설치: https://petercorke.com/toolboxes/robotics-toolbox/
3. MATLAB에서 `startup_rvc` 실행하여 경로 추가

## 학습 순서

### Basics (기초)
| 파일 | 배우는 것 |
|------|----------|
| s01_basics_robot.m | 로봇 정의, 관절/링크, workspace |
| s02_basics_fk.m | 순기구학 (FK) - 각도→위치 |
| s03_basics_ik.m | 역기구학 (IK) - 위치→각도 |

### Kinematics (기구학)
| 파일 | 배우는 것 |
|------|----------|
| s04_kinematics_dh.m | DH 파라미터, 변환 행렬 |
| s05_kinematics_jacobian.m | 야코비안, 속도 변환, 특이점 |

### Dynamics (동역학) - 예정
| 파일 | 배우는 것 |
|------|----------|
| s06_dynamics_xxx.m | 질량행렬, 토크 계산 |

## 핵심 개념 요약

### Forward Kinematics (FK)
```
관절 각도 [q1, q2] → 끝점 위치 [x, y]

x = L1*cos(q1) + L2*cos(q1+q2)
y = L1*sin(q1) + L2*sin(q1+q2)
```

### Inverse Kinematics (IK)
```
끝점 위치 [x, y] → 관절 각도 [q1, q2]

cos(q2) = (x² + y² - L1² - L2²) / (2*L1*L2)
q2 = atan2(±√(1-cos²q2), cos(q2))  ← 해가 2개!
q1 = atan2(y, x) - atan2(L2*sin(q2), L1+L2*cos(q2))
```

### DH 파라미터
```
| θ (theta) | Z축 회전 (관절각)    |
| d         | Z축 이동             |
| a         | X축 이동 (링크 길이) |
| α (alpha) | X축 회전 (비틀림)    |
```

## 참고 자료
- OJT 원본: `C:\Work\OJT_Robotics_Study`
- RVCTools 문서: https://petercorke.com/rvc/
