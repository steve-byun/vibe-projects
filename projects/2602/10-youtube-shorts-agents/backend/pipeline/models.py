from pydantic import BaseModel
from typing import List, Optional


class GenerateRequest(BaseModel):
    topic: str
    style: str = "정보형"          # 정보형 | 감성형 | 유머형
    duration_target: int = 50      # seconds


class DirectorBrief(BaseModel):
    concept: str
    tone: str
    target_emotion: str
    hook: str
    body_points: List[str]
    cta: str
    visual_mood: str
    title_suggestion: str
    tags: List[str]
    estimated_duration: int


class ScriptSegment(BaseModel):
    type: str                      # hook | body | cta
    text: str
    emphasis: bool = False


class Script(BaseModel):
    title: str
    script_segments: List[ScriptSegment]
    full_script: str
    search_keywords: List[str]
    hashtags: List[str]


class VideoClip(BaseModel):
    path: str
    pexels_id: int
    keyword: str
    duration: float
    width: int
    height: int


class MediaAssets(BaseModel):
    video_clips: List[VideoClip]


class WordTiming(BaseModel):
    text: str
    start: float
    duration: float


class SegmentTiming(BaseModel):
    segment_index: int
    start: float
    end: float


class AudioResult(BaseModel):
    audio_path: str
    duration: float
    word_timings: List[WordTiming]
    segment_timings: List[SegmentTiming]


class FinalVideo(BaseModel):
    video_path: str
    title: str
    duration: float
    file_size: int
    hashtags: List[str]


class AgentProgress(BaseModel):
    agent: str
    status: str                    # waiting | running | done | error
    message: str
    elapsed: float = 0
