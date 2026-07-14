
import React from 'react';
import { Layout } from '../components/Layout';
import { SearchBar } from '../components/SearchBar';
import { BookFilter } from '../components/BookFilter';
import { BookCard } from '../components/BookCard';
import { useBooks } from '../context/BookContext';
import { Book } from 'lucide-react';

const Books = () => {
  const { filteredBooks, searchTerm } = useBooks();

  return (
    <Layout>
      <section className="pt-8">
        <div className="mx-auto max-w-2xl animate-fade-in">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Explore Our Library
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Browse through our collection and find your next read.
          </p>
          <div className="mt-6">
            <SearchBar />
          </div>
        </div>
      </section>

      <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-4">
        <div className="md:col-span-1">
          <div className="sticky top-24">
            <BookFilter />
          </div>
        </div>
        <div className="md:col-span-3">
          {filteredBooks.length > 0 ? (
            <>
              <p className="mb-4 text-sm text-muted-foreground">
                Showing {filteredBooks.length} book{filteredBooks.length !== 1 ? 's' : ''}
                {searchTerm && (
                  <span> for "{searchTerm}"</span>
                )}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-4">
                {filteredBooks.map((book, index) => (
                  <BookCard key={book._id} book={book} index={index} />
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-muted p-4 mb-4">
                <Book className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="mb-2 text-lg font-medium">No books found</h3>
              <p className="text-muted-foreground">
                {searchTerm
                  ? `We couldn't find any books matching "${searchTerm}". Try a different search term.`
                  : "Try adjusting your filters to find what you're looking for."}
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Books;
