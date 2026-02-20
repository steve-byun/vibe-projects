r"""
iCloud Photo Cleaner - 로컬 테스트 도구
유사 사진을 찾아 베스트 1장은 '선택', 나머지는 '중복' 폴더로 분류

사용법:
  python photo_cleaner.py [사진 폴더 경로]
  python photo_cleaner.py                    # 현재 폴더
  python photo_cleaner.py C:\Users\me\Photos
  python photo_cleaner.py ./photos --threshold 12 --move
"""

import os
import sys
import shutil
import argparse
from pathlib import Path
from PIL import Image
import math
import io

# Windows 콘솔 UTF-8 출력
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

# ── 설정 ──
IMAGE_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.bmp', '.webp', '.heic', '.tiff', '.tif'}
DHASH_SIZE = 8  # 8x9 → 64-bit hash


def compute_dhash(img):
    """dHash 계산: 9x8 리사이즈 → 인접 픽셀 비교 → 64비트 해시"""
    small = img.convert('L').resize((DHASH_SIZE + 1, DHASH_SIZE), Image.LANCZOS)
    pixels = list(small.getdata())
    w = DHASH_SIZE + 1

    hash_val = 0
    for y in range(DHASH_SIZE):
        for x in range(DHASH_SIZE):
            left = pixels[y * w + x]
            right = pixels[y * w + x + 1]
            if left > right:
                hash_val |= 1 << (y * DHASH_SIZE + x)

    return hash_val


def hamming_distance(h1, h2):
    """두 해시 간 Hamming distance (0=동일, 64=완전 다름)"""
    xor = h1 ^ h2
    dist = 0
    while xor:
        dist += xor & 1
        xor >>= 1
    return dist


def compute_sharpness(img):
    """Laplacian variance로 선명도 측정 (높을수록 선명)"""
    gray = img.convert('L').resize((64, 64), Image.LANCZOS)
    pixels = list(gray.getdata())
    w = 64

    laplacian_vals = []
    for y in range(1, w - 1):
        for x in range(1, w - 1):
            center = pixels[y * w + x]
            lap = (
                pixels[(y - 1) * w + x] +
                pixels[(y + 1) * w + x] +
                pixels[y * w + (x - 1)] +
                pixels[y * w + (x + 1)] -
                4 * center
            )
            laplacian_vals.append(lap)

    if not laplacian_vals:
        return 0

    mean = sum(laplacian_vals) / len(laplacian_vals)
    variance = sum((v - mean) ** 2 for v in laplacian_vals) / len(laplacian_vals)

    # 0~100 정규화 (sigmoid-like)
    score = 100 * (1 - math.exp(-variance / 500))
    return round(max(0, min(100, score)))


def compute_exposure(img):
    """평균 밝기 기반 노출 평가 (100-160 이상적)"""
    gray = img.convert('L').resize((64, 64), Image.LANCZOS)
    pixels = list(gray.getdata())
    mean = sum(pixels) / len(pixels)

    if 100 <= mean <= 160:
        return 100
    dist = abs(mean - 130)
    return round(max(0, 100 - dist * 1.2))


def compute_contrast(img):
    """밝기 표준편차 기반 대비 평가"""
    gray = img.convert('L').resize((64, 64), Image.LANCZOS)
    pixels = list(gray.getdata())
    mean = sum(pixels) / len(pixels)
    variance = sum((p - mean) ** 2 for p in pixels) / len(pixels)
    stddev = math.sqrt(max(0, variance))

    return round(min(100, stddev * 2))


def compute_quality(img):
    """종합 품질 점수 (선명도 50% + 노출 30% + 대비 20%)"""
    sharpness = compute_sharpness(img)
    exposure = compute_exposure(img)
    contrast = compute_contrast(img)
    total = sharpness * 0.50 + exposure * 0.30 + contrast * 0.20

    return {
        'sharpness': sharpness,
        'exposure': exposure,
        'contrast': contrast,
        'total': round(total, 1),
    }


def compute_resolution_score(img):
    """해상도 보너스 (더 큰 이미지에 약간의 보너스)"""
    w, h = img.size
    megapixels = (w * h) / 1_000_000
    # 0~10 보너스 (12MP 이상이면 최대)
    return min(10, megapixels * 0.8)


