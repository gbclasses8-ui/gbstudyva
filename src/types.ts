export interface Batch {
  id: number | string;
  title: string;
  thumbnail: string;
  category: 'class12' | 'class11' | 'dropper' | 'modules';
  classLabel: string;
  description: string;
  totalVideos?: number;
  totalPdfs?: number;
  faculties?: string[];
}

export interface FolderItem {
  id: string;
  parent_id: string;
  Title: string;
  description?: string;
  material_type: 'FOLDER' | 'VIDEO' | 'PDF' | 'IMAGE' | 'NOTES';
  thumbnail?: string;
  file_link?: string;
  pdf_link?: string;
  pdf_link2?: string;
  download_link?: string;
  download_links?: Array<{ resolution?: string; url?: string; bitrate?: string }>;
  videos_count?: string;
  files_count?: string;
  tests_count?: string;
  duration?: string;
  duration_in_secs?: string;
  date_and_time?: string;
  event_date?: string;
  course_id?: string;
  live_status?: number;
}

export interface VideoQuality {
  quality: string;
  url: string;
  player_url?: string;
}

export interface VideoDetail {
  success: boolean;
  video_id: string;
  course_id: string;
  title: string;
  duration?: string;
  thumbnail?: string;
  date?: string;
  decoded_video_link?: string;
  player_url?: string;
  qualities?: VideoQuality[];
  pdf_viewer?: string | null;
  pdf_viewer2?: string | null;
  decoded_pdf_link?: string | null;
  decoded_pdf_link2?: string | null;
}

export interface BreadcrumbCrumb {
  id: string;
  title: string;
}
