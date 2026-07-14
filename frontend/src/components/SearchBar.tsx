
import React, { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useBooks } from '../context/BookContext';

export const SearchBar: React.FC = () => {
  const { searchTerm, setSearchTerm } = useBooks();
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleClear = () => {
    setSearchTerm('');
    inputRef.current?.focus();
  };

  return (
    <div className={`relative ${isFocused ? 'ring-2 ring-offset-2 ring-primary/50 ring-offset-background' : ''}`}>
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Search className="w-4 h-4 text-muted-foreground" />
      </div>
      <input
        ref={inputRef}
        type="search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder="Search by title or author..."
        className="block w-full py-2.5 pl-10 pr-10 bg-secondary/50 border-0 rounded-lg focus:outline-none focus:ring-0 text-sm placeholder:text-muted-foreground"
      />
      {searchTerm && (
        <button
          onClick={handleClear}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
        >
          <X className="w-4 h-4" />
        </button>
      )}
      <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden md:inline-flex items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
        <span className="text-xs">⌘</span>K
      </kbd>
    </div>
  );
};
