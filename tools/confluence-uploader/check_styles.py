#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""페이지 스타일 속성 확인"""

import sys
import re
sys.stdout.reconfigure(encoding='utf-8')
sys.path.insert(0, 'c:/Steve/01_Vibe_Projects/tools/confluence-uploader')

from confluence_manager import ConfluenceManager
import requests

manager = ConfluenceManager()

# 비교할 두 페이지
pages = {
    "1507852307": "UDP Data Gathering 통합 매뉴얼",
    "1450704910": "Matlab Scope 연결",
}

for page_id, desc in pages.items():
    url = f"{manager.base_url}/wiki/rest/api/content/{page_id}"
    params = {'expand': 'body.storage'}
    response = requests.get(url, headers=manager.headers, params=params)

    if response.status_code == 200:
        data = response.json()
        content = data.get('body', {}).get('storage', {}).get('value', '')

        print("=" * 60)
        print(f"[{desc}]")
        print("=" * 60)

        # style 속성 찾기
        styles = re.findall(r'style="([^"]*)"', content)
        if styles:
            print("Style 속성:")
            for s in styles:
                print(f"  - {s}")
        else:
            print("Style 속성: 없음")

        # font 관련 속성 찾기
        fonts = re.findall(r'font[^">\s]*', content)
        if fonts:
            print("\nFont 관련:")
            for f in set(fonts):
                print(f"  - {f}")

        # class 속성 찾기
        classes = re.findall(r'class="([^"]*)"', content)
        if classes:
            print("\nClass 속성:")
            for c in set(classes):
                print(f"  - {c}")

        # 사용된 태그 종류
        tags = re.findall(r'<([a-zA-Z0-9]+)[\s>]', content)
        unique_tags = set(tags)
        print(f"\n사용된 태그: {', '.join(sorted(unique_tags))}")

        print()
