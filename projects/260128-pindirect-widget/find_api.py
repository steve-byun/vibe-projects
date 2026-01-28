"""
PinDirect API 찾기 도우미

이 스크립트는 브라우저에서 복사한 네트워크 요청 정보를
분석하여 config.json에 저장합니다.

사용법:
1. 브라우저에서 pindirectshop.com에 로그인
2. F12 -> Network 탭 열기
3. 페이지 새로고침
4. 'api' 또는 'usage' 등의 키워드로 요청 필터링
5. 데이터를 가져오는 요청 찾기
6. 해당 요청 우클릭 -> Copy -> Copy as cURL (bash)
7. 아래에 붙여넣기
"""

import json
import re
from pathlib import Path

def parse_curl(curl_command):
    """cURL 명령에서 URL과 헤더 추출"""
    result = {
        "url": "",
        "headers": {},
        "cookies": ""
    }

    # URL 추출
    url_match = re.search(r"curl\s+'([^']+)'", curl_command)
    if url_match:
        result["url"] = url_match.group(1)

    # 헤더 추출
    header_matches = re.findall(r"-H\s+'([^:]+):\s*([^']+)'", curl_command)
    for key, value in header_matches:
        if key.lower() == "cookie":
            result["cookies"] = value
        else:
            result["headers"][key] = value

    return result

def main():
    print("=" * 50)
    print("PinDirect API 설정 도우미")
    print("=" * 50)
    print()
    print("브라우저 개발자 도구에서 API 요청을 찾는 방법:")
    print()
    print("1. pindirectshop.com에 로그인합니다")
    print("2. F12를 눌러 개발자 도구를 엽니다")
    print("3. Network 탭을 선택합니다")
    print("4. 페이지를 새로고침합니다 (Ctrl+R)")
    print("5. 요청 목록에서 데이터 사용량 API를 찾습니다")
    print("   (보통 'usage', 'subscription', 'data' 등의 이름)")
    print("6. 해당 요청을 우클릭 -> Copy -> Copy as cURL (bash)")
    print()

    curl_input = input("cURL 명령을 붙여넣으세요 (또는 Enter로 건너뛰기): ").strip()

    if curl_input:
        parsed = parse_curl(curl_input)

        if parsed["url"]:
            print()
            print(f"찾은 URL: {parsed['url']}")
            print(f"헤더 수: {len(parsed['headers'])}")

            # config.json 업데이트
            config_path = Path(__file__).parent / "config.json"
            with open(config_path, "r", encoding="utf-8") as f:
                config = json.load(f)

            config["api_url"] = parsed["url"]
            if "Authorization" in parsed["headers"]:
                config["auth_token"] = parsed["headers"]["Authorization"].replace("Bearer ", "")

            # 추가 헤더 저장
            if parsed["cookies"]:
                config["cookies"] = parsed["cookies"]

            with open(config_path, "w", encoding="utf-8") as f:
                json.dump(config, f, indent=2, ensure_ascii=False)

            print()
            print("config.json이 업데이트되었습니다!")
            print("이제 run_widget.bat을 실행하세요.")
        else:
            print("URL을 찾을 수 없습니다. cURL 형식을 확인해주세요.")
    else:
        print()
        print("건너뛰었습니다.")
        print()
        print("수동 설정 방법:")
        print("1. config.json 파일을 열어주세요")
        print("2. api_url에 API 주소를 입력하세요")
        print("3. 필요시 auth_token에 인증 토큰을 입력하세요")

    print()
    input("Enter를 눌러 종료...")

if __name__ == "__main__":
    main()
