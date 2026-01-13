"use client";
import axios from "axios";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import LoadingSkeletion from "@/components/loading-skeletion";
import PageLayout from "@/components/page-layout";
import ProductActions from "@/components/product/product-actions";
import ProductFilter from "@/components/product/product-filter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PaginatedResponse } from "@/types/index.types";
import { Product } from "@/types/products.types";
import { useQuery } from "@tanstack/react-query";

function ToursContent() {
  const [hasMore, setHasMore] = useState(false);
  const searchParams = useSearchParams();
  const status = searchParams.get("status");
  const page = Number(searchParams.get("page")) ?? 1;

  const { data, isPending } = useQuery({
    queryKey: ["products", "tour", page, status],
    queryFn: async () => {
      const { data } = await axios.post<PaginatedResponse<Product>>(
        `/api/product/tour/paginate`,
        {
          filters: {
            status,
          },
        },
        {
          params: {
            page,
          },
        }
      );
      const productData = data.data.data;
      setHasMore(data.data.current_page < data.data.last_page);
      return productData;
    },
    gcTime: 0,
  });

  return (
    <PageLayout
      title="Tours"
      description="Manage your Tours."
      actions={
        <>
          <ProductFilter />
          <Link href="/admin/product/tour/new">
            <Button size="sm" className="gap-1">
              <PlusCircle size={16} />
              <span className="sr-only sm:not-sr-only">Add Tour</span>
            </Button>
          </Link>
        </>
      }
      hasMore={hasMore}
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Short Code</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isPending && <LoadingSkeletion columns={4} />}
          {!isPending &&
            data?.map((product) => (
              <TableRow className="*:py-2" key={product.id}>
                <TableCell className="font-medium truncate">{product.name}</TableCell>
                <TableCell className="capitalize">
                  <Badge className="capitalize" variant="outline">
                    {product.status}
                  </Badge>
                </TableCell>
                <TableCell className="capitalize">{product.short_code}</TableCell>
                <TableCell className="w-20">
                  <ProductActions id={product.id} type="tour" />
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </PageLayout>
  );
}

function Tours() {
  return (
    <Suspense fallback={<LoadingSkeletion columns={4} />}>
      <ToursContent />
    </Suspense>
  );
}

export default Tours;

