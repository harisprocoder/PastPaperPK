
import { Paper } from '../types';

const PAPERS_KEY = 'pastpaperpk_papers';
const RECENTLY_VIEWED_KEY = 'pastpaperpk_recently_viewed';
const MAX_RECENTLY_VIEWED = 10;

// --- Paper Index Cache ---

export const getPapersFromIndex = (): Paper[] | null => {
  try {
    const storedPapers = localStorage.getItem(PAPERS_KEY);
    return storedPapers ? JSON.parse(storedPapers) : null;
  } catch (error) {
    console.error("Failed to read papers from local cache", error);
    return null;
  }
};

export const setPapersToIndex = (papers: Paper[]): void => {
  try {
    localStorage.setItem(PAPERS_KEY, JSON.stringify(papers));
  } catch (error) {
    console.error("Failed to save papers to local cache", error);
  }
};

export const addPaperToIndex = (paper: Paper): void => {
  const papers = getPapersFromIndex() || [];
  const updatedPapers = [paper, ...papers];
  setPapersToIndex(updatedPapers);
};

// --- Recently Viewed Cache ---

export const getRecentlyViewed = (): Paper[] => {
    try {
        const stored = localStorage.getItem(RECENTLY_VIEWED_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error("Failed to read recently viewed from local cache", error);
        return [];
    }
};

export const addRecentlyViewed = (paper: Paper): Paper[] => {
    try {
        let viewed = getRecentlyViewed();
        // Remove existing entry to move it to the top
        viewed = viewed.filter(p => p.id !== paper.id);
        // Add new paper to the front
        viewed.unshift(paper);
        // Limit the list size
        const updatedViewed = viewed.slice(0, MAX_RECENTLY_VIEWED);
        localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(updatedViewed));
        return updatedViewed;
    } catch (error) {
        console.error("Failed to save recently viewed to local cache", error);
        return getRecentlyViewed(); // return existing on error
    }
};
