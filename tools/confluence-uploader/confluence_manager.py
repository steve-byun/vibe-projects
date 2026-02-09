#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Confluence Manager
폴더 구조 생성, 페이지 이동, 매뉴얼 업로드를 관리하는 스크립트
"""

import os
import sys
import json
import base64
import re
import requests
from pathlib import Path
from datetime import datetime

sys.stdout.reconfigure(encoding='utf-8')


class ConfluenceManager:
    def __init__(self, config_path: str = None):
        if config_path is None:
            config_path = Path(__file__).parent / "config.json"

        with open(config_path, "r", encoding="utf-8") as f:
            self.config = json.load(f)

        self.base_url = self.config['base_url']
        self.space_key = self.config['space_key']
        self.auth = base64.b64encode(
            f"{self.config['email']}:{self.config['api_token']}".encode()
        ).decode()
        self.headers = {
            "Authorization": f"Basic {self.auth}",
            "Content-Type": "application/json"
        }

    def get_page_by_title(self, title: str) -> dict | None:
        """제목으로 페이지 검색"""
        url = f"{self.base_url}/wiki/rest/api/content"
        params = {
            "spaceKey": self.space_key,
            "title": title,
            "expand": "version,ancestors"
        }
        response = requests.get(url, headers=self.headers, params=params)
        if response.status_code == 200:
            results = response.json().get("results", [])
            if results:
                return results[0]
        return None

    def get_page_by_id(self, page_id: str) -> dict | None:
        """ID로 페이지 조회"""
        url = f"{self.base_url}/wiki/rest/api/content/{page_id}"
        params = {"expand": "version,ancestors,children.page"}
        response = requests.get(url, headers=self.headers, params=params)
        if response.status_code == 200:
            return response.json()
        return None

    def create_page(self, title: str, content: str, parent_id: str = None) -> dict:
        """새 페이지 생성"""
        url = f"{self.base_url}/wiki/rest/api/content"

        data = {
            "type": "page",
            "title": title,
            "space": {"key": self.space_key},
            "body": {
                "storage": {
                    "value": content,
                    "representation": "storage"
                }
            }
        }

        if parent_id:
            data["ancestors"] = [{"id": str(parent_id)}]

        response = requests.post(url, headers=self.headers, json=data)

        if response.status_code == 200:
            return response.json()
        else:
            print(f"Error creating page '{title}': {response.status_code}")
            print(response.text)
            return None

    def update_page(self, page_id: str, title: str, content: str, version: int) -> dict:
        """페이지 업데이트"""
        url = f"{self.base_url}/wiki/rest/api/content/{page_id}"

        data = {
            "type": "page",
            "title": title,
            "version": {"number": version + 1},
            "body": {
                "storage": {
                    "value": content,
                    "representation": "storage"
                }
            }
        }

        response = requests.put(url, headers=self.headers, json=data)

        if response.status_code == 200:
            return response.json()
        else:
            print(f"Error updating page: {response.status_code}")
            print(response.text)
            return None

    def move_page(self, page_id: str, new_parent_id: str) -> bool:
        """페이지를 다른 부모 아래로 이동"""
        page = self.get_page_by_id(page_id)
        if not page:
            print(f"Page {page_id} not found")
            return False

        url = f"{self.base_url}/wiki/rest/api/content/{page_id}"

        data = {
            "type": "page",
            "title": page["title"],
            "version": {"number": page["version"]["number"] + 1},
            "ancestors": [{"id": str(new_parent_id)}]
        }

        response = requests.put(url, headers=self.headers, json=data)

        if response.status_code == 200:
            print(f"  Moved '{page['title']}' successfully")
            return True
        else:
            print(f"Error moving page: {response.status_code}")
            print(response.text)
            return False

    def create_folder(self, title: str, parent_id: str = None) -> dict:
        """폴더(빈 페이지) 생성 - 이미 존재하면 기존 페이지 반환"""
        existing = self.get_page_by_title(title)
        if existing:
            print(f"  Folder '{title}' already exists (id: {existing['id']})")
            return existing

        # 폴더용 기본 콘텐츠
        content = f"""<p>이 페이지는 하위 문서들을 포함하는 폴더입니다.</p>
