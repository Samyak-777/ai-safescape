
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, LayoutDashboard } from 'lucide-react';
import { Github } from 'lucide-react';
import Button from './Button';
import MissionModal from './MissionModal';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMissionModalOpen, setIsMissionModalOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Check auth state
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Features', path: '/features' },
    { name: 'Threat Intel', path: '/threat-intel' },
    { name: 'Statistics', path: '/statistics' },
    { name: 'Simulator', path: '/simulator' },
    { name: 'Documentation', path: '/documentation' },
  ];

  return (
    <header
      className={`fixed w-full top-0 left-0 z-50 transition-all duration-300 ${
        isScrolled || isMenuOpen ? 'glass shadow-md py-3' : 'py-5'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link 
            to="/" 
            className="text-xl font-medium flex items-center gap-2"
          >
            <span className="bg-primary text-white w-8 h-8 flex items-center justify-center rounded-lg">
              AI
            </span>
            <span className="hidden sm:inline">SafeScape</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg transition-colors duration-300 ${
                  location.pathname === link.path
                    ? 'text-primary font-medium'
                    : 'text-foreground/80 hover:text-foreground hover:bg-muted'
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            {/* Our Mission Button */}
            <button
              onClick={() => setIsMissionModalOpen(true)}
              className="px-4 py-2 rounded-lg transition-colors duration-300 text-foreground/80 hover:text-foreground hover:bg-muted"
            >
              Our Mission
            </button>
            
            {/* GitHub Button */}
            <a
              href="https://github.com/Samyak-777/ai-safescape"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg transition-colors duration-300 text-foreground/80 hover:text-foreground hover:bg-muted flex items-center gap-2"
            >
              <Github size={16} />
              GitHub
            </a>

            {user ? (
              <>
                <Link to="/dashboard">
                  <Button 
                    variant="outline"
                    size="sm"
                    className="ml-4 flex items-center gap-2"
                  >
                    <LayoutDashboard size={16} />
                    Dashboard
                  </Button>
                </Link>
                <Button 
                  variant="primary"
                  size="sm"
                  className="ml-2 flex items-center gap-2"
                  onClick={handleLogout}
                >
                  <LogOut size={16} />
                  Logout
                </Button>
              </>
            ) : (
              <Link to="/auth">
                <Button 
                  variant="primary"
                  size="sm"
                  className="ml-4"
                >
                  Sign In
                </Button>
              </Link>
            )}
          </nav>

      <MissionModal open={isMissionModalOpen} onOpenChange={setIsMissionModalOpen} />

          {/* Mobile Navigation Toggle */}
          <button
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg bg-muted/50 text-foreground"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="glass md:hidden transition-all duration-300 ease-in-out animate-fade-in">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-3 rounded-lg transition-colors duration-300 ${
                    location.pathname === link.path
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'text-foreground/80 hover:text-foreground hover:bg-muted'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              
              {/* Our Mission Button for Mobile */}
              <button
                onClick={() => setIsMissionModalOpen(true)}
                className="px-4 py-3 rounded-lg transition-colors duration-300 text-foreground/80 hover:text-foreground hover:bg-muted text-left"
              >
                Our Mission
              </button>
              
              {/* GitHub Button for Mobile */}
              <a
                href="https://github.com/Samyak-777/ai-safescape"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3 rounded-lg transition-colors duration-300 text-foreground/80 hover:text-foreground hover:bg-muted flex items-center gap-2"
              >
                <Github size={16} />
                GitHub
              </a>

              {user ? (
                <>
                  <Link to="/dashboard" className="w-full">
                    <Button 
                      variant="outline"
                      className="mt-2 w-full flex items-center gap-2"
                    >
                      <LayoutDashboard size={16} />
                      Dashboard
                    </Button>
                  </Link>
                  <Button 
                    variant="primary"
                    className="mt-2 w-full flex items-center gap-2"
                    onClick={handleLogout}
                  >
                    <LogOut size={16} />
                    Logout
                  </Button>
                </>
              ) : (
                <Link to="/auth">
                  <Button 
                    variant="primary"
                    className="mt-2 w-full"
                  >
                    Sign In
                  </Button>
                </Link>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
