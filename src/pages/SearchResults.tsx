import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { searchMovies, getImageUrl } from '../services/tmdb';
import { MovieGrid } from '../components/MovieGrid';
import { useDebounce } from '../hooks/useDebounce';

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  release_date?: string;
  overview?: string;
}

export function SearchResults() {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [suggestions, setSuggestions] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!debouncedQuery.trim()) {
        setSuggestions([]);
        return;
      }

      try {
        const response = await searchMovies(debouncedQuery);
        const results = response.data.results
          .filter((movie: Movie) => movie.poster_path)
          .slice(0, 5);
        setSuggestions(results);
      } catch (error) {
        console.error('Failed to fetch suggestions:', error);
      }
    };

    fetchSuggestions();
  }, [debouncedQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const response = await searchMovies(query);
      setMovies(response.data.results.filter((movie: Movie) => movie.poster_path));
      setError(null);
      setShowSuggestions(false);
    } catch (error) {
      setError('Failed to search movies. Please try again later.');
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (movie: Movie) => {
    setQuery(movie.title);
    setShowSuggestions(false);
    handleSearch(new Event('submit') as any);
  };

  return (
    <div className="space-y-8">
      <div className="rounded-lg bg-gray-800 p-6">
        <div className="relative" ref={suggestionsRef}>
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                placeholder="Search for movies..."
                className="w-full rounded-lg bg-gray-700 px-4 py-2 pl-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery('');
                    setSuggestions([]);
                  }}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-purple-500 px-6 py-2 font-semibold text-white hover:bg-purple-600 disabled:opacity-50"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </form>

          {/* Suggestions dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute z-50 mt-2 w-full rounded-lg bg-gray-800 shadow-lg">
              {suggestions.map((movie) => (
                <div
                  key={movie.id}
                  onClick={() => handleSuggestionClick(movie)}
                  className="flex cursor-pointer items-center gap-4 border-b border-gray-700 p-4 last:border-0 hover:bg-gray-700"
                >
                  {movie.poster_path && (
                    <img
                      src={getImageUrl(movie.poster_path, 'w92')}
                      alt={movie.title}
                      className="h-16 w-12 rounded object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-white">{movie.title}</h3>
                    {movie.release_date && (
                      <p className="text-sm text-gray-400">
                        {new Date(movie.release_date).getFullYear()}
                      </p>
                    )}
                    {movie.overview && (
                      <p className="mt-1 line-clamp-2 text-sm text-gray-300">
                        {movie.overview}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
        </div>
      )}

      {error && (
        <div className="rounded-lg bg-red-100 p-6 text-center">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {movies.length > 0 && (
        <div className="space-y-8">
          <h2 className="text-2xl font-bold text-white">Search Results</h2>
          <MovieGrid movies={movies} />
        </div>
      )}

      {!loading && !error && movies.length === 0 && query && (
        <div className="text-center text-gray-400">
          No movies found for "{query}"
        </div>
      )}
    </div>
  );
}