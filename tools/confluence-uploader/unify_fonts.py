#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
모든 매뉴얼 페이지의 폰트/형식을 통일
- br 태그를 적절한 구조로 변환
- 불필요한 속성 제거
- 깔끔한 HTML 구조로 정규화
"""

import sys
import re
sys.stdout.reconfigure(encoding='utf-8')
sys.path.insert(0, 'c:/Steve/01_Vibe_Projects/tools/confluence-uploader')

from confluence_manager import ConfluenceManager
import requests

# 폰트 통일할 모든 페이지
ALL_PAGES = [
    "1507852307",  # UDP Data Gathering 통합 매뉴얼
    "1509097510",  # Git 코드 받기 통합 매뉴얼
    "1509097526",  # 양산 SW 관리 통합 매뉴얼
    "1509359621",  # IP 및 SVN 정보 통합
    "1434025985",  # 솔루션으로 구동 방법
    "1448378373",  # friction data converter
    "1448476694",  # log 암호화 해제
    "1449951239",  # 제어기에서 저크 변경
    "1450934277",  # v3 완전 삭제 후 재 설치
    # "1450704910",  # matlab scope 연결 - 기준 페이지 (건너뜀)
    "1505755159",  # 개발 코드 적용 통합 매뉴얼
]


def get_page_content(manager, page_id):
    """페이지 내용 가져오기"""
    url = f"{manager.base_url}/wiki/rest/api/content/{page_id}"
    params = {'expand': 'body.storage,version'}
    response = requests.get(url, headers=manager.headers, params=params)

    if response.status_code == 200:
        data = response.json()
        return (data.get('title', ''),
                data.get('body', {}).get('storage', {}).get('value', ''),
                data.get('version', {}).get('number', 1))
    return None, None, None


def normalize_html(content):
    """HTML을 기준 페이지와 동일한 형식으로 정규화"""

    # 1. info 박스 내의 <br /> 를 줄바꿈 없이 단순 텍스트로 처리
    # <p>텍스트<br />텍스트</p> → <p>텍스트</p><p>텍스트</p>
    def fix_br_in_p(match):
        content = match.group(1)
        # br 태그를 </p><p>로 변환
        content = re.sub(r'\s*<br\s*/?>\s*', '</p><p>', content)
        return f'<p>{content}</p>'

    # p 태그 내의 br 처리
    content = re.sub(r'<p>([^<]*(?:<(?!/?p)[^<]*)*)</p>', fix_br_in_p, content)

    # 2. 연속된 <p></p> 정리
    content = re.sub(r'<p>\s*</p>', '', content)

    # 3. 단독 <br /> 태그 제거
    content = re.sub(r'(?<!</p>)\s*<br\s*/?>\s*(?!<)', '\n', content)

    # 4. 불필요한 속성 제거 (style, class 등)
    content = re.sub(r'\s+style="[^"]*"', '', content)
    content = re.sub(r'\s+class="[^"]*"', '', content)

    # 5. hr 태그 통일
    content = re.sub(r'<hr\s*/?>', '<hr />', content)

    # 6. 연속된 줄바꿈 정리
    content = re.sub(r'\n{3,}', '\n\n', content)

    # 7. 태그 사이 공백 정리
    content = re.sub(r'>\s+<', '>\n<', content)

    # 8. ac:structured-macro 내부 정리 (줄바꿈 제거)
    def clean_macro(match):
        return match.group(0).replace('\n', '')
    content = re.sub(r'<ac:structured-macro[^>]*>.*?</ac:structured-macro>', clean_macro, content, flags=re.DOTALL)

    return content.strip()


def main():
    print("=" * 60)
    print("Unifying Font/Format Across All Manual Pages")
    print("=" * 60)

    manager = ConfluenceManager()

    updated = 0
    skipped = 0
    failed = 0

    for page_id in ALL_PAGES:
        title, content, version = get_page_content(manager, page_id)

        if not content:
            print(f"  ✗ Failed to fetch {page_id}")
            failed += 1
            continue

        print(f"\n[{page_id}] {title}")

        new_content = normalize_html(content)

        if new_content != content:
            result = manager.update_page(page_id, title, new_content, version)
            if result:
                print(f"  ✓ Updated")
                updated += 1
            else:
                print(f"  ✗ Failed to update")
                failed += 1
        else:
            print(f"  - Already normalized (skipped)")
            skipped += 1

    print("\n" + "=" * 60)
    print(f"Results: {updated} updated, {skipped} skipped, {failed} failed")
    print("=" * 60)


if __name__ == "__main__":
    main()
