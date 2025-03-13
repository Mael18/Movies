import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Play } from 'lucide-react';
import { 
  getTrending, 
  getTopRatedMovies, 
  getUpcomingMovies,
  getTopRatedTvShows,
  getImageUrl 
} from '../services/tmdb';
import { MovieGrid } from '../components/MovieGrid';
import { MovieCard } from '../components/MovieCard';

interface Movie {
  id: number;
  title: string;
  name?: string;
  poster_path: string;
  backdrop_path: string;
  overview: string;
  media_type?: string;
}

export function Home() {
  const [trending, setTrending] = useState<Movie[]>([]);
  const [topRated, setTopRated] = useState<Movie[]>([]);
  const [upcoming, setUpcoming] = useState<Movie[]>([]);
  const [topShows, setTopShows] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [trendingRes, topRatedRes, upcomingRes, topShowsRes] = await Promise.all([
          getTrending(),
          getTopRatedMovies(),
          getUpcomingMovies(),
          getTopRatedTvShows()
        ]);

        setTrending(trendingRes.data.results.slice(0, 5));
        setTopRated(topRatedRes.data.results.slice(0, 10));
        setUpcoming(upcomingRes.data.results.slice(0, 10));
        setTopShows(topShowsRes.data.results.slice(0, 10));
        setError(null);
      } catch (error) {
        setError('Failed to fetch content. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % trending.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [trending.length]);

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
    <div className="space-y-12">
      {/* Hero Slider */}
      <div className="relative h-[70vh] overflow-hidden rounded-xl">
        {trending.map((item, index) => (
          <div
            key={item.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={getImageUrl(item.backdrop_path)}
              alt={item.title || item.name}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50"></div>
            <div className="absolute bottom-0 left-0 p-8">
              <h2 className="text-4xl font-bold text-white">
                {item.title || item.name}
              </h2>
              <p className="mt-2 max-w-2xl text-gray-300">{item.overview}</p>
              <Link
                to={`/${item.media_type}/${item.id}`}
                className="mt-4 inline-flex items-center rounded-lg bg-purple-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-purple-600"
              >
                <Play className="mr-2 h-5 w-5" />
                Watch Now
              </Link>
            </div>
          </div>
        ))}
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 space-x-2">
          {trending.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 w-2 rounded-full transition-all ${
                index === currentSlide ? 'bg-purple-500 w-8' : 'bg-gray-400'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Top 10 Movies */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Top 10 Movies</h2>
          <Link 
            to="/movies" 
            className="flex items-center text-purple-400 hover:text-purple-300"
          >
            View All <ChevronRight className="h-5 w-5" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {topRated.map((movie, index) => (
            <div key={movie.id} className="relative">
              <MovieCard
                id={movie.id}
                title={movie.title}
                posterPath={movie.poster_path}
              />
              <div className="absolute -left-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-purple-500 font-bold text-white">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recently Added */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Recently Added</h2>
          <Link 
            to="/movies" 
            className="flex items-center text-purple-400 hover:text-purple-300"
          >
            View All <ChevronRight className="h-5 w-5" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {upcoming.map((movie) => (
            <MovieCard
              key={movie.id}
              id={movie.id}
              title={movie.title}
              posterPath={movie.poster_path}
            />
          ))}
        </div>
      </section>

      {/* Top TV Shows */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Top TV Shows</h2>
          <Link 
            to="/tv-shows" 
            className="flex items-center text-purple-400 hover:text-purple-300"
          >
            View All <ChevronRight className="h-5 w-5" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {topShows.map((show) => (
            <MovieCard
              key={show.id}
              id={show.id}
              title={show.name || ''}
              posterPath={show.poster_path}
            />
          ))}
        </div>
      </section>
    </div>
  );
}