#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""UDP Data Gathering 통합 매뉴얼 재생성"""

import sys
sys.stdout.reconfigure(encoding='utf-8')
sys.path.insert(0, 'c:/Steve/01_Vibe_Projects/tools/confluence-uploader')

from confluence_manager import ConfluenceManager

manager = ConfluenceManager()

# 부모 페이지 ID (2. 데이터 수집 (Scope & UDP))
PARENT_ID = "1507557390"

# 통합 매뉴얼 HTML (기준 페이지와 동일한 폰트/형식)
CONTENT = """<h1>UDP Data Gathering 통합 매뉴얼</h1>
<ac:structured-macro ac:name="info" ac:schema-version="1"><ac:rich-text-body>
<p>이 문서는 기존 2개 파일을 통합한 것입니다:</p>
<p>- <ac:link><ri:attachment ri:filename="로봇 데이터 획득 메뉴얼.txt" /><ac:plain-text-link-body><![CDATA[로봇 데이터 획득 메뉴얼.txt]]></ac:plain-text-link-body></ac:link></p>
<p>- <ac:link><ri:attachment ri:filename="UDP data gathering manual.txt" /><ac:plain-text-link-body><![CDATA[UDP data gathering manual.txt]]></ac:plain-text-link-body></ac:link></p>
</ac:rich-text-body></ac:structured-macro>
<hr />
<h2>1. 기본 물리적 셋팅</h2>
<ul>
<li>개발 PC(Data gathering용)와 E-PC의 <strong>1번 LAN 포트</strong>를 LAN 선으로 연결</li>
<li>개발 PC에 Matlab 설치 필요</li>
<li>원격 접속 정보: <code>hcr / hcr12345</code> 또는 <code>Administrator / hcr12345</code></li>
</ul>
<hr />
<h2>2. E-PC 설정 (최초 또는 문제 발생 시)</h2>
<h3>2.1 regedit 설정</h3>
<ol>
<li><code>regedit</code> 실행</li>
<li>경로: <code>HKEY_LOCAL_MACHINE\\SYSTEM\\CurrentControlSet\\services\\TcpIp\\Parameters</code></li>
<li><code>IPEnableRouter</code> 값을 <code>1</code>로 설정</li>
<li><strong>Reboot</strong></li>
</ol>
<h3>2.2 INtime Configuration 설정</h3>
<ul>
<li>INtime Configuration → Node Management → Network</li>
<li>Default route IPv4: <code>192.168.222.222</code> (PC#1 Win VEther IP로 설정)</li>
</ul>
<h3>2.3 네트워크 설정</h3>
<p>ethernet3 (E-PC ↔ INTime 간 내부 연결)의 IP를 고정 IP로 설정:</p>
<ac:structured-macro ac:name="code" ac:schema-version="1"><ac:parameter ac:name="language">text</ac:parameter><ac:plain-text-body><![CDATA[IP: 192.168.222.222
Subnet: 255.255.255.0
Gateway: (비워둠)]]></ac:plain-text-body></ac:structured-macro>
<hr />
<h2>3. 개발 PC 설정</h2>
<p>cmd 창을 <strong>관리자 권한</strong>으로 열고 다음 커맨드 입력:</p>
<ac:structured-macro ac:name="code" ac:schema-version="1"><ac:parameter ac:name="language">bash</ac:parameter><ac:plain-text-body><![CDATA[route add 192.168.222.0 mask 255.255.255.0 192.168.100.160]]></ac:plain-text-body></ac:structured-macro>
<p>※ 개발 PC IP를 <code>192.168.100.160</code>이라 가정</p>
<hr />
<h2>4. Config 파일 수정</h2>
<h3>4.1 Config 파일 경로</h3>
<table><tbody>
<tr><th>환경</th><th>경로</th></tr>
<tr><td>개발 환경</td><td><code>C:\\V3\\src\\rodi\\code\\node_modules\\rodi-memory\\clinkAPI\\config</code></td></tr>
<tr><td>양산 환경</td><td><code>C:\\RODI\\node_modules\\rodi-memory\\clinkAPI\\config</code></td></tr>
</tbody></table>
<h3>4.2 수정 내용 (config_sample.ini)</h3>
<ac:structured-macro ac:name="code" ac:schema-version="1"><ac:parameter ac:name="language">ini</ac:parameter><ac:plain-text-body><![CDATA[log_print_out=on          # 기본 off
debug_data_transfer=on    # 기본 off
debug_dest_ip=192.168.100.160  # 본인 PC IP로 변경
debug_dest_port=6000      # 6000 고정]]></ac:plain-text-body></ac:structured-macro>
<ac:structured-macro ac:name="warning" ac:schema-version="1"><ac:rich-text-body>
<p>수정 후 <strong>재부팅 필수</strong> (개발/양산 환경 모두)</p>
</ac:rich-text-body></ac:structured-macro>
<hr />
<h2>5. Matlab에서 데이터 수집</h2>
<h3>5.1 UDP Scope 실행</h3>
<ol>
<li><code>hcr_scope.zip</code> 압축 해제 후 <code>startup_scope.m</code> 실행 (F5)</li>
<li>최초 실행 시 방화벽 설정을 <strong>홈 네트워크</strong>로 설정</li>
<li>데이터가 안 올라오면 방화벽 자체를 끄고 테스트</li>
</ol>
<h3>5.2 로봇 모델 설정</h3>
<p><code>root_scope.m</code> 파일에서 로봇 모델에 따라 설정 변경:</p>
<ac:structured-macro ac:name="code" ac:schema-version="1"><ac:parameter ac:name="language">matlab</ac:parameter><ac:plain-text-body><![CDATA[add_robot('HCR_3gen_5', n_dof);   % 3세대 5W
add_robot('HCR_3gen_10', n_dof);  % 3세대 10L
add_robot('HCR_3gen_14', n_dof);  % 3세대 14]]></ac:plain-text-body></ac:structured-macro>
<h3>5.3 포트 변경</h3>
<p>UDP_Scope의 UDP Receive 블럭 더블클릭 → 로컬 IP 포트 변경</p>
<h3>5.4 End-Effector Force/Torque</h3>
<p>필요시 Joint Data Sub-System 아래의 <code>Joint Torques</code>, <code>Static Force &amp; Moment</code> 블럭 주석 해제</p>
<hr />
<h2>6. 트러블슈팅</h2>
<h3>6.1 데이터가 들어오지 않는 경우</h3>
<p><strong>해결</strong>: 포트 번호 변경</p>
<ul>
<li>config 파일 내 <code>debug_dest_port</code>와 Matlab simulink의 포트 번호를 6000이 아닌 다른 번호로 변경</li>
<li>재부팅 후 재시도</li>
</ul>
<h3>6.2 Scope 실행 시 에러 발생</h3>
<ac:structured-macro ac:name="code" ac:schema-version="1"><ac:parameter ac:name="language">text</ac:parameter><ac:plain-text-body><![CDATA['UDP_Scope_240822/Joint Data Sub-System/force_moment_ext/A\\b'에서 오류가 발생했습니다.]]></ac:plain-text-body></ac:structured-macro>
<p><strong>해결</strong>: <code>Joint Torques</code>, <code>Static Force &amp; Moment</code> 블럭 주석 처리 후 재실행</p>
<hr />
<p><em>마지막 업데이트: 2026-01-29</em></p>"""

