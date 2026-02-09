"""YouTube Shorts Generator - Flask Backend"""
import os
import sys
import json
import re
import uuid
import tempfile
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS

# Windows 콘솔 UTF-8 인코딩 설정
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')
    sys.stderr.reconfigure(encoding='utf-8')

from tts import generate_speech, detect_language
from pexels import PexelsClient
from subtitles import word_timings_to_srt, text_to_srt, text_to_ass
from video import create_simple_shorts, get_audio_duration

app = Flask(__name__)
CORS(app)

# 설정 로드
CONFIG_PATH = os.path.join(os.path.dirname(__file__), "config.json")

def load_config():
    with open(CONFIG_PATH, 'r', encoding='utf-8') as f:
        return json.load(f)

def save_config(config):
    with open(CONFIG_PATH, 'w', encoding='utf-8') as f:
        json.dump(config, f, indent=4, ensure_ascii=False)

def get_output_folder():
    config = load_config()
    output = config.get("output_folder", "../output")
    if not os.path.isabs(output):
        output = os.path.join(os.path.dirname(__file__), output)
    os.makedirs(output, exist_ok=True)
    return output

def parse_script_response(response: str) -> dict:
    """Gemini 응답에서 제목, 태그, 스크립트 추출 (유연한 파싱)"""
    result = {
        "title": "",
        "tags": [],
        "script": ""
    }

    # 디버그 로그
    print(f"[Parser] 원본 응답 길이: {len(response) if response else 0}")
    print(f"[Parser] 원본 응답 미리보기: {response[:500] if response else 'EMPTY'}")

    if not response or not response.strip():
        print("[Parser] 빈 응답")
        return result

    # 섹션 마커가 연속으로 붙어있으면 줄바꿈 추가
    response = re.sub(r'\[제목\]', '\n[제목]', response)
    response = re.sub(r'\[태그\]', '\n[태그]', response)
    response = re.sub(r'\[스크립트\]', '\n[스크립트]', response)

    lines = response.strip().split('\n')
    current_section = None

    # 제목 패턴들
    title_patterns = [
        r'^\[제목\]:?\s*',
        r'^제목:?\s*',
        r'^\*\*제목[:\s\*]*',
        r'^##?\s*제목:?\s*',
    ]

    # 태그 패턴들
    tag_patterns = [
        r'^\[태그\]:?\s*',
        r'^태그:?\s*',
        r'^\*\*태그[:\s\*]*',
        r'^##?\s*태그:?\s*',
        r'^Tags?:?\s*',
        r'^Keywords?:?\s*',
    ]

    # 스크립트 패턴들
    script_patterns = [
        r'^\[스크립트\]:?\s*',
        r'^스크립트:?\s*',
        r'^\*\*스크립트[:\s\*]*',
        r'^##?\s*스크립트:?\s*',
        r'^나레이션:?\s*',
    ]

    for line in lines:
        line_stripped = line.strip()
        if not line_stripped:
            continue

        # 제목 추출
        title_matched = False
        for pattern in title_patterns:
            if re.match(pattern, line_stripped, re.IGNORECASE):
                title = re.sub(pattern, '', line_stripped, flags=re.IGNORECASE).strip()
                title = title.strip('*').strip('"').strip("'").strip()
                if title:
                    result["title"] = title
                    print(f"[Parser] 제목 추출: {title}")
                current_section = None
                title_matched = True
                break

        if title_matched:
            continue

        # 태그 추출
        tag_matched = False
        for pattern in tag_patterns:
            if re.match(pattern, line_stripped, re.IGNORECASE):
                tags_str = re.sub(pattern, '', line_stripped, flags=re.IGNORECASE).strip()
                tags_str = tags_str.strip('*').strip()
                if '#' in tags_str:
                    result["tags"] = [t.strip().strip('#') for t in tags_str.split('#') if t.strip()]
                else:
                    result["tags"] = [t.strip() for t in tags_str.split(',') if t.strip()]
                print(f"[Parser] 태그 추출: {result['tags']}")
                current_section = None
                tag_matched = True
                break

        if tag_matched:
            continue

        # 스크립트 섹션 시작
        script_matched = False
        for pattern in script_patterns:
            if re.match(pattern, line_stripped, re.IGNORECASE):
                current_section = 'script'
                script_inline = re.sub(pattern, '', line_stripped, flags=re.IGNORECASE).strip()
                if script_inline:
                    result["script"] = script_inline
                script_matched = True
                print("[Parser] 스크립트 섹션 시작")
                break

        if script_matched:
            continue

        # 스크립트 내용 수집
        if current_section == 'script' and line_stripped:
            if result["script"]:
                result["script"] += "\n" + line_stripped
            else:
                result["script"] = line_stripped

    # 스크립트가 없으면 전체 텍스트에서 추출 시도
    if not result["script"]:
        print("[Parser] 스크립트 섹션 없음, fallback 파싱...")
        script_lines = []
        for line in lines:
            line_stripped = line.strip()
            if not line_stripped:
                continue

            # 제목/태그 라인 스킵
            is_meta = False
            for patterns in [title_patterns, tag_patterns, script_patterns]:
                for pattern in patterns:
                    if re.match(pattern, line_stripped, re.IGNORECASE):
                        is_meta = True
                        break
                if is_meta:
                    break

            if not is_meta and len(line_stripped) > 10:
                script_lines.append(line_stripped)

        if script_lines:
            result["script"] = '\n'.join(script_lines)
            print(f"[Parser] fallback 스크립트: {len(result['script'])}자")

    # 스크립트 정리
    if result["script"]:
        result["script"] = clean_script(result["script"])
        print(f"[Parser] 최종 스크립트: {len(result['script'])}자")

    return result

