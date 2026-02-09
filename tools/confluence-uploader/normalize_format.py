#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
모든 페이지 형식을 기준 페이지와 동일하게 정규화
- 빈 줄 제거
- compact한 HTML 구조로 변환
"""

import sys
import re
sys.stdout.reconfigure(encoding='utf-8')
sys.path.insert(0, 'c:/Steve/01_Vibe_Projects/tools/confluence-uploader')

from confluence_manager import ConfluenceManager
import requests

# 정규화할 모든 페이지
ALL_PAGES = [
    "1450704910",  # matlab scope 연결 및 data gathering 방법
    "1434025985",  # 솔루션으로 구동 방법
    "1448378373",  # friction data converter
    "1448476694",  # log 암호화 해제
    "1449951239",  # 제어기에서 저크 변경
    "1450934277",  # v3 완전 삭제 후 재 설치
    "1507852307",  # UDP Data Gathering 통합 매뉴얼
    "1509097510",  # Git 코드 받기 통합 매뉴얼
    "1509097526",  # 양산 SW 관리 통합 매뉴얼
    "1509359621",  # IP 및 SVN 정보 통합
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


def normalize_content(content):
    """콘텐츠를 기준 페이지 형식으로 정규화"""

    # 1. 연속된 줄바꿈을 단일 줄바꿈으로
    content = re.sub(r'\n{2,}', '\n', content)

    # 2. 태그 사이의 불필요한 공백 제거
    content = re.sub(r'>\s+<', '>\n<', content)

    # 3. </h1> 또는 </h2> 다음에 줄바꿈 하나만
    content = re.sub(r'(</h[123]>)\s*', r'\1\n', content)

    # 4. <hr /> 또는 <hr/> 통일
    content = re.sub(r'<hr\s*/?>', '<hr/>', content)

    # 5. 마지막 줄 정리
    content = content.strip()

    return content


def main():
    print("=" * 60)
    print("Normalizing All Pages Format")
    print("=" * 60)

    manager = ConfluenceManager()

    for page_id in ALL_PAGES:
        title, content, version = get_page_content(manager, page_id)

        if not content:
            print(f"  ✗ Failed to fetch {page_id}")
            continue

        print(f"\nProcessing: {title}")

        new_content = normalize_content(content)

        if new_content != content:
            result = manager.update_page(page_id, title, new_content, version)
            if result:
                print(f"  ✓ Normalized")
            else:
                print(f"  ✗ Failed to update")
        else:
            print(f"  - Already normalized")

    print("\n" + "=" * 60)
    print("Done!")
    print("=" * 60)


if __name__ == "__main__":
    main()