def find_images(folder):
    """폴더 하위의 모든 이미지 파일 검색 (선택/중복 폴더 제외)"""
    folder = Path(folder)
    images = []
    skip_dirs = {'선택', '중복', '_선택', '_중복'}

    for root, dirs, files in os.walk(folder):
        # 선택/중복 폴더 건너뛰기
        dirs[:] = [d for d in dirs if d not in skip_dirs]

        for f in files:
            if Path(f).suffix.lower() in IMAGE_EXTENSIONS:
                images.append(Path(root) / f)

    return sorted(images)


def group_similar(photos, threshold):
    """Union-Find로 유사 사진 그룹핑"""
    n = len(photos)
    parent = list(range(n))
    rank = [0] * n

    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x

    def union(a, b):
        ra, rb = find(a), find(b)
        if ra == rb:
            return
        if rank[ra] < rank[rb]:
            parent[ra] = rb
        elif rank[ra] > rank[rb]:
            parent[rb] = ra
        else:
            parent[rb] = ra
            rank[ra] += 1

    # 모든 쌍 비교
    for i in range(n):
        for j in range(i + 1, n):
            dist = hamming_distance(photos[i]['hash'], photos[j]['hash'])
            if dist <= threshold:
                union(i, j)

    # 그룹 수집
    groups = {}
    for i in range(n):
        root = find(i)
        if root not in groups:
            groups[root] = []
        groups[root].append(i)

    # 2장 이상인 그룹만 반환
    result = []
    for indices in groups.values():
        if len(indices) >= 2:
            group_photos = [photos[i] for i in indices]
            # 베스트 선택: 품질 + 해상도 보너스
            best = max(group_photos, key=lambda p: p['quality']['total'] + p['res_bonus'])
            result.append({
                'photos': group_photos,
                'best': best,
            })

    result.sort(key=lambda g: len(g['photos']), reverse=True)
    return result


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


def format_size(bytes_val):
    """바이트를 읽기 쉬운 형식으로"""
    for unit in ['B', 'KB', 'MB', 'GB']:
        if bytes_val < 1024:
            return f"{bytes_val:.1f}{unit}"
        bytes_val /= 1024
    return f"{bytes_val:.1f}TB"


