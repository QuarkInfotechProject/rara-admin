import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ApiResponse } from "@/types/index.types";
import { Skeleton } from "@/components/ui/skeleton";
import { RatingStats } from "@/types/dashboard.types";
import { ScrollArea } from "@/components/ui/scroll-area";

function RecentReviews() {
  const { data, isPending } = useQuery({
    queryKey: ["rating-stats"],
    queryFn: async () => {
      const ratingStats = await axios.get<ApiResponse<RatingStats>>("/api/dashboard/product-rating-stats");
      return ratingStats.data.data;
    },
  });

  if (isPending) {
    return <Skeleton className="w-full h-full min-h-96 rounded-xl" />;
  }

  if (data?.recent_reviews.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Recent Reviews</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-screen max-h-96">
          <div className="flex flex-col gap-3">
            {data?.recent_reviews.map((review) => (
              <Card key={review.id}>
                <CardHeader className="p-2">
                  <CardTitle className="text-base">
                    {review.product.name} ({review.average_rating}/5)
                  </CardTitle>
                  <CardDescription>{review.public_review}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

export default RecentReviews;
