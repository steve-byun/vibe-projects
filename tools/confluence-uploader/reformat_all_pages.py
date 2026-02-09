#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
모든 페이지를 기준 형식으로 재작성
- local-id 속성 제거
- 인라인 스타일 제거
- 깔끔한 HTML 구조로 변환
"""

import sys
import re
sys.stdout.reconfigure(encoding='utf-8')
sys.path.insert(0, 'c:/Steve/01_Vibe_Projects/tools/confluence-uploader')

from confluence_manager import ConfluenceManager
import requests

# 각 페이지의 새 콘텐츠 (Markdown → Confluence HTML)
PAGE_CONTENTS = {
    "1450704910": {
        "title": "matlab scope 연결 및 data gathering 방법",
        "content": """<h1>Matlab Scope 연결 및 Data Gathering 방법</h1>

<ac:structured-macro ac:name="info"><ac:rich-text-body>
<p>이 문서는 2세대 로봇의 Matlab Scope 연결 및 데이터 수집 방법을 설명합니다.</p>
</ac:rich-text-body></ac:structured-macro>

<hr/>

<h2>1. 준비물</h2>
<ul>
<li>공유기 (3소켓 이상) &amp; 파워</li>
<li>랜선 2개 (짧은 선 1개, 긴 선 1개)</li>
<li>멀티탭</li>
<li>USB, USB 허브</li>
<li>개발 PC (노트북)</li>
<li>E-PC 연결용 키보드/마우스</li>
</ul>

<hr/>

<h2>2. 개발 PC 설정</h2>
<ol>
<li>Matlab <strong>2013b</strong> 설치</li>
<li>제공된 zip파일 중 <code>2gen_scope</code> 압축 해제</li>
<li>Matlab 2013b 실행 → Home → Set Path에서 다음 경로 추가:
<ul>
<li><code>2gen_scope\\blocks</code> (하위폴더 포함)</li>
<li><code>2gen_scope\\scope</code> (하위폴더 포함)</li>
</ul>
</li>
</ol>

<hr/>

<h2>3. Rodi 및 2세대 제어기 케이블 설정</h2>

<h3>3.1 Rodi 세팅</h3>
<ul>
<li><code>v2.010.004 Gen2</code> 버전 (현재 개발버전)으로 소프트웨어 업데이트</li>
</ul>

<h3>3.2 제어기 랜선 세팅</h3>
<ol>
<li><strong>제어기 e-PC 케이블</strong>: ePC로 들어가는 케이블 (페라이트 코어 설치된 케이블, E-PC OUT이라 적혀있음)을 뽑아서 iptime 공유기에 연결</li>
<li><strong>짧은 랜선</strong>: e-PC 케이블 뽑은 자리에 짧은 랜선 한 쪽을 연결하고, 반대쪽은 iptime 공유기에 연결</li>
<li><strong>긴 랜선</strong>: 랜선 한 쪽을 iptime 공유기에 연결하고, 개발 PC에 반대쪽을 연결</li>
</ol>

<hr/>

<h2>4. Zed Board 설정</h2>

<h3>4.1 WinSCP 연결</h3>
<ol>
<li>제공된 zip파일 중 <code>WinSCP-6.5-Portable</code> 압축 해제하여 WinSCP.exe 실행</li>
<li>로그인 정보:
<ul>
<li>Host name: <code>192.168.100.240</code> (zed board ip)</li>
<li>User name: <code>root</code></li>
<li>Password: <code>root</code></li>
</ul>
</li>
<li>왼쪽 화면: 개발 PC 폴더 트리 / 오른쪽 화면: Zed Board 폴더 트리</li>
</ol>

<h3>4.2 파일 교체</h3>
<ol>
<li>제공된 zip 파일 중 <code>arm</code> 압축 해제</li>
<li>폴더 내 파일 확인:
<ul>
<li>.so 파일 (force, kinematics, safety, torqctrl)</li>
<li>.elf 파일 (zed_kpa_hcr5)</li>
<li>codegen~.so 파일</li>
</ul>
</li>
<li>.so 파일을 zed board 내 <code>/kpa/master/htw/HCR5_2GEN/module/~~</code> 각 폴더에 교체</li>
<li>.elf 파일은 <code>/kpa/master/htw/HCR5_2GEN/</code> 내에 교체</li>
</ol>

<ac:structured-macro ac:name="warning"><ac:rich-text-body>
<p><strong>주의</strong>: 원상복구를 위해 기존 파일들을 반드시 백업!</p>
<p>예: <code>forcectrl_htw_hcr5_2gen.so</code> → <code>forcectrl_htw_hcr5_2gen.so_ori</code></p>
</ac:rich-text-body></ac:structured-macro>

