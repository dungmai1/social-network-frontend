"use client";

import { Search, X, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import useSearchUser from "@/hooks/useSearchUser";
import Link from "next/link";

export default function SearchBar() {
  const { searchResults, isLoading, searchQuery, handleSearch, clearSearch } =
    useSearchUser();
  const [isOpen, setIsOpen] = useState(false);
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
    const input = searchRef.current?.querySelector("input");
    if (input) {
      input.value = "";
    }
  };

  const handleResultClick = () => {
    setIsOpen(false);
    handleClear();
  };

  return (
    <div ref={searchRef} className="relative">
      {/* Search Input */}
      <div className="flex items-center bg-gray-100 rounded-lg px-4 py-2 w-64">
        <Search size={16} className="text-gray-400 mr-2" />
        <input
          className="bg-transparent outline-none w-full text-sm text-gray-800 placeholder-gray-400"
          placeholder="Search"
          onChange={handleInputChange}
          onFocus={() => searchQuery && setIsOpen(true)}
        />
        {isLoading ? (
          <Loader2 size={16} className="text-gray-400 animate-spin" />
        ) : (
          searchQuery && (
            <button
              onClick={handleClear}
              className="p-0.5 hover:bg-gray-200 rounded-full"
            >
              <X size={14} className="text-gray-400" />
            </button>
          )
        )}
      </div>

      {/* Dropdown Results */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 max-h-80 overflow-y-auto z-50">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 size={24} className="text-gray-400 animate-spin" />
            </div>
          ) : searchResults.length > 0 ? (
            <div className="py-2">
              {searchResults.map((user) => (
                <Link
                  key={user.id}
                  href={`/profile/${user.username}`}
                  onClick={handleResultClick}
                  className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition"
                >
                  <img
                    src={user.avatar || "/default-avatar.png"}
                    alt={user.username}
                    className="w-10 h-10 rounded-full object-cover border border-gray-200"
                  />
                  <div className="flex flex-col">
                    <span className="font-semibold text-sm text-gray-900">
                      {user.username}
                    </span>
                    {user.displayname && (
                      <span className="text-xs text-gray-500">
                        {user.displayname}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-gray-500 text-sm">
              No results found
            </div>
          )}
        </div>
      )}
    </div>
  );
}