def main():
    print("=" * 60)
    print("Creating UDP Data Gathering 통합 매뉴얼")
    print("=" * 60)

    # 페이지 생성
    result = manager.create_page(
        title="UDP Data Gathering 통합 매뉴얼",
        content=CONTENT,
        parent_id=PARENT_ID
    )

    if result:
        page_id = result['id']
        print(f"✓ Page created: ID={page_id}")
        print(f"  URL: {manager.base_url}/wiki{result['_links']['webui']}")

        # 첨부 파일 업로드
        print("\nAttaching files...")
        import requests

        files_to_attach = [
            "C:/Work/04_Admin_Docs/Reports/매뉴얼/로봇 데이터 획득 메뉴얼.txt",
            "C:/Work/04_Admin_Docs/Reports/매뉴얼/UDP data gathering manual.txt"
        ]

        for file_path in files_to_attach:
            try:
                url = f"{manager.base_url}/wiki/rest/api/content/{page_id}/child/attachment"
                headers = {"Authorization": manager.headers["Authorization"], "X-Atlassian-Token": "nocheck"}

                with open(file_path, 'rb') as f:
                    filename = file_path.split('/')[-1]
                    files = {'file': (filename, f, 'text/plain')}
                    response = requests.post(url, headers=headers, files=files)

                if response.status_code in [200, 201]:
                    print(f"  ✓ Attached: {filename}")
                else:
                    print(f"  ✗ Failed: {filename} ({response.status_code})")
            except Exception as e:
                print(f"  ✗ Error: {e}")
    else:
        print("✗ Failed to create page")

    print("\n" + "=" * 60)
    print("Done!")
    print("=" * 60)

if __name__ == "__main__":
    main()
