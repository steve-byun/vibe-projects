r"""
음식 사진 필터 - CLIP 모델로 음식 사진만 골라내기
100% 로컬 실행 (인터넷은 최초 모델 다운로드 시에만 필요)

사용법:
  python food_filter.py [사진 폴더 경로]
  python food_filter.py E:\test\2023 --dry-run
  python food_filter.py E:\test\2023 --move
  python food_filter.py E:\test\2023 --threshold 0.5
"""

import os
import sys
import shutil
import argparse
import io
from pathlib import Path
from PIL import Image

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

IMAGE_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.bmp', '.webp', '.heic', '.tiff', '.tif'}

# CLIP 카테고리 라벨
# 사람 없이 음식만 있는 사진
FOOD_ONLY_LABELS = [
    "a close-up photo of food on a table with no people",
    "a photo of a dish on a plate without any person",
    "a photo of only food, no people visible",
]

# 사람이 포함된 라벨
PERSON_LABELS = [
    "a photo of a person eating food",
    "a photo of people at a restaurant",
    "a photo of a person",
    "a photo of a selfie",
    "a group photo of people",
]

# 기타 라벨
OTHER_LABELS = [
    "a photo of a landscape or scenery",
    "a photo of a building or architecture",
    "a photo of an animal",
    "a photo of text or document",
    "a photo of nature",
]

ALL_LABELS = FOOD_ONLY_LABELS + PERSON_LABELS + OTHER_LABELS
FOOD_ONLY_COUNT = len(FOOD_ONLY_LABELS)
PERSON_COUNT = len(PERSON_LABELS)


LIVE_PHOTO_EXTENSIONS = {'.mov', '.MOV'}


def move_with_live_photo(src_path, dest_dir, op, suffix_tag=''):
    """파일 이동/복사 + Live Photo MOV 동반 처리. 이동 수 반환."""
    count = 0
    stem = src_path.stem

    # 이름 충돌 시 suffix_tag 추가 (JPG/MOV 동일한 stem 유지)
    dest = dest_dir / src_path.name
    use_tag = dest.exists()
    if use_tag:
        dest = dest_dir / f"{stem}{suffix_tag}{src_path.suffix}"

    try:
        op(str(src_path), str(dest))
        count += 1
    except Exception as e:
        print(f"   오류: {src_path.name}: {e}")
        return count

    # Live Photo 동반 MOV 찾기 (JPG와 같은 stem 규칙 적용)
    for ext in LIVE_PHOTO_EXTENSIONS:
        companion = src_path.with_suffix(ext)
        if companion.exists():
            if use_tag:
                cdest = dest_dir / f"{stem}{suffix_tag}{companion.suffix}"
            else:
                cdest = dest_dir / companion.name
            try:
                op(str(companion), str(cdest))
                print(f"   Live Photo: {companion.name} 동반 처리")
            except Exception as e:
                print(f"   오류 (Live Photo): {companion.name}: {e}")
            break

    return count


def find_images(folder):
    folder = Path(folder)
    images = []
    skip_dirs = {'음식', '기타', '_음식', '_기타', '선택', '중복'}
    for root, dirs, files in os.walk(folder):
        dirs[:] = [d for d in dirs if d not in skip_dirs]
        for f in files:
            if Path(f).suffix.lower() in IMAGE_EXTENSIONS:
                images.append(Path(root) / f)
    return sorted(images)


def format_size(b):
    for u in ['B', 'KB', 'MB', 'GB']:
        if b < 1024:
            return f"{b:.1f}{u}"
        b /= 1024
    return f"{b:.1f}TB"


