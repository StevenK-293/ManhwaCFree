import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import MangaDetails from './pages/MangaDetails';
import Chapter from './pages/Chapter';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import { useAuthStore } from './store/authStore';
import { useReadingListStore } from './store/readingListStore';
import { useBookmarkStore } from './store/bookmarkStore';

function App() {
  const { initialize } = useAuthStore();
  const { fetchList } = useReadingListStore();
  const { fetchBookmarks } = useBookmarkStore();

  useEffect(() => {
    initialize();
    fetchList();
    fetchBookmarks();
  }, [initialize, fetchList, fetchBookmarks]);

  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-gray-100">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/manga/:slug" element={<MangaDetails />} />
            <Route path="/manga/:slug/:chapter" element={<Chapter />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </main>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#1F2937',
              color: '#F3F4F6',
              borderRadius: '0.5rem',
            },
          }}
        />
      </div>
    </Router>
  );
}

export default App