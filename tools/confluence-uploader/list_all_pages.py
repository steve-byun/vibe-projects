#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""모든 페이지 목록 조회"""

import sys
sys.stdout.reconfigure(encoding='utf-8')
sys.path.insert(0, 'c:/Steve/01_Vibe_Projects/tools/confluence-uploader')

from confluence_manager import ConfluenceManager
import requests

manager = ConfluenceManager()

url = f"{manager.base_url}/wiki/rest/api/content"
params = {
    'spaceKey': manager.space_key,
    'expand': 'ancestors,version',
    'limit': 100
}
response = requests.get(url, headers=manager.headers, params=params)

if response.status_code == 200:
    pages = response.json().get('results', [])
    print(f"Total pages: {len(pages)}\n")

    for page in pages:
        ancestors = page.get('ancestors', [])
        parent = ancestors[-1]['title'] if ancestors else 'Root'
        print(f"ID: {page['id']:12} | Parent: {parent:30} | Title: {page['title']}")
else:
    print(f"Error: {response.status_code}")
