#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
기존 페이지들 형식 통일
- 마지막 업데이트 날짜 형식 수정
- 중복 업데이트 텍스트 정리
"""

import sys
import re
sys.stdout.reconfigure(encoding='utf-8')
sys.path.insert(0, 'c:/Steve/01_Vibe_Projects/tools/confluence-uploader')

from confluence_manager import ConfluenceManager
import requests

# 기존 페이지들
EXISTING_PAGES = [
    "1434025985",  # 솔루션으로 구동 방법
    "1448378373",  # friction data converter
    "1448476694",  # log 암호화 해제
    "1449951239",  # 제어기에서 저크 변경
    "1450704910",  # matlab scope 연결 및 data gathering 방법
    "1450934277",  # v3 완전 삭제 후 재 설치
]


def get_page_content(manager: ConfluenceManager, page_id: str) -> tuple:
    """페이지 내용 가져오기"""
    url = f"{manager.base_url}/wiki/rest/api/content/{page_id}"
    params = {'expand': 'body.storage,version'}
    response = requests.get(url, headers=manager.headers, params=params)

    if response.status_code != 200:
        return None, None, None

    data = response.json()
    title = data.get('title', '')
    content = data.get('body', {}).get('storage', {}).get('value', '')
    version = data.get('version', {}).get('number', 1)

    return title, content, version


def fix_content(content: str) -> str:
    """콘텐츠 수정"""
    original = content

    # 1. "업데이트 : 2026년 1월 9일" 같은 텍스트 제거 (footer에 통합)
    # 다양한 패턴 매칭
    update_text_patterns = [
        r'<p[^>]*>업데이트\s*:\s*\d+년\s*\d+월\s*\d+일</p>',
        r'<p[^>]*>업데이트\s*:\s*\d+년\s*\d+월\s*\d+일\s*</p>',
        r'<p[^>]*>\s*업데이트\s*:\s*\d+년\s*\d+월\s*\d+일\s*</p>',
    ]
    for pattern in update_text_patterns:
        content = re.sub(pattern, '', content, flags=re.IGNORECASE)

    # 2. 빈 <p> 태그 정리 (연속된 빈 줄)
    content = re.sub(r'(<p[^>]*/>\s*){2,}', '<p/>', content)

    # 3. 마지막 업데이트 날짜 형식 수정
    # "2025-01" → "2026-01-29"
    content = re.sub(
        r'(<p><em>마지막 업데이트:\s*)2025-01(\s*</em></p>)',
        r'\g<1>2026-01-29\g<2>',
        content
    )

    # 4. footer가 없으면 추가
    if '<em>마지막 업데이트:' not in content:
        content = content.rstrip() + '\n<hr/><p><em>마지막 업데이트: 2026-01-29</em></p>'

    # 5. 연속된 <hr/> 정리
    content = re.sub(r'(<hr\s*/?>[\s\n]*){2,}', '<hr/>\n', content)

    return content


def process_page(manager: ConfluenceManager, page_id: str):
    """단일 페이지 처리"""
    title, content, version = get_page_content(manager, page_id)
    if not content:
        print(f"  Failed to fetch page {page_id}")
        return

    print(f"\n{'='*60}")
    print(f"Processing: {title} (ID: {page_id})")
    print(f"{'='*60}")

    original_content = content
    new_content = fix_content(content)

    if new_content != original_content:
        result = manager.update_page(page_id, title, new_content, version)
        if result:
            print(f"  ✓ Updated successfully")
        else:
            print(f"  ✗ Failed to update")
    else:
        print(f"  - No changes needed")


def main():
    print("=" * 60)
    print("Fixing Existing Pages Format")
    print("=" * 60)

    manager = ConfluenceManager()

    for page_id in EXISTING_PAGES:
        process_page(manager, page_id)

    print("\n" + "=" * 60)
    print("All pages processed!")
    print("=" * 60)


if __name__ == "__main__":
    main()
