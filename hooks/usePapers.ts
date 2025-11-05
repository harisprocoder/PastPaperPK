
import { useState, useEffect, useCallback } from 'react';
import { Paper } from '../types';
import { getPapersFromIndex, setPapersToIndex } from '../services/localCache';
import { listAllPapers, getPaperUrl } from '../services/firebase';

export const usePapers = () => {
  const [papers, setPapers] = useState<Paper[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const fetchAndCachePapers = useCallback(async () => {
    setError('');
    setLoading(true);
    try {
      const remotePapers = await listAllPapers();
      // Fetch URLs in parallel
      const papersWithUrls = await Promise.all(
        remotePapers.map(async (paper) => {
          const url = await getPaperUrl(paper.path);
          return { ...paper, url };
        })
      );
      setPapersToIndex(papersWithUrls);
      setPapers(papersWithUrls);
    } catch (err: any) {
      console.error('Failed to fetch papers from Firebase:', err);
      setError('Could not fetch papers from the server. Please check your connection and try again.');
      setPapers([]); // Set to empty array on error
    } finally {
      setLoading(false);
    }
  }, []);
  
  useEffect(() => {
    const loadPapers = async () => {
      setLoading(true);
      setError('');
      const cachedPapers = getPapersFromIndex();
      if (cachedPapers && cachedPapers.length > 0) {
        setPapers(cachedPapers);
        setLoading(false);
      } else {
        await fetchAndCachePapers();
      }
    };

    loadPapers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refreshPapers = useCallback(async () => {
    await fetchAndCachePapers();
  }, [fetchAndCachePapers]);

  return { papers, loading, error, refreshPapers };
};
