
import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { useParams, useNavigate } from 'react-router-dom';
import { useBooks } from '../../context/BookContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Loader2, ArrowLeft, Save } from 'lucide-react';
import { toast } from 'sonner';
import { API_URL } from "@/lib/api";

const BookEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { books, getAllGenres } = useBooks();
  const isNewBook = id === 'new';
  
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    coverImage: '',
    description: '',
    genres: [] as string[],
    publicationDate: new Date().toISOString(),
    featured: false
  });
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [availableGenres, setAvailableGenres] = useState<string[]>([]);
  
  useEffect(() => {
    // Load available genres
    const genres = getAllGenres();
    setAvailableGenres(genres);
    
    // If editing an existing book, load its data
    if (!isNewBook && id) {
      const book = books.find(b => b._id === id);
      if (book) {
        setFormData({
          title: book.title,
          author: book.author,
          coverImage: book.coverImage,
          description: book.description,
          genres: book.genres,
          publicationDate: book.publicationDate,
          featured: book.featured || false
        });
        setDate(new Date(book.publicationDate));
      }
    }
  }, [id, books, isNewBook, getAllGenres]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, featured: checked }));
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setDate(date);
      setFormData(prev => ({ ...prev, publicationDate: date.toISOString() }));
    }
  };

  const handleGenreSelect = (genre: string) => {
    if (formData.genres.includes(genre)) {
      setFormData(prev => ({
        ...prev,
        genres: prev.genres.filter(g => g !== genre)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        genres: [...prev.genres, genre]
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const url = isNewBook
      ? `${API_URL}/api/books`
      : `${API_URL}/api/books/${id}`;

    const method = isNewBook ? "POST" : "PUT";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Failed to save book: ${response.statusText}`);
      }

      const result = await response.json();
      toast.success(
        isNewBook ? "Book created successfully" : "Book updated successfully"
      );
      navigate("/admin/books");
    } catch (error) {
      console.error("Error saving book:", error);
      toast.error("Failed to save book");
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">
              {isNewBook ? 'Add New Book' : 'Edit Book'}
            </h1>
            <p className="text-muted-foreground">
              {isNewBook 
                ? 'Add a new book to your collection' 
                : 'Update the details of this book'}
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-8 border rounded-lg p-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Book title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="author">Author</Label>
                <Input
                  id="author"
                  name="author"
                  placeholder="Author name"
                  value={formData.author}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="coverImage">Cover Image URL</Label>
                <Input
                  id="coverImage"
                  name="coverImage"
                  placeholder="https://example.com/image.jpg"
                  value={formData.coverImage}
                  onChange={handleInputChange}
                  required
                />
                {formData.coverImage && (
                  <div className="mt-2 w-20 h-30 overflow-hidden rounded border">
                    <img 
                      src={formData.coverImage} 
                      alt="Cover preview" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label>Publication Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={handleDateSelect}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="featured">Featured Book</Label>
                  <Switch
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={handleSwitchChange}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Featured books appear on the homepage
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Book description"
                  className="min-h-[150px]"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label>Genres</Label>
                <div className="grid grid-cols-2 gap-2">
                  {availableGenres.map(genre => (
                    <div 
                      key={genre}
                      className={`
                        flex items-center justify-center p-2 border rounded-md cursor-pointer text-sm
                        ${formData.genres.includes(genre) 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-background hover:bg-secondary/50'}
                      `}
                      onClick={() => handleGenreSelect(genre)}
                    >
                      {genre}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Click to select multiple genres
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Book
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default BookEditor;
