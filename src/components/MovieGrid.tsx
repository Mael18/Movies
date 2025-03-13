import React from 'react';
import { MovieCard } from './MovieCard';

interface Movie {
  id: number;
  title: string;
  poster_path: string;
}

interface MovieGridProps {
  movies: Movie[];
}

export function MovieGrid({ movies }: MovieGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          id={movie.id}
          title={movie.title}
          posterPath={movie.poster_path}
        />
      ))}
    </div>
  );
}