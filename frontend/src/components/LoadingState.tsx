import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type BookGridSkeletonProps = {
  count?: number;
  className?: string;
};

export const BookGridSkeleton = ({
  count = 8,
  className,
}: BookGridSkeletonProps) => (
  <div
    className={cn(
      "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6",
      className
    )}
  >
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="space-y-3">
        <Skeleton className="aspect-[2/3] w-full rounded-lg" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    ))}
  </div>
);

export const FeaturedBookSkeleton = () => (
  <div className="grid md:grid-cols-2 gap-8 items-center">
    <Skeleton className="aspect-[2/3] max-w-sm mx-auto w-full rounded-xl" />
    <div className="space-y-4">
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-20 w-full" />
      <Skeleton className="h-10 w-32" />
    </div>
  </div>
);

export const TableRowsSkeleton = ({
  rows = 5,
  cols = 4,
}: {
  rows?: number;
  cols?: number;
}) => (
  <>
    {Array.from({ length: rows }).map((_, row) => (
      <tr key={row} className="border-b">
        {Array.from({ length: cols }).map((_, col) => (
          <td key={col} className="p-4">
            <Skeleton className="h-4 w-full max-w-[10rem]" />
          </td>
        ))}
      </tr>
    ))}
  </>
);

export const PageLoader = ({
  label = "Loading...",
}: {
  label?: string;
}) => (
  <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
    <p className="text-sm">{label}</p>
  </div>
);

export const BookDetailSkeleton = () => (
  <div className="grid md:grid-cols-[280px_1fr] gap-8 py-8">
    <Skeleton className="aspect-[2/3] w-full max-w-[280px] rounded-xl" />
    <div className="space-y-4">
      <Skeleton className="h-10 w-2/3" />
      <Skeleton className="h-5 w-1/4" />
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-32 w-full" />
      <div className="flex gap-2">
        <Skeleton className="h-8 w-20 rounded-full" />
        <Skeleton className="h-8 w-20 rounded-full" />
      </div>
    </div>
  </div>
);
