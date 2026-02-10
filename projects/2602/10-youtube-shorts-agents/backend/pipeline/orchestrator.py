"""쇼츠 생성 파이프라인 오케스트레이터"""
import os
import time
import uuid
import threading
from concurrent.futures import ThreadPoolExecutor

class ShortsOrchestrator:
    def __init__(self, config: dict):
        self.config = config
        self._init_services()
        self._init_agents()
        self.jobs = {}  # job_id -> job state

    def _init_services(self):
        from services.ai_client import AIClient
        from services.tts_service import TTSService
        from services.pexels_service import PexelsService
        from services.subtitle_service import SubtitleService
        from services.video_service import VideoService

        self.ai_client = AIClient(self.config)
        self.tts = TTSService()
        self.pexels = PexelsService(self.config["pexels_api_key"])

        ffmpeg_path = self.config.get("ffmpeg_path", "./ffmpeg/ffmpeg.exe")
        if not os.path.isabs(ffmpeg_path):
            ffmpeg_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), ffmpeg_path)
        ffprobe_path = os.path.join(os.path.dirname(ffmpeg_path), "ffprobe.exe")

        self.subtitle = SubtitleService()
        self.video = VideoService(ffmpeg_path, ffprobe_path)

    def _init_agents(self):
        from agents import DirectorAgent, WriterAgent, ResearcherAgent, VoiceAgent, EditorAgent

        self.agents = {
            "director": DirectorAgent(self.ai_client),
            "writer": WriterAgent(self.ai_client),
            "researcher": ResearcherAgent(self.ai_client, self.pexels),
            "voice": VoiceAgent(self.tts),
            "editor": EditorAgent(self.video, self.subtitle),
        }

    def start_job(self, topic: str, style: str = "정보형", duration_target: int = 50) -> str:
        """새 생성 작업 시작 (비동기)"""
        job_id = str(uuid.uuid4())[:8]

        self.jobs[job_id] = {
            "status": "running",
            "events": [],
            "result": None,
            "error": None
        }

        thread = threading.Thread(
            target=self._run_pipeline,
            args=(job_id, topic, style, duration_target),
            daemon=True
        )
        thread.start()

        return job_id

    def _emit(self, job_id: str, agent: str, status: str, message: str):
        """진행 이벤트 추가"""
        event = {
            "agent": agent,
            "status": status,
            "message": message,
            "timestamp": time.time()
        }
        if job_id in self.jobs:
            self.jobs[job_id]["events"].append(event)
        print(f"[{agent}] {status}: {message}")

    def _run_pipeline(self, job_id: str, topic: str, style: str, duration_target: int):
        """5-에이전트 파이프라인 실행"""
        try:
            start_time = time.time()

            # Setup output directory
            output_dir = os.path.join(
                os.path.dirname(os.path.dirname(__file__)),
                self.config.get("output_folder", "./output"),
                job_id
            )
            os.makedirs(output_dir, exist_ok=True)

            video_config = self.config.get("video", {})

            # ===== STEP 1: Director =====
            self._emit(job_id, "director", "running", "콘셉트를 기획하고 있습니다...")

            brief = self.agents["director"].run({
                "topic": topic,
                "style": style,
                "duration_target": duration_target
            })

            self._emit(job_id, "director", "done",
                       f"콘셉트 확정: {brief.get('concept', '')[:50]}")

            # ===== STEP 2: Writer =====
            self._emit(job_id, "writer", "running", "스크립트를 작성하고 있습니다...")

            script = self.agents["writer"].run(brief)

            script_len = len(script.get("full_script", ""))
            self._emit(job_id, "writer", "done",
                       f"스크립트 완성 ({script_len}자)")

            # ===== STEP 3: Researcher + Voice (PARALLEL) =====
            self._emit(job_id, "researcher", "running", "영상 소스를 찾고 있습니다...")
            self._emit(job_id, "voice", "running", "나레이션을 녹음하고 있습니다...")

            # Prepare inputs
            researcher_input = {
                "search_keywords": script.get("search_keywords", []),
                "title": script.get("title", ""),
                "output_dir": os.path.join(output_dir, "clips"),
                "max_videos": video_config.get("max_videos", 30)
            }

            voice_input = {
                "full_script": script.get("full_script", ""),
                "output_path": os.path.join(output_dir, "narration.mp3"),
                "voice": self.config.get("voice", {}).get("ko", "ko-KR-SunHiNeural"),
                "segment_texts": [s["text"] for s in script.get("script_segments", [])]
            }

            # Run in parallel using ThreadPoolExecutor
            with ThreadPoolExecutor(max_workers=2) as executor:
                media_future = executor.submit(self.agents["researcher"].run, researcher_input)
                audio_future = executor.submit(self.agents["voice"].run, voice_input)

                media = media_future.result()
                audio = audio_future.result()

            clip_count = len(media.get("video_clips", []))
            self._emit(job_id, "researcher", "done", f"영상 {clip_count}개 확보")
            self._emit(job_id, "voice", "done",
                       f"나레이션 완료 ({audio.get('duration', 0):.1f}초)")

            # ===== STEP 4: Editor =====
            self._emit(job_id, "editor", "running", "영상을 합성하고 있습니다...")

            # Safe filename
            title = script.get("title", "shorts")
            safe_title = "".join(c for c in title if c.isalnum() or c in " _-").strip()[:50]
            if not safe_title:
                safe_title = "shorts"
            output_path = os.path.join(output_dir, f"{safe_title}.mp4")

            editor_input = {
                "script": script,
                "media": media,
                "audio": audio,
                "output_path": output_path,
                "width": video_config.get("width", 1080),
                "height": video_config.get("height", 1920),
                "clip_duration": video_config.get("clip_duration", 2.5)
            }

            result = self.agents["editor"].run(editor_input)

            elapsed = time.time() - start_time
            self._emit(job_id, "editor", "done",
                       f"완성! ({result.get('duration', 0):.1f}초, {result.get('file_size', 0) / 1024 / 1024:.1f}MB)")

            # Store result
            result["elapsed"] = round(elapsed, 1)
            result["brief"] = brief
            result["script"] = script

            self.jobs[job_id]["status"] = "completed"
            self.jobs[job_id]["result"] = result

        except Exception as e:
            import traceback
            error_msg = str(e)
            traceback.print_exc()
            self._emit(job_id, "error", "error", error_msg)
            self.jobs[job_id]["status"] = "error"
            self.jobs[job_id]["error"] = error_msg

    def get_job(self, job_id: str) -> dict:
        return self.jobs.get(job_id)

    def get_events(self, job_id: str, since_index: int = 0) -> list:
        job = self.jobs.get(job_id)
        if not job:
            return []
        return job["events"][since_index:]
