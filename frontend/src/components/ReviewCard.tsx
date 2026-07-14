import React from "react";
import { StarRating } from "./StarRating";
import { Review } from "../context/BookContext";
import { formatDistanceToNow } from "date-fns";

type ReviewCardProps = {
  review: Review;
  index: number;
};

export const ReviewCard: React.FC<ReviewCardProps> = ({ review, index }) => {
  const parsedDate = review.date ? new Date(review.date) : null;
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
            {review.userAvatar ? (
              <img
                src={review.userAvatar}
                alt={review.userName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                {review.userName ? review.userName.charAt(0) : "?"}
              </div>
            )}
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">{review.userName}</h4>
            <span className="text-xs text-muted-foreground">
              {formattedDate}
            </span>
          </div>
          <div className="mt-1">
            <StarRating rating={review.rating} size="sm" />
          </div>
          <p className="mt-2 text-sm text-muted-foreground">{review.text}</p>
        </div>
      </div>
    </div>
  );
};
