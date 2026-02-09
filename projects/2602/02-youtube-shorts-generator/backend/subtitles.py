"""자막 생성 모듈 - 쇼츠 스타일 자막 (최대 8글자, 팝업 애니메이션)"""
import re

# 읽기 속도 설정
CHARS_PER_SECOND = 5  # 30-40대 남성 기준 초당 인지 가능 글자 수
MAX_CHARS_PER_LINE = 8  # 한 번에 표시할 최대 글자 수 (샘플 영상 분석: 5-8자)

# 팝업 애니메이션 설정
POPUP_DURATION_MS = 100  # 팝업 애니메이션 지속 시간 (ms)
POPUP_START_SCALE = 50   # 시작 크기 (%)
POPUP_OVERSHOOT = 115    # 오버슈트 크기 (%) - 튀어나오는 효과
POPUP_FINAL_SCALE = 100  # 최종 크기 (%)

# ASS 헤더 템플릿 (세로 영상용, 화면 중앙)
ASS_HEADER = """[Script Info]
Title: YouTube Shorts Subtitles
ScriptType: v4.00+
PlayResX: 1080
PlayResY: 1920
WrapStyle: 0

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,Arial Black,70,&H00FFFFFF,&H000000FF,&H00000000,&H80000000,1,0,0,0,100,100,0,0,1,4,2,5,50,50,0,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""


def text_to_ass(text: str, duration: float) -> str:
    """텍스트를 쇼츠 스타일 ASS 자막으로 변환

    - 최대 10글자씩 끊어서 표시
    - 초당 5글자 속도로 표시 시간 계산
    - 화면 중앙에 한 번에 하나의 덩어리만 표시
    """
    # 텍스트를 청크로 분할
    chunks = split_text_to_chunks(text, MAX_CHARS_PER_LINE)

    if not chunks:
        return ASS_HEADER + "Dialogue: 0,0:00:00.00,0:00:05.00,Default,,0,0,0,, \n"

    events = []
    current_time = 0.0

    # 전체 글자 수 계산
    total_chars = sum(len(chunk) for chunk in chunks)

    # 전체 시간에 맞춰 속도 조정
    actual_chars_per_second = total_chars / duration if duration > 0 else CHARS_PER_SECOND

    for chunk in chunks:
        # 글자 수에 따른 표시 시간 계산 (최소 0.5초, 최대 3초)
        chunk_duration = len(chunk) / actual_chars_per_second
        chunk_duration = max(0.5, min(3.0, chunk_duration))

        # 남은 시간 체크
        if current_time + chunk_duration > duration:
            chunk_duration = duration - current_time
            if chunk_duration <= 0:
                break

        events.append(format_ass_dialogue(
            current_time,
            current_time + chunk_duration,
            chunk,
            "Default"
        ))

        current_time += chunk_duration

    return ASS_HEADER + '\n'.join(events)


def split_text_to_chunks(text: str, max_chars: int = 8) -> list:
    """텍스트를 최대 글자 수 기준으로 청크 분할 (한글 자연스러운 끊기)

    - 공백 기준 단어 분리 우선
    - 한글 조사/어미 뒤에서 자연스럽게 끊기
    - 단어 중간에서 절대 끊지 않음
    """
    # 줄바꿈으로 먼저 분리
    lines = [line.strip() for line in text.split('\n') if line.strip()]

    chunks = []

    for line in lines:
        # 공백으로 단어 분리
        words = line.split()

        current_chunk = ""

        for word in words:
            # 단어가 max_chars보다 길면 한글 분리점에서 분할
            if len(word) > max_chars:
                # 현재 청크 저장
                if current_chunk:
                    chunks.append(current_chunk.strip())
                    current_chunk = ""

                # 긴 단어를 자연스러운 위치에서 분할
                sub_chunks = split_korean_word(word, max_chars)
                chunks.extend(sub_chunks)
                continue

            # 현재 청크에 단어 추가 시 길이 체크
            if current_chunk:
                test_chunk = current_chunk + " " + word
                test_len = len(test_chunk.replace(" ", ""))
            else:
                test_chunk = word
                test_len = len(word)

            if test_len <= max_chars:
                # 글자 수가 max_chars 이하면 추가
                current_chunk = test_chunk
            else:
                # 초과하면 현재 청크 저장하고 새로 시작
                if current_chunk:
                    chunks.append(current_chunk.strip())
                current_chunk = word

        # 마지막 청크 저장
        if current_chunk:
            chunks.append(current_chunk.strip())

    return chunks


def split_korean_word(word: str, max_chars: int) -> list:
    """긴 한글 단어를 자연스러운 위치에서 분할

    분할 우선순위:
    1. 조사 뒤 (은, 는, 이, 가, 를, 을, 에, 로, 와, 과, 도, 만, 의)
    2. 어미 뒤 (다, 요, 죠, 네, 고, 며, 서, 면, 니, 지)
    3. max_chars 위치 (최후의 수단)
    """
    if len(word) <= max_chars:
        return [word]

    # 한글 분리 패턴 (조사/어미 뒤)
    # 우선순위가 높은 것부터
    break_after = [
        '습니다', '입니다', '합니다', '됩니다',  # 존칭 어미
        '에서', '으로', '에게', '처럼', '보다',  # 2글자 조사
        '는', '은', '이', '가', '를', '을',      # 주격/목적격 조사
        '에', '로', '와', '과', '도', '만', '의', # 기타 조사
        '다', '요', '죠', '네', '고', '며',      # 어미
        '서', '면', '니', '지', '게', '라',      # 연결어미
    ]

    chunks = []
    remaining = word

    while len(remaining) > max_chars:
        best_break = max_chars  # 기본값: max_chars 위치

        # 자연스러운 분리점 찾기 (max_chars 범위 내에서)
        for pattern in break_after:
            # 패턴이 끝나는 위치 찾기
            idx = remaining[:max_chars + len(pattern)].find(pattern)
            if idx != -1:
                break_pos = idx + len(pattern)
                # max_chars를 크게 초과하지 않는 범위에서
                if break_pos <= max_chars + 2 and break_pos > 0:
                    best_break = break_pos
                    break

        # 분리점이 너무 앞이면 (2글자 이하) max_chars 사용
        if best_break <= 2:
            best_break = max_chars

        chunks.append(remaining[:best_break])
        remaining = remaining[best_break:]

    if remaining:
        chunks.append(remaining)

    return chunks


def format_ass_dialogue(start: float, end: float, text: str, style: str = "Default", animate: bool = True) -> str:
    """ASS Dialogue 라인 포맷 (팝업 애니메이션 포함)

    애니메이션 효과:
    - 작은 크기에서 시작 (50%)
    - 오버슈트로 튀어나옴 (115%)
    - 최종 크기로 안착 (100%)
    """
    if animate:
        # 팝업 애니메이션 태그
        # \fscx, \fscy: 가로/세로 스케일
        # \t(t1,t2,\tag): t1~t2 시간 동안 태그 값으로 애니메이션
        anim_text = (
            f"{{\\fscx{POPUP_START_SCALE}\\fscy{POPUP_START_SCALE}"  # 시작: 50%
            f"\\t(0,{POPUP_DURATION_MS},\\fscx{POPUP_OVERSHOOT}\\fscy{POPUP_OVERSHOOT})"  # 0-100ms: 115%로
            f"\\t({POPUP_DURATION_MS},{POPUP_DURATION_MS + 80},\\fscx{POPUP_FINAL_SCALE}\\fscy{POPUP_FINAL_SCALE})}}"  # 100-180ms: 100%로
            f"{text}"
        )
    else:
        anim_text = text

    return f"Dialogue: 0,{format_ass_timestamp(start)},{format_ass_timestamp(end)},{style},,0,0,0,,{anim_text}"


def format_ass_timestamp(seconds: float) -> str:
    """초를 ASS 타임스탬프로 변환 (H:MM:SS.cc)"""
    hours = int(seconds // 3600)
    minutes = int((seconds % 3600) // 60)
    secs = int(seconds % 60)
    centis = int((seconds % 1) * 100)
    return f"{hours}:{minutes:02d}:{secs:02d}.{centis:02d}"


def text_to_srt(text: str, duration: float, chars_per_second: float = 8.0) -> str:
    """텍스트와 총 길이로 SRT 생성 (word_timings 없을 때 fallback)"""
    sentences = script_to_sentences(text)
    if not sentences:
        return "1\n00:00:00,000 --> 00:00:05,000\n \n"

    srt_lines = []
    total_chars = sum(len(s) for s in sentences)

    current_time = 0.0
    for i, sentence in enumerate(sentences):
        # 문장 길이에 비례해서 시간 배분
        sentence_duration = (len(sentence) / total_chars) * duration
        end_time = min(current_time + sentence_duration, duration)

        srt_lines.append(format_srt_entry(i + 1, current_time, end_time, sentence))
        current_time = end_time

    return "\n".join(srt_lines)

def word_timings_to_srt(word_timings: list, max_chars_per_line: int = 30) -> str:
    """단어 타이밍을 SRT 형식으로 변환"""
    if not word_timings:
        return ""

    srt_lines = []
    current_text = ""
    current_start = None
    current_end = None
    index = 1

    for timing in word_timings:
        word = timing["text"]
        start = timing["start"]
        end = start + timing["duration"]

        if current_start is None:
            current_start = start
            current_text = word
            current_end = end
        elif len(current_text) + len(word) + 1 <= max_chars_per_line:
            current_text += " " + word
            current_end = end
        else:
            # 현재 자막 저장
            srt_lines.append(format_srt_entry(index, current_start, current_end, current_text))
            index += 1

            # 새 자막 시작
            current_start = start
            current_text = word
            current_end = end

    # 마지막 자막 저장
    if current_text:
        srt_lines.append(format_srt_entry(index, current_start, current_end, current_text))

    return "\n".join(srt_lines)

def format_srt_entry(index: int, start: float, end: float, text: str) -> str:
    """SRT 엔트리 포맷"""
    return f"{index}\n{format_timestamp(start)} --> {format_timestamp(end)}\n{text}\n"

def format_timestamp(seconds: float) -> str:
    """초를 SRT 타임스탬프로 변환"""
    hours = int(seconds // 3600)
    minutes = int((seconds % 3600) // 60)
    secs = int(seconds % 60)
    millis = int((seconds % 1) * 1000)
    return f"{hours:02d}:{minutes:02d}:{secs:02d},{millis:03d}"

def script_to_sentences(script: str) -> list:
    """스크립트를 문장 단위로 분리"""
    # 줄바꿈으로 먼저 분리
    lines = [line.strip() for line in script.split('\n') if line.strip()]

    sentences = []
    for line in lines:
        # 문장 부호로 추가 분리
        parts = re.split(r'(?<=[.!?])\s+', line)
        sentences.extend([p.strip() for p in parts if p.strip()])

    return sentences

def estimate_duration(text: str, wpm: int = 150) -> float:
    """텍스트 읽기 시간 추정 (분당 단어 수 기준)"""
    words = len(text.split())
    return (words / wpm) * 60

if __name__ == "__main__":
    # 테스트
    test_script = """안녕하세요.
오늘은 놀라운 우주 사실을 알려드릴게요.
태양은 지구보다 100만 배 더 큽니다.
믿기 어렵죠?"""

    sentences = script_to_sentences(test_script)
    print("Sentences:")
    for s in sentences:
        print(f"  - {s} ({estimate_duration(s):.1f}s)")
