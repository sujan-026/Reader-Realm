
import React from 'react';
import { Layout } from '../components/Layout';
import { FeaturedBook } from '../components/FeaturedBook';
import { BookCard } from '../components/BookCard';
import { useBooks } from '../context/BookContext';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Index = () => {
  const { featuredBooks, books } = useBooks();
  const featuredBook = featuredBooks[0];
  const recentBooks = books.slice(0, 4);

  return (
    <Layout>
      <section className="pt-8 md:pt-16 pb-12">
        <div className="space-y-2 text-center max-w-3xl mx-auto animate-fade-in">
          <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
            Discover and Share Your Reading Experience
          </h1>
          <p className="text-muted-foreground text-lg">
            Find your next favorite book and join the conversation with fellow readers.
          </p>
        </div>
      </section>

      <section className="my-12">
        {featuredBook && <FeaturedBook book={featuredBook} />}
      </section>

      <section className="my-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold tracking-tight">Recent Releases</h2>
          <Link 
            to="/books" 
            className="inline-flex items-center text-sm font-medium text-primary hover:underline"
          >
            View all
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {recentBooks.map((book, index) => (
            <BookCard key={book._id} book={book} index={index} />
          ))}
        </div>
      </section>

      <section className="my-16">
        <div className="rounded-2xl bg-gradient-to-r from-secondary via-secondary/50 to-background p-8 md:p-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold tracking-tight">Ready to share your thoughts?</h2>
              <p className="text-muted-foreground">
                Contribute to our community by reviewing books you've read.
              </p>
            </div>
            <Link
              to="/books"
              className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              Browse Books
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
