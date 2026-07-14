import { Layout } from '../components/Layout';
import { BookCard } from '../components/BookCard';
import { useBooks } from '../context/BookContext';
import { useUser } from '../context/UserContext';
import { Book, User, BookOpen, Settings, LogIn } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Link, Navigate } from 'react-router-dom';

const Profile = () => {
  const { books } = useBooks();
  const { user, isAuthenticated, likedBooks } = useUser();
  
  // Get liked books
  const userLikedBooks = books.filter(book => likedBooks.includes(book._id));
  
  // Simulate read books and reviews for the user profile
  const readBooks = books.slice(0, 3);
  const userReviews = books.slice(0, 2).flatMap(book => 
    book.reviews.slice(0, 1).map(review => ({ bookId: book._id, book, ...review }))
  );

  // If user is not authenticated, show login prompt
  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-20 space-y-6 text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
            <LogIn className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="space-y-2 max-w-md">
            <h1 className="text-2xl font-bold">Sign in to view your profile</h1>
            <p className="text-muted-foreground">
              Sign in to track your reading progress, save favorite books, and contribute reviews
            </p>
          </div>
          <div className="flex gap-4">
            <Link to="/login">
              <Button>Sign in</Button>
            </Link>
            <Link to="/signup">
              <Button variant="outline">Create account</Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="pt-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-10">
          <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center overflow-hidden">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <User className="h-12 w-12 text-muted-foreground" />
            )}
          </div>
          <div className="text-center sm:text-left">
            <h1 className="text-3xl font-bold">{user.name}</h1>
            <p className="text-muted-foreground">{user.email}</p>
            {user.role === 'admin' && (
              <div className="mt-2">
                <Link to="/admin">
                  <Button variant="outline" size="sm">
                    Admin Dashboard
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        <Tabs defaultValue="bookshelf" className="w-full">
          <TabsList className="grid w-full md:w-[400px] grid-cols-3">
            <TabsTrigger value="bookshelf" className="flex gap-1 items-center">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Bookshelf</span>
            </TabsTrigger>
            <TabsTrigger value="favorites" className="flex gap-1 items-center">
              <Book className="h-4 w-4" />
              <span className="hidden sm:inline">Favorites</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex gap-1 items-center">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="bookshelf" className="mt-6 animate-fade-in">
            <h2 className="text-xl font-bold mb-4">Books You've Read</h2>
            
            {readBooks.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {readBooks.map((book, index) => (
                  <BookCard key={book._id} book={book} index={index} />
                ))}
              </div>
            ) : (
              <div className="p-12 text-center">
                <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">Your bookshelf is empty</h3>
                <p className="text-muted-foreground">Books you read will appear here</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="favorites" className="mt-6 animate-fade-in">
            <h2 className="text-xl font-bold mb-4">Your Favorite Books</h2>
            
            {userLikedBooks.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {userLikedBooks.map((book, index) => (
                  <BookCard key={book._id} book={book} index={index} />
                ))}
              </div>
            ) : (
              <div className="p-12 text-center">
                <Book className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No favorite books yet</h3>
                <p className="text-muted-foreground">Books you like will appear here</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="settings" className="mt-6 animate-fade-in">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-xl font-bold mb-6">Account Settings</h2>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-sm font-medium">
                    Display Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    defaultValue={user.name}
                    className="w-full rounded-md border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    defaultValue={user.email}
                    className="w-full rounded-md border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Notification Preferences</label>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <input 
                        id="notify-reviews" 
                        type="checkbox" 
                        defaultChecked
                        className="rounded border-input bg-transparent" 
                      />
                      <label htmlFor="notify-reviews" className="text-sm">
                        Notify me about responses to my reviews
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input 
                        id="notify-books" 
                        type="checkbox" 
                        defaultChecked
                        className="rounded border-input bg-transparent" 
                      />
                      <label htmlFor="notify-books" className="text-sm">
                        Notify me about new book recommendations
                      </label>
                    </div>
                  </div>
                </div>
                
                <Button
                  type="button"
                  className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Profile;
