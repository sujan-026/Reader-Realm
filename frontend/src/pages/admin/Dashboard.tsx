import { useEffect, useState } from "react";
import { AdminLayout } from "../../components/admin/AdminLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BookOpen, Star, Users, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { API_URL, authHeaders } from "@/lib/api";
import { PageLoader } from "@/components/LoadingState";

const Dashboard = () => {
  const [books, setBooks] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch Books
        const booksRes = await fetch(`${API_URL}/api/books`);
        if (!booksRes.ok)
          throw new Error(
            `Books API Error: ${booksRes.status} ${booksRes.statusText}`
          );
        const booksData = await booksRes.json();
          // console.log(booksData.data);
        // Extract books array if API returns an object
        const booksArray = booksData.data

        // Fetch Users
        const usersRes = await fetch(`${API_URL}/api/users`, {
          headers: authHeaders(),
        });
        if (!usersRes.ok)
          throw new Error(
            `Users API Error: ${usersRes.status} ${usersRes.statusText}`
          );
        const usersData = await usersRes.json();

        // Extract users count if API returns an object
        const usersCount = usersData.data.length;

        // console.log("Books Data:", booksArray);
        // console.log("Users Data:", usersCount);

        setBooks(booksArray);
        setTotalUsers(usersCount);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate statistics
  const totalBooks = books.length;
  const totalReviews = books.reduce(
    (acc, book) => acc + (book.reviews?.length || 0),
    0
  );
  const averageRating = totalBooks
    ? (
        books.reduce((acc, book) => acc + (book.rating || 0), 0) / totalBooks
      ).toFixed(1)
    : "0.0";

  // Get recent books
  const recentBooks = books
    .sort(
      (a, b) =>
        new Date(b.publicationDate).getTime() -
        new Date(a.publicationDate).getTime()
    )
    .slice(0, 5);

  if (loading)
    return (
      <AdminLayout>
        <PageLoader label="Loading dashboard..." />
      </AdminLayout>
    );
  if (error)
    return (
      <AdminLayout>
        <p className="text-center text-red-500 py-20">{error}</p>
      </AdminLayout>
    );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <div className="space-x-2">
            <Link to="/">
              <Button variant="outline">Home</Button>
            </Link>
            <Link to="/admin/books/new">
              <Button>Add New Book</Button>
            </Link>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Books</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalBooks}</div>
              <p className="text-xs text-muted-foreground">in the collection</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Reviews
              </CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalReviews}</div>
              <p className="text-xs text-muted-foreground">across all books</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Average Rating
              </CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{averageRating}/5</div>
              <p className="text-xs text-muted-foreground">across all books</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers}</div>
              <p className="text-xs text-muted-foreground">active users</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle>Recent Books</CardTitle>
              <CardDescription>
                The latest books added to the catalog
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentBooks.map((book) => (
                  <div key={book._id} className="flex items-center">
                    <div className="w-10 h-14 mr-4 overflow-hidden rounded">
                      <img
                        src={book.coverImage}
                        alt={book.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {book.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {book.author}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                      <span className="text-xs">{book.rating}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Book Categories</CardTitle>
              <CardDescription>Distribution of books by genre</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from(new Set(books.flatMap((book) => book.genres || [])))
                  .slice(0, 5)
                  .map((genre) => {
                    const count = books.filter((book) =>
                      book.genres?.includes(genre)
                    ).length;
                    const percentage = Math.round((count / totalBooks) * 100);

                    return (
                      <div key={genre} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm">{genre}</p>
                          <p className="text-xs text-muted-foreground">
                            {count} books
                          </p>
                        </div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
