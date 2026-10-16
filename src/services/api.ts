import { FolderItem, VideoDetail } from '../types';

const BASE_API = 'https://studybeepro.site';

// In-memory cache for folder contents to make navigation lightning fast
const folderCache = new Map<string, FolderItem[]>();
const videoDetailsCache = new Map<string, VideoDetail>();

export async function fetchFolderContents(
  courseId: string | number,
  parentId: string | number = '-1'
): Promise<FolderItem[]> {
  const cacheKey = `${courseId}_${parentId}`;
  if (folderCache.has(cacheKey)) {
    return folderCache.get(cacheKey)!;
  }

  const url = `${BASE_API}/get/folder_contentsv3?course_id=${courseId}&parent_id=${parentId}&start=0`;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Failed to load contents (status: ${response.status})`);
  }

  const json = await response.json();
  if (json.status === 200 && Array.isArray(json.data)) {
    folderCache.set(cacheKey, json.data);
    return json.data;
  } else {
    throw new Error(json.message || 'Unable to retrieve folder contents');
  }
}

export async function fetchVideoDetails(
  courseId: string | number,
  videoId: string | number
): Promise<VideoDetail> {
  const cacheKey = `${courseId}_${videoId}`;
  if (videoDetailsCache.has(cacheKey)) {
    return videoDetailsCache.get(cacheKey)!;
  }

  const url = `${BASE_API}/get/fetchVideoDetailsById?course_id=${courseId}&video_id=${videoId}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Video fetch error (status: ${response.status})`);
  }

  const json = await response.json();
  if (json && json.success) {
    videoDetailsCache.set(cacheKey, json);
    return json as VideoDetail;
  } else {
    throw new Error(json.error || 'Failed to get video streaming details');
  }
}

export function buildProxyStreamUrl(rawUrl: string): string {
  if (!rawUrl) return '';
  return `${BASE_API}/proxy?url=${encodeURIComponent(rawUrl)}`;
}

export function buildProxyPdfUrl(rawUrl: string): string {
  if (!rawUrl) return '';
  return `${BASE_API}/pdf?url=${encodeURIComponent(rawUrl)}`;
}
