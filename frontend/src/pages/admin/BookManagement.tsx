
import React, { useState } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { useBooks } from '../../context/BookContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Star, PlusCircle, Search, Book, Edit, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { API_URL } from "@/lib/api";

const BookManagement = () => {
  const { books } = useBooks();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter books based on search term
  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteBook = async (bookId: string) => {
    // console.log(bookId);
    try {
      const response = await fetch(
        `${API_URL}/api/book/${bookId}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        toast.success('Book deleted successfully');
        // Optionally, update the books state here if needed.
      } else {
        toast.error('Failed to delete book');
      }
    } catch (error) {
      toast.error('Failed to delete book');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Books</h1>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search books..."
                className="w-full appearance-none pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Link to="/admin/books/new">
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Book
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Book</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Published</TableHead>
                <TableHead>Reviews</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBooks.length > 0 ? (
                filteredBooks.map((book) => (
                  <TableRow key={book._id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-8 overflow-hidden rounded">
                          <img 
                            src={book.coverImage} 
                            alt={book.title} 
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="font-medium">{book.title}</div>
                      </div>
                    </TableCell>
                    <TableCell>{book.author}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Star className="mr-1 h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{book.rating}</span>
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(book.publicationDate)}</TableCell>
                    <TableCell>{book.reviews.length}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <Link to={`/books/${book._id}`}>
                            <DropdownMenuItem>
                              <Book className="mr-2 h-4 w-4" />
                              View
                            </DropdownMenuItem>
                          </Link>
                          <Link to={`/admin/books/edit/${book._id}`}>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                          </Link>
                          <DropdownMenuItem 
                            className="text-destructive focus:text-destructive"
                            onClick={() => handleDeleteBook(book._id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No books found.
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

export default BookManagement;