def translate_to_english(text: str) -> str:
    """한글 텍스트를 영어로 번역 (Pexels 검색용)"""
    if not text or text.isascii():
        return text  # 이미 영어면 그대로

    try:
        from deep_translator import GoogleTranslator
        translator = GoogleTranslator(source='ko', target='en')
        translated = translator.translate(text)
        return translated if translated else text
    except Exception as e:
        print(f"Translation error: {e}")
        return text


def extract_keywords_from_script(script: str, title: str = "", tags: list = None) -> list:
    """스크립트에서 Pexels 검색용 영어 키워드 추출 (번역 기반)

    1. 제목 번역 → 키워드로 사용
    2. 태그 번역 → 키워드로 사용
    3. 스크립트 첫 2문장 번역 → 주요 명사 추출
    """
    keywords = []

    # 1. 제목 번역
    if title:
        translated_title = translate_to_english(title)
        if translated_title:
            # 제목에서 주요 단어 추출 (2글자 이상)
            words = [w.strip('.,!?()[]') for w in translated_title.split()]
            for word in words:
                if len(word) >= 3 and word.lower() not in ['the', 'and', 'for', 'are', 'this', 'that', 'with']:
                    if word not in keywords:
                        keywords.append(word)

    # 2. 태그 번역
    if tags:
        for tag in tags[:5]:
            translated_tag = translate_to_english(tag)
            if translated_tag and translated_tag not in keywords:
                keywords.append(translated_tag)

    # 3. 스크립트 핵심 부분 번역 (첫 100자)
    if script and len(keywords) < 8:
        script_preview = script[:150].replace('\n', ' ')
        translated_script = translate_to_english(script_preview)
        if translated_script:
            # 명사/형용사 같은 주요 단어 추출
            words = [w.strip('.,!?()[]"\'') for w in translated_script.split()]
            for word in words:
                if len(word) >= 4 and word.lower() not in ['have', 'this', 'that', 'will', 'with', 'from', 'they', 'were', 'been', 'would', 'could', 'should', 'about', 'there', 'their', 'which', 'today', 'going']:
                    if word not in keywords and len(keywords) < 10:
                        keywords.append(word)

    # 키워드가 부족하면 기본값 추가
    if len(keywords) < 3:
        defaults = ["cinematic", "abstract background", "motion graphics"]
        for d in defaults:
            if d not in keywords:
                keywords.append(d)
                if len(keywords) >= 5:
                    break

    print(f"[Keywords] Extracted: {keywords}")
    return keywords[:10]  # 최대 10개


