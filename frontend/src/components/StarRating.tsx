
import React from 'react';
import { Star, StarHalf } from 'lucide-react';

type StarRatingProps = {
  rating: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
};

export const StarRating: React.FC<StarRatingProps> = ({ 
  rating, 
  max = 5,
  size = 'md' 
}) => {
  // Calculate full and half stars
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  // Determine star dimensions based on size prop
  const dimensions = {
    sm: { width: 3, height: 3 },
    md: { width: 4, height: 4 },
    lg: { width: 5, height: 5 },
  }[size];

  return (
    <div className="flex">
      {Array.from({ length: max }).map((_, i) => {
        if (i < fullStars) {
          // Full star
          return (
            <Star
              key={i}
              className={`w-${dimensions.width} h-${dimensions.height} text-yellow-400 fill-yellow-400`}
            />
          );
        } else if (i === fullStars && hasHalfStar) {
          // Half star
          return (
            <StarHalf
              key={i}
              className={`w-${dimensions.width} h-${dimensions.height} text-yellow-400 fill-yellow-400`}
            />
          );
        } else {
          // Empty star
          return (
            <Star
              key={i}
              className={`w-${dimensions.width} h-${dimensions.height} text-muted`}
            />
          );
        }
      })}
    </div>
  );
};
