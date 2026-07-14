import React, { useEffect, useState } from "react";
import { StarRating } from "./StarRating";
import { Review } from "../context/BookContext";
import { formatDistanceToNow } from "date-fns";
import { API_URL } from "@/lib/api";

type ReviewCardProps = {
  review: Review;
  index: number;
};

export const ReviewCard: React.FC<ReviewCardProps> = ({ review, index }) => {
  const [fetchedReview, setFetchedReview] = useState<Review | null>(null);

  // Debugging: Check raw review details
  const reviewId = Object.values(review).join("");
  // console.log("Raw Review:", reviewId);

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/reviews/${reviewId}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch review");
        }

        const data = await response.json();
        if (!data.success) {
          throw new Error("Error fetching review");
        }

        setFetchedReview(data.data); // Update state with fetched review
      } catch (error) {
        console.error("Error fetching review:", error);
      }
    };

    fetchReview();
  }, [review]); // Fetch review when the ID changes

  // Use fetched review if available, otherwise fallback to props
  const displayedReview = fetchedReview || review;

  // Parse and format date safely
  const parsedDate = displayedReview.date
    ? new Date(displayedReview.date)
    : null;
  const formattedDate =
    parsedDate && !isNaN(parsedDate.getTime())
      ? formatDistanceToNow(parsedDate, { addSuffix: true })
      : "Unknown date";

  return (
    <div
      className="review-card p-5 rounded-lg bg-card shadow-sm mb-4"
      style={{ "--index": index } as React.CSSProperties}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-4">
          <div className="w-10 h-10 rounded-full overflow-hidden">
            {displayedReview.userAvatar ? (
              <img
                src={displayedReview.userAvatar}
                alt={displayedReview.userName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                {displayedReview.userName
                  ? displayedReview.userName.charAt(0)
                  : "?"}
              </div>
            )}
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">{displayedReview.userName}</h4>
            <span className="text-xs text-muted-foreground">
              {formattedDate}
            </span>
          </div>
          <div className="mt-1">
            <StarRating rating={displayedReview.rating} size="sm" />
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            {displayedReview.text}
          </p>
        </div>
      </div>
    </div>
  );
};
