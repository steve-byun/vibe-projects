#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""페이지 전체 내용 가져오기"""

import sys
import re
import html
sys.stdout.reconfigure(encoding='utf-8')
sys.path.insert(0, 'c:/Steve/01_Vibe_Projects/tools/confluence-uploader')

from confluence_manager import ConfluenceManager
import requests

manager = ConfluenceManager()

def html_to_text(content):
    """HTML에서 텍스트 추출"""
    # 태그 제거하되 구조 유지
    text = content

    # 줄바꿈 처리
    text = re.sub(r'<br\s*/?>', '\n', text)
    text = re.sub(r'</p>', '\n', text)
    text = re.sub(r'</li>', '\n', text)
    text = re.sub(r'</h\d>', '\n', text)
    text = re.sub(r'<hr\s*/?>', '\n---\n', text)

    # 리스트 마커
    text = re.sub(r'<li[^>]*>', '- ', text)
    text = re.sub(r'<ol[^>]*>', '', text)
    text = re.sub(r'</ol>', '', text)
    text = re.sub(r'<ul[^>]*>', '', text)
    text = re.sub(r'</ul>', '', text)

    # 제목
    text = re.sub(r'<h1[^>]*>', '# ', text)
    text = re.sub(r'<h2[^>]*>', '## ', text)
    text = re.sub(r'<h3[^>]*>', '### ', text)

    # 강조
    text = re.sub(r'<strong>([^<]*)</strong>', r'**\1**', text)
    text = re.sub(r'<em>([^<]*)</em>', r'*\1*', text)
    text = re.sub(r'<code>([^<]*)</code>', r'`\1`', text)

    # 나머지 태그 제거
    text = re.sub(r'<[^>]+>', '', text)

    # HTML 엔티티 디코딩
    text = html.unescape(text)

    # 연속 공백/줄바꿈 정리
    text = re.sub(r'\n{3,}', '\n\n', text)
    text = re.sub(r'  +', ' ', text)

    return text.strip()

# 기존 페이지들
pages = [
    "1450704910",  # matlab scope 연결 및 data gathering 방법
    "1434025985",  # 솔루션으로 구동 방법
    "1448378373",  # friction data converter
    "1448476694",  # log 암호화 해제
    "1449951239",  # 제어기에서 저크 변경
    "1450934277",  # v3 완전 삭제 후 재 설치
]

for page_id in pages:
    url = f"{manager.base_url}/wiki/rest/api/content/{page_id}"
    params = {'expand': 'body.storage'}
    response = requests.get(url, headers=manager.headers, params=params)

    if response.status_code == 200:
        data = response.json()
        title = data.get('title', '')
        content = data.get('body', {}).get('storage', {}).get('value', '')

        print("=" * 80)
        print(f"PAGE ID: {page_id}")
        print(f"TITLE: {title}")
        print("=" * 80)
        print(html_to_text(content))
        print("\n\n")
