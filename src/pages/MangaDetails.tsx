import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Loader, Star, Trophy, BookOpen, ArrowLeft, Bookmark, Clock, CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { getMangaDetails } from '../api';
import { MangaDetails as MangaDetailsType } from '../types';
import { useReadingListStore, ReadingStatus } from '../store/readingListStore';
import { useHistoryStore } from '../store/historyStore';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';

const statusOptions: { label: string; value: ReadingStatus; icon: any }[] = [
  { label: 'Reading', value: 'reading', icon: BookOpen },
  { label: 'Completed', value: 'completed', icon: CheckCircle },
  { label: 'Plan to Read', value: 'plan_to_read', icon: Clock },
  { label: 'Dropped', value: 'dropped', icon: XCircle },
];

const MangaDetails: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [details, setDetails] = useState<MangaDetailsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();
  const { items: readingList, addToList, updateStatus } = useReadingListStore();
  const { items: history } = useHistoryStore();

  const mangaInList = readingList.find(item => item.mangaSlug === slug);
  const recentChapters = history
    .filter(item => item.slug === slug)
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 5);

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

  const handleStatusUpdate = async (status: ReadingStatus) => {
    if (!user) {
      toast.error('Please sign in to save to your reading list');
      return;
    }

    if (!details) return;

    try {
      if (mangaInList) {
        await updateStatus(slug!, status);
      } else {
        await addToList({
          mangaSlug: slug!,
          title: details.mangaUrl.split('/').pop()?.replace(/-/g, ' ') || 'Unknown',
          status,
        });
      }
      toast.success(`Added to ${status.replace('_', ' ')}`);
    } catch (error) {
      toast.error('Failed to update reading list');
    }
  };

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
    <div className="max-w-6xl mx-auto space-y-8 pb-8">
      <div className="flex items-center space-x-2 text-gray-400">
        <Link
          to="/"
          className="inline-flex items-center space-x-1 hover:text-purple-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Search</span>
        </Link>
      </div>

      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900" />
        <div className="relative bg-gray-800/50 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl">
          <div className="flex flex-col md:flex-row gap-8 p-8">
            <div className="w-full md:w-1/3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative group"
              >
                <img
                  src={details.image || 'https://files.catbox.moe/gamwb1.jpg'}
                  alt={title}
                  className="w-full rounded-lg shadow-lg transform group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute top-2 right-2 space-y-2">
                  {statusOptions.map(({ label, value, icon: Icon }) => (
                    <motion.button
                      key={value}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleStatusUpdate(value)}
                      className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
                        mangaInList?.status === value
                          ? 'bg-purple-500 text-white'
                          : 'bg-gray-800/50 hover:bg-gray-700/50'
                      }`}
                      title={label}
                    >
                      <Icon className="w-5 h-5" />
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </div>
            <div className="flex-1 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h1 className="text-4xl font-bold text-white mb-4">{title}</h1>
                
                <div className="flex flex-wrap gap-4 text-sm mb-6">
                  {details.rating && (
                    <div className="flex items-center space-x-1 bg-yellow-500/10 text-yellow-400 px-3 py-1.5 rounded-full">
                      <Star className="w-4 h-4" />
                      <span>{details.rating}</span>
                    </div>
                  )}
                  {details.rank && (
                    <div className="flex items-center space-x-1 bg-purple-500/10 text-purple-400 px-3 py-1.5 rounded-full">
                      <Trophy className="w-4 h-4" />
                      <span>Rank #{details.rank}</span>
                    </div>
                  )}
                  {details.status && (
                    <div className="flex items-center space-x-1 bg-green-500/10 text-green-400 px-3 py-1.5 rounded-full">
                      <BookOpen className="w-4 h-4" />
                      <span>{details.status}</span>
                    </div>
                  )}
                </div>

                {details.genres.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
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
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {recentChapters.length > 0 && (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-xl">
          <h2 className="text-xl font-semibold mb-4 text-white">Recently Read</h2>
          <div className="grid gap-2">
            {recentChapters.map((item, index) => (
              <Link
                key={`${item.chapter}-${index}`}
                to={`/manga/${slug}/${item.chapter}`}
                className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors"
              >
                <span className="font-medium">{item.chapter}</span>
                <span className="text-sm text-gray-400">
                  {new Date(item.timestamp).toLocaleDateString()}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-xl">
        <h2 className="text-xl font-semibold mb-4 text-white">Chapters</h2>
        <div className="grid gap-2 sm:grid-cols-1 md:grid-cols-2">
          {details.chapters.map((chapter, index) => {
            const chapterSlug = chapter.chapterUrl?.split('/').pop();
            return (
              <Link
                key={`${slug}-${chapterSlug}-${index}`}
                to={chapterSlug ? `/manga/${slug}/${chapterSlug}` : '#'}
                className={`flex items-center justify-between p-4 rounded-lg ${
                  chapterSlug
                    ? 'bg-gray-700/30 hover:bg-gray-700/50 transition-colors'
                    : 'opacity-50 cursor-not-allowed bg-gray-700/10'
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