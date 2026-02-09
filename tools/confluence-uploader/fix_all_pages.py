#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
모든 매뉴얼 페이지 일괄 수정
- 중복 info 박스 제거
- expand 섹션 제거
- 마지막 업데이트 날짜 중복 제거
- 원본 txt 파일 첨부 및 링크 연결
"""

import sys
import re
import os
sys.stdout.reconfigure(encoding='utf-8')
sys.path.insert(0, 'c:/Steve/01_Vibe_Projects/tools/confluence-uploader')

from confluence_manager import ConfluenceManager
import requests

# 매뉴얼 폴더 경로
MANUAL_DIR = r"C:\Work\04_Admin_Docs\Reports\매뉴얼"

# 통합 매뉴얼 페이지 정보 (page_id: [원본 txt 파일들])
MANUAL_PAGES = {
    "1509097510": {  # Git 코드 받기 통합 매뉴얼
        "title": "Git 코드 받기 통합 매뉴얼",
        "files": [
            "git으로 코드 받기.txt",
            "git으로 코드 받기_최초및3세대.txt",
            "git으로 코드 받기_23세대 동일.txt",
            "git으로 코드 받기_2세대.txt",
            "git으로 v3 코드 받기 V2.txt"
        ]
    },
    "1509097526": {  # 양산 SW 관리 통합 매뉴얼
        "title": "양산 SW 관리 통합 매뉴얼",
        "files": [
            "양산 Release 된 SW 버전 받는 곳.txt",
            "양산 Release 된 SW로 업데이트 하는 법.txt",
            "양산 제어기 → 개발 환경 변경 메뉴얼.txt"
        ]
    },
    "1509359621": {  # IP 및 SVN 정보 통합
        "title": "IP 및 SVN 정보 통합",
        "files": [
            "IP 정보.txt",
            "SVN IP.txt",
            "12gen svn address.txt"
        ]
    },
    "1507852307": {  # UDP Data Gathering 통합 매뉴얼
        "title": "UDP Data Gathering 통합 매뉴얼",
        "files": [
            "로봇 데이터 획득 메뉴얼.txt",
            "UDP data gathering manual.txt"
        ]
    },
    "1508179977": {  # 개발 코드 적용 통합 매뉴얼 (이미 수정됨)
        "title": "개발 코드 적용 통합 매뉴얼",
        "files": [
            "개발 코드 최초 적용 메뉴얼.txt",
            "코드 변경 후 적용 방법.txt"
        ]
    }
}


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


def upload_attachment(manager: ConfluenceManager, page_id: str, file_path: str) -> bool:
    """파일을 페이지에 첨부"""
    url = f"{manager.base_url}/wiki/rest/api/content/{page_id}/child/attachment"

    headers = {
        "Authorization": manager.headers["Authorization"],
        "X-Atlassian-Token": "nocheck"
    }

    filename = os.path.basename(file_path)

    with open(file_path, 'rb') as f:
        files = {'file': (filename, f, 'text/plain')}
        response = requests.post(url, headers=headers, files=files)

    if response.status_code == 200:
        return True
    elif response.status_code == 400 and "same file name" in response.text:
        return True  # 이미 존재함
    return False


def fix_content(content: str) -> str:
    """콘텐츠 수정 (중복 제거, expand 제거 등)"""

    # 1. "클릭하면 원본 내용을 볼 수 있습니다" info 박스 제거
    patterns = [
        r'<ac:structured-macro ac:name="info"[^>]*><ac:rich-text-body>\s*<p>이 문서는 기존 \d+개 파일을 통합한 것입니다\. 클릭하면 원본 내용을 볼 수 있습니다:?</p>\s*</ac:rich-text-body></ac:structured-macro>',
    ]
    for pattern in patterns:
        content = re.sub(pattern, '', content, flags=re.DOTALL)

    # 2. expand 섹션 제거
    expand_pattern = r'<ac:structured-macro ac:name="expand"[^>]*>.*?</ac:structured-macro>'
    content = re.sub(expand_pattern, '', content, flags=re.DOTALL)

    # 3. 마지막 업데이트 날짜 중복 제거
    update_pattern = r'<hr\s*/?>\s*<p><em>마지막 업데이트:.*?</em></p>'
    update_matches = list(re.finditer(update_pattern, content))

    if len(update_matches) > 1:
        content = re.sub(update_pattern, '', content)
        content = content.rstrip() + '\n<hr/><p><em>마지막 업데이트: 2026-01-29</em></p>'
    elif len(update_matches) == 1:
        content = re.sub(
            r'(<p><em>마지막 업데이트:).*?(</em></p>)',
            r'\1 2026-01-29\2',
            content
        )
    else:
        # footer가 없으면 추가
        content = content.rstrip() + '\n<hr/><p><em>마지막 업데이트: 2026-01-29</em></p>'

    # 4. 연속된 <hr/> 제거
    content = re.sub(r'(<hr\s*/?>[\s\n]*){2,}', '<hr/>\n', content)

    # 5. 연속된 빈 줄 정리
    content = re.sub(r'\n{3,}', '\n\n', content)

    return content


def update_links(content: str, filenames: list) -> str:
    """파일명을 첨부파일 링크로 변경"""
    for filename in filenames:
        # <code>파일명</code> → 첨부파일 링크
        old_pattern = f'<code>{re.escape(filename)}</code>'
        new_link = f'<ac:link><ri:attachment ri:filename="{filename}"/><ac:plain-text-link-body><![CDATA[{filename}]]></ac:plain-text-link-body></ac:link>'

        if re.search(old_pattern, content):
            content = re.sub(old_pattern, new_link, content)

    return content


def process_page(manager: ConfluenceManager, page_id: str, page_info: dict):
    """단일 페이지 처리"""
    print(f"\n{'='*60}")
    print(f"Processing: {page_info['title']}")
    print(f"{'='*60}")

    # 1. 페이지 내용 가져오기
    title, content, version = get_page_content(manager, page_id)
    if not content:
        print("  Failed to fetch page")
        return

    original_content = content

    # 2. 파일 첨부
    print(f"\n[1/3] Uploading attachments...")
    for filename in page_info['files']:
        file_path = os.path.join(MANUAL_DIR, filename)
        if os.path.exists(file_path):
            if upload_attachment(manager, page_id, file_path):
                print(f"  ✓ {filename}")
            else:
                print(f"  ✗ {filename} (upload failed)")
        else:
            print(f"  - {filename} (not found)")

    # 3. 콘텐츠 수정
    print(f"\n[2/3] Fixing content...")
    content = fix_content(content)

    # 4. 링크 연결
    print(f"\n[3/3] Updating links...")
    content = update_links(content, page_info['files'])

    # 5. 변경사항이 있으면 업데이트
    if content != original_content:
        # 버전 다시 가져오기 (첨부 시 버전이 올라갈 수 있음)
        _, _, version = get_page_content(manager, page_id)
        result = manager.update_page(page_id, title, content, version)
        if result:
            print(f"\n✓ Page updated successfully")
        else:
            print(f"\n✗ Failed to update page")
    else:
        print(f"\n- No changes needed")


def main():
    print("=" * 60)
    print("Confluence Manual Pages Batch Update")
    print("=" * 60)

    manager = ConfluenceManager()

    for page_id, page_info in MANUAL_PAGES.items():
        process_page(manager, page_id, page_info)

    print("\n" + "=" * 60)
    print("All pages processed!")
    print("=" * 60)


if __name__ == "__main__":
    main()
