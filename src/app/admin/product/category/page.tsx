"use client";
import axios from "axios";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import LoadingSkeletion from "@/components/loading-skeletion";
import PageLayout from "@/components/page-layout";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PaginatedBlogCategoryResponse } from "@/types/blog.types";
import { PaginatedResponse } from "@/types/index.types";
import { useQuery } from "@tanstack/react-query";
import CategoryActions from "@/components/product/category-actions";

function Category() {
  const [hasMore, setHasMore] = useState(false);
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) ?? 1;
  const search = searchParams.get("search");

  const { data, isPending } = useQuery({
    queryKey: ["blog-categories", page, search],
    queryFn: async () => {
      const { data } = await axios.post<PaginatedResponse<PaginatedBlogCategoryResponse>>(
        `/api/blog/category/paginate`,
        {
          filters: {
            name: search,
          },
        },
        {
          params: {
            page,
          },
        }
      );
      const categories = data.data.data;
      setHasMore(data.data.current_page < data.data.last_page);
      return categories;
    },
    gcTime: 0,
  });

  return (
    <PageLayout
      title="Categories"
      description="Manage your post categories."
      actions={
        <Link href="/admin/product/category/new">
          <Button size="sm" className="gap-1">
            <PlusCircle size={16} />
            <span className="sr-only sm:not-sr-only">Add category</span>
          </Button>
        </Link>
      }
      hasMore={hasMore}
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isPending && <LoadingSkeletion columns={3} />}
          {!isPending &&
            data?.map((category) => (
              <TableRow className="*:py-2" key={category.id}>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell>{category.slug}</TableCell>
                <TableCell className="w-20">
                  <CategoryActions id={category.id} />
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </PageLayout>
  );
}

export default Category;
