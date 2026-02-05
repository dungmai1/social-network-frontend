"use client";

import { Search, X, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import useSearchUser from "@/hooks/useSearchUser";
import Link from "next/link";

export default function SearchBar() {
  const { searchResults, isLoading, searchQuery, handleSearch, clearSearch } =
    useSearchUser();
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const searchRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    // Debounce search
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      handleSearch(value);
    }, 300);

    // Update UI immediately
    if (value.trim()) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
      clearSearch();
    }
  };

  const handleClear = () => {
    clearSearch();
    setIsOpen(false);
    setInputValue("");
  };

  const handleResultClick = () => {
    setIsOpen(false);
    handleClear();
  };

  return (
    <div ref={searchRef} className="relative">
      {/* Search Input */}
      <div className="flex items-center bg-muted/50 border border-border rounded-xl px-4 py-2.5 w-64 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
        <Search size={18} className="text-muted-foreground mr-3" />
        <input
          className="bg-transparent outline-none w-full text-sm text-foreground placeholder:text-muted-foreground"
          placeholder="Search users..."
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => searchQuery && setIsOpen(true)}
        />
        {isLoading ? (
          <Loader2 size={16} className="text-primary animate-spin" />
        ) : (
          inputValue && (
            <button
              onClick={handleClear}
              className="p-1 hover:bg-accent rounded-full transition-colors cursor-pointer"
            >
              <X size={14} className="text-muted-foreground" />
            </button>
          )
        )}
      </div>

      {/* Dropdown Results */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 glass-card rounded-xl shadow-xl max-h-80 overflow-y-auto z-50 scrollbar-thin">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center gap-2">
                <Loader2 size={20} className="text-primary animate-spin" />
                <span className="text-sm text-muted-foreground">
                  Searching...
                </span>
              </div>
            </div>
          ) : searchResults.length > 0 ? (
            <div className="py-2">
              {searchResults.map((user) => (
                <Link
                  key={user.id}
                  href={`/profile/${user.username}`}
                  onClick={handleResultClick}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-accent/50 transition-colors cursor-pointer"
                >
                  <img
                    src={
                      user.avatar ||
                      `https://picsum.photos/seed/${user.username}/80`
                    }
                    alt={user.username}
                    className="w-11 h-11 rounded-full object-cover ring-2 ring-primary/20"
                  />
                  <div className="flex flex-col min-w-0">
                    <span className="font-semibold text-sm text-foreground truncate">
                      {user.username}
                    </span>
                    {user.displayname && (
                      <span className="text-xs text-muted-foreground truncate">
                        {user.displayname}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center">
              <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-3">
                <Search size={20} className="text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">No results found</p>
              <p className="text-xs text-muted-foreground/70 mt-1">
                Try searching for a different name
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
