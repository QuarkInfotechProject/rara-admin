"use client";
import axios from "axios";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import CTAActions from "@/components/cta/cta-actions";
import CTAFilter from "@/components/cta/cta-filter";
import LoadingSkeletion from "@/components/loading-skeletion";
import PageLayout from "@/components/page-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CTA } from "@/types/cta.types";
import { PaginatedResponse } from "@/types/index.types";
import { useQuery } from "@tanstack/react-query";

function CTAs() {
  const [hasMore, setHasMore] = useState(false);
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) ?? 1;
  const category = searchParams.get("category");

  const { data, isPending } = useQuery({
    queryKey: ["ctas", page, category],
    queryFn: async () => {
      const { data } = await axios.post<PaginatedResponse<CTA>>(
        `/api/cta/paginate`,
        {
          filters: {
            type: category,
          },
        },
        {
          params: {
            page,
          },
        }
      );
      const ctaData = data.data.data;
      setHasMore(data.data.current_page < data.data.last_page);
      return ctaData;
    },
    gcTime: 0,
  });

  return (
    <PageLayout
      title="CTAs"
      description="Manage your call to actions."
      actions={
        <>
          <CTAFilter />
          <Link href="/admin/cta/new">
            <Button size="sm" className="gap-1">
              <PlusCircle size={16} />
              <span className="sr-only sm:not-sr-only">Add CTA</span>
            </Button>
          </Link>
        </>
      }
      hasMore={hasMore}
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Fullname</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isPending && <LoadingSkeletion columns={5} />}
          {!isPending &&
            data?.map((cta) => (
              <TableRow className="*:py-2" key={cta.id}>
                <TableCell className="font-medium truncate capitalize">{cta.fullname}</TableCell>
                <TableCell>
                  <Badge className="capitalize" variant="outline">
                    {cta.status}
                  </Badge>
                </TableCell>
                <TableCell>{cta.email}</TableCell>
                <TableCell>{cta.phone_number}</TableCell>
                <TableCell className="w-20">
                  <CTAActions id={cta.id} />
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </PageLayout>
  );
}

export default CTAs;
