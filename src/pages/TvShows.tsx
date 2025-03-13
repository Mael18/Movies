import React, { useEffect, useState } from 'react';
import { getTvShows } from '../services/tmdb';
import { MovieGrid } from '../components/MovieGrid';

interface TvShow {
  id: number;
  name: string;
  poster_path: string;
}

export function TvShows() {
  const [shows, setShows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchShows = async () => {
      try {
        const response = await getTvShows();
        const formattedShows = response.data.results.map((show: TvShow) => ({
          id: show.id,
          title: show.name,
          poster_path: show.poster_path
        }));
        setShows(formattedShows);
        setError(null);
      } catch (error) {
        setError('Failed to fetch TV shows. Please try again later.');
        setShows([]);
      } finally {
        setLoading(false);
      }
    };

    fetchShows();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-5rem)] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[calc(100vh-5rem)] items-center justify-center">
        <div className="rounded-lg bg-red-100 p-6 text-center">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-white">Popular TV Shows</h1>
      <MovieGrid movies={shows} />
    </div>
  );
}