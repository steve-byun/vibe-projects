#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Confluence 페이지에 파일 첨부 및 링크 연결
"""

import sys
import re
import os
sys.stdout.reconfigure(encoding='utf-8')
sys.path.insert(0, 'c:/Steve/01_Vibe_Projects/tools/confluence-uploader')

from confluence_manager import ConfluenceManager
import requests


def upload_attachment(manager: ConfluenceManager, page_id: str, file_path: str) -> dict:
    """파일을 페이지에 첨부"""
    url = f"{manager.base_url}/wiki/rest/api/content/{page_id}/child/attachment"

    # 첨부 파일용 헤더 (Content-Type 제거)
    headers = {
        "Authorization": manager.headers["Authorization"],
        "X-Atlassian-Token": "nocheck"
    }

    filename = os.path.basename(file_path)

    with open(file_path, 'rb') as f:
        files = {
            'file': (filename, f, 'text/plain')
        }
        response = requests.post(url, headers=headers, files=files)

    if response.status_code == 200:
        results = response.json().get('results', [])
        if results:
            print(f"  Uploaded: {filename}")
            return results[0]
    else:
        print(f"  Error uploading {filename}: {response.status_code}")
        print(f"  {response.text}")

    return None


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


def update_content_with_links(content: str, files: list) -> str:
    """파일명을 첨부파일 링크로 변경"""

    for filename in files:
        # <code>파일명.txt</code> 형태를 첨부파일 링크로 변경
        old_pattern = f'<code>{re.escape(filename)}</code>'

        # Confluence 첨부파일 링크 형식
        new_link = f'''<ac:link><ri:attachment ri:filename="{filename}"/><ac:plain-text-link-body><![CDATA[{filename}]]></ac:plain-text-link-body></ac:link>'''

        if re.search(old_pattern, content):
            content = re.sub(old_pattern, new_link, content)
            print(f"  Linked: {filename}")

    return content


def main():
    print("=" * 60)
    print("Confluence File Attachment & Link")
    print("=" * 60)

    page_id = "1508179977"
    manager = ConfluenceManager()

    # 첨부할 파일들
    files_to_attach = [
        r"C:\Work\04_Admin_Docs\Reports\매뉴얼\개발 코드 최초 적용 메뉴얼.txt",
        r"C:\Work\04_Admin_Docs\Reports\매뉴얼\코드 변경 후 적용 방법.txt"
    ]

    # 1. 파일 첨부
    print(f"\n[1/3] Uploading attachments...")
    for file_path in files_to_attach:
        if os.path.exists(file_path):
            upload_attachment(manager, page_id, file_path)
        else:
            print(f"  File not found: {file_path}")

    # 2. 페이지 내용 가져오기
    print(f"\n[2/3] Fetching page content...")
    title, content, version = get_page_content(manager, page_id)

    if not content:
        print("Failed to fetch page")
        return

    # 3. 파일명을 링크로 변경
    print(f"\n[3/3] Updating links...")
    filenames = [os.path.basename(f) for f in files_to_attach]
    new_content = update_content_with_links(content, filenames)

    if new_content != content:
        result = manager.update_page(page_id, title, new_content, version)
        if result:
            print(f"\nSuccess! Page updated with attachment links.")
            print(f"URL: {manager.base_url}/wiki/spaces/~7120206d37a559792c47e093327b791cbe5c4f/pages/{page_id}")
    else:
        print("No changes needed")


if __name__ == "__main__":
    main()
