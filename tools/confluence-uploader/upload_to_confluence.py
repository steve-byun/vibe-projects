#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Confluence Markdown Uploader
로컬 Markdown 파일을 Confluence 페이지로 업로드하는 스크립트

사용법:
    python upload_to_confluence.py <markdown_file_path>
    python upload_to_confluence.py "path/to/your/document.md"
"""

import os
import sys
import json
import base64
import requests
import markdown
from pathlib import Path


def load_config():
    """config.json에서 설정 로드"""
    config_path = Path(__file__).parent / "config.json"

    if not config_path.exists():
        print(f"Error: config.json not found at {config_path}")
        print("Please create config.json with your credentials.")
        print("See config.template.json for the format.")
        sys.exit(1)

    with open(config_path, "r", encoding="utf-8") as f:
        return json.load(f)


def markdown_to_confluence(md_content: str) -> str:
    """Markdown을 Confluence Storage Format (XHTML)로 변환"""
    # Markdown을 HTML로 변환
    html = markdown.markdown(
        md_content,
        extensions=[
            'tables',
            'fenced_code',
            'codehilite',
            'toc',
            'nl2br'
        ]
    )

    # Confluence Storage Format으로 래핑
    # 코드 블록을 Confluence 매크로로 변환
    html = html.replace('<pre><code>', '<ac:structured-macro ac:name="code"><ac:plain-text-body><![CDATA[')
    html = html.replace('</code></pre>', ']]></ac:plain-text-body></ac:structured-macro>')

    # 언어 지정된 코드 블록 처리
    import re
    code_pattern = r'<pre><code class="language-(\w+)">'
    def replace_code_block(match):
        lang = match.group(1)
        return f'<ac:structured-macro ac:name="code"><ac:parameter ac:name="language">{lang}</ac:parameter><ac:plain-text-body><![CDATA['
    html = re.sub(code_pattern, replace_code_block, html)

    return html


def get_page_by_title(config: dict, space_key: str, title: str) -> dict | None:
    """제목으로 기존 페이지 검색"""
    url = f"{config['base_url']}/wiki/rest/api/content"

    auth = base64.b64encode(
        f"{config['email']}:{config['api_token']}".encode()
    ).decode()

    headers = {
        "Authorization": f"Basic {auth}",
        "Content-Type": "application/json"
    }

    params = {
        "spaceKey": space_key,
        "title": title,
        "expand": "version"
    }

    response = requests.get(url, headers=headers, params=params)

    if response.status_code == 200:
        results = response.json().get("results", [])
        if results:
            return results[0]

    return None


def create_page(config: dict, space_key: str, title: str, content: str, parent_id: str = None) -> dict:
    """새 페이지 생성"""
    url = f"{config['base_url']}/wiki/rest/api/content"

    auth = base64.b64encode(
        f"{config['email']}:{config['api_token']}".encode()
    ).decode()

    headers = {
        "Authorization": f"Basic {auth}",
        "Content-Type": "application/json"
    }

    data = {
        "type": "page",
        "title": title,
        "space": {"key": space_key},
        "body": {
            "storage": {
                "value": content,
                "representation": "storage"
            }
        }
    }

    if parent_id:
        data["ancestors"] = [{"id": parent_id}]

    response = requests.post(url, headers=headers, json=data)

    if response.status_code == 200:
        return response.json()
    else:
        print(f"Error creating page: {response.status_code}")
        print(response.text)
        sys.exit(1)


def update_page(config: dict, page_id: str, title: str, content: str, version: int) -> dict:
    """기존 페이지 업데이트"""
    url = f"{config['base_url']}/wiki/rest/api/content/{page_id}"

    auth = base64.b64encode(
        f"{config['email']}:{config['api_token']}".encode()
    ).decode()

    headers = {
        "Authorization": f"Basic {auth}",
        "Content-Type": "application/json"
    }

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

    response = requests.put(url, headers=headers, json=data)

    if response.status_code == 200:
        return response.json()
    else:
        print(f"Error updating page: {response.status_code}")
        print(response.text)
        sys.exit(1)


def upload_markdown(file_path: str, config: dict) -> str:
    """Markdown 파일을 Confluence에 업로드"""
    file_path = Path(file_path)

    if not file_path.exists():
        print(f"Error: File not found: {file_path}")
        sys.exit(1)

    # 파일 읽기
    with open(file_path, "r", encoding="utf-8") as f:
        md_content = f.read()

    # 제목 추출 (첫 번째 # 헤더 또는 파일명)
    title = file_path.stem  # 기본값: 파일명
    for line in md_content.split("\n"):
        if line.startswith("# "):
            title = line[2:].strip()
            break

    # Markdown을 Confluence 형식으로 변환
    confluence_content = markdown_to_confluence(md_content)

    # 설정에서 space key와 parent id 가져오기
    space_key = config.get("space_key")
    parent_id = config.get("parent_page_id")

    # 기존 페이지 확인
    existing_page = get_page_by_title(config, space_key, title)

    if existing_page:
        print(f"Updating existing page: {title}")
        result = update_page(
            config,
            existing_page["id"],
            title,
            confluence_content,
            existing_page["version"]["number"]
        )
        action = "Updated"
    else:
        print(f"Creating new page: {title}")
        result = create_page(config, space_key, title, confluence_content, parent_id)
        action = "Created"

    page_url = f"{config['base_url']}/wiki{result['_links']['webui']}"
    print(f"{action} successfully!")
    print(f"URL: {page_url}")

    return page_url


def main():
    if len(sys.argv) < 2:
        print("Usage: python upload_to_confluence.py <markdown_file_path>")
        print("Example: python upload_to_confluence.py ./my_document.md")
        sys.exit(1)

    file_path = sys.argv[1]
    config = load_config()

    upload_markdown(file_path, config)


if __name__ == "__main__":
    main()
