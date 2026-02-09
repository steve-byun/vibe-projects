#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Batch Upload & Reorganize Script
모든 매뉴얼을 통일된 양식으로 업로드하고 기존 페이지 통폐합
"""

import sys
sys.stdout.reconfigure(encoding='utf-8')
sys.path.insert(0, 'c:/Steve/01_Vibe_Projects/tools/confluence-uploader')

from confluence_manager import ConfluenceManager
from pathlib import Path
import requests


def delete_page(manager: ConfluenceManager, page_id: str) -> bool:
    """페이지 삭제"""
    url = f"{manager.base_url}/wiki/rest/api/content/{page_id}"
    response = requests.delete(url, headers=manager.headers)
    return response.status_code == 204


def standardize_existing_page(manager: ConfluenceManager, page_id: str, title: str, content_text: str):
    """기존 페이지를 통일된 양식으로 재작성"""

    # 통일된 양식 템플릿 적용
    # 기존 텍스트를 파싱해서 구조화된 HTML로 변환

    page = manager.get_page_by_id(page_id)
    if not page:
        return None

    # 기존 내용 가져오기
    url = f"{manager.base_url}/wiki/rest/api/content/{page_id}"
    params = {'expand': 'body.storage,version'}
    response = requests.get(url, headers=manager.headers, params=params)

    if response.status_code != 200:
        return None

    data = response.json()
    current_content = data.get('body', {}).get('storage', {}).get('value', '')
    version = data.get('version', {}).get('number', 1)

    # 이미 잘 구조화되어 있으면 스킵
    if '<h1>' in current_content or '<h2>' in current_content:
        print(f"  '{title}' - already formatted, skipping")
        return None

    # 업데이트 날짜 추가
    footer = '<hr/><p><em>마지막 업데이트: 2025-01</em></p>'

    if footer not in current_content:
        new_content = current_content + footer
        result = manager.update_page(page_id, title, new_content, version)
        if result:
            print(f"  '{title}' - added footer")
            return result

    return None


def main():
    print("=" * 60)
    print("Batch Upload & Reorganization")
    print("=" * 60)

    manager = ConfluenceManager()

    # 폴더 ID 매핑
    folders = {
        "1. 개발 환경 설정": "1508409356",
        "2. 데이터 수집 (Scope & UDP)": "1507557390",
        "3. 양산 SW 관리": "1508311047",
        "4. 제어기 (E-PC) 설정": "1508212756",
        "5. Calibration & Friction": "1507426316",
        "6. 트러블슈팅": "1510178818",
        "7. 참고 자료": "1508737041",
    }

    # ===========================================
    # 1. 중복 페이지 삭제 (Git 통합으로 대체)
    # ===========================================
    print("\n[1/4] Removing duplicate pages (replaced by unified manuals)...")

    pages_to_delete = [
        "git 최초 설정",      # Git 통합 매뉴얼로 대체
        "git으로 v2/3 받기",  # Git 통합 매뉴얼로 대체
    ]

    for title in pages_to_delete:
        page = manager.get_page_by_title(title)
        if page:
            if delete_page(manager, page['id']):
                print(f"  Deleted: {title}")
            else:
                print(f"  Failed to delete: {title}")

    # ===========================================
    # 2. 로컬 .md 파일들 업로드
    # ===========================================
    print("\n[2/4] Uploading local markdown files...")

    md_files = {
        # 파일경로: (대상 폴더, 새 제목)
        "C:/Work/04_Admin_Docs/Reports/매뉴얼/Git_코드_받기_통합.md":
            ("1. 개발 환경 설정", None),
        "C:/Work/04_Admin_Docs/Reports/매뉴얼/개발_코드_적용_통합.md":
            ("1. 개발 환경 설정", None),
        "C:/Work/04_Admin_Docs/Reports/매뉴얼/양산_SW_관리_통합.md":
            ("3. 양산 SW 관리", None),
        "C:/Work/04_Admin_Docs/Reports/매뉴얼/IP_및_SVN_정보_통합.md":
            ("7. 참고 자료", None),
        # UDP는 이미 업로드됨, 스킵
    }

    for file_path, (folder_name, new_title) in md_files.items():
        folder_id = folders.get(folder_name)
        if folder_id:
            url = manager.upload_markdown_file(file_path, folder_id)
            if url:
                print(f"  Uploaded: {Path(file_path).stem} -> {folder_name}")

    # ===========================================
    # 3. 기존 페이지들 양식 통일 (footer 추가)
    # ===========================================
    print("\n[3/4] Standardizing existing pages...")

    existing_pages = [
        "솔루션으로 구동 방법",
        "friction data converter",
        "log 암호화 해제",
        "제어기에서 저크 변경",
        "matlab scope 연결 및 data gathering 방법",
        "v3 완전 삭제 후 재 설치",
    ]

    for title in existing_pages:
        page = manager.get_page_by_title(title)
        if page:
            standardize_existing_page(manager, page['id'], title, "")

    # ===========================================
    # 4. 최종 구조 출력
    # ===========================================
    print("\n[4/4] Final structure:")

    url = f"{manager.base_url}/wiki/rest/api/content"
    params = {'spaceKey': manager.space_key, 'expand': 'ancestors', 'limit': 100}
    response = requests.get(url, headers=manager.headers, params=params)
    pages = response.json().get('results', [])

    # 폴더별로 그룹화
    structure = {}
    for page in pages:
        ancestors = page.get('ancestors', [])
        if ancestors:
            parent_title = ancestors[-1].get('title', 'Root')
        else:
            parent_title = 'Root'

        if parent_title not in structure:
            structure[parent_title] = []
        structure[parent_title].append(page['title'])

    for parent, children in sorted(structure.items()):
        print(f"\n  {parent}:")
        for child in children:
            print(f"    - {child}")

    print("\n" + "=" * 60)
    print("Complete!")
    print("=" * 60)


if __name__ == "__main__":
    main()
