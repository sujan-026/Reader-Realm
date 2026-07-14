import React, { useState, useEffect } from "react";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  Calendar as CalendarIcon,
  Loader2,
  ArrowLeft,
  Save,
} from "lucide-react";
import { toast } from "sonner";
import { Calendar } from "@/components/ui/calendar";
import { API_URL } from "@/lib/api";

const ReviewEditor = () => {
  const { id } = useParams(); // `id` corresponds to the review _id
  const navigate = useNavigate();
  const isNewReview = id === "new";

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    bookId: "", // Book that is being reviewed
    reviewerName: "",
    rating: 0,
    reviewText: "",
    featured: false,
  });
  const [date, setDate] = useState<Date | undefined>(new Date());

  useEffect(() => {
    // Load review data when editing an existing review (not a new one)
    if (!isNewReview && id) {
      fetch(`${API_URL}/api/reviews/${id}`) // Fetch review by _id
        .then((response) => response.json())
        .then((data) => {
          setFormData({
            bookId: data.bookId, // Assuming the response has a `bookId` field
            reviewerName: data.reviewerName,
            rating: data.rating,
            reviewText: data.reviewText,
            featured: data.featured,
          });
          setDate(new Date(data.createdAt)); // Assuming a `createdAt` field in response
        })
        .catch((error) => {
          console.error("Error fetching review:", error);
          toast.error("Failed to load review data");
        });
    }
  }, [id, isNewReview]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, featured: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const url = isNewReview
      ? `${API_URL}/api/reviews`
      : `${API_URL}/api/reviews/${id}`;

    const method = isNewReview ? "POST" : "PUT";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Failed to save review: ${response.statusText}`);
      }

      const result = await response.json();
      toast.success(
        isNewReview
          ? "Review created successfully"
          : "Review updated successfully"
      );
      navigate("/admin/reviews");
    } catch (error) {
      console.error("Error saving review:", error);
      toast.error("Failed to save review");
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
              {isNewReview ? "Add New Review" : "Edit Review"}
            </h1>
            <p className="text-muted-foreground">
              {isNewReview
                ? "Add a new review for a book"
                : "Update the details of this review"}
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-8 border rounded-lg p-6"
        >
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bookId">Book</Label>
                <Input
                  id="bookId"
                  name="bookId"
                  placeholder="Book ID"
                  value={formData.bookId}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reviewerName">Reviewer Name</Label>
                <Input
                  id="reviewerName"
                  name="reviewerName"
                  placeholder="Your name"
                  value={formData.reviewerName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rating">Rating</Label>
                <Input
                  id="rating"
                  name="rating"
                  type="number"
                  min="1"
                  max="5"
                  value={formData.rating}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Review Date</Label>
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
                      {date ? (
                        date.toLocaleDateString()
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(date) => setDate(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="featured">Featured Review</Label>
                  <Switch
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={handleSwitchChange}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Featured reviews will be highlighted
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reviewText">Review Text</Label>
                <Textarea
                  id="reviewText"
                  name="reviewText"
                  placeholder="Write your review"
                  className="min-h-[150px]"
                  value={formData.reviewText}
                  onChange={handleInputChange}
                  required
                />
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
                  Save Review
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default ReviewEditor;
