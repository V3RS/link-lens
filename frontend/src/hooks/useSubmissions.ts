import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { Submission } from '../types';
import { useLocalStorage } from './useLocalStorage';
import { fetchOpenGraphData, generateMockData } from '../services/submissionService';
import { STORAGE_KEYS, SUBMISSION } from '../constants';
import {
  isValidUrl,
  createNewSubmission,
  updateSubmissionById,
  replaceFirstSubmission,
} from '../utils';

export function useSubmissions() {
  const [submissions, setSubmissions] = useLocalStorage<Submission[]>(
    STORAGE_KEYS.SUBMISSIONS,
    []
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = useCallback(async (url: string) => {
    if (!isValidUrl(url)) {
      toast.error('Please enter a valid link that starts with http or https.');
      return;
    }

    try {
      const newSubmission = createNewSubmission(url);
      const updatedSubmissions = [newSubmission, ...submissions];
      
      setSubmissions(updatedSubmissions);
      setIsLoading(true);

      setTimeout(() => {
        const processingSubmission = { ...newSubmission, status: 'processing' as const };
        const withProcessing = updateSubmissionById(
          submissions,
          newSubmission.id,
          { status: 'processing' }
        );
        const finalWithProcessing = replaceFirstSubmission(withProcessing, processingSubmission);
        setSubmissions(finalWithProcessing);
      }, SUBMISSION.PROCESSING_DELAY);

      const result = await fetchOpenGraphData(url);
      setIsLoading(false);

      const finalSubmission = { ...newSubmission, ...result };
      const updatedFinal = updateSubmissionById(
        submissions,
        newSubmission.id,
        result
      );
      const finalResult = replaceFirstSubmission(updatedFinal, finalSubmission);
      setSubmissions(finalResult);
    } catch {
      setIsLoading(false);
      const updatedWithError = updateSubmissionById(
        submissions,
        submissions[0].id,
        { status: 'failed', error: SUBMISSION.ERROR_MESSAGE }
      );
      setSubmissions(updatedWithError);
    }
  }, [submissions, setSubmissions]);

  const handleAddMockData = useCallback(() => {
    const mockData = generateMockData();
    const updatedSubmissions = [...mockData, ...submissions];
    setSubmissions(updatedSubmissions);
    toast.success('Added mock data successfully!');
  }, [submissions, setSubmissions]);

  return {
    submissions,
    isLoading,
    handleSubmit,
    handleAddMockData,
  };
}
