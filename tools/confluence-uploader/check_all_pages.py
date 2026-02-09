#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""모든 기존 페이지 내용 확인"""

import sys
sys.stdout.reconfigure(encoding='utf-8')
sys.path.insert(0, 'c:/Steve/01_Vibe_Projects/tools/confluence-uploader')

from confluence_manager import ConfluenceManager
import requests

manager = ConfluenceManager()

# 기존 페이지들 (통합 매뉴얼이 아닌 것들)
EXISTING_PAGES = [
    "1434025985",  # 솔루션으로 구동 방법
    "1448378373",  # friction data converter
    "1448476694",  # log 암호화 해제
    "1449951239",  # 제어기에서 저크 변경
    "1450704910",  # matlab scope 연결 및 data gathering 방법
    "1450934277",  # v3 완전 삭제 후 재 설치
]

for page_id in EXISTING_PAGES:
    url = f"{manager.base_url}/wiki/rest/api/content/{page_id}"
    params = {'expand': 'body.storage,version'}
    response = requests.get(url, headers=manager.headers, params=params)

    if response.status_code == 200:
        data = response.json()
        title = data.get('title', '')
        content = data.get('body', {}).get('storage', {}).get('value', '')
        version = data.get('version', {}).get('number', 1)

        print("=" * 80)
        print(f"ID: {page_id} | Title: {title} | Version: {version}")
        print("=" * 80)
        print(content[:2000])
        print("\n... (truncated)\n")
