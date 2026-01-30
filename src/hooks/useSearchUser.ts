import { searchUsers } from "@/services/user.service";
import { UserModel } from "@/types/user";
import { useState, useCallback } from "react";

export default function useSearchUser() {
  const [searchResults, setSearchResults] = useState<UserModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = useCallback(async (query: string) => {
    setSearchQuery(query);

    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const results = await searchUsers(query);
      setSearchResults(results || []);
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearSearch = useCallback(() => {
    setSearchQuery("");
    setSearchResults([]);
  }, []);

  return {
    searchResults,
    isLoading,
    searchQuery,
    handleSearch,
    clearSearch,
  };
}