<p><ac:structured-macro ac:name="children">
<ac:parameter ac:name="all">true</ac:parameter>
</ac:structured-macro></p>"""

        result = self.create_page(title, content, parent_id)
        if result:
            print(f"  Created folder '{title}' (id: {result['id']})")
        return result

    def markdown_to_confluence(self, md_content: str) -> str:
        """Markdown을 깔끔한 Confluence Storage Format으로 변환"""
        lines = md_content.split('\n')
        html_parts = []
        in_code_block = False
        code_lang = ""
        code_content = []
        in_table = False
        table_rows = []
        in_blockquote = False
        blockquote_content = []

        i = 0
        while i < len(lines):
            line = lines[i]

            # 코드 블록 처리
            if line.startswith('```'):
                if not in_code_block:
                    in_code_block = True
                    code_lang = line[3:].strip() or "text"
                    code_content = []
                else:
                    in_code_block = False
                    code_text = '\n'.join(code_content)
                    # HTML 엔티티 이스케이프
                    code_text = code_text.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
                    html_parts.append(
                        f'<ac:structured-macro ac:name="code">'
                        f'<ac:parameter ac:name="language">{code_lang}</ac:parameter>'
                        f'<ac:plain-text-body><![CDATA[{code_text}]]></ac:plain-text-body>'
                        f'</ac:structured-macro>'
                    )
                i += 1
                continue

            if in_code_block:
                code_content.append(line)
                i += 1
                continue

            # 빈 줄
            if not line.strip():
                if in_blockquote:
                    in_blockquote = False
                    quote_text = '<br/>'.join(blockquote_content)
                    html_parts.append(
                        f'<ac:structured-macro ac:name="info">'
                        f'<ac:rich-text-body><p>{quote_text}</p></ac:rich-text-body>'
                        f'</ac:structured-macro>'
                    )
                    blockquote_content = []
                if in_table:
                    in_table = False
                    html_parts.append(self._build_table(table_rows))
                    table_rows = []
                i += 1
                continue

            # 인용문 (>)
            if line.startswith('>'):
                in_blockquote = True
                quote_line = line[1:].strip()
                # 인라인 서식 처리
                quote_line = self._process_inline(quote_line)
                blockquote_content.append(quote_line)
                i += 1
                continue

            # 테이블
            if '|' in line and not line.startswith('#'):
                if line.strip().replace('-', '').replace('|', '').replace(' ', '') == '':
                    # 구분선 행 스킵
                    i += 1
                    continue
                in_table = True
                cells = [c.strip() for c in line.split('|')[1:-1]]
                table_rows.append(cells)
                i += 1
                continue

            # 헤더
            if line.startswith('#'):
                match = re.match(r'^(#{1,6})\s+(.+)$', line)
                if match:
                    level = len(match.group(1))
                    text = self._process_inline(match.group(2))
                    html_parts.append(f'<h{level}>{text}</h{level}>')
                    i += 1
                    continue

            # 수평선
            if line.strip() in ['---', '***', '___']:
                html_parts.append('<hr/>')
                i += 1
                continue

            # 리스트
            if re.match(r'^(\s*)[-*]\s+', line):
                list_items, i = self._parse_list(lines, i, ordered=False)
                html_parts.append(list_items)
                continue

            if re.match(r'^(\s*)\d+\.\s+', line):
                list_items, i = self._parse_list(lines, i, ordered=True)
                html_parts.append(list_items)
                continue

            # 일반 단락
            text = self._process_inline(line)
            html_parts.append(f'<p>{text}</p>')
            i += 1

        # 남은 블록 처리
        if in_blockquote and blockquote_content:
            quote_text = '<br/>'.join(blockquote_content)
            html_parts.append(
                f'<ac:structured-macro ac:name="info">'
                f'<ac:rich-text-body><p>{quote_text}</p></ac:rich-text-body>'
                f'</ac:structured-macro>'
            )

        if in_table and table_rows:
            html_parts.append(self._build_table(table_rows))

        return '\n'.join(html_parts)

    def _process_inline(self, text: str) -> str:
        """인라인 마크다운 처리 (볼드, 이탤릭, 코드, 링크)"""
        # 인라인 코드 (backtick)
        text = re.sub(r'`([^`]+)`', r'<code>\1</code>', text)
        # 볼드
        text = re.sub(r'\*\*([^*]+)\*\*', r'<strong>\1</strong>', text)
        # 이탤릭
        text = re.sub(r'\*([^*]+)\*', r'<em>\1</em>', text)
        # 링크
        text = re.sub(r'\[([^\]]+)\]\(([^)]+)\)', r'<a href="\2">\1</a>', text)
        return text

    def _parse_list(self, lines: list, start: int, ordered: bool) -> tuple:
        """리스트 파싱"""
        items = []
        i = start
        tag = 'ol' if ordered else 'ul'
        pattern = r'^(\s*)\d+\.\s+(.+)$' if ordered else r'^(\s*)[-*]\s+(.+)$'

        while i < len(lines):
            match = re.match(pattern, lines[i])
            if not match:
                break
            text = self._process_inline(match.group(2))
            items.append(f'<li>{text}</li>')
            i += 1

        return f'<{tag}>{"".join(items)}</{tag}>', i

    def _build_table(self, rows: list) -> str:
        """테이블 HTML 생성"""
        if not rows:
            return ''

        html = '<table><tbody>'
        for idx, row in enumerate(rows):
            html += '<tr>'
            tag = 'th' if idx == 0 else 'td'
            for cell in row:
                cell_text = self._process_inline(cell)
                html += f'<{tag}>{cell_text}</{tag}>'
            html += '</tr>'
        html += '</tbody></table>'
        return html

    def upload_markdown_file(self, file_path: str, parent_id: str = None) -> str:
        """Markdown 파일을 Confluence에 업로드"""
        file_path = Path(file_path)

        if not file_path.exists():
            print(f"Error: File not found: {file_path}")
            return None

        with open(file_path, "r", encoding="utf-8") as f:
            md_content = f.read()

        # 제목 추출
        title = file_path.stem.replace('_', ' ')
        for line in md_content.split("\n"):
            if line.startswith("# "):
                title = line[2:].strip()
                break

        # 변환
        confluence_content = self.markdown_to_confluence(md_content)

        # 기존 페이지 확인
        existing = self.get_page_by_title(title)

        if existing:
            print(f"  Updating: {title}")
            result = self.update_page(
                existing["id"],
                title,
                confluence_content,
                existing["version"]["number"]
            )
        else:
            print(f"  Creating: {title}")
            result = self.create_page(title, confluence_content, parent_id)

        if result:
            return f"{self.base_url}/wiki{result['_links']['webui']}"
        return None


def main():
    print("=" * 60)
    print("Confluence Manual Structure Setup")
    print("=" * 60)

    manager = ConfluenceManager()

    # 1. 루트 페이지 (Manual) 찾기
    root_page = manager.get_page_by_title("개요")
    if not root_page:
        print("Error: Root page '개요' not found")
        return

    root_id = root_page["id"]
    print(f"\nRoot page: 개요 (id: {root_id})")

    # 2. 폴더 구조 생성
    print("\n[1/4] Creating folder structure...")

    folder_structure = {
        "1. 개발 환경 설정": None,
        "2. 데이터 수집 (Scope & UDP)": None,
        "3. 양산 SW 관리": None,
        "4. 제어기 (E-PC) 설정": None,
        "5. Calibration & Friction": None,
        "6. 트러블슈팅": None,
        "7. 참고 자료": None,
    }

    for folder_name in folder_structure:
        folder = manager.create_folder(folder_name, root_id)
        if folder:
            folder_structure[folder_name] = folder["id"]

    # 3. 기존 페이지 이동 매핑
    print("\n[2/4] Moving existing pages...")

    page_moves = {
        # "페이지 제목": "대상 폴더 이름"
        "git 최초 설정": "1. 개발 환경 설정",
        "git으로 v2/3 받기": "1. 개발 환경 설정",
        "v3 완전 삭제 후 재 설치": "1. 개발 환경 설정",
        "matlab scope 연결 및 data gathering 방법": "2. 데이터 수집 (Scope & UDP)",
        "UDP Data Gathering 통합 매뉴얼": "2. 데이터 수집 (Scope & UDP)",
        "솔루션으로 구동 방법": "3. 양산 SW 관리",
        "제어기에서 저크 변경": "4. 제어기 (E-PC) 설정",
        "friction data converter": "5. Calibration & Friction",
        "log 암호화 해제": "6. 트러블슈팅",
    }

    for page_title, target_folder in page_moves.items():
        page = manager.get_page_by_title(page_title)
        if page and folder_structure.get(target_folder):
            manager.move_page(page["id"], folder_structure[target_folder])

    # 4. 빈 폴더 페이지들 삭제 (하위 페이지 없는 경우만)
    # 여기서는 삭제하지 않고 유지 (사용자 요청에 따라)

    print("\n[3/4] Structure reorganization complete!")

    # 5. 새 매뉴얼 업로드 여부 확인
    print("\n[4/4] Ready to upload new manuals.")
    print("\nNew folder structure created successfully!")
    print("You can now upload markdown files to specific folders.")


if __name__ == "__main__":
    main()
