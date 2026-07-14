
import React from 'react';
import { X } from 'lucide-react';
import { useBooks } from '../context/BookContext';

export const BookFilter: React.FC = () => {
  const { selectedGenres, setSelectedGenres, getAllGenres } = useBooks();
  const genres = getAllGenres();

  const toggleGenre = (genre: string) => {
    setSelectedGenres(
      selectedGenres.includes(genre)
        ? selectedGenres.filter((g) => g !== genre)
        : [...selectedGenres, genre]
    );
  };

  const clearFilters = () => {
    setSelectedGenres([]);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Filter by Genre</h3>
        {selectedGenres.length > 0 && (
          <button
            onClick={clearFilters}
            className="text-xs text-muted-foreground hover:text-primary flex items-center"
          >
            <X className="w-3 h-3 mr-1" />
            Clear
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {genres.map((genre) => (
          <button
            key={genre}
            onClick={() => toggleGenre(genre)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              selectedGenres.includes(genre)
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
            }`}
          >
            {genre}
          </button>
        ))}
      </div>
    </div>
  );
};
