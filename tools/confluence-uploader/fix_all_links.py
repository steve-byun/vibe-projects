#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
모든 통합 매뉴얼 페이지의 txt 파일 링크 재연결
"""

import sys
import re
import os
sys.stdout.reconfigure(encoding='utf-8')
sys.path.insert(0, 'c:/Steve/01_Vibe_Projects/tools/confluence-uploader')

from confluence_manager import ConfluenceManager
import requests

MANUAL_DIR = r"C:\Work\04_Admin_Docs\Reports\매뉴얼"

# 통합 매뉴얼 페이지들
PAGES = {
    "1507852307": {
        "title": "UDP Data Gathering 통합 매뉴얼",
        "files": ["로봇 데이터 획득 메뉴얼.txt", "UDP data gathering manual.txt"]
    },
    "1509097510": {
        "title": "Git 코드 받기 통합 매뉴얼",
        "files": ["git으로 코드 받기.txt", "git으로 코드 받기_최초및3세대.txt",
                  "git으로 코드 받기_23세대 동일.txt", "git으로 코드 받기_2세대.txt",
                  "git으로 v3 코드 받기 V2.txt"]
    },
    "1509097526": {
        "title": "양산 SW 관리 통합 매뉴얼",
        "files": ["양산 Release 된 SW 버전 받는 곳.txt", "양산 Release 된 SW로 업데이트 하는 법.txt",
                  "양산 제어기 → 개발 환경 변경 메뉴얼.txt"]
    },
    "1509359621": {
        "title": "IP 및 SVN 정보 통합",
        "files": ["IP 정보.txt", "SVN IP.txt", "12gen svn address.txt"]
    },
    "1508179977": {
        "title": "개발 코드 적용 통합 매뉴얼",
        "files": ["개발 코드 최초 적용 메뉴얼.txt", "코드 변경 후 적용 방법.txt"]
    }
}


def upload_attachment(manager, page_id, file_path):
    """파일 첨부"""
    url = f"{manager.base_url}/wiki/rest/api/content/{page_id}/child/attachment"
    headers = {
        "Authorization": manager.headers["Authorization"],
        "X-Atlassian-Token": "nocheck"
    }
    filename = os.path.basename(file_path)

    with open(file_path, 'rb') as f:
        files = {'file': (filename, f, 'text/plain')}
        response = requests.post(url, headers=headers, files=files)

    return response.status_code in [200, 400]  # 400 = already exists


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


def fix_file_links(content, filenames):
    """<code>파일명</code>을 첨부파일 링크로 변경"""
    for filename in filenames:
        # <code>파일명</code> 패턴
        code_pattern = f'<code>{re.escape(filename)}</code>'

        # 첨부파일 링크 형식 (기준 페이지와 동일)
        link = f'<ac:link><ri:attachment ri:filename="{filename}"/><ac:plain-text-link-body><![CDATA[{filename}]]></ac:plain-text-link-body></ac:link>'

        if re.search(code_pattern, content):
            content = re.sub(code_pattern, link, content)
            print(f"    Linked: {filename}")

    return content


def main():
    print("=" * 60)
    print("Fixing All File Links")
    print("=" * 60)

    manager = ConfluenceManager()

    for page_id, info in PAGES.items():
        print(f"\n{'='*60}")
        print(f"Processing: {info['title']}")
        print(f"{'='*60}")

        # 1. 파일 첨부
        print(f"\n  [1/2] Uploading attachments...")
        for filename in info['files']:
            file_path = os.path.join(MANUAL_DIR, filename)
            if os.path.exists(file_path):
                upload_attachment(manager, page_id, file_path)
                print(f"    ✓ {filename}")
            else:
                print(f"    - {filename} (not found)")

        # 2. 링크 수정
        print(f"\n  [2/2] Fixing links...")
        title, content, version = get_page_content(manager, page_id)

        if content:
            new_content = fix_file_links(content, info['files'])

            if new_content != content:
                result = manager.update_page(page_id, title, new_content, version)
                if result:
                    print(f"  ✓ Updated")
                else:
                    print(f"  ✗ Failed")
            else:
                print(f"  - No changes needed")

    print("\n" + "=" * 60)
    print("Done!")
    print("=" * 60)


if __name__ == "__main__":
    main()
