
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { StarRating } from './StarRating';
import { Book } from '../context/BookContext';

type BookCardProps = {
  book: Book;
  index?: number;
};

export const BookCard: React.FC<BookCardProps> = ({ book, index = 0 }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <Link
      to={`/books/${book._id}`}
      className="book-card group block overflow-hidden rounded-lg bg-white shadow hover:shadow-md transition-all duration-300"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div
        className={`relative aspect-[2/3] overflow-hidden ${
          imageLoaded ? "" : "animate-pulse bg-muted"
        }`}
      >
        <div
          className={`blur-load w-full h-full ${imageLoaded ? "loaded" : ""}`}
          style={{
            backgroundImage: book.blurImage
              ? `url(${book.blurImage})`
              : undefined,
          }}
        >
          <img
            src={book.coverImage}
            alt={book.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            onLoad={() => setImageLoaded(true)}
          />
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="line-clamp-1 text-xs font-medium text-muted-foreground">
            {book.author}
          </div>
          <div className="flex items-center">
            <StarRating rating={book.rating} size="sm" />
            <span className="ml-1 text-xs text-muted-foreground">
              {book.rating}
            </span>
          </div>
        </div>
        <h3 className="mt-1 line-clamp-1 text-sm font-medium text-black">
          {book.title}
        </h3>
      </div>
    </Link>
  );
};