<h3>4.3 Plugin 폴더 설정</h3>
<ol>
<li>zedboard 내 <code>/kpa/master/bin/</code>에 <code>plugin</code> 폴더 생성</li>
<li><code>cogen_block_test_scope_zed_collision_HCR5_ForceTorqueData.so</code> 파일을 plugin 폴더에 복사</li>
</ol>

<hr/>

<h2>5. 로봇 재부팅</h2>
<ul>
<li>변경된 .so/.elf 파일들로 부팅되도록 로봇 재부팅</li>
</ul>

<ac:structured-macro ac:name="note"><ac:rich-text-body>
<p>부팅 중 약 30% 정도에서 꺼지는 현상이 자주 발생합니다. 계속 재부팅하면 정상 부팅됩니다.</p>
</ac:rich-text-body></ac:structured-macro>

<hr/>

<h2>6. 데이터 수집</h2>

<h3>6.1 Simulink 연결</h3>
<ol>
<li>Matlab 2013b에서 scope 폴더를 현재 경로로 설정</li>
<li><code>cogen_block_test_scope_zed_collisionHCR5_ForceTorqueData.slx</code> 실행</li>
<li>Simulink 화면에서 <strong>&gt;&lt;</strong> (Connect to target) 클릭</li>
</ol>

<ac:structured-macro ac:name="warning"><ac:rich-text-body>
<p><strong>주의</strong>: □ 모양 (Stop)을 누르면 E-PC를 재부팅해야 합니다! &lt;&gt; 모양 (Disconnect)를 사용하세요.</p>
</ac:rich-text-body></ac:structured-macro>

<h3>6.2 Friction Motion 실행</h3>
<ol>
<li>Plot 화면이 순서대로 켜지고 time scope7까지 확인</li>
<li>제공된 <code>HCR-5_friction_motion.zip</code> 압축 해제</li>
<li>J1~J6 파일들을 USB에 넣고 제어기에 연결</li>
<li>부하 없이 friction motion 실행
<ul>
<li>1, 4, 5, 6축: 약 1시간</li>
<li>2축: 약 15분</li>
<li>3축: 약 25분</li>
</ul>
</li>
</ol>

