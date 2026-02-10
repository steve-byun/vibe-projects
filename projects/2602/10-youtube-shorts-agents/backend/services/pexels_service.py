"""Pexels 영상 검색/다운로드 서비스"""
import requests
import os
import time


class PexelsService:
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = "https://api.pexels.com"
        self.headers = {"Authorization": api_key}

    def search_videos(self, query: str, orientation: str = "portrait", per_page: int = 5) -> list:
        url = f"{self.base_url}/videos/search"
        params = {
            "query": query,
            "orientation": orientation,
            "per_page": per_page,
            "size": "medium"
        }

        response = requests.get(url, headers=self.headers, params=params)
        if response.status_code != 200:
            print(f"Pexels API error: {response.status_code}")
            return []

        data = response.json()
        videos = []

        for video in data.get("videos", []):
            video_files = video.get("video_files", [])
            best_file = None
            for vf in video_files:
                if vf.get("quality") in ["hd", "sd"]:
                    if best_file is None or vf.get("height", 0) > best_file.get("height", 0):
                        best_file = vf

            if best_file:
                videos.append({
                    "pexels_id": video["id"],
                    "url": best_file["link"],
                    "width": best_file.get("width", 0),
                    "height": best_file.get("height", 0),
                    "duration": video.get("duration", 0)
                })

        return videos

    def download_video(self, url: str, output_path: str, max_retries: int = 3) -> str:
        for attempt in range(max_retries):
            try:
                response = requests.get(url, stream=True, timeout=30)
                if response.status_code != 200:
                    raise Exception(f"HTTP {response.status_code}")

                with open(output_path, "wb") as f:
                    for chunk in response.iter_content(chunk_size=8192):
                        f.write(chunk)
                return output_path
            except Exception as e:
                if attempt < max_retries - 1:
                    time.sleep(2 ** attempt)
                    continue
                raise e

    def search_and_download(self, keywords: list, output_dir: str, max_videos: int = 30) -> list:
        os.makedirs(output_dir, exist_ok=True)
        downloaded = []
        downloaded_ids = set()

        videos_per_keyword = max(5, max_videos // max(len(keywords), 1) + 2)

        for keyword in keywords:
            if len(downloaded) >= max_videos:
                break

            videos = self.search_videos(keyword, per_page=videos_per_keyword)

            for video in videos:
                if len(downloaded) >= max_videos:
                    break
                if video["pexels_id"] in downloaded_ids:
                    continue

                output_path = os.path.join(output_dir, f"bg_{len(downloaded)}_{video['pexels_id']}.mp4")

                try:
                    self.download_video(video["url"], output_path)
                    downloaded.append({
                        "path": output_path,
                        "pexels_id": video["pexels_id"],
                        "keyword": keyword,
                        "duration": video["duration"],
                        "width": video["width"],
                        "height": video["height"]
                    })
                    downloaded_ids.add(video["pexels_id"])
                    print(f"Downloaded [{len(downloaded)}/{max_videos}]: {keyword} -> {video['pexels_id']}")
                except Exception as e:
                    print(f"Download error: {keyword} - {e}")

        return downloaded
