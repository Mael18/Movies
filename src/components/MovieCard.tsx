import React from 'react';
import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';
import { cn } from '../lib/utils';
import { getImageUrl } from '../services/tmdb';

interface MovieCardProps {
  id: number;
  title: string;
  posterPath: string;
  className?: string;
}

export function MovieCard({ id, title, posterPath, className }: MovieCardProps) {
  return (
    <Link 
      to={`/movie/${id}`}
      className={cn(
        "group relative overflow-hidden rounded-lg transition-transform hover:scale-105",
        className
      )}
    >
      <img
        src={getImageUrl(posterPath, 'w500')}
        alt={title}
        className="h-full w-full object-cover"
      />
      <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
        <Play className="h-12 w-12 text-white" />
      </div>
      <div className="absolute bottom-0 w-full bg-gradient-to-t from-black p-4">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
      </div>
    </Link>
  );
}