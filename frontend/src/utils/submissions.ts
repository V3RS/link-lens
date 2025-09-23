import { Submission } from '../types';
import { SUBMISSION } from '../constants';

export const generateSubmissionId = (): string => {
  return `${SUBMISSION.ID_PREFIX}${Date.now()}`;
};

export const createNewSubmission = (url: string): Submission => ({
  id: generateSubmissionId(),
  url,
  status: 'queued',
  createdAt: new Date().toISOString(),
});

export const updateSubmissionById = (
  submissions: Submission[],
  id: string,
  updates: Partial<Submission>
): Submission[] => {
  return submissions.map(sub => 
    sub.id === id ? { ...sub, ...updates } : sub
  );
};

export const replaceFirstSubmission = (
  submissions: Submission[],
  newSubmission: Submission
): Submission[] => {
  const updated = [...submissions];
  updated.shift();
  updated.unshift(newSubmission);
  return updated;
};
