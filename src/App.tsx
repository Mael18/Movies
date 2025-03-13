import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { Film, Search, Tv, Clapperboard } from 'lucide-react';
import { Home } from './pages/Home';
import { MovieDetails } from './pages/MovieDetails';
import { Movies } from './pages/Movies';
import { TvShows } from './pages/TvShows';
import { SearchResults } from './pages/SearchResults';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900">
        <nav className="fixed top-0 z-50 w-full bg-gray-800 shadow-lg">
          <div className="container mx-auto flex h-16 items-center px-4">
            <NavLink to="/" className="flex items-center">
              <Film className="h-8 w-8 text-purple-500" />
              <span className="ml-2 text-xl font-bold text-white">ITM Movies</span>
            </NavLink>
            <div className="ml-auto flex items-center space-x-6">
              <NavLink
                to="/movies"
                className={({ isActive }) =>
                  `flex items-center ${isActive ? 'text-purple-500' : 'text-gray-300 hover:text-white'}`
                }
              >
                <Clapperboard className="mr-1 h-5 w-5" />
                Movies
              </NavLink>
              <NavLink
                to="/tv-shows"
                className={({ isActive }) =>
                  `flex items-center ${isActive ? 'text-purple-500' : 'text-gray-300 hover:text-white'}`
                }
              >
                <Tv className="mr-1 h-5 w-5" />
                TV Shows
              </NavLink>
              <NavLink
                to="/search"
                className={({ isActive }) =>
                  `flex items-center ${isActive ? 'text-purple-500' : 'text-gray-300 hover:text-white'}`
                }
              >
                <Search className="mr-1 h-5 w-5" />
                Search
              </NavLink>
            </div>
          </div>
        </nav>
        
        <main className="container mx-auto px-4 pt-20">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/tv-shows" element={<TvShows />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/movie/:id" element={<MovieDetails />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;