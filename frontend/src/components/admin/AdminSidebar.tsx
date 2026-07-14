import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  BookOpen, 
  LayoutDashboard, 
  MessageSquare, 
  Users, 
  Settings, 
  LogOut 
} from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { Button } from '@/components/ui/button';

export const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useUser();
  
  const sidebarLinks = [
    {
      name: 'Dashboard',
      href: '/admin',
      icon: LayoutDashboard
    },
    {
      name: 'Books',
      href: '/admin/books',
      icon: BookOpen
    },
    {
      name: 'Reviews',
      href: '/admin/reviews',
      icon: MessageSquare
    },
    {
      name: 'Users',
      href: '/admin/users',
      icon: Users
    },
    {
      name: 'Settings',
      href: '/admin/settings',
      icon: Settings
    }
  ];
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="w-64 border-r bg-card h-screen flex flex-col">
      <div className="p-6 border-b">
        <Link to="/admin" className="flex items-center gap-2">
          <BookOpen className="h-6 w-6" />
          <span className="font-bold text-xl">Admin Panel</span>
        </Link>
      </div>
      
      <div className="flex-1 py-6 overflow-y-auto">
        <nav className="space-y-1 px-2">
          {sidebarLinks.map((link) => {
            const isActive = location.pathname === link.href || 
                             (link.href !== '/admin' && location.pathname.startsWith(link.href));
            
            return (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <link.icon className="h-4 w-4" />
                {link.name}
              </Link>
            );
          })}
        </nav>
      </div>
      
      <div className="p-4 border-t">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center overflow-hidden">
            {user?.avatar ? (
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-lg font-medium">
                {user?.name.charAt(0)}
              </span>
            )}
          </div>
          <div>
            <div className="font-medium">{user?.name}</div>
            <div className="text-xs text-muted-foreground">{user?.email}</div>
          </div>
        </div>
        
        <Button 
          variant="outline" 
          className="w-full justify-start" 
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </Button>
      </div>
    </div>
  );
};
