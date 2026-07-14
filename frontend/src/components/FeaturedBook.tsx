
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { StarRating } from './StarRating';
import { Book } from '../context/BookContext';
import { ArrowRight } from 'lucide-react';

type FeaturedBookProps = {
  book: Book;
};

export const FeaturedBook: React.FC<FeaturedBookProps> = ({ book }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <Link
      to={`/books/${book._id}`}
      className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-background to-secondary shadow-md hover:shadow-lg transition-all duration-300"
    >
      <div className="flex flex-col-reverse md:flex-row">
        <div className="relative z-10 flex flex-1 flex-col justify-center p-6 md:p-10">
          <div className="animate-fade-in opacity-0" style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}>
            <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              Featured
            </div>
          </div>
          <h2 
            className="mt-4 text-2xl font-bold leading-tight md:text-4xl animate-fade-in opacity-0" 
            style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}
          >
            {book.title}
          </h2>
          <p 
            className="mt-2 text-muted-foreground animate-fade-in opacity-0" 
            style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}
          >
            by {book.author}
          </p>
          <div 
            className="mt-2 flex items-center animate-fade-in opacity-0" 
            style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}
          >
            <StarRating rating={book.rating} />
            <span className="ml-2 text-sm text-muted-foreground">
              {book.rating.toFixed(1)} ({book.reviews.length} reviews)
            </span>
          </div>
          <p 
            className="mt-4 line-clamp-2 md:line-clamp-3 text-sm md:text-base text-muted-foreground animate-fade-in opacity-0" 
            style={{ animationDelay: '500ms', animationFillMode: 'forwards' }}
          >
            {book.description}
          </p>
          <div 
            className="mt-6 inline-flex items-center font-medium text-primary animate-fade-in opacity-0" 
            style={{ animationDelay: '600ms', animationFillMode: 'forwards' }}
          >
            <span>Read more</span>
            <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
        <div className="relative aspect-[3/2] md:aspect-square md:w-1/3 overflow-hidden">
          <div
            className={`blur-load absolute inset-0 ${imageLoaded ? 'loaded' : ''}`}
            style={{ backgroundImage: book.blurImage ? `url(${book.blurImage})` : undefined }}
          >
            <img
              src={book.coverImage}
              alt={book.title}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              onLoad={() => setImageLoaded(true)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
          </div>
        </div>
      </div>
    </Link>
  );
};
