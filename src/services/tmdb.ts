import axios from 'axios';

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export const tmdbApi = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: TMDB_API_KEY,
  },
});

export const getImageUrl = (path: string, size: string = 'original') => 
  `${IMAGE_BASE_URL}/${size}${path}`;

export const getTrending = () => 
  tmdbApi.get('/trending/all/week');

export const getMovieDetails = (id: string) => 
  tmdbApi.get(`/movie/${id}`);

export const getMovieVideos = (id: string) => 
  tmdbApi.get(`/movie/${id}/videos`);

export const getPopularMovies = () => 
  tmdbApi.get('/movie/popular');

export const getTopRatedMovies = () => 
  tmdbApi.get('/movie/top_rated');

export const searchMovies = (query: string) =>
  tmdbApi.get('/search/movie', { params: { query } });

export const getTvShows = () =>
  tmdbApi.get('/tv/popular');

export const getMovies = () =>
  tmdbApi.get('/movie/now_playing');

export const getUpcomingMovies = () =>
  tmdbApi.get('/movie/upcoming');

export const getTopRatedTvShows = () =>
  tmdbApi.get('/tv/top_rated');

export const STREAMING_SOURCES = [
  'https://vidlink.pro/movie/',
  'https://vidsrc.dev/embed/movie/',
  'https://111movies.com/movie/',
  'https://vidjoy.pro/embed/movie/',
  'https://vidsrc.io/embed/movie/',
  'https://vidsrc.cc/v2/embed/movie/',
  'https://vidsrc.xyz/embed/movie/',
  'https://www.2embed.cc/embed/',
  'https://moviesapi.club/movie/'
];