import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

import axios from "axios";
import { API_URL, authHeaders, getToken } from "@/lib/api";

export type Book = {
  _id: string;
  title: string;
  author: string;
  coverImage: string;
  blurImage?: string;
  description: string;
  rating: number;
  reviews: Review[];
  genres: string[];
  publicationDate: string;
  featured?: boolean;
};

export type Review = {
  id: string;
  _id?: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  text: string;
  date: string;
};

type BookContextType = {
  books: Book[];
  featuredBooks: Book[];
  filteredBooks: Book[];
  isLoading: boolean;
  error: string | null;
  searchTerm: string;
  selectedGenres: string[];
  setSearchTerm: (term: string) => void;
  setSelectedGenres: (genres: string[]) => void;
  addReview: (
    bookId: string,
    review: Omit<Review, "id" | "date">
  ) => Promise<void>;
  getBook: (id: string) => Book | undefined;
  getAllGenres: () => string[];
  fetchBookById: (bookId: string) => Promise<Book | null>;
  submitReview: (reviewData: {
    bookId: string;
    userId: string;
    userName: string;
    userAvatar?: string;
    rating: number;
    text: string;
  }) => Promise<{ success: boolean; data: Review }>;
  refreshBooks: () => Promise<void>;
  removeBookLocally: (bookId: string) => void;
};

const BookContext = createContext<BookContextType | undefined>(undefined);

export const BookProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

  const fetchBooks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/api/books`);
      if (!response.ok) throw new Error("Failed to fetch books");

      const data = await response.json();
      if (!data.success) throw new Error("Failed to fetch books");

      const booksWithReviews = await Promise.all(
        data.data.map(async (book: Book & { reviews: string[] }) => {
          const reviewsWithDetails = await Promise.all(
            (book.reviews || []).map(async (reviewId: string) => {
              const reviewResponse = await fetch(
                `${API_URL}/api/reviews/${reviewId}`
              );
              if (!reviewResponse.ok) return null;

              const reviewData = await reviewResponse.json();
              return reviewData.success ? reviewData.data : null;
            })
          );

          return {
            ...book,
            reviews: reviewsWithDetails.filter((review) => review !== null),
          };
        })
      );

      setBooks(booksWithReviews);
    } catch (err) {
      console.error("Error fetching books:", err);
      setError("Could not load books. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBookById = async (bookId: string) => {
    try {
      const response = await fetch(`${API_URL}/api/books/${bookId}`);
      if (!response.ok) throw new Error("Failed to fetch book");
      const data = await response.json();
      const book = data.data;
      if (!book) return null;

      const reviewsWithDetails = await Promise.all(
        (book.reviews || []).map(async (reviewId: string | Review) => {
          if (typeof reviewId === "object" && reviewId !== null) {
            return reviewId;
          }
          const reviewResponse = await fetch(
            `${API_URL}/api/reviews/${reviewId}`
          );
          if (!reviewResponse.ok) return null;
          const reviewData = await reviewResponse.json();
          return reviewData.success ? reviewData.data : null;
        })
      );

      return {
        ...book,
        reviews: reviewsWithDetails.filter(Boolean),
      };
    } catch (err) {
      console.error("Error fetching book:", err);
      return null;
    }
  };

  const featuredBooks = books.filter((book) => book.featured);
  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesGenres =
      selectedGenres.length === 0 ||
      selectedGenres.some((genre) => book.genres.includes(genre));

    return matchesSearch && matchesGenres;
  });

  const addReview = async (
    bookId: string,
    review: Omit<Review, "id" | "date">
  ) => {
    const reviewPayload = {
      ...review,
      bookId,
      date: new Date().toISOString(),
    };

    try {
      const response = await fetch(`${API_URL}/api/reviews/`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(reviewPayload),
      });

      if (!response.ok) throw new Error("Failed to add review");

      const data = await response.json();
      if (!data.success) throw new Error("Failed to add review");

      const newReview = data.data;

      setBooks((prevBooks) =>
        prevBooks.map((book) =>
          book._id === bookId
            ? {
                ...book,
                reviews: [newReview, ...book.reviews],
                rating: calculateAverageRating([...book.reviews, newReview]),
              }
            : book
        )
      );
    } catch (err) {
      console.error("Error adding review:", err);
    }
  };

  const submitReview = async (reviewData: {
    bookId: string;
    userId: string;
    userName: string;
    userAvatar?: string;
    rating: number;
    text: string;
  }) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/reviews/`,
        {
          bookId: reviewData.bookId,
          rating: reviewData.rating,
          text: reviewData.text,
          userAvatar: reviewData.userAvatar,
        },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      return response.data;
    } catch (err) {
      console.error("Review submission error:", err);
      throw err;
    }
  };

  const calculateAverageRating = (reviews: Review[]): number => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return parseFloat((sum / reviews.length).toFixed(1));
  };

  const getBook = (id: string): Book | undefined => {
    return books.find((book) => book._id === id);
  };

  const getAllGenres = (): string[] => {
    const genresSet = new Set<string>();
    books.forEach((book) =>
      book.genres.forEach((genre) => genresSet.add(genre))
    );
    return Array.from(genresSet);
  };

  const removeBookLocally = (bookId: string) => {
    setBooks((prev) => prev.filter((book) => book._id !== bookId));
  };

  return (
    <BookContext.Provider
      value={{
        books,
        featuredBooks,
        filteredBooks,
        isLoading,
        error,
        searchTerm,
        selectedGenres,
        setSearchTerm,
        setSelectedGenres,
        addReview,
        getBook,
        getAllGenres,
        fetchBookById,
        submitReview,
        refreshBooks: fetchBooks,
        removeBookLocally,
      }}
    >
      {children}
    </BookContext.Provider>
  );
};

export const useBooks = (): BookContextType => {
  const context = useContext(BookContext);
  if (!context) {
    throw new Error("useBooks must be used within a BookProvider");
  }
  return context;
};
