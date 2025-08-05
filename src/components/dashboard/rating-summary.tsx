import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ApiResponse } from "@/types/index.types";
import { Skeleton } from "@/components/ui/skeleton";
import { RatingStats } from "@/types/dashboard.types";

function RatingSummary() {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Rating Summary</CardTitle>
      </CardHeader>
      <CardContent className="[_h3]:font-medium [&_h4]:text-lg">
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-4 *:border-r border p-4 rounded-lg">
          <div>
            <h3>Total Reviews</h3>
            <h4>{data?.summary.total_reviews}</h4>
          </div>
          <div>
            <h3>Pending Approvals</h3>
            <h4>{data?.summary.pending_approvals}</h4>
          </div>
          <div>
            <h3>Pending Replies</h3>
            <h4>{data?.summary.pending_replies}</h4>
          </div>
          <div>
            <h3>Approval Completion Rate</h3>
            <h4>{data?.summary.approval_completion_rate}</h4>
          </div>
          <div>
            <h3>Reply Completion Rate</h3>
            <h4>{data?.summary.reply_completion_rate}</h4>
          </div>
        </div>
        <CardTitle className="text-lg my-2">Average Rating</CardTitle>
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-4 *:border-r border p-4 rounded-lg">
          <div>
            <h3>Cleanliness</h3>
            <h4>{data?.average_ratings.cleanliness}</h4>
          </div>
          <div>
            <h3>Communication</h3>
            <h4>{data?.average_ratings.communication}</h4>
          </div>
          <div>
            <h3>Hospitality</h3>
            <h4>{data?.average_ratings.hospitality}</h4>
          </div>
          <div>
            <h3>Value for money</h3>
            <h4>{data?.average_ratings.value_for_money}</h4>
          </div>
          <div>
            <h3>Overall</h3>
            <h4>{data?.average_ratings.overall}</h4>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default RatingSummary;
