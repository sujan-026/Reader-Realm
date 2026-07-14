
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-background to-secondary/30">
      <div className="text-center max-w-md mx-auto">
        <h1 className="text-7xl font-bold mb-4 animate-fade-in">404</h1>
        <div className="w-16 h-1 bg-primary mx-auto mb-6 animate-fade-in" style={{ animationDelay: '100ms' }}></div>
        <p className="text-xl mb-6 text-muted-foreground animate-fade-in" style={{ animationDelay: '200ms' }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-flex items-center justify-center py-2 px-4 rounded-md bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors animate-fade-in"
          style={{ animationDelay: '300ms' }}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
