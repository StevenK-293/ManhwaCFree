import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Loader } from 'lucide-react';
import { searchManga } from '../api';
import { MangaResult } from '../types';

const Home = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<MangaResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [prevPage, setPrevPage] = useState<string | null>(null);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (page: number = 1) => {
    if (!query.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await searchManga(query, page);
      setResults(response.results);
      setCurrentPage(response.pagination.currentPage);
      setTotalPages(response.pagination.totalPages);

      setPrevPage(response.pagination.prevPage);
      setNextPage(response.pagination.nextPage);
    } catch (err) {
      setError('Failed to fetch results. Please try again.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="max-w-2xl mx-auto">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search for manhwa..."
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
          />
          <button
            onClick={() => handleSearch()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-purple-500"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>
      </div>

      {error && (
        <div className="text-center text-red-400 bg-red-900/20 py-3 px-4 rounded-lg">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center">
          <Loader className="w-8 h-8 animate-spin text-purple-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {results.map((manga) => (
            <Link
              key={manga.url}
              to={`/manga/${manga.url.split('/').pop()}`}
              className="bg-gray-800 rounded-lg overflow-hidden hover:ring-2 hover:ring-purple-500 transition-all group"
            >
              <div className="aspect-[2/3] relative overflow-hidden">
                <img
                  src={manga.image}
                  alt={manga.title}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-100 group-hover:opacity-90 transition-opacity">
                  <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-1 bg-purple-500/80 rounded-md text-xs font-medium">
                        {manga.status}
                      </span>
                      {manga.latest_chapter && (
                        <span className="px-2 py-1 bg-gray-700/80 rounded-md text-xs">
                          {manga.latest_chapter}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold line-clamp-2 leading-tight">
                      {manga.title}
                    </h3>
                    <div className="flex flex-wrap gap-1">
                      {manga.genres.slice(0, 3).map((genre) => (
                        <span key={genre} className="text-xs text-gray-300">
                          {genre}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center space-x-4 mt-8">
          <button
            onClick={() => prevPage && handleSearch(currentPage - 1)}
            disabled={!prevPage}
            className="px-4 py-2 bg-gray-800 rounded-lg disabled:opacity-50 hover:bg-gray-700"
          >
            Previous
          </button>

          <span className="px-4 py-2">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => nextPage && handleSearch(currentPage + 1)}
            disabled={!nextPage}
            className="px-4 py-2 bg-gray-800 rounded-lg disabled:opacity-50 hover:bg-gray-700"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
