import { useState, useCallback, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { Submission, PaginatedResponse, PaginationMeta } from '../types';
import { fetchOpenGraphData } from '../services/submissionService';
import { API, PAGINATION } from '../constants';
import { isValidUrl } from '../utils';

export function useSubmissions() {
  const [latestSubmission, setLatestSubmission] = useState<Submission | null>(null);
  const [historySubmissions, setHistorySubmissions] = useState<Submission[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: PAGINATION.DEFAULT_PAGE,
    limit: PAGINATION.ITEMS_PER_PAGE,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrevious: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isPolling, setIsPolling] = useState(false);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const previousSubmissionsRef = useRef<Submission[]>([]);

  const fetchLatest = useCallback(async () => {
    try {
      const url = new URL(`${API.BASE_URL}/api/submissions`);
      url.searchParams.set('offset', '0');
      url.searchParams.set('limit', '1');

      const response = await fetch(url.toString());
      if (response.ok) {
        const paginatedResponse: PaginatedResponse<any> = await response.json();
        const latestItem = paginatedResponse.data[0];
        if (latestItem) {
          const convertedLatest = API.convertSubmission(latestItem);
          setLatestSubmission(convertedLatest);
          return convertedLatest;
        } else {
          setLatestSubmission(null);
          return null;
        }
      }
    } catch (error) {
      console.error('Failed to fetch latest submission:', error);
    }
    return null;
  }, []);

  const fetchHistoryPage = useCallback(async (page: number = pagination.page) => {
    try {
      // Standard offset calculation: skip latest (1) + previous history pages  
      const offset = 1 + (page - 1) * pagination.limit;
      
      const url = new URL(`${API.BASE_URL}/api/submissions`);
      url.searchParams.set('offset', offset.toString());
      url.searchParams.set('limit', pagination.limit.toString());

      const response = await fetch(url.toString());
      if (response.ok) {
        const paginatedResponse: PaginatedResponse<any> = await response.json();
        const historyItems: Submission[] = paginatedResponse.data.map(API.convertSubmission);
        
        setHistorySubmissions(historyItems);
        
        // Calculate pagination based on total history items (total - 1 for latest)
        const totalHistoryItems = Math.max(0, paginatedResponse.pagination.total - 1);
        const adjustedPagination = {
          page: page,
          limit: pagination.limit,
          total: totalHistoryItems,
          totalPages: Math.ceil(totalHistoryItems / pagination.limit),
          hasNext: offset + pagination.limit < paginatedResponse.pagination.total,
          hasPrevious: page > 1,
        };
        
        setPagination(adjustedPagination);
      }
    } catch (error) {
      console.error('Failed to fetch history submissions:', error);
    }
  }, [pagination.page, pagination.limit]);

  const fetchSubmissions = useCallback(async (page: number = pagination.page) => {
    const latest = await fetchLatest();
    await fetchHistoryPage(page);
    
    if (latest && previousSubmissionsRef.current.length > 0 && page === 1) {
      const previouslyProcessing = previousSubmissionsRef.current.filter(sub => 
        sub.status === 'processing' || sub.status === 'queued'
      );
      
      if (latest.status === 'complete' && 
          previouslyProcessing.some(prev => prev.id === latest.id)) {
        toast.success('URL processed successfully!');
      }
    }
    
    if (latest) {
      previousSubmissionsRef.current = [latest];
    }
  }, [fetchLatest, fetchHistoryPage, pagination.page]);

  const hasActiveSubmissions = useCallback(() => {
    const allSubmissions = latestSubmission ? [latestSubmission, ...historySubmissions] : historySubmissions;
    return allSubmissions.some(sub => sub.status === 'queued' || sub.status === 'processing');
  }, [latestSubmission, historySubmissions]);

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
    if (hasActiveSubmissions()) {
      startPolling();
    } else {
      stopPolling();
    }
  }, [hasActiveSubmissions, startPolling, stopPolling]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  useEffect(() => {
    return () => stopPolling();
  }, [stopPolling]);

  const handlePageChange = useCallback((page: number) => {
    fetchHistoryPage(page);
  }, [fetchHistoryPage]);

  const handleSubmit = useCallback(async (url: string) => {
    if (!isValidUrl(url)) {
      toast.error('Please enter a valid link that starts with http or https.');
      return;
    }

    setIsLoading(true);
    try {
      await fetchOpenGraphData(url);
      await fetchSubmissions(1);
      toast.success('URL submitted successfully!');
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('Failed to submit URL. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [fetchSubmissions]);


  return {
    latestSubmission,
    historySubmissions,
    pagination,
    isLoading,
    isPolling,
    handleSubmit,
    handlePageChange,
    refreshSubmissions: fetchSubmissions,
  };
}
