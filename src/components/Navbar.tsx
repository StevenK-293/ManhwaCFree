import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 border-b border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <BookOpen className="w-8 h-8 text-purple-500" />
            <span className="text-xl font-bold">Nexus V1.0</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;