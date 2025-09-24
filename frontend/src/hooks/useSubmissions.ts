import { useState, useCallback, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { Submission } from '../types';
import { fetchOpenGraphData } from '../services/submissionService';
import { API } from '../constants';
import { isValidUrl } from '../utils';

export function useSubmissions() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPolling, setIsPolling] = useState(false);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const previousSubmissionsRef = useRef<Submission[]>([]);

  const fetchSubmissions = useCallback(async () => {
    try {
      const response = await fetch(`${API.BASE_URL}/api/submissions`);
      if (response.ok) {
        const data = await response.json();
        const convertedSubmissions: Submission[] = data.map(API.convertSubmission);
        
        const previousSubmissions = previousSubmissionsRef.current;
        if (previousSubmissions.length > 0) {
          const previouslyProcessing = previousSubmissions.filter(sub => 
            sub.status === 'processing' || sub.status === 'queued'
          );
          const nowCompleted = convertedSubmissions.filter(sub => 
            sub.status === 'complete' && 
            previouslyProcessing.some(prev => prev.id === sub.id)
          );
          
          if (nowCompleted.length > 0) {
            toast.success(`${nowCompleted.length} URL${nowCompleted.length === 1 ? '' : 's'} processed successfully!`);
          }
        }
        
        previousSubmissionsRef.current = convertedSubmissions;
        setSubmissions(convertedSubmissions);
      }
    } catch (error) {
      console.error('Failed to fetch submissions:', error);
    }
  }, []);

  const hasActiveSubmissions = useCallback((subs: Submission[]) => {
    return subs.some(sub => sub.status === 'queued' || sub.status === 'processing');
  }, []);

  const startPolling = useCallback(() => {
    if (pollingRef.current) return;

    setIsPolling(true);
    pollingRef.current = setInterval(() => {
      fetchSubmissions();
    }, 2000);
  }, [fetchSubmissions]);

  const stopPolling = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
      setIsPolling(false);
    }
  }, []);

  useEffect(() => {
    if (hasActiveSubmissions(submissions)) {
      startPolling();
    } else {
      stopPolling();
    }
  }, [submissions, hasActiveSubmissions, startPolling, stopPolling]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  useEffect(() => {
    return () => stopPolling();
  }, [stopPolling]);

  const handleSubmit = useCallback(async (url: string) => {
    if (!isValidUrl(url)) {
      toast.error('Please enter a valid link that starts with http or https.');
      return;
    }

    setIsLoading(true);
    try {
      await fetchOpenGraphData(url);
      await fetchSubmissions();
      toast.success('URL submitted successfully!');
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('Failed to submit URL. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [fetchSubmissions]);


  return {
    submissions,
    isLoading,
    isPolling,
    handleSubmit,
    refreshSubmissions: fetchSubmissions,
  };
}
