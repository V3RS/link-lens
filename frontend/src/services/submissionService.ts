import { Submission } from '../types';
import { API } from '../constants';

export const fetchOpenGraphData = async (url: string): Promise<Partial<Submission>> => {
  const response = await fetch(`${API.BASE_URL}/api/submissions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url }),
  });

  if (!response.ok) {
    throw new Error('Failed to submit URL');
  }

  const data = await response.json();
  
  return {
    status: API.STATUS_MAP[data.status as keyof typeof API.STATUS_MAP] || 'failed',
    title: data.ogTitle || null,
    imageUrl: data.ogImageUrl || null,
    error: data.error || null
  };
};