<h3>6.3 데이터 저장</h3>
<ol>
<li>모션 종료 후 <strong>&gt;&lt;</strong> (Disconnect to target) 클릭</li>
<li><code>test_file_save.m</code> 실행하여 데이터 저장</li>
<li>저장된 데이터 이름 변경 (예: <code>HCR-5A_#313_J1</code>)</li>
<li><code>load_data();</code>로 데이터 확인</li>
<li><code>clear; clc;</code> 후 1~6번축 모션 반복</li>
</ol>

<ac:structured-macro ac:name="info"><ac:rich-text-body>
<p><strong>참고</strong>: 제어기는 바꾸지 않고 로봇만 교체합니다. 제어기 변경 시 2~3번 과정을 다시 해야 합니다.</p>
</ac:rich-text-body></ac:structured-macro>

<hr/>

<h2>7. 원상복구</h2>
<ol>
<li>기존 Rodi SW 버전으로 업그레이드/다운그레이드</li>
<li>이 과정에서 변경한 .so 파일들이 삭제됨</li>
<li>SW 버전 변경 완료 후 제어기 케이블도 원래 상태로 복구</li>
</ol>

<hr/>
<p><em>마지막 업데이트: 2026-01-29</em></p>"""
    },

    "1434025985": {
        "title": "솔루션으로 구동 방법",
        "content": """<h1>솔루션으로 구동 방법</h1>

<ac:structured-macro ac:name="info"><ac:rich-text-body>
<p>Visual Studio 솔루션을 통해 개발 환경을 실행하는 방법입니다.</p>
</ac:rich-text-body></ac:structured-macro>

<hr/>

<h2>실행 순서</h2>

<ol>
<li><strong>3개 프로젝트 빌드</strong> (기존과 동일)
<ul>
<li>build_intime</li>
<li>build_win</li>
<li>build_win_for_intime</li>
</ul>
</li>
<li><strong>배치파일 실행</strong>
<ac:structured-macro ac:name="code"><ac:parameter ac:name="language">text</ac:parameter>
<ac:plain-text-body><![CDATA[C:\\v3\\src\\ctrlink\\scripts\\build_real_env_-nodegyp.bat]]></ac:plain-text-body></ac:structured-macro>
<p>※ 기존 script 1, 3, 4를 한번에 실행하는 배치 파일</p>
</li>
<li><strong>Visual Studio에서 실행</strong>
<ul>
<li><code>win_for_intime</code> 프로젝트에서 <code>test_gui_control_nana</code>를 시작 프로젝트로 설정</li>
<li><strong>F5</strong>로 실행 → Intime과 UI가 함께 실행됨</li>
</ul>
</li>
</ol>

<hr/>
<p><em>마지막 업데이트: 2026-01-29</em></p>"""
    },

    "1448378373": {
        "title": "friction data converter",
        "content": """<h1>Friction Data Converter</h1>

<ac:structured-macro ac:name="info"><ac:rich-text-body>
<p>Friction estimation 결과 데이터의 단위를 변환하는 도구입니다.</p>
</ac:rich-text-body></ac:structured-macro>

<hr/>

<h2>사용 방법</h2>

<ol>
<li><strong>파일 준비</strong>
<ul>
<li>첨부 파일(<code>rdconv.py</code>)을 다음 경로에 복사:</li>
</ul>
<ac:structured-macro ac:name="code"><ac:parameter ac:name="language">text</ac:parameter>
<ac:plain-text-body><![CDATA[D:\\hanwha\\tgos\\let-it-bot\\friction\\modeling]]></ac:plain-text-body></ac:structured-macro>
<p>또는 friction estimation 결과 데이터 (*.dat 파일)와 같은 경로에 복사</p>
</li>
<li><strong>실행</strong>
<ac:structured-macro ac:name="code"><ac:parameter ac:name="language">bash</ac:parameter>
<ac:plain-text-body><![CDATA[python rdconv.py]]></ac:plain-text-body></ac:structured-macro>
</li>
<li><strong>결과 확인</strong>
<ul>
<li>rad → deg, deg → rad 단위 변환 결과가 각 폴더에 저장</li>
<li>변환 내역은 txt 파일로 저장됨</li>
</ul>
</li>
</ol>

<hr/>

<h2>첨부파일</h2>
<ul>
<li><code>rdconv.py</code> - 단위 변환 스크립트</li>
</ul>

<hr/>
<p><em>마지막 업데이트: 2026-01-29</em></p>"""
    },

    "1448476694": {
        "title": "log 암호화 해제",
        "content": """<h1>Log 암호화 해제</h1>

<ac:structured-macro ac:name="info"><ac:rich-text-body>
<p>암호화된 로그 파일을 복호화하는 방법입니다.</p>
</ac:rich-text-body></ac:structured-macro>

<hr/>

<h2>사용 방법</h2>

<ol>
<li>첨부파일 (<code>cryptor.zip</code>) 압축 해제</li>
<li><code>cryptor_dotnet.exe</code> 실행</li>
<li>암호화된 log 파일/폴더를 프로그램에 <strong>드래그 앤 드랍</strong></li>
</ol>

<hr/>

<h2>첨부파일</h2>
<ul>
<li><code>cryptor.zip</code> - 복호화 도구</li>
</ul>

<hr/>
<p><em>마지막 업데이트: 2026-01-29</em></p>"""
    },

    "1449951239": {
        "title": "제어기에서 저크 변경",
        "content": """<h1>제어기에서 저크(Jerk) 변경</h1>

<ac:structured-macro ac:name="info"><ac:rich-text-body>
<p>E-PC 제어기에서 Jerk 값을 변경하는 방법입니다.</p>
</ac:rich-text-body></ac:structured-macro>

<hr/>

<h2>변경 방법</h2>

<ol>
<li><strong>설정 파일 열기</strong>
<ac:structured-macro ac:name="code"><ac:parameter ac:name="language">text</ac:parameter>
<ac:plain-text-body><![CDATA[D:\\hanwha\\tgos\\let-it-bot\\system\\hcr.data]]></ac:plain-text-body></ac:structured-macro>
<p>메모장으로 열기</p>
</li>
<li><strong>JERK 값 수정</strong>
<ac:structured-macro ac:name="code"><ac:parameter ac:name="language">json</ac:parameter>
<ac:plain-text-body><![CDATA[{
  "version": "1.0.0.0",
  "robotName": "New_HCR14",
  "modelName": "HCR14",
  "robot": {
    "MODEL": "CLINK_ROBOT_MODEL_HCR14_3GEN",
    "JERK_PERCENTAGE": 0.8,    // ← 이 값을 수정
    "HOME_JOINT_ANGLE": [...]
  }
}]]></ac:plain-text-body></ac:structured-macro>
</li>
<li><strong>로봇 재부팅</strong></li>
<li><strong>확인</strong>
<ul>
<li>UI Rodi → 관리 → 로봇 관리 → 추가 정보 → Jerk 값</li>
<li>수정한 값이 반영되었는지 확인</li>
</ul>
</li>
</ol>

<hr/>
<p><em>마지막 업데이트: 2026-01-29</em></p>"""
    },

    "1450934277": {
        "title": "v3 완전 삭제 후 재 설치",
        "content": """<h1>V3 완전 삭제 후 재설치</h1>

<ac:structured-macro ac:name="info"><ac:rich-text-body>
<p>V3 개발 환경을 완전히 삭제하고 다시 설치하는 방법입니다.</p>
</ac:rich-text-body></ac:structured-macro>

<hr/>

<h2>참고 문서</h2>

<p>아래 문서를 참조하세요:</p>

<ul>
<li><a href="https://hanwharobot.atlassian.net/wiki/spaces/V3/pages/388513801">[개발환경] v3 git 최신 버전(develop) 업데이트 배치 파일</a></li>
</ul>

<hr/>
<p><em>마지막 업데이트: 2026-01-29</em></p>"""
    },

    "1507852307": {
        "title": "UDP Data Gathering 통합 매뉴얼",
        "content": """<h1>UDP Data Gathering 통합 매뉴얼</h1>

<ac:structured-macro ac:name="info"><ac:rich-text-body>
<p>이 문서는 기존 2개 파일을 통합한 것입니다:<br/>
- <code>로봇 데이터 획득 메뉴얼.txt</code><br/>
- <code>UDP data gathering manual.txt</code></p>
</ac:rich-text-body></ac:structured-macro>

<hr/>

<h2>1. 기본 물리적 셋팅</h2>
<ul>
<li>개발 PC(Data gathering용)와 E-PC의 <strong>1번 LAN 포트</strong>를 LAN 선으로 연결</li>
<li>개발 PC에 Matlab 설치 필요</li>
<li>원격 접속 정보: <code>hcr / hcr12345</code> 또는 <code>Administrator / hcr12345</code></li>
</ul>

<hr/>

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
<ac:structured-macro ac:name="code"><ac:parameter ac:name="language">text</ac:parameter>
<ac:plain-text-body><![CDATA[IP: 192.168.222.222
Subnet: 255.255.255.0
Gateway: (비워둠)]]></ac:plain-text-body></ac:structured-macro>

<hr/>

<h2>3. Matlab에서 데이터 수집</h2>

<h3>3.1 UDP 설정</h3>
<ac:structured-macro ac:name="code"><ac:parameter ac:name="language">matlab</ac:parameter>
<ac:plain-text-body><![CDATA[% UDP 객체 생성
u = udp('192.168.222.111', 'LocalPort', 50000);
u.InputBufferSize = 65535;
u.Timeout = 10;

% 연결
fopen(u);

% 데이터 수신
data = fread(u, u.BytesAvailable);

% 연결 해제
fclose(u);
delete(u);]]></ac:plain-text-body></ac:structured-macro>

<h3>3.2 데이터 저장</h3>
<ul>
<li>수집된 데이터는 Matlab workspace에 저장</li>
<li><code>save('filename.mat', 'data');</code>로 파일 저장</li>
</ul>

<hr/>

<h2>4. 트러블슈팅</h2>

<h3>연결이 안 될 때</h3>
<ol>
<li>E-PC와 개발 PC가 같은 네트워크에 있는지 확인</li>
<li>방화벽 설정 확인</li>
<li>IP 주소가 올바른지 확인</li>
<li>INtime이 정상 실행 중인지 확인</li>
</ol>

<hr/>
<p><em>마지막 업데이트: 2026-01-29</em></p>"""
    }
}


def get_page_version(manager: ConfluenceManager, page_id: str) -> int:
    """페이지 버전 가져오기"""
    url = f"{manager.base_url}/wiki/rest/api/content/{page_id}"
    params = {'expand': 'version'}
    response = requests.get(url, headers=manager.headers, params=params)

    if response.status_code == 200:
        return response.json().get('version', {}).get('number', 1)
    return 1


def main():
    print("=" * 60)
    print("Reformatting All Pages to Standard Format")
    print("=" * 60)

    manager = ConfluenceManager()

    for page_id, page_data in PAGE_CONTENTS.items():
        print(f"\n{'='*60}")
        print(f"Processing: {page_data['title']} (ID: {page_id})")
        print(f"{'='*60}")

        version = get_page_version(manager, page_id)
        result = manager.update_page(
            page_id,
            page_data['title'],
            page_data['content'],
            version
        )

        if result:
            print(f"  ✓ Updated successfully")
        else:
            print(f"  ✗ Failed to update")

    print("\n" + "=" * 60)
    print("All pages reformatted!")
    print("=" * 60)


if __name__ == "__main__":
    main()
