"use client";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import LoadingSkeletion from "@/components/loading-skeletion";
import PageLayout from "@/components/page-layout";
import ReviewActions from "@/components/reviews/review-actions";
import ReviewFilter from "@/components/reviews/review-filter";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PaginatedResponse } from "@/types/index.types";
import { Review } from "@/types/reviews.types";
import { useQuery } from "@tanstack/react-query";

function Reviews() {
  const [hasMore, setHasMore] = useState(false);
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) ?? 1;
  const productId = searchParams.get("product_id");
  const userId = searchParams.get("user_id");
  const approved = searchParams.get("approved");

  const { data, isPending } = useQuery<Array<Review>>({
    queryKey: ["reviews", page, productId, userId, approved],
    queryFn: async () => {
      const { data } = await axios.post<PaginatedResponse<Review>>(
        `/api/review/paginate`,
        {
          filters: {
            product_id: productId,
            user_id: userId,
            approved,
          },
        },
        {
          params: {
            page,
          },
        }
      );
      const reviewData = data.data.data;
      setHasMore(data.data.current_page < data.data.last_page);
      return reviewData;
    },
    gcTime: 0,
  });

  return (
    <PageLayout title="Reviews" description="Manage your reviews." actions={<ReviewFilter />} hasMore={hasMore}>
      <Table>
        <TableHeader>
          <TableRow>
            {/* <TableHead>Fullname</TableHead> */}
            <TableHead>Status</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isPending && <LoadingSkeletion columns={5} />}
          {!isPending &&
            data?.map((review) => (
              <TableRow className="*:py-2" key={review.id}>
                {/* <TableCell className="font-medium truncate capitalize">{review.user.full_name}</TableCell> */}
                <TableCell>
                  <Badge className="capitalize" variant="outline">
                    {review.approved === 1 ? "Approved" : "Pending"}
                  </Badge>
                </TableCell>
                <TableCell>{review.product.name}</TableCell>
                <TableCell>{review.overall_rating}</TableCell>
                <TableCell className="w-20">
                  <ReviewActions id={review.id} isApproved={review.approved === 1} />
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </PageLayout>
  );
}

export default Reviews;
