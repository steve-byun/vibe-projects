#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""두 페이지의 HTML 구조 비교"""

import sys
sys.stdout.reconfigure(encoding='utf-8')
sys.path.insert(0, 'c:/Steve/01_Vibe_Projects/tools/confluence-uploader')

from confluence_manager import ConfluenceManager
import requests

manager = ConfluenceManager()

# 비교할 두 페이지
pages = {
    "1507852307": "UDP Data Gathering 통합 매뉴얼 (왼쪽 - 다른 폰트)",
    "1450704910": "Matlab Scope 연결 (오른쪽 - 기준 폰트)",
}

for page_id, desc in pages.items():
    url = f"{manager.base_url}/wiki/rest/api/content/{page_id}"
    params = {'expand': 'body.storage'}
    response = requests.get(url, headers=manager.headers, params=params)

    if response.status_code == 200:
        data = response.json()
        title = data.get('title', '')
        content = data.get('body', {}).get('storage', {}).get('value', '')

        print("=" * 80)
        print(f"[{desc}]")
        print(f"PAGE ID: {page_id}")
        print(f"TITLE: {title}")
        print("=" * 80)
        print("HTML 구조 (첫 2000자):")
        print(content[:2000])
        print("\n\n")
