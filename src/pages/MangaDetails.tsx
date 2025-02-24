import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Loader, Star, Trophy, BookOpen, ArrowLeft } from 'lucide-react';
import { getMangaDetails } from '../api';
import { MangaDetails as MangaDetailsType } from '../types';

const MangaDetails: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [details, setDetails] = useState<MangaDetailsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!slug) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const data = await getMangaDetails(slug);
        setDetails(data);
      } catch (err) {
        setError('Failed to load manga details. Please try again later.');
        setDetails(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <div className="text-center text-red-400 bg-red-900/20 py-3 px-4 rounded-lg max-w-md">
          {error}
        </div>
        <Link
          to="/"
          className="inline-flex items-center px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Home</span>
        </Link>
      </div>
    );
  }

  if (!details) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <div className="text-center text-gray-400">
          No manga details found.
        </div>
        <Link
          to="/"
          className="inline-flex items-center px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Home</span>
        </Link>
      </div>
    );
  }

  const title = details.mangaUrl.split('/').pop()?.replace(/-/g, ' ') || 'Unknown Title';

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-8">
      <div className="flex items-center space-x-2 text-gray-400">
        <Link
          to="/"
          className="inline-flex items-center space-x-1 hover:text-purple-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Search</span>
        </Link>
      </div>

      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 shadow-xl">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/3">
            <img
              src={details.image || 'https://files.catbox.moe/gamwb1.jpg'}
              alt={title}
              className="w-full rounded-lg shadow-lg"
              loading="lazy"
            />
          </div>
          <div className="flex-1 space-y-6">
            <h1 className="text-3xl font-bold text-white">{title}</h1>
            
            <div className="flex flex-wrap gap-4 text-sm">
              {details.rating && (
                <div className="flex items-center space-x-1 bg-gray-700/50 px-3 py-1.5 rounded-full">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span>{details.rating}</span>
                </div>
              )}
              {details.rank && (
                <div className="flex items-center space-x-1 bg-gray-700/50 px-3 py-1.5 rounded-full">
                  <Trophy className="w-4 h-4 text-purple-500" />
                  <span>Rank #{details.rank}</span>
                </div>
              )}
              {details.status && (
                <div className="flex items-center space-x-1 bg-gray-700/50 px-3 py-1.5 rounded-full">
                  <BookOpen className="w-4 h-4 text-green-500" />
                  <span>{details.status}</span>
                </div>
              )}
            </div>

            {details.genres.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {details.genres.map((genre) => (
                  <span
                    key={genre}
                    className="px-3 py-1.5 bg-gray-700/50 rounded-full text-sm hover:bg-gray-600 transition-colors cursor-default"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            )}

            {details.summary && (
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300 leading-relaxed">{details.summary}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 shadow-xl">
        <h2 className="text-xl font-semibold mb-4 text-white">Chapters</h2>
        <div className="grid gap-2 sm:grid-cols-1 md:grid-cols-2">
          {details.chapters.map((chapter, index) => {
  const chapterSlug = chapter.chapterUrl?.split('/').pop();
  return (
    <Link
      key={`${slug}-${chapterSlug}-${index}`}
      to={chapterSlug ? `/manga/${slug}/${chapterSlug}` : '#'}
      className={`flex items-center justify-between p-4 bg-gray-700/50 rounded-lg ${
        chapterSlug ? 'hover:bg-gray-600 transition-colors' : 'opacity-50 cursor-not-allowed'
      } group`}
    >
      <span className="font-medium group-hover:text-purple-400 transition-colors">
        {chapter.chapterTitle}
      </span>
      <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
        {chapter.releaseDate}
      </span>
    </Link>
  );
})}

        </div>
      </div>
    </div>
  );
};

export default MangaDetails;
