
import React from 'react';
import { Heart } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface LikeButtonProps {
  bookId: string;
}

export const LikeButton: React.FC<LikeButtonProps> = ({ bookId }) => {
  const { isAuthenticated, toggleLikeBook, isBookLiked } = useUser();
  const isLiked = isBookLiked(bookId);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleLikeBook(bookId);
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={`absolute top-2 right-2 h-8 w-8 rounded-full ${isLiked ? 'bg-primary/10' : 'bg-background/80'} backdrop-blur-sm`}
            onClick={handleLike}
            disabled={!isAuthenticated}
          >
            <Heart
              className={`h-4 w-4 ${isLiked ? 'fill-primary text-primary' : 'text-foreground'}`}
            />
            <span className="sr-only">Like</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {isAuthenticated 
            ? (isLiked ? 'Remove from favorites' : 'Add to favorites') 
            : 'Sign in to like books'}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
