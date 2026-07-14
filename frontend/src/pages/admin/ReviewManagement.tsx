import React, { useState, useEffect } from "react";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Star, Book, Edit, Trash2, Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { API_URL } from "@/lib/api";

const ReviewManagement = () => {
  const [reviews, setReviews] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchReviews();
    fetchBooks();
  }, []);

  // Fetch reviews
  const fetchReviews = async () => {
    try {
      const response = await fetch(`${API_URL}/api/reviews`);
      if (!response.ok) throw new Error("Failed to fetch reviews");

      const data = await response.json();
      if (!data.success) throw new Error("Failed to fetch reviews");

      setReviews(data.data); // Store reviews in state
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast.error("Failed to load reviews");
    }
  };

  // Fetch books
  const fetchBooks = async () => {
    try {
      const response = await fetch(`${API_URL}/api/books`);
      if (!response.ok) throw new Error("Failed to fetch books");

      const data = await response.json();
      if (!data.success) throw new Error("Failed to fetch books");

      setBooks(data.data); // Store books in state
    } catch (error) {
      console.error("Error fetching books:", error);
      toast.error("Failed to load books");
    }
  };

  // Match reviews with book titles
  const getBookTitleByReviewId = (reviewId: string): string => {
    for (const book of books) {
      if (book.reviews.includes(reviewId)) {
        return book.title; // Return the book title if the review exists in its array
      }
      // console.log(book.reviews);
    }
    return "Unknown"; // Default title if no match is found
  };

  // Delete a review
  const handleDeleteReview = async (reviewId) => {
    try {
      const response = await fetch(
        `${API_URL}/api/reviews/${reviewId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        toast.success("Review deleted successfully");
        setReviews(reviews.filter((review) => review.id !== reviewId)); // Remove from state
      } else {
        toast.error("Failed to delete review");
      }
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error("Failed to delete review");
    }
  };

  // Navigate to edit review page
  const handleEditReview = (reviewId) => {
    navigate(`/admin/reviews/edit/${reviewId}`);
  };

  // Filter reviews based on search term
  const filteredReviews = reviews.filter(
    (review) =>
      review.text?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.bookTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.userName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Reviews</h1>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search reviews..."
                className="w-full appearance-none pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Book Title</TableHead>
                <TableHead>Reviewer</TableHead>
                <TableHead>Review</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReviews.length > 0 ? (
                filteredReviews.map((review) => (
                  <TableRow key={review.id}>
                    <TableCell>{getBookTitleByReviewId(review.id)}</TableCell>
                    <TableCell>{review.userName}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {review.text}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Star className="mr-1 h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{review.rating}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(review.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <Link to={`/books/${review.bookId}`}>
                            <DropdownMenuItem>
                              <Book className="mr-2 h-4 w-4" />
                              View Book
                            </DropdownMenuItem>
                          </Link>
                          <DropdownMenuItem
                            onClick={() => handleEditReview(review.id)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Review
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => handleDeleteReview(review.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Review
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No reviews found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ReviewManagement;
