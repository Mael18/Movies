import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getMovieDetails, getMovieVideos, getImageUrl, STREAMING_SOURCES } from '../services/tmdb';
import { Play, X, Film, ChevronLeft, ChevronRight } from 'lucide-react';

interface Video {
  key: string;
  name: string;
  type: string;
  site: string;
}

interface MovieDetails {
  id: number;
  title: string;
  overview: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  runtime: number;
}

export function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [showFullMovie, setShowFullMovie] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSourceIndex, setCurrentSourceIndex] = useState(0);

  useEffect(() => {
    const fetchMovieData = async () => {
      if (!id) {
        setError('Movie ID is missing');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const [movieResponse, videosResponse] = await Promise.all([
          getMovieDetails(id),
          getMovieVideos(id)
        ]);
        
        if (!movieResponse.data) {
          throw new Error('Failed to fetch movie details');
        }

        setMovie(movieResponse.data);
        
        // Filter for YouTube trailers and teasers only
        const filteredVideos = videosResponse.data.results
          .filter((video: Video) => 
            video.site === 'YouTube' && 
            (video.type === 'Trailer' || video.type === 'Teaser') && 
            video.key
          );
        setVideos(filteredVideos);
      } catch (err) {
        setError('Failed to load movie data. Please try again later.');
        setMovie(null);
        setVideos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieData();
  }, [id]);

  const handleNextSource = () => {
    setCurrentSourceIndex((prev) => (prev + 1) % STREAMING_SOURCES.length);
  };

  const handlePreviousSource = () => {
    setCurrentSourceIndex((prev) => 
      prev === 0 ? STREAMING_SOURCES.length - 1 : prev - 1
    );
  };

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-5rem)] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="flex h-[calc(100vh-5rem)] items-center justify-center">
        <div className="rounded-lg bg-red-100 p-6 text-center">
          <p className="text-red-600">{error || 'Movie not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="relative h-[60vh] w-full overflow-hidden rounded-xl">
        <img
          src={getImageUrl(movie.backdrop_path)}
          alt={movie.title}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900"></div>
        <div className="absolute bottom-0 left-0 p-8">
          <h1 className="text-4xl font-bold text-white">{movie.title}</h1>
          <p className="mt-2 max-w-2xl text-gray-300">{movie.overview}</p>
          <div className="mt-4 flex gap-4">
            <button
              onClick={() => setShowFullMovie(true)}
              className="flex items-center rounded-lg bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700"
            >
              <Film className="mr-2 h-5 w-5" />
              Watch Full Movie
            </button>
            {videos.length > 0 && (
              <button
                onClick={() => setSelectedVideo(videos[0])}
                className="flex items-center rounded-lg bg-purple-500 px-6 py-3 font-semibold text-white hover:bg-purple-600"
              >
                <Play className="mr-2 h-5 w-5" />
                Watch Trailer
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="text-2xl font-bold text-white">Details</h2>
          <div className="mt-4 space-y-2 text-gray-300">
            <p><span className="font-semibold">Release Date:</span> {movie.release_date}</p>
            <p><span className="font-semibold">Rating:</span> {movie.vote_average.toFixed(1)}/10</p>
            <p><span className="font-semibold">Runtime:</span> {movie.runtime} minutes</p>
          </div>
        </div>

        {videos.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-white">Videos</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {videos.map((video) => (
                <button
                  key={video.key}
                  onClick={() => setSelectedVideo(video)}
                  className="flex items-center rounded-lg bg-gray-800 p-4 text-left hover:bg-gray-700"
                >
                  <Play className="mr-3 h-8 w-8 text-purple-500" />
                  <div>
                    <p className="font-semibold text-white">{video.name}</p>
                    <p className="text-sm text-gray-400">{video.type}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Full Movie Modal */}
      {showFullMovie && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
          <div className="relative w-full max-w-5xl">
            <button
              onClick={() => setShowFullMovie(false)}
              className="absolute -right-4 -top-4 rounded-full bg-gray-800 p-2 text-white hover:bg-gray-700"
            >
              <X className="h-6 w-6" />
            </button>
            <div className="relative pb-[56.25%]">
              <iframe
                className="absolute inset-0 h-full w-full rounded-lg"
                src={`${STREAMING_SOURCES[currentSourceIndex]}${id}`}
                title={`Watch ${movie.title}`}
                allowFullScreen
                referrerPolicy="strict-origin"
              ></iframe>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <button
                onClick={handlePreviousSource}
                className="flex items-center rounded bg-gray-700 px-4 py-2 text-white hover:bg-gray-600"
              >
                <ChevronLeft className="mr-2 h-5 w-5" />
                Previous Source
              </button>
              <span className="text-white">
                Source {currentSourceIndex + 1} of {STREAMING_SOURCES.length}
              </span>
              <button
                onClick={handleNextSource}
                className="flex items-center rounded bg-gray-700 px-4 py-2 text-white hover:bg-gray-600"
              >
                Next Source
                <ChevronRight className="ml-2 h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Trailer Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
          <div className="relative w-full max-w-4xl">
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute -right-4 -top-4 rounded-full bg-gray-800 p-2 text-white hover:bg-gray-700"
            >
              <X className="h-6 w-6" />
            </button>
            <div className="relative pb-[56.25%]">
              <iframe
                className="absolute inset-0 h-full w-full rounded-lg"
                src={`https://www.youtube-nocookie.com/embed/${selectedVideo.key}?autoplay=1&rel=0`}
                title={selectedVideo.name}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                referrerPolicy="strict-origin"
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}