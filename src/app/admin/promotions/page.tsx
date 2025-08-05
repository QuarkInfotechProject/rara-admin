"use client";
import axios from "axios";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import LoadingSkeletion from "@/components/loading-skeletion";
import PageLayout from "@/components/page-layout";
import PromotionActions from "@/components/promotions/promotion-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ApiResponse } from "@/types/index.types";
import { ListPromotion } from "@/types/promotions.types";
import { useQuery } from "@tanstack/react-query";

function Promotions() {
  const { data, isPending } = useQuery({
    queryKey: ["promotions"],
    queryFn: async () => {
      const { data } = await axios.get<ApiResponse<ListPromotion[]>>(`/api/promotion/list`);
      const promotionData = data.data;
      return promotionData;
    },
  });

  return (
    <PageLayout
      title="Promotions"
      description="Manage your promotions."
      actions={
        <Link href="/admin/promotions/new">
          <Button size="sm" className="gap-1">
            <PlusCircle size={16} />
            <span className="sr-only sm:not-sr-only">Add Promotion</span>
          </Button>
        </Link>
      }
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Placement</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isPending && <LoadingSkeletion columns={4} />}
          {!isPending &&
            data?.map((promotion) => (
              <TableRow className="*:py-2" key={promotion.id}>
                <TableCell className="font-medium truncate">{promotion.name}</TableCell>
                <TableCell>
                  <Badge className="capitalize" variant="outline">
                    {promotion.is_active ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell>{promotion.placement_place}</TableCell>
                <TableCell className="w-20">
                  <PromotionActions id={promotion.id} />
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </PageLayout>
  );
}

export default Promotions;
