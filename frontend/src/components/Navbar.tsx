
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SearchIcon, User, BookOpen, Menu, X, Moon, Sun, LogOut } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useTheme } from '../context/ThemeContext';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, logout } = useUser();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Books', path: '/books' },
    ...(user?.role === 'admin' ? [{ name: 'Admin', path: '/admin' }] : []),
    { name: 'Profile', path: '/profile' }
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
        isScrolled ? 'bg-card/80 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link 
            to="/" 
            className="flex items-center gap-2 font-semibold text-xl"
          >
            <BookOpen className="w-6 h-6" />
            <span className="hidden sm:inline">ReaderRealm</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === item.path
                    ? 'text-primary'
                    : 'text-muted-foreground'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              to="/books" 
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <SearchIcon className="w-5 h-5" />
            </Link>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>
            
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage 
                        src={user?.avatar} 
                        alt={user?.name} 
                      />
                      <AvatarFallback>
                        {user?.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>{user?.name}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <Link to="/profile">
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                  </Link>
                  {user?.role === 'admin' && (
                    <Link to="/admin">
                      <DropdownMenuItem>
                        <BookOpen className="mr-2 h-4 w-4" />
                        Admin Dashboard
                      </DropdownMenuItem>
                    </Link>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login">
                <Button variant="outline" size="sm">
                  Sign in
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
            
            <button
              className="inline-flex items-center justify-center p-2 rounded-md text-foreground hover:bg-secondary transition-colors"
              onClick={toggleMenu}
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-card border-b border-border">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  location.pathname === item.path
                    ? 'bg-secondary text-foreground'
                    : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
                }`}
              >
                {item.name}
              </Link>
            ))}
            
            {!isAuthenticated && (
              <Link
                to="/login"
                className="block px-3 py-2 rounded-md text-base font-medium text-primary hover:bg-secondary/50"
              >
                Sign in
              </Link>
            )}
          </div>
          
          {isAuthenticated && (
            <div className="pt-4 pb-3 border-t border-border">
              <div className="flex items-center px-5">
                <div className="flex-shrink-0">
                  <Avatar className="h-10 w-10">
                    <AvatarImage 
                      src={user?.avatar} 
                      alt={user?.name} 
                    />
                    <AvatarFallback>
                      {user?.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-foreground">{user?.name}</div>
                  <div className="text-sm font-medium text-muted-foreground">{user?.email}</div>
                </div>
              </div>
              <div className="mt-3 px-2 space-y-1">
                <button
                  onClick={logout}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                >
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
