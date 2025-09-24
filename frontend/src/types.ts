export type SubmissionStatus = 'queued' | 'processing' | 'complete' | 'no image found' | 'failed';

export interface Submission {
  id: string;
  url: string;
  status: SubmissionStatus;
  title?: string;
  imageUrl?: string;
  error?: string;
  createdAt: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}