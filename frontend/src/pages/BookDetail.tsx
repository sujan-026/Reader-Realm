import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Layout } from "../components/Layout";
import { StarRating } from "../components/StarRating";
import { ReviewCard } from "../components/ReviewCard";
import { useBooks } from "../context/BookContext";
import { useUser } from "../context/UserContext";
import {
  Calendar,
  Tag,
  ArrowLeft,
  ThumbsUp,
  MessageSquare,
  Loader2,
} from "lucide-react";
import { useToast } from "../hooks/use-toast";
import { BookDetailSkeleton } from "../components/LoadingState";

interface Review {
  _id?: string;
  userId: string;
  userName: string;
  rating: number;
  text: string;
}

interface Book {
  _id: string;
  title: string;
  author: string;
  description: string;
  coverImage: string;
  blurImage?: string;
  publicationDate: string;
  genres: string[];
  rating: number;
  reviews: Review[];
}

const BookDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { fetchBookById, submitReview } = useBooks();
  const { user } = useUser();
  const { toast } = useToast();

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [userReview, setUserReview] = useState("");
  const [userRating, setUserRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const loadBook = async () => {
      setLoading(true);
      try {
        const fetchedBook = await fetchBookById(id!);
        setBook(fetchedBook);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch book details.",
          variant: "destructive",
        });
        navigate("/books");
      }
      setLoading(false);
    };

    loadBook();
    window.scrollTo(0, 0);
  }, [id, fetchBookById, navigate, toast]);

  if (loading) {
    return (
      <Layout>
        <BookDetailSkeleton />
      </Layout>
    );
  }

  if (!book) {
    return null;
  }

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: "Login required",
        description: "Please log in to submit a review.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    const reviewData = {
      bookId: id!,
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar || "",
      rating: userRating,
      text: userReview,
    };

    try {
      console.log("Submitting review data:", reviewData); // Log the data to verify

      await submitReview(reviewData);

      toast({
        title: "Review submitted",
        description: "Your review has been added successfully.",
      });

      setUserReview("");
      setUserRating(5);

      // Refresh book details after submitting review
      const updatedBook = await fetchBookById(id!);
      setBook(updatedBook);
    } catch (error) {
      console.error("Full review submission error:", error);
      toast({
        title: "Error",
        description: `Failed to submit review: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        variant: "destructive",
      });
    }

    setIsSubmitting(false);
  };

  // Group reviews by recent and older
  const recentReviews = book.reviews.slice(0, 3);
  const olderReviews = book.reviews.slice(3);

  return (
    <Layout>
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="sticky top-24">
            <div
              className={`aspect-[2/3] overflow-hidden rounded-lg shadow-md ${
                imageLoaded ? "" : "animate-pulse bg-muted"
              }`}
            >
              <div
                className={`blur-load h-full w-full ${
                  imageLoaded ? "loaded" : ""
                }`}
                style={{
                  backgroundImage: book.blurImage
                    ? `url(${book.blurImage})`
                    : undefined,
                }}
              >
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="h-full w-full object-cover"
                  onLoad={() => setImageLoaded(true)}
                />
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-muted-foreground mr-2" />
                  <span className="text-sm text-muted-foreground">
                    {new Date(book.publicationDate).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Genres</h3>
                <div className="flex flex-wrap gap-2">
                  {book.genres.map((genre) => (
                    <div
                      key={genre}
                      className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium"
                    >
                      <Tag className="mr-1 h-3 w-3" />
                      {genre}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            {book.title}
          </h1>
          <p className="mt-2 text-xl font-medium">by {book.author}</p>

          <div className="mt-3 flex items-center">
            <StarRating rating={book.rating} size="lg" />
            <span className="ml-2 text-muted-foreground">
              {book.rating.toFixed(1)} ({book.reviews.length} reviews)
            </span>
          </div>

          <div className="mt-6 prose prose-lg max-w-none">
            <p className="text-muted-foreground">{book.description}</p>
          </div>

          <div className="mt-10">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <MessageSquare className="mr-2 h-5 w-5" />
              Reviews
            </h2>

            {user ? (
              <form
                onSubmit={handleReviewSubmit}
                className="mb-10 bg-card p-6 rounded-lg shadow-sm"
              >
                <h3 className="text-lg font-medium mb-4">Write a Review</h3>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    Rating
                  </label>
                  <div className="flex gap-4 items-center">
                    <StarRating rating={userRating} />
                    <select
                      aria-label="Rating"
                      value={userRating}
                      onChange={(e) => setUserRating(Number(e.target.value))}
                      className="rounded-md border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                    >
                      {[1, 2, 3, 4, 5].map((num) => (
                        <option key={num} value={num}>
                          {num}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <textarea
                  value={userReview}
                  onChange={(e) => setUserReview(e.target.value)}
                  rows={4}
                  placeholder="Share your thoughts..."
                  className="w-full rounded-md border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  required
                />

                <button
                  type="submit"
                  disabled={isSubmitting || !userReview.trim()}
                  className="mt-4 inline-flex items-center bg-primary px-4 py-2 text-sm font-medium text-primary-foreground rounded-md disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Review
                      <ThumbsUp className="ml-2 h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <div className="mb-10 bg-card p-6 rounded-lg shadow-sm text-center space-y-3">
                <p className="text-muted-foreground">
                  Log in to share your review with the community.
                </p>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                >
                  Log in to review
                </Link>
              </div>
            )}

            {recentReviews.length > 0 ? (
              <div className="space-y-2">
                {recentReviews.map((review, index) => (
                  <ReviewCard
                    key={review._id || review.userId}
                    review={{
                      ...review,
                      id: review._id || review.userId,
                      date: "",
                    }}
                    index={index}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                No reviews yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BookDetail;
