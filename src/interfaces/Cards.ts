export interface DownloadCardProps {
  downloadId: string;
  videoTitle: string;
  videoLink: string;
  duration: number;
  size: number;
  createdAt: Date;
  remainingAge: Date;
}

export interface DownloadConvertEvent {
  isDownloading: number;
  downloadProgress: number;
  isConverting: number;
  convertProgress: number;
}