def clean_script(script: str) -> str:
    """스크립트 정리"""
    lines = script.split('\n')
    cleaned = []

    for line in lines:
        line = line.strip()

        # 빈 줄 스킵
        if not line:
            continue

        # 번호 제거 (1. 2. 등)
        line = re.sub(r'^\d+\.\s*', '', line)

        # 마크다운 굵은 글씨 제거
        line = re.sub(r'\*\*([^*]+)\*\*', r'\1', line)
        line = re.sub(r'\*([^*]+)\*', r'\1', line)

        # 괄호 안 설명 제거 (예: (배경음악))
        line = re.sub(r'\([^)]*\)', '', line).strip()

        if line:
            cleaned.append(line)

    return '\n'.join(cleaned)

@app.route('/health', methods=['GET'])
def health():
    """헬스 체크"""
    return jsonify({"status": "ok"})

@app.route('/config', methods=['GET'])
def get_config():
    """설정 조회"""
    config = load_config()
    # API 키 마스킹
    if config.get("pexels_api_key"):
        config["pexels_api_key_set"] = True
        config["pexels_api_key"] = "***"
    return jsonify(config)

@app.route('/config', methods=['POST'])
def update_config():
    """설정 업데이트"""
    data = request.json
    config = load_config()

    if "pexels_api_key" in data and data["pexels_api_key"] != "***":
        config["pexels_api_key"] = data["pexels_api_key"]
    if "output_folder" in data:
        config["output_folder"] = data["output_folder"]
    if "voice" in data:
        config["voice"] = data["voice"]

    save_config(config)
    return jsonify({"status": "ok"})

@app.route('/open-folder', methods=['POST'])
def open_output_folder():
    """출력 폴더 열기"""
    import subprocess
    output_folder = get_output_folder()
    # 경로 정규화 (Windows 형식으로)
    output_folder = os.path.normpath(os.path.abspath(output_folder))
    print(f"Opening folder: {output_folder}")
    try:
        # Windows에서 폴더 열기 (explorer.exe 명시적 호출)
        subprocess.run(['explorer.exe', output_folder], check=False)
        return jsonify({"status": "ok", "path": output_folder})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/generate', methods=['POST'])
