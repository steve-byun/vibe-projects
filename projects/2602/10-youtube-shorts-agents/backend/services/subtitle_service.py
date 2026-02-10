"""자막 생성 서비스 - 쇼츠 스타일 ASS 자막"""
import os

POPUP_DURATION_MS = 100
POPUP_START_SCALE = 50
POPUP_OVERSHOOT = 115
POPUP_FINAL_SCALE = 100
MAX_CHARS_PER_LINE = 8

ASS_HEADER = """[Script Info]
Title: YouTube Shorts Subtitles
ScriptType: v4.00+
PlayResX: 1080
PlayResY: 1920
WrapStyle: 0

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,Arial Black,70,&H00FFFFFF,&H000000FF,&H00000000,&H80000000,1,0,0,0,100,100,0,0,1,4,2,5,50,50,0,1
Style: Hook,Arial Black,75,&H0000FFFF,&H000000FF,&H00000000,&H80000000,1,0,0,0,100,100,0,0,1,4,2,5,50,50,0,1
Style: CTA,Arial Black,70,&H0000FFFF,&H000000FF,&H00000000,&H80000000,1,0,0,0,100,100,0,0,1,4,2,5,50,50,0,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""


class SubtitleService:
    def generate_ass(self, word_timings: list, segment_types: list, duration: float, output_path: str) -> str:
        """단어 타이밍 기반 ASS 자막 생성"""
        if not word_timings:
            content = ASS_HEADER + f"Dialogue: 0,0:00:00.00,0:00:{duration:.2f},Default,,0,0,0,, \n"
            with open(output_path, "w", encoding="utf-8") as f:
                f.write(content)
            return output_path

        # 단어들을 MAX_CHARS_PER_LINE 기준으로 그룹화
        events = []
        current_text = ""
        current_start = None
        current_end = None

        for wt in word_timings:
            word = wt["text"]
            word_start = wt["start"]
            word_end = word_start + wt["duration"]

            # Determine style based on segment_types
            style = self._get_style_for_time(word_start, segment_types)

            if current_start is None:
                current_start = word_start
                current_text = word
                current_end = word_end
            elif len((current_text + word).replace(" ", "")) <= MAX_CHARS_PER_LINE:
                current_text += " " + word
                current_end = word_end
            else:
                # Save current chunk
                events.append(self._format_dialogue(current_start, current_end, current_text, style))
                current_start = word_start
                current_text = word
                current_end = word_end

        # Last chunk
        if current_text:
            style = self._get_style_for_time(current_start, segment_types)
            events.append(self._format_dialogue(current_start, current_end, current_text, style))

        content = ASS_HEADER + "\n".join(events)
        with open(output_path, "w", encoding="utf-8") as f:
            f.write(content)

        return output_path

    def generate_ass_from_text(self, text: str, duration: float, output_path: str) -> str:
        """텍스트 기반 ASS 자막 생성 (word_timings 없을 때 fallback)"""
        chunks = self._split_text_to_chunks(text, MAX_CHARS_PER_LINE)
        if not chunks:
            return self.generate_ass([], [], duration, output_path)

        events = []
        current_time = 0.0
        total_chars = sum(len(c) for c in chunks)
        chars_per_sec = total_chars / duration if duration > 0 else 5

        for chunk in chunks:
            chunk_dur = max(0.5, min(3.0, len(chunk) / chars_per_sec))
            if current_time + chunk_dur > duration:
                chunk_dur = duration - current_time
                if chunk_dur <= 0:
                    break
            events.append(self._format_dialogue(current_time, current_time + chunk_dur, chunk))
            current_time += chunk_dur

        content = ASS_HEADER + "\n".join(events)
        with open(output_path, "w", encoding="utf-8") as f:
            f.write(content)
        return output_path

    def _get_style_for_time(self, time: float, segment_types: list) -> str:
        for seg in segment_types:
            if seg["start"] <= time <= seg["end"]:
                if seg["type"] == "hook":
                    return "Hook"
                elif seg["type"] == "cta":
                    return "CTA"
        return "Default"

    def _format_dialogue(self, start: float, end: float, text: str, style: str = "Default") -> str:
        anim = (
            f"{{\\fscx{POPUP_START_SCALE}\\fscy{POPUP_START_SCALE}"
            f"\\t(0,{POPUP_DURATION_MS},\\fscx{POPUP_OVERSHOOT}\\fscy{POPUP_OVERSHOOT})"
            f"\\t({POPUP_DURATION_MS},{POPUP_DURATION_MS + 80},\\fscx{POPUP_FINAL_SCALE}\\fscy{POPUP_FINAL_SCALE})}}"
            f"{text}"
        )
        return f"Dialogue: 0,{self._ts(start)},{self._ts(end)},{style},,0,0,0,,{anim}"

    @staticmethod
    def _ts(seconds: float) -> str:
        h = int(seconds // 3600)
        m = int((seconds % 3600) // 60)
        s = int(seconds % 60)
        cs = int((seconds % 1) * 100)
        return f"{h}:{m:02d}:{s:02d}.{cs:02d}"

    @staticmethod
    def _split_text_to_chunks(text: str, max_chars: int = 8) -> list:
        lines = [l.strip() for l in text.split('\n') if l.strip()]
        chunks = []
        for line in lines:
            words = line.split()
            current = ""
            for word in words:
                if current:
                    test = current + " " + word
                    test_len = len(test.replace(" ", ""))
                else:
                    test = word
                    test_len = len(word)

                if test_len <= max_chars:
                    current = test
                else:
                    if current:
                        chunks.append(current.strip())
                    current = word
            if current:
                chunks.append(current.strip())
        return chunks
