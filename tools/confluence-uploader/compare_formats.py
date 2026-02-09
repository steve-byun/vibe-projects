#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""페이지 포맷 비교"""

import sys
sys.stdout.reconfigure(encoding='utf-8')
sys.path.insert(0, 'c:/Steve/01_Vibe_Projects/tools/confluence-uploader')

from confluence_manager import ConfluenceManager
import requests

manager = ConfluenceManager()

pages = {
    "1508179977": "개발 코드 적용 통합 매뉴얼 (기준)",
    "1450704910": "matlab scope 연결 및 data gathering 방법",
    "1507852307": "UDP Data Gathering 통합 매뉴얼",
}

for page_id, name in pages.items():
    url = f"{manager.base_url}/wiki/rest/api/content/{page_id}"
    params = {'expand': 'body.storage'}
    response = requests.get(url, headers=manager.headers, params=params)

    if response.status_code == 200:
        content = response.json().get('body', {}).get('storage', {}).get('value', '')
        print("=" * 80)
        print(f"{name}")
        print("=" * 80)
        # 처음 1500자만 출력
        print(content[:1500])
        print("\n...\n")