def main():
    parser = argparse.ArgumentParser(
        description='유사 사진을 찾아 베스트는 선택, 나머지는 중복 폴더로 분류'
    )
    parser.add_argument('folder', nargs='?', default='.', help='사진 폴더 경로 (기본: 현재 폴더)')
    parser.add_argument('--threshold', type=int, default=10, help='유사도 임계값 (기본: 10, 낮을수록 엄격)')
    parser.add_argument('--move', action='store_true', help='파일 이동 (기본: 복사)')
    parser.add_argument('--dry-run', action='store_true', help='실제 파일 이동/복사 없이 결과만 표시')
    parser.add_argument('--min-group', type=int, default=2, help='최소 그룹 크기 (기본: 2)')

    args = parser.parse_args()
    folder = Path(args.folder).resolve()

    if not folder.is_dir():
        print(f"오류: '{folder}' 폴더가 존재하지 않습니다")
        sys.exit(1)

    print(f"\n📁 스캔 폴더: {folder}")
    print(f"   임계값: {args.threshold} | 모드: {'이동' if args.move else '복사'} | {'DRY RUN' if args.dry_run else '실행'}")
    print()

    # Step 1: 이미지 파일 검색
    print("🔍 이미지 파일 검색 중...")
    image_paths = find_images(folder)

    if not image_paths:
        print("   사진을 찾을 수 없습니다.")
        sys.exit(0)

    print(f"   {len(image_paths)}개 이미지 발견\n")

    # Step 2: 해시 + 품질 계산
    print("📊 분석 중...")
    photos = []
    errors = 0

    for i, path in enumerate(image_paths):
        progress = f"[{i+1}/{len(image_paths)}]"
        try:
            img = Image.open(path)
            img.load()  # 실제 로드

            dhash = compute_dhash(img)
            quality = compute_quality(img)
            res_bonus = compute_resolution_score(img)
            file_size = path.stat().st_size

            photos.append({
                'path': path,
                'hash': dhash,
                'quality': quality,
                'res_bonus': res_bonus,
                'size': file_size,
                'dimensions': img.size,
            })

            score = quality['total'] + res_bonus
            print(f"   {progress} {path.name:<40} "
                  f"품질:{quality['total']:>5.1f} "
                  f"선명:{quality['sharpness']:>3} "
                  f"노출:{quality['exposure']:>3} "
                  f"대비:{quality['contrast']:>3} "
                  f"{img.size[0]}x{img.size[1]}")

        except Exception as e:
            errors += 1
            print(f"   {progress} {path.name:<40} ⚠️ 오류: {e}")

    if errors:
        print(f"\n   ⚠️ {errors}개 파일 처리 실패")

    if len(photos) < 2:
        print("\n   비교할 사진이 부족합니다 (최소 2장 필요)")
        sys.exit(0)

    # Step 3: 유사 그룹핑
    print(f"\n🔗 유사 사진 그룹핑 (임계값: {args.threshold})...")
    groups = group_similar(photos, args.threshold)

    if not groups:
        print("   유사한 사진 그룹이 없습니다! 모든 사진이 서로 다릅니다.")
        sys.exit(0)

    # Step 4: 결과 출력
    total_duplicates = sum(len(g['photos']) - 1 for g in groups)
    total_dup_size = sum(
        p['size'] for g in groups for p in g['photos'] if p != g['best']
    )

    print(f"\n{'='*70}")
    print(f"📋 결과: {len(groups)}개 그룹, {total_duplicates}개 중복 ({format_size(total_dup_size)} 절약 가능)")
    print(f"{'='*70}")

    for gi, group in enumerate(groups):
        best = group['best']
        duplicates = [p for p in group['photos'] if p != best]

        print(f"\n── 그룹 {gi+1} ({len(group['photos'])}장) ──")
        print(f"   ⭐ BEST: {best['path'].name} "
              f"(품질:{best['quality']['total']:.1f} | {best['dimensions'][0]}x{best['dimensions'][1]} | {format_size(best['size'])})")

        for dup in duplicates:
            dist = hamming_distance(dup['hash'], best['hash'])
            print(f"   ❌ 중복: {dup['path'].name} "
                  f"(품질:{dup['quality']['total']:.1f} | 유사도:{64-dist}/64 | {format_size(dup['size'])})")

    # Step 5: 파일 분류
    if args.dry_run:
        print(f"\n{'='*70}")
        print("🏁 DRY RUN 완료 — 실제 파일 이동/복사 없음")
        print(f"   --dry-run 플래그를 빼고 다시 실행하면 파일이 분류됩니다")
        sys.exit(0)

    print(f"\n{'='*70}")
    action = '이동' if args.move else '복사'
    answer = input(f"\n📂 {total_duplicates}개 중복 사진을 분류할까요? ({action}) [y/N]: ").strip().lower()

    if answer != 'y':
        print("취소됨")
        sys.exit(0)

    # 폴더 생성
    select_dir = folder / '선택'
    dup_dir = folder / '중복'
    select_dir.mkdir(exist_ok=True)
    dup_dir.mkdir(exist_ok=True)

    op = shutil.move if args.move else shutil.copy2
    moved_best = 0
    moved_dup = 0

    for group in groups:
        best = group['best']
        duplicates = [p for p in group['photos'] if p != best]

        # 베스트 → 선택 폴더
        moved_best += move_with_live_photo(best['path'], select_dir, op, '_best')

        # 중복 → 중복 폴더
        for dup in duplicates:
            moved_dup += move_with_live_photo(dup['path'], dup_dir, op, '_dup')

    print(f"\n✅ 완료!")
    print(f"   📂 선택: {select_dir} ({moved_best}장)")
    print(f"   📂 중복: {dup_dir} ({moved_dup}장)")
    print(f"   💾 절약: {format_size(total_dup_size)}")


if __name__ == '__main__':
    main()
