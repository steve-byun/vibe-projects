"""YouTube Shorts Factory - 웹 서버"""
import os
import sys
import json
import time
from flask import Flask, request, jsonify, Response, send_from_directory
from flask_cors import CORS

# Add backend to path
sys.path.insert(0, os.path.dirname(__file__))

from pipeline.orchestrator import ShortsOrchestrator

app = Flask(__name__, static_folder='../frontend', static_url_path='')
CORS(app)

# Load config
CONFIG_PATH = os.path.join(os.path.dirname(__file__), "config.json")

def load_config():
    with open(CONFIG_PATH, 'r', encoding='utf-8') as f:
        return json.load(f)

def save_config(config):
    with open(CONFIG_PATH, 'w', encoding='utf-8') as f:
        json.dump(config, f, indent=4, ensure_ascii=False)

config = load_config()
orchestrator = ShortsOrchestrator(config)

@app.route('/')
def index():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/health')
def health():
    return jsonify({"status": "ok", "message": "Shorts Factory 가동 중"})

@app.route('/config', methods=['GET'])
def get_config():
    cfg = load_config()
    # Mask API keys
    masked = dict(cfg)
    for key_name in ["anthropic_api_key", "gemini_api_key", "pexels_api_key"]:
        if masked.get(key_name) and not masked[key_name].startswith("YOUR_"):
            val = masked[key_name]
            masked[key_name] = val[:8] + "***" if len(val) > 8 else "***"
    return jsonify(masked)

@app.route('/config', methods=['POST'])
def update_config():
    global config, orchestrator
    updates = request.json
    cfg = load_config()

    # Update only provided fields
    for key in ["ai_provider", "anthropic_api_key", "gemini_api_key", "pexels_api_key",
                 "claude_model", "gemini_model"]:
        if key in updates and updates[key] and not updates[key].endswith("***"):
            cfg[key] = updates[key]

    if "voice" in updates:
        cfg["voice"] = updates["voice"]
    if "video" in updates:
        cfg["video"].update(updates["video"])

    save_config(cfg)
    config = cfg
    orchestrator = ShortsOrchestrator(config)

    return jsonify({"status": "ok", "message": "설정이 저장되었습니다"})

@app.route('/generate', methods=['POST'])
def generate():
    data = request.json or {}
    topic = data.get("topic", "")
    style = data.get("style", "정보형")
    duration = data.get("duration_target", 50)

    if not topic:
        return jsonify({"error": "주제를 입력해주세요"}), 400

    job_id = orchestrator.start_job(topic, style, duration)
    return jsonify({"job_id": job_id})

@app.route('/generate/<job_id>/stream')
def stream(job_id):
    """SSE 엔드포인트 - 실시간 진행 상황"""
    def event_stream():
        last_index = 0
        while True:
            job = orchestrator.get_job(job_id)
            if not job:
                yield f"event: error\ndata: {json.dumps({'message': 'Job not found'})}\n\n"
                break

            # Send new events
            events = orchestrator.get_events(job_id, last_index)
            for event in events:
                yield f"event: progress\ndata: {json.dumps(event, ensure_ascii=False)}\n\n"
                last_index += 1

            # Check if job is done
            if job["status"] == "completed":
                result = job["result"]
                # Convert path to relative URL
                if result and "video_path" in result:
                    result = dict(result)
                    result["video_url"] = f"/output/{job_id}/{os.path.basename(result['video_path'])}"
                yield f"event: complete\ndata: {json.dumps(result, ensure_ascii=False)}\n\n"
                break
            elif job["status"] == "error":
                yield f"event: error\ndata: {json.dumps({'message': job.get('error', 'Unknown error')})}\n\n"
                break

            time.sleep(0.5)

    return Response(event_stream(), mimetype='text/event-stream',
                   headers={'Cache-Control': 'no-cache', 'X-Accel-Buffering': 'no'})

@app.route('/generate/<job_id>/result')
def get_result(job_id):
    job = orchestrator.get_job(job_id)
    if not job:
        return jsonify({"error": "Job not found"}), 404

    if job["status"] == "completed":
        return jsonify(job["result"])
    elif job["status"] == "error":
        return jsonify({"error": job.get("error")}), 500
    else:
        return jsonify({"status": "running"}), 202

@app.route('/output/<path:filename>')
def serve_output(filename):
    """생성된 영상 파일 서빙"""
    output_dir = os.path.join(os.path.dirname(__file__),
                              config.get("output_folder", "./output"))
    return send_from_directory(output_dir, filename)

@app.route('/open-folder', methods=['POST'])
def open_folder():
    """출력 폴더 열기"""
    output_dir = os.path.join(os.path.dirname(__file__),
                              config.get("output_folder", "./output"))
    output_dir = os.path.abspath(output_dir)
    os.makedirs(output_dir, exist_ok=True)

    if sys.platform == 'win32':
        os.startfile(output_dir)

    return jsonify({"status": "ok", "path": output_dir})

if __name__ == '__main__':
    server_config = config.get("server", {})
    host = server_config.get("host", "127.0.0.1")
    port = server_config.get("port", 5000)

    print(f"\n{'='*50}")
    print(f"  SHORTS FACTORY")
    print(f"  http://{host}:{port}")
    print(f"{'='*50}\n")

    app.run(host=host, port=port, debug=False, threaded=True)
