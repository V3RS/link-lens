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