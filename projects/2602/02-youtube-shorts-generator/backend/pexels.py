"""Pexels API 영상 검색 모듈"""
import requests
import os
import json

class PexelsClient:
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = "https://api.pexels.com"
        self.headers = {"Authorization": api_key}

    def search_videos(self, query: str, orientation: str = "portrait", per_page: int = 5) -> list:
        """비디오 검색"""
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
            # HD 품질 우선, 없으면 SD
            video_files = video.get("video_files", [])

            # 세로 영상 (9:16) 우선 선택
            best_file = None
            for vf in video_files:
                if vf.get("quality") in ["hd", "sd"]:
                    if best_file is None or vf.get("height", 0) > best_file.get("height", 0):
                        best_file = vf

            if best_file:
                videos.append({
                    "id": video["id"],
                    "url": best_file["link"],
                    "width": best_file.get("width"),
                    "height": best_file.get("height"),
                    "duration": video.get("duration")
                })

        return videos

    def download_video(self, url: str, output_path: str) -> str:
        """비디오 다운로드"""
        response = requests.get(url, stream=True)

        if response.status_code != 200:
            raise Exception(f"Download failed: {response.status_code}")

        with open(output_path, "wb") as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)

        return output_path

    def get_videos_for_keywords(self, keywords: list, output_dir: str, max_videos: int = 3) -> list:
        """키워드 목록으로 영상 검색 및 다운로드 (돌려쓰기 방지를 위해 충분히 다운로드)"""
        downloaded = []
        downloaded_ids = set()  # 중복 방지

        # 키워드당 더 많은 영상 검색
        videos_per_keyword = max(5, max_videos // len(keywords) + 2) if keywords else 10

        for i, keyword in enumerate(keywords):
            if len(downloaded) >= max_videos:
                break

            # 키워드당 더 많은 영상 검색
            videos = self.search_videos(keyword, per_page=videos_per_keyword)

            for video in videos:
                if len(downloaded) >= max_videos:
                    break

                # 중복 방지
                if video['id'] in downloaded_ids:
                    continue

                output_path = os.path.join(output_dir, f"bg_{len(downloaded)}_{video['id']}.mp4")

                try:
                    self.download_video(video["url"], output_path)
                    downloaded.append({
                        "path": output_path,
                        "duration": video["duration"],
                        "keyword": keyword
                    })
                    downloaded_ids.add(video['id'])
                    print(f"Downloaded [{len(downloaded)}/{max_videos}]: {keyword} -> {video['id']}")
                except Exception as e:
                    print(f"Download error for {keyword}: {e}")

        return downloaded

if __name__ == "__main__":
    # 테스트 (API 키 필요)
    with open("config.json") as f:
        config = json.load(f)

    client = PexelsClient(config["pexels_api_key"])
    videos = client.search_videos("space galaxy", per_page=3)
    print(f"Found {len(videos)} videos")
    for v in videos:
        print(f"  - {v['id']}: {v['width']}x{v['height']}, {v['duration']}s")
