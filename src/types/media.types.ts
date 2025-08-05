export interface MediaCategory {
  id: number;
  name: string;
  url: string;
}

export interface FileShowResponse {
  id?: number;
  file: string;
  filename: string;
  fileCategoryId: string | null;
  fileCategoryName: string;
  alternativeText: string;
  title: string;
  caption: string;
  description: string;
  size: string;
  width: number;
  height: number;
  url: string;
  thumbnailUrl: string;
  createdAt: string;
}

export interface File {
  id: number;
  filename: string;
  width: number;
  height: number;
  imageUrl: string;
  thumbnailUrl: string;
}
