import { useEffect, useState } from "react";

const SEARCH_HISTORY_KEY = "parsley_search_history";
const MAX_HISTORY_ITEMS = 5;

/**
 * Hook to manage search history and integrate with search suggestions.
 * Stores up to 10 recent searches in localStorage and combines them with existing suggestions.
 * @returns An object containing:
 *   - searchHistory: Array of recent searches
 *   - addToHistory: Function to add a search to history
 *   - combineWithSuggestions: Function to combine history with suggestions
 */
export const useSearchHistory = () => {
  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(SEARCH_HISTORY_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(searchHistory));
    } catch (error) {
      console.error("Failed to save search history:", error);
    }
  }, [searchHistory]);

  const addToHistory = (search: string) => {
    if (!search.trim()) return;

    setSearchHistory((prevHistory) => {
      // Remove the search term if it already exists
      const filteredHistory = prevHistory.filter((item) => item !== search);
      // Add the new search term to the beginning
      const newHistory = [search, ...filteredHistory];
      // Keep only the most recent MAX_HISTORY_ITEMS
      return newHistory.slice(0, MAX_HISTORY_ITEMS);
    });
  };

  const combineWithSuggestions = (suggestions: string[] = []): string[] =>
    // Combine existing suggestions with search history, removing duplicates
    [...new Set([...searchHistory, ...suggestions])];

  return {
    addToHistory,
    combineWithSuggestions,
    searchHistory,
  };
};

// Export constants for testing
export const __testing__ = {
  MAX_HISTORY_ITEMS,
  SEARCH_HISTORY_KEY,
};
