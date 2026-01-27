'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Menu, X, User, LogOut, Settings, ShoppingCart } from 'lucide-react';
import Logo, { LogoCompact } from './Logo';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navClass = `fixed top-0 left-0 right-0 z-50 backdrop-blur-md transition-all duration-300 ${
    isScrolled
      ? 'bg-white/90 border-b border-slate-200 shadow-sm'
      : 'bg-white/70 border-b border-transparent'
  }`;

  return (
    <nav className={navClass}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop Layout */}
        <div className="hidden md:block relative h-20">
          {/* Normal Layout - Logo in center, menus on sides */}
          <div
            className={`grid grid-cols-3 items-center h-20 absolute inset-0 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isScrolled ? 'opacity-0 translate-y-2 pointer-events-none' : 'opacity-100 translate-y-0'
            }`}
          >
              {/* Left Menu */}
              <div className="flex items-center justify-start space-x-6">
                <Link
                  href="/"
                  className="text-slate-700 hover:text-blue-600 transition"
                >
                  Home
                </Link>
                <Link
                  href="/cars"
                  className="text-slate-700 hover:text-blue-600 transition"
                >
                  Models
                </Link>
                <Link
                  href="/contact"
                  className="text-slate-700 hover:text-blue-600 transition"
                >
                  Contact
                </Link>
                {session && (
                  <Link
                    href="/sell"
                    className="text-slate-700 hover:text-blue-600 transition"
                  >
                    Sell
                  </Link>
                )}
              </div>

              {/* Logo - Center */}
              <div className="flex justify-center">
                <Logo size="md" />
              </div>

              {/* Right Menu */}
              <div className="flex items-center justify-end space-x-6">
                {session && (
                  <Link
                    href="/cart"
                    className="text-slate-700 hover:text-blue-600 transition relative"
                  >
                    <ShoppingCart className="h-5 w-5" />
                  </Link>
                )}
                {session ? (
                  <>
                    {session.user?.role === 'admin' && (
                      <Link
                        href="/admin"
                        className="text-slate-700 hover:text-blue-600 transition"
                      >
                        Admin
                      </Link>
                    )}
                    <div className="relative group">
                      <button className="flex items-center space-x-2 text-slate-700 hover:text-blue-600 transition">
                        <User className="h-5 w-5" />
                        <span>{session.user?.name}</span>
                      </button>
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all border border-slate-200">
                        <Link
                          href="/profile"
                          className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                        >
                          <Settings className="h-4 w-4 mr-2" />
                          Profile
                        </Link>
                        <button
                          onClick={() => signOut()}
                          className="flex items-center w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <Link
                      href="/auth/signin"
                      className="text-slate-700 hover:text-blue-600 transition"
                    >
                      Login
                    </Link>
                    <Link
                      href="/auth/signup"
                      className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition shadow-sm"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>

          {/* Scrolled Layout - All items centered */}
          <div
            className={`flex items-center justify-center h-20 space-x-6 absolute inset-0 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isScrolled ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
            }`}
          >
            <Link
              href="/"
              className="text-slate-700 hover:text-blue-600 transition"
            >
              Home
            </Link>
            <Link
              href="/cars"
              className="text-slate-700 hover:text-blue-600 transition"
            >
              Models
            </Link>
            <Link
              href="/contact"
              className="text-slate-700 hover:text-blue-600 transition"
            >
              Contact
            </Link>
            {session && (
              <Link
                href="/sell"
                className="text-slate-700 hover:text-blue-600 transition"
              >
                Sell
              </Link>
            )}
            <LogoCompact />
            {session ? (
              <>
                <Link
                  href="/cart"
                  className="text-slate-700 hover:text-blue-600 transition"
                >
                  <ShoppingCart className="h-5 w-5" />
                </Link>
                {session.user?.role === 'admin' && (
                  <Link
                    href="/admin"
                    className="text-slate-700 hover:text-blue-600 transition"
                  >
                    Admin
                  </Link>
                )}
                <Link
                  href="/profile"
                  className="text-slate-700 hover:text-blue-600 transition"
                >
                  Profile
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/auth/signin"
                  className="text-slate-700 hover:text-blue-600 transition"
                >
                  Login
                </Link>
                <Link
                  href="/auth/signup"
                  className="text-slate-700 hover:text-blue-600 transition"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden grid grid-cols-3 items-center h-20">
          {/* Mobile Menu Button */}
          <button
            className="text-slate-700 transition"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>

          {/* Logo - Center */}
          <div className="flex justify-center">
            <LogoCompact />
          </div>

          {/* Empty space - Right */}
          <div></div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2 border-t border-slate-200 bg-white/90">
            <Link
              href="/"
              className="block px-4 py-2 text-slate-700 hover:bg-slate-100 transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/cars"
              className="block px-4 py-2 text-slate-700 hover:bg-slate-100 transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Models
            </Link>
            <Link
              href="/contact"
              className="block px-4 py-2 text-slate-700 hover:bg-slate-100 transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
            {session ? (
              <>
                <Link
                  href="/sell"
                  className="block px-4 py-2 text-slate-700 hover:bg-slate-100 transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sell
                </Link>
                <Link
                  href="/cart"
                  className="block px-4 py-2 text-slate-700 hover:bg-slate-100 transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Cart
                </Link>
                <Link
                  href="/profile"
                  className="block px-4 py-2 text-slate-700 hover:bg-slate-100 transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                {session.user?.role === 'admin' && (
                  <Link
                    href="/admin"
                    className="block px-4 py-2 text-slate-700 hover:bg-slate-100 transition"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={() => {
                    signOut();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-slate-700 hover:bg-slate-100 transition"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/signin"
                  className="block px-4 py-2 text-slate-700 hover:bg-slate-100 transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="block px-4 py-2 text-slate-700 hover:bg-slate-100 transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