def generate_video():
    """영상 생성"""
    data = request.json

    # 필수 필드 확인
    script_response = data.get("script_response")
    if not script_response:
        return jsonify({"error": "script_response is required"}), 400

    config = load_config()

    # Pexels API 키 확인
    pexels_key = config.get("pexels_api_key")
    if not pexels_key or pexels_key == "YOUR_PEXELS_API_KEY":
        return jsonify({"error": "Pexels API key not configured"}), 400

    try:
        # 1. 스크립트 파싱
        parsed = parse_script_response(script_response)
        print(f"Parsed: {parsed}")

        if not parsed["script"]:
            return jsonify({"error": "Could not parse script from response"}), 400

        # 고유 ID 생성
        video_id = datetime.now().strftime("%Y%m%d_%H%M%S") + "_" + str(uuid.uuid4())[:8]
        output_folder = get_output_folder()
        work_dir = os.path.join(output_folder, video_id)
        os.makedirs(work_dir, exist_ok=True)

        # 2. TTS 음성 생성
        print("Generating speech...")
        lang = detect_language(parsed["script"])
        voice = config["voice"].get(lang, "ko-KR-SunHiNeural")

        audio_path = os.path.join(work_dir, "audio.mp3")
        tts_result = generate_speech(parsed["script"], audio_path, voice)

        # 3. 자막 생성 (동적 하이라이트 ASS 포맷)
        print("Generating subtitles...")
        subtitle_path = os.path.join(work_dir, "subtitles.ass")

        audio_dur = get_audio_duration(audio_path)
        if audio_dur <= 0:
            audio_dur = 30.0

        # ASS 포맷으로 동적 자막 생성 (단어별 하이라이트)
        ass_content = text_to_ass(parsed["script"], audio_dur)

        with open(subtitle_path, 'w', encoding='utf-8') as f:
            f.write(ass_content)

        print(f"ASS subtitle created: {len(ass_content)} chars")

        # 4. Pexels 영상 검색 (스크립트 내용과 관련된 영상)
        print("Searching videos on Pexels...")
        pexels = PexelsClient(pexels_key)

        # 스크립트 내용에서 관련 키워드 추출 (한글→영어 변환)
        keywords = extract_keywords_from_script(
            script=parsed["script"],
            title=parsed["title"],
            tags=parsed["tags"]
        )
        print(f"Extracted keywords: {keywords}")

        # 60초 영상 기준 2.5초 간격 = 최소 24개 영상 필요 (돌려쓰기 금지)
        bg_videos = pexels.get_videos_for_keywords(keywords, work_dir, max_videos=30)

        if len(bg_videos) < 24:
            # 부족하면 일반적인 배경 영상으로 보충
            extra_keywords = ["abstract background", "motion graphics", "light particles"]
            for kw in extra_keywords:
                if len(bg_videos) >= 30:
                    break
                extra = pexels.get_videos_for_keywords([kw], work_dir, max_videos=8)
                bg_videos.extend(extra)

        if not bg_videos:
            return jsonify({"error": "Could not find background videos"}), 500

        print(f"Downloaded {len(bg_videos)} background videos")

        # 5. 영상 합성 (파일명을 제목으로)
        print("Creating video...")
        # 파일명에 사용할 수 없는 문자 제거
        safe_title = re.sub(r'[\\/*?:"<>|]', '', parsed["title"])[:50].strip()
        if not safe_title:
            safe_title = video_id
        output_path = os.path.join(output_folder, f"{safe_title}.mp4")

        # 같은 이름 파일이 있으면 숫자 추가
        counter = 1
        base_path = output_path
        while os.path.exists(output_path):
            output_path = base_path.replace('.mp4', f'_{counter}.mp4')
            counter += 1

        create_simple_shorts(
            background_video=bg_videos[0]["path"],
            audio_path=audio_path,
            subtitle_path=subtitle_path,
            output_path=output_path,
            background_videos=bg_videos,  # 여러 영상 전달 (돌려쓰기 금지)
            clip_duration=2.5  # 2.5초마다 전환 (샘플 영상 분석 기준)
        )

        # 6. 영상 파일 존재 확인
        if not os.path.exists(output_path):
            return jsonify({"error": "Video file was not created"}), 500

        file_size = os.path.getsize(output_path)
        if file_size < 1000:  # 1KB 미만이면 실패로 간주
            return jsonify({"error": f"Video file is too small ({file_size} bytes)"}), 500

        print(f"Video created: {output_path} ({file_size} bytes)")

        # 7. 임시 파일 정리 (옵션)
        # shutil.rmtree(work_dir)

        return jsonify({
            "status": "ok",
            "video_id": video_id,
            "output_path": output_path,
            "title": parsed["title"],
            "duration": get_audio_duration(audio_path),
            "file_size": file_size
        })

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@app.route('/test', methods=['GET'])
def test_generate():
    """테스트 영상 생성"""
    test_response = """
[제목]: 놀라운 우주 사실 3가지

[태그]: 우주, 과학, 사실, 흥미로운, 태양계

[스크립트]:
여러분, 오늘은 놀라운 우주 사실을 알려드릴게요.
첫 번째, 우주는 매일 조금씩 더 커지고 있어요.
두 번째, 목성에는 지구보다 큰 폭풍이 300년 넘게 불고 있어요.
세 번째, 우리 은하에는 태양 같은 별이 수천억 개나 있어요.
놀랍지 않나요? 좋아요와 구독 부탁드려요!
"""

    # /generate 엔드포인트 호출
    with app.test_client() as client:
        response = client.post('/generate', json={"script_response": test_response})
        return response.get_json()

if __name__ == "__main__":
    config = load_config()
    host = config.get("server", {}).get("host", "127.0.0.1")
    port = config.get("server", {}).get("port", 5000)

    print(f"Starting YouTube Shorts Generator server on {host}:{port}")
    app.run(host=host, port=port, debug=True)
