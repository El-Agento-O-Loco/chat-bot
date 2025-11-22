import { KEYWORDS } from './constants';

// Node Extraction Logic
export const extractKeywords = (text: string): string[] => {
  const found: string[] = [];
  KEYWORDS.forEach(kw => {
    if (text.toLowerCase().includes(kw.toLowerCase())) {
      found.push(kw);
    }
  });
  return found;
};

// Action Item Extraction Logic (Regex)
export const detectActionItems = (text: string): string | null => {
  const patterns = [
    /I will (.*)/i,
    /We need to (.*)/i,
    /Don't forget to (.*)/i,
    /Please (.*)/i,
    /Action item: (.*)/i
  ];

  for (let pattern of patterns) {
    const match = text.match(pattern);
    if (match) return match[1]; // Return the captured group
  }
  return null;
};
