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
import {
  MoreHorizontal,
  Star,
  Book,
  Edit,
  Trash2,
  Search,
  Loader2,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { API_URL, authHeaders } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

type ReviewRow = {
  _id: string;
  bookId?: string | { _id?: string; title?: string };
  userName?: string;
  text?: string;
  rating?: number;
  date?: string;
};

const ReviewManagement = () => {
  const [reviews, setReviews] = useState<ReviewRow[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/reviews`);
      if (!response.ok) throw new Error("Failed to fetch reviews");

      const data = await response.json();
      if (!data.success) throw new Error("Failed to fetch reviews");

      setReviews(data.data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast.error("Failed to load reviews");
    } finally {
      setIsLoading(false);
    }
  };

  const getBookTitle = (review: ReviewRow): string => {
    if (review.bookId && typeof review.bookId === "object") {
      return review.bookId.title || "Unknown";
    }
    return "Unknown";
  };

  const getBookId = (review: ReviewRow): string => {
    if (review.bookId && typeof review.bookId === "object") {
      return review.bookId._id || "";
    }
    return typeof review.bookId === "string" ? review.bookId : "";
  };

  const handleDeleteReview = async (reviewId: string) => {
    setDeletingId(reviewId);
    try {
      const response = await fetch(`${API_URL}/api/reviews/${reviewId}`, {
        method: "DELETE",
        headers: authHeaders(),
      });

      if (response.ok) {
        toast.success("Review deleted successfully");
        setReviews(reviews.filter((review) => review._id !== reviewId));
      } else {
        const data = await response.json().catch(() => ({}));
        toast.error(data.message || "Failed to delete review");
      }
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error("Failed to delete review");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredReviews = reviews.filter(
    (review) =>
      review.text?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getBookTitle(review).toLowerCase().includes(searchTerm.toLowerCase()) ||
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
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 6 }).map((_, j) => (
                      <TableCell key={j}>
                        <Skeleton className="h-4 w-24" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : filteredReviews.length > 0 ? (
                filteredReviews.map((review) => (
                  <TableRow key={review._id}>
                    <TableCell>{getBookTitle(review)}</TableCell>
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
                      {review.date
                        ? new Date(review.date).toLocaleDateString()
                        : "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={deletingId === review._id}
                          >
                            {deletingId === review._id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <MoreHorizontal className="h-4 w-4" />
                            )}
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {getBookId(review) && (
                            <Link to={`/books/${getBookId(review)}`}>
                              <DropdownMenuItem>
                                <Book className="mr-2 h-4 w-4" />
                                View Book
                              </DropdownMenuItem>
                            </Link>
                          )}
                          <DropdownMenuItem
                            onClick={() =>
                              navigate(`/admin/reviews/edit/${review._id}`)
                            }
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Review
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => handleDeleteReview(review._id)}
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
