import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 flex items-center justify-center">
                <img 
                  src="/Logo Upscaled.png" 
                  alt="Agoras Logo" 
                  className="w-8 h-8 object-contain rounded-md"
                />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Agoras</h1>
                <p className="text-xs text-[#741b1c] font-medium">Privat Matematikkundervisning</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link 
                to="/" 
                className={`transition-colors font-medium ${
                  isActive('/') 
                    ? 'text-[#741b1c] border-b-2 border-[#741b1c] pb-1' 
                    : 'text-gray-700 hover:text-[#741b1c]'
                }`}
              >
                Hjem
              </Link>
              <Link 
                to="/kurs" 
                className={`transition-colors font-medium ${
                  isActive('/kurs') 
                    ? 'text-[#741b1c] border-b-2 border-[#741b1c] pb-1' 
                    : 'text-gray-700 hover:text-[#741b1c]'
                }`}
              >
                Kurs
              </Link>
              <Link 
                to="/om-meg" 
                className={`transition-colors font-medium ${
                  isActive('/om-meg') 
                    ? 'text-[#741b1c] border-b-2 border-[#741b1c] pb-1' 
                    : 'text-gray-700 hover:text-[#741b1c]'
                }`}
              >
                Om Meg
              </Link>
              <Link 
                to="/kontakt" 
                className={`transition-colors font-medium ${
                  isActive('/kontakt') 
                    ? 'text-[#741b1c] border-b-2 border-[#741b1c] pb-1' 
                    : 'text-gray-700 hover:text-[#741b1c]'
                }`}
              >
                Kontakt
              </Link>
            </nav>



            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-100">
              <nav className="flex flex-col space-y-4">
                <Link 
                  to="/" 
                  className={`transition-colors font-medium ${
                    isActive('/') ? 'text-[#741b1c]' : 'text-gray-700 hover:text-[#741b1c]'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Hjem
                </Link>
                <Link 
                  to="/kurs" 
                  className={`transition-colors font-medium ${
                    isActive('/kurs') ? 'text-[#741b1c]' : 'text-gray-700 hover:text-[#741b1c]'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Kurs
                </Link>
                <Link 
                  to="/om-meg" 
                  className={`transition-colors font-medium ${
                    isActive('/om-meg') ? 'text-[#741b1c]' : 'text-gray-700 hover:text-[#741b1c]'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Om Meg
                </Link>
                <Link 
                  to="/kontakt" 
                  className={`transition-colors font-medium ${
                    isActive('/kontakt') ? 'text-[#741b1c]' : 'text-gray-700 hover:text-[#741b1c]'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Kontakt
                </Link>
              </nav>
            </div>
          )}
        </div>
      </header>


    </>
  );
};

export default Header;