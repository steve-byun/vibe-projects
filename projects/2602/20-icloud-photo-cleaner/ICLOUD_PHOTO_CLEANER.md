# iCloud Photo Cleaner

## 개요
iCloud Photos 웹(icloud.com/photos)에서 유사한 사진들을 자동으로 찾아 그룹화하고,
가장 잘 나온 사진 1장을 추천하여 나머지를 정리할 수 있는 Chrome 확장 프로그램.

## 핵심 기능
- **유사 사진 감지**: dHash(Difference Hash) 알고리즘으로 연사/유사 포즈 사진 자동 그룹핑
- **품질 자동 평가**: 선명도(Laplacian) + 노출 + 대비 + 얼굴 품질(face-api.js)
- **반자동 정리**: 베스트 사진 추천 → 사용자 확인 후 삭제

## 기술 스택
- Chrome Extension Manifest V3
- dHash (perceptual hashing) — 64비트 이미지 지문
- Offscreen Document — Canvas 기반 이미지 처리
- face-api.js tiny (~190KB) — 얼굴 인식
- Union-Find 알고리즘 — 유사 그룹핑

## 설치 & 테스트
1. `chrome://extensions` 열기
2. "개발자 모드" ON
3. "압축해제된 확장 프로그램을 로드합니다" 클릭
4. `projects/2602/20-icloud-photo-cleaner` 폴더 선택
5. icloud.com/photos 접속 → 확장 아이콘 클릭 → 스캔

## 구조
```
├── manifest.json                 # MV3 매니페스트
├── popup/                        # 팝업 UI (다크 테마)
├── background/service-worker.js  # 오케스트레이터
├── content/icloud.js             # iCloud DOM 조작
├── offscreen/processor.js        # 이미지 처리 엔진
├── lib/
│   ├── constants.js              # 공유 상수
│   ├── dhash.js                  # dHash 알고리즘
│   ├── quality.js                # 품질 평가
│   ├── grouping.js               # Union-Find 그룹핑
│   └── face-api.min.js           # 얼굴 인식 라이브러리
├── models/                       # face-api.js 모델 파일
├── photo_cleaner.py              # 로컬 유사 사진 정리 도구
└── food_filter.py                # CLIP 기반 음식 사진 필터
```

## 로컬 도구 (Python)

### photo_cleaner.py — 유사 사진 정리
로컬 폴더에서 유사 사진을 찾아 베스트 1장은 `선택`, 나머지는 `중복` 폴더로 분류.
```bash
python photo_cleaner.py E:\test\2023 --threshold 18 --move
python photo_cleaner.py E:\test\2023 --dry-run        # 미리보기만
```
- **알고리즘**: dHash + Hamming distance → Union-Find 그룹핑
- **품질 평가**: 선명도(50%) + 노출(30%) + 대비(20%) + 해상도 보너스
- **Live Photo 지원**: JPG 이동 시 동일 stem의 MOV 파일 자동 동반 처리
- **의존성**: `pip install Pillow`

### food_filter.py — 음식 사진 필터
CLIP 모델로 사람 없이 음식만 있는 사진을 골라내기.
```bash
python food_filter.py E:\test\2023 --threshold 0.4 --move
python food_filter.py E:\test\2023 --dry-run
```
- **알고리즘**: OpenAI CLIP (clip-vit-base-patch32) zero-shot 분류
- **2단계 판별**: food_prob >= 0.4 AND person_prob < 0.3
- **라벨 구분**: FOOD_ONLY(3) + PERSON(5) + OTHER(5) = 13개 라벨
- **Live Photo 지원**: 음식 사진 이동 시 MOV 동반 처리
- **의존성**: `pip install Pillow torch transformers` (최초 실행 시 ~600MB 모델 다운로드)

## 알고리즘
### dHash (유사도)
- 이미지 → 9x8 리사이즈 → 그레이스케일 → 인접 픽셀 비교 → 64비트 해시
- Hamming distance < 10 = 유사 사진

### 품질 점수
- 얼굴 있음: 선명도(35%) + 노출(20%) + 대비(15%) + 얼굴(30%)
- 얼굴 없음: 선명도(50%) + 노출(30%) + 대비(20%)

## 상태
- v0.1.0 — Chrome 확장 MVP 구현 완료, 실제 iCloud 테스트 필요
- v0.2.0 — 로컬 Python 도구 추가 (photo_cleaner.py + food_filter.py)
  - E:\test\2023에서 테스트 완료 (threshold 18 → 7그룹 15중복 발견)
  - food_filter CLIP 정확도 검증 완료 (사람 포함 사진 필터링 성공)
  - Live Photo (JPG+MOV) 동반 처리 지원

## 주의사항
- iCloud DOM은 Apple이 언제든 변경할 수 있어 셀렉터 유지보수 필요
- 최대 500장 제한 (성능), 설정에서 변경 가능
- 삭제는 반자동: 사진 선택까지만 자동, iCloud 삭제 확인은 사용자가 직접