def main():
    parser = argparse.ArgumentParser(description='CLIP으로 음식 사진만 골라내기')
    parser.add_argument('folder', nargs='?', default='.', help='사진 폴더 경로')
    parser.add_argument('--threshold', type=float, default=0.4,
                        help='음식 판별 임계값 (기본: 0.4, 낮을수록 더 많이 잡음)')
    parser.add_argument('--move', action='store_true', help='파일 이동 (기본: 복사)')
    parser.add_argument('--dry-run', action='store_true', help='결과만 표시')
    args = parser.parse_args()

    folder = Path(args.folder).resolve()
    if not folder.is_dir():
        print(f"오류: '{folder}' 폴더가 존재하지 않습니다")
        sys.exit(1)

    print(f"\n스캔 폴더: {folder}")
    print(f"   음식 임계값: {args.threshold} | 모드: {'이동' if args.move else '복사'} | {'DRY RUN' if args.dry_run else '실행'}")

    # 이미지 검색
    print("\n이미지 파일 검색 중...")
    image_paths = find_images(folder)
    if not image_paths:
        print("   사진을 찾을 수 없습니다.")
        sys.exit(0)
    print(f"   {len(image_paths)}개 이미지 발견")

    # CLIP 모델 로드
    print("\nCLIP 모델 로딩 중... (최초 실행 시 ~600MB 다운로드)")
    import torch
    from transformers import CLIPProcessor, CLIPModel

    device = "cuda" if torch.cuda.is_available() else "cpu"
    model_name = "openai/clip-vit-base-patch32"
    model = CLIPModel.from_pretrained(model_name).to(device)
    processor = CLIPProcessor.from_pretrained(model_name)
    model.eval()
    print(f"   모델 로드 완료! (장치: {device})")

    # 분류
    print("\n분석 중...")
    food_photos = []
    other_photos = []

    for i, path in enumerate(image_paths):
        try:
            img = Image.open(path).convert('RGB')
            # 큰 이미지는 리사이즈 (CLIP은 224x224로 처리하므로)
            if max(img.size) > 1024:
                img.thumbnail((1024, 1024), Image.LANCZOS)

            inputs = processor(text=ALL_LABELS, images=img, return_tensors="pt", padding=True)
            inputs = {k: v.to(device) for k, v in inputs.items()}

            with torch.no_grad():
                outputs = model(**inputs)
                logits = outputs.logits_per_image[0]
                probs = logits.softmax(dim=0)

            # 음식만(사람X) 확률 vs 사람 확률
            food_prob = sum(probs[j].item() for j in range(FOOD_ONLY_COUNT))
            person_prob = sum(probs[j].item() for j in range(FOOD_ONLY_COUNT, FOOD_ONLY_COUNT + PERSON_COUNT))

            # 음식만: 음식 확률 높고 AND 사람 확률 낮아야
            is_food = food_prob >= args.threshold and person_prob < 0.3

            # 가장 높은 라벨
            top_idx = probs.argmax().item()
            top_label = ALL_LABELS[top_idx]
            for prefix in ["a close-up photo of ", "a photo of ", "a group photo of "]:
                top_label = top_label.replace(prefix, "")
            top_prob = probs[top_idx].item()

            status = "[음식]" if is_food else "[기타]"
            file_size = path.stat().st_size

            print(f"   [{i+1}/{len(image_paths)}] {status} {path.name:<35} "
                  f"음식:{food_prob:.0%} 사람:{person_prob:.0%} | {top_label} ({top_prob:.0%})")

            entry = {'path': path, 'food_prob': food_prob, 'person_prob': person_prob,
                     'top_label': top_label, 'size': file_size}
            if is_food:
                food_photos.append(entry)
            else:
                other_photos.append(entry)

        except Exception as e:
            print(f"   [{i+1}/{len(image_paths)}] [오류] {path.name}: {e}")

    # 결과
    food_size = sum(p['size'] for p in food_photos)
    print(f"\n{'='*60}")
    print(f"결과: 음식 {len(food_photos)}장 / 기타 {len(other_photos)}장")
    print(f"   음식 사진 용량: {format_size(food_size)}")
    print(f"{'='*60}")

    if not food_photos:
        print("\n음식 사진이 없습니다!")
        sys.exit(0)

    if args.dry_run:
        print("\nDRY RUN 완료 -- 실제 파일 이동/복사 없음")
        sys.exit(0)

    # 파일 분류
    action = '이동' if args.move else '복사'
    answer = input(f"\n음식 사진 {len(food_photos)}장을 '음식' 폴더로 {action}할까요? [y/N]: ").strip().lower()
    if answer != 'y':
        print("취소됨")
        sys.exit(0)

    food_dir = folder / '음식'
    food_dir.mkdir(exist_ok=True)
    op = shutil.move if args.move else shutil.copy2
    count = 0

    for p in food_photos:
        count += move_with_live_photo(p['path'], food_dir, op)

    print(f"\n완료! 음식 폴더: {food_dir} ({count}장)")


if __name__ == '__main__':
    main()
