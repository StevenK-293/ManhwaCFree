import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, User, LogOut, List, X } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { AuthModal } from './AuthModal';
import { ReadingListModal } from './ReadingListModal';
import { motion } from 'framer-motion';

const Navbar = () => {
  const { user, signOut } = useAuthStore();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showReadingList, setShowReadingList] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="sticky top-0 z-50 bg-gray-800/95 backdrop-blur-sm border-b border-gray-700 shadow-lg"
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 group">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <BookOpen className="w-8 h-8 text-primary-500" />
              </motion.div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
                Nexus V1.0
              </span>
            </Link>

            <div className="lg:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <List className="w-6 h-6" />}
              </button>
            </div>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center space-x-4">
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
                  >
                    <User className="w-4 h-4" />
                    <span>Dashboard</span>
                  </Link>
                  <button
                    onClick={() => setShowReadingList(true)}
                    className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
                  >
                    <List className="w-4 h-4" />
                    <span>Reading List</span>
                  </button>
                  <button
                    onClick={() => signOut()}
                    className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span>Sign In</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.nav>

      {isMenuOpen && (
        <div className="lg:hidden bg-gray-800/95 backdrop-blur-sm border-b border-gray-700 shadow-lg absolute top-16 left-0 right-0 py-4 px-4">
          <div className="flex flex-col items-center space-y-4">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors w-full text-center"
                >
                  <User className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={() => setShowReadingList(true)}
                  className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors w-full text-center"
                >
                  <List className="w-4 h-4" />
                  <span>Reading List</span>
                </button>
                <button
                  onClick={() => signOut()}
                  className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors w-full text-center"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 transition-colors w-full text-center"
              >
                <User className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      )}

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />

      <ReadingListModal
        isOpen={showReadingList}
        onClose={() => setShowReadingList(false)}
      />
    </>
  );
};

export default Navbar;
