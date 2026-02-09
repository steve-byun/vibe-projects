#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""페이지 내용 확인"""

import sys
sys.stdout.reconfigure(encoding='utf-8')
sys.path.insert(0, 'c:/Steve/01_Vibe_Projects/tools/confluence-uploader')

from confluence_manager import ConfluenceManager
import requests

page_id = "1508179977"
manager = ConfluenceManager()

url = f"{manager.base_url}/wiki/rest/api/content/{page_id}"
params = {'expand': 'body.storage,version'}
response = requests.get(url, headers=manager.headers, params=params)

if response.status_code == 200:
    data = response.json()
    print(f"Title: {data.get('title')}")
    print(f"Version: {data.get('version', {}).get('number')}")
    print("\n" + "=" * 60)
    print("CONTENT:")
    print("=" * 60)
    content = data.get('body', {}).get('storage', {}).get('value', '')
    print(content)
else:
    print(f"Error: {response.status_code}")
