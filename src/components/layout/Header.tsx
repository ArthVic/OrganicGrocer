
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Menu, X, Search, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SearchDialog from '@/components/search/SearchDialog';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/hooks/useCart';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { cart } = useCart();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/products' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const handleSignOut = async () => {
    await signOut();
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container-custom py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="h-8 w-8 rounded-full bg-600 flex items-center justify-center">
              {/* <span className="text-white font-heading font-bold">OG</span> */}
              <img src="/green.png" alt="OG" className="w-8 h-8" />
            </span>
            <span className="font-heading font-bold text-xl">OrganicGrocer</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-gray-700 hover:text-leaf-600 font-medium transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            <SearchDialog className="hidden md:flex" />
            
            {user ? (
              <>
                <Link to="/profile" className="hidden md:flex">
                  <Button variant="ghost" size="icon" title="My Profile">
                    <User className="h-5 w-5" />
                  </Button>
                </Link>
                <button onClick={handleSignOut} className="hidden md:flex">
                  <Button variant="ghost" size="icon" title="Sign Out">
                    <LogOut className="h-5 w-5" />
                  </Button>
                </button>
              </>
            ) : (
              <Link to="/auth" className="hidden md:flex">
                <Button className="bg-leaf-600 hover:bg-leaf-700">
                  Sign In
                </Button>
              </Link>
            )}
            
            <Link to="/cart" className="relative">
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5" />
                {cart.totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-leaf-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cart.totalItems}
                  </span>
                )}
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t mt-4 animate-fade-in">
            <ul className="space-y-4">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="block text-gray-700 hover:text-leaf-600 font-medium transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
              <li className="pt-2 border-t">
                <Link
                  to="/search"
                  className="flex items-center space-x-2 text-gray-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Search className="h-4 w-4" />
                  <span>Search</span>
                </Link>
              </li>
              
              {user ? (
                <>
                  <li>
                    <Link
                      to="/profile"
                      className="flex items-center space-x-2 text-gray-700"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="h-4 w-4" />
                      <span>My Account</span>
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center space-x-2 text-gray-700 w-full text-left"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </li>
                </>
              ) : (
                <li>
                  <Link
                    to="/auth"
                    className="flex items-center space-x-2 text-gray-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="h-4 w-4" />
                    <span>Sign In / Register</span>
                  </Link>
                </li>
              )}
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
