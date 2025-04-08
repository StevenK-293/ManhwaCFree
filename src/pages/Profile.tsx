import React from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useAuthStore } from '../store/authStore';
import { useReadingListStore } from '../store/readingListStore';

const Profile = () => {
  const { user, signOut } = useAuthStore();
  const { items } = useReadingListStore();
  const navigate = useNavigate();

  if (!user) {
    navigate('/');
    return null;
  }

  const readingStats = {
    reading: items.filter(item => item.status === 'reading').length,
    completed: items.filter(item => item.status === 'completed').length,
    planToRead: items.filter(item => item.status === 'plan_to_read').length,
    dropped: items.filter(item => item.status === 'dropped').length,
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4">Profile</h1>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-400">Email</label>
            <p className="font-medium">{user.email}</p>
          </div>
          <div>
            <label className="text-sm text-gray-400">Member Since</label>
            <p className="font-medium">
              {format(new Date(user.created_at), 'MMMM d, yyyy')}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Reading Statistics</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-700/50 rounded-lg p-4">
            <p className="text-2xl font-bold text-purple-400">{readingStats.reading}</p>
            <p className="text-sm text-gray-400">Reading</p>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-4">
            <p className="text-2xl font-bold text-green-400">{readingStats.completed}</p>
            <p className="text-sm text-gray-400">Completed</p>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-4">
            <p className="text-2xl font-bold text-blue-400">{readingStats.planToRead}</p>
            <p className="text-sm text-gray-400">Plan to Read</p>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-4">
            <p className="text-2xl font-bold text-red-400">{readingStats.dropped}</p>
            <p className="text-sm text-gray-400">Dropped</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {items.slice(0, 5).map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg"
            >
              <div>
                <h3 className="font-medium">{item.title}</h3>
                <p className="text-sm text-gray-400">
                  Last read: {format(item.lastRead, 'MMM d, yyyy')}
                </p>
              </div>
              <span className="px-3 py-1 text-sm rounded-full bg-purple-500/20 text-purple-400">
                {item.status.replace('_', ' ')}
              </span>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => signOut()}
        className="w-full py-3 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
      >
        Sign Out
      </button>
    </div>
  );
};

export default Profile;