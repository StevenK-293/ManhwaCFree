import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import MangaDetails from './pages/MangaDetails';
import Chapter from './pages/Chapter';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-gray-100">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/manga/:slug" element={<MangaDetails />} />
            <Route path="/manga/:slug/:chapter" element={<Chapter />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;