import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { BookOpen, Bookmark, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useReadingListStore } from '../store/readingListStore';
import { useBookmarkStore } from '../store/bookmarkStore';
import { useHistoryStore } from '../store/historyStore';

const Dashboard = () => {
  const { user } = useAuthStore();
  const { items: readingList } = useReadingListStore();
  const { bookmarks } = useBookmarkStore();
  const { items: history } = useHistoryStore();
  const navigate = useNavigate();

  if (!user) {
    navigate('/');
    return null;
  }

  const readingStats = {
    reading: readingList.filter(item => item.status === 'reading').length,
    completed: readingList.filter(item => item.status === 'completed').length,
    planToRead: readingList.filter(item => item.status === 'plan_to_read').length,
    dropped: readingList.filter(item => item.status === 'dropped').length,
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 flex items-center space-x-4">
          <div className="p-3 bg-purple-500/20 rounded-full">
            <BookOpen className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-purple-400">{readingStats.reading}</p>
            <p className="text-sm text-gray-400">Reading</p>
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 flex items-center space-x-4">
          <div className="p-3 bg-green-500/20 rounded-full">
            <CheckCircle className="w-6 h-6 text-green-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-green-400">{readingStats.completed}</p>
            <p className="text-sm text-gray-400">Completed</p>
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 flex items-center space-x-4">
          <div className="p-3 bg-blue-500/20 rounded-full">
            <Clock className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-blue-400">{readingStats.planToRead}</p>
            <p className="text-sm text-gray-400">Plan to Read</p>
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 flex items-center space-x-4">
          <div className="p-3 bg-red-500/20 rounded-full">
            <XCircle className="w-6 h-6 text-red-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-red-400">{readingStats.dropped}</p>
            <p className="text-sm text-gray-400">Dropped</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center space-x-2">
            <Bookmark className="w-5 h-5 text-purple-400" />
            <span>Recent Bookmarks</span>
          </h2>
          <div className="space-y-4">
            {bookmarks.slice(0, 5).map((bookmark) => (
              <Link
                key={bookmark.id}
                to={`/manga/${bookmark.mangaSlug}/${bookmark.chapter}`}
                className="block p-4 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{bookmark.chapter}</p>
                    <p className="text-sm text-gray-400">
                      Page {bookmark.page}
                    </p>
                  </div>
                  <span className="text-sm text-gray-400">
                    {format(bookmark.createdAt, 'MMM d, yyyy')}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center space-x-2">
            <Clock className="w-5 h-5 text-purple-400" />
            <span>Reading History</span>
          </h2>
          <div className="space-y-4">
            {history.slice(0, 5).map((item, index) => (
              <Link
                key={`${item.slug}-${index}`}
                to={`/manga/${item.slug}/${item.chapter}`}
                className="block p-4 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-gray-400">{item.chapter}</p>
                  </div>
                  <span className="text-sm text-gray-400">
                    {format(item.timestamp, 'MMM d, yyyy')}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;