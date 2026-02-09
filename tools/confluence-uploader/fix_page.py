#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Confluence 페이지 수정 스크립트
- 중복 메시지 제거
- <br/> 태그를 줄바꿈으로 변환
- 마지막 업데이트 날짜 중복 제거
"""

import sys
import re
sys.stdout.reconfigure(encoding='utf-8')
sys.path.insert(0, 'c:/Steve/01_Vibe_Projects/tools/confluence-uploader')

from confluence_manager import ConfluenceManager
import requests


def get_page_content(manager: ConfluenceManager, page_id: str) -> tuple:
    """페이지 내용 가져오기"""
    url = f"{manager.base_url}/wiki/rest/api/content/{page_id}"
    params = {'expand': 'body.storage,version'}
    response = requests.get(url, headers=manager.headers, params=params)

    if response.status_code != 200:
        print(f"Error fetching page: {response.status_code}")
        return None, None, None

    data = response.json()
    title = data.get('title', '')
    content = data.get('body', {}).get('storage', {}).get('value', '')
    version = data.get('version', {}).get('number', 1)

    return title, content, version


def fix_content(content: str) -> str:
    """콘텐츠 수정"""

    # 1. 두 번째 info 박스와 그 뒤의 expand 섹션들 제거
    # "클릭하면 원본 내용을 볼 수 있습니다" 메시지와 expand 섹션은 불필요

    # 두 번째 info 박스 제거 (클릭하면 원본...)
    second_info_pattern = r'<ac:structured-macro ac:name="info"[^>]*><ac:rich-text-body>\s*<p>이 문서는 기존 2개 파일을 통합한 것입니다\. 클릭하면 원본 내용을 볼 수 있습니다:</p>\s*</ac:rich-text-body></ac:structured-macro>'
    if re.search(second_info_pattern, content):
        print("  Removing duplicate info box (클릭하면 원본...)")
        content = re.sub(second_info_pattern, '', content)

    # 2. expand 섹션들 제거 (원본 txt 파일 내용은 이미 정리된 본문에 포함됨)
    expand_pattern = r'<ac:structured-macro ac:name="expand"[^>]*>.*?</ac:structured-macro>'
    expand_matches = list(re.finditer(expand_pattern, content, re.DOTALL))
    if expand_matches:
        print(f"  Removing {len(expand_matches)} expand sections")
        content = re.sub(expand_pattern, '', content, flags=re.DOTALL)

    # 3. 마지막 업데이트 날짜 중복 제거
    update_pattern = r'<hr\s*/?>\s*<p><em>마지막 업데이트:.*?</em></p>'
    update_matches = list(re.finditer(update_pattern, content))

    if len(update_matches) > 1:
        print(f"  Found {len(update_matches)} update footers, keeping only one")
        # 모두 제거 후 마지막에 하나만 추가
        content = re.sub(update_pattern, '', content)
        content = content.rstrip() + '\n<hr/><p><em>마지막 업데이트: 2026-01-29</em></p>'
    else:
        # 날짜를 오늘로 업데이트
        content = re.sub(
            r'(<p><em>마지막 업데이트:).*?(</em></p>)',
            r'\1 2026-01-29\2',
            content
        )

    # 4. 연속된 <hr/> 제거 (공백, 줄바꿈 포함)
    content = re.sub(r'(<hr\s*/?>[\s\n]*){2,}', '<hr/>\n', content)

    # 5. 연속된 빈 줄 정리
    content = re.sub(r'\n{3,}', '\n\n', content)

    return content


def main():
    print("=" * 60)
    print("Confluence Page Fixer")
    print("=" * 60)

    # 페이지 ID (스크린샷에서 확인)
    page_id = "1508179977"

    manager = ConfluenceManager()

    # 1. 현재 내용 가져오기
    print(f"\n[1/3] Fetching page {page_id}...")
    title, content, version = get_page_content(manager, page_id)

    if not content:
        print("Failed to fetch page content")
        return

    print(f"  Title: {title}")
    print(f"  Version: {version}")
    print(f"  Content length: {len(content)} chars")

    # 2. 내용 수정
    print(f"\n[2/3] Fixing content...")
    fixed_content = fix_content(content)
    print(f"  Fixed content length: {len(fixed_content)} chars")

    # 변경사항 확인
    if content == fixed_content:
        print("  No changes needed")
        return

    # 3. 업데이트
    print(f"\n[3/3] Updating page...")
    result = manager.update_page(page_id, title, fixed_content, version)

    if result:
        print(f"\nSuccess! Page updated.")
        print(f"URL: {manager.base_url}/wiki/spaces/~7120206d37a559792c47e093327b791cbe5c4f/pages/{page_id}")
    else:
        print("Failed to update page")


if __name__ == "__main__":
    main()
