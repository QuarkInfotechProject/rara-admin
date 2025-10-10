"use client";
import axios from "axios";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import CategoryActions from "@/components/product/category-actions";
import LoadingSkeletion from "@/components/loading-skeletion";
import PageLayout from "@/components/page-layout";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";

interface Meta {
  id?: number;
  entity_type: string;
  entity_id: number;
  meta_title?: string;
  meta_keywords?: string;
  meta_description?: string;
  created_at?: string;
  updated_at?: string;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  status: string;
  meta: Meta;
}

interface ApiResponse {
  code: number;
  message: string;
  data: {
    current_page: number;
    data: Category[];
    last_page: number;
    total: number;
  };
}

function Categories() {
  const [hasMore, setHasMore] = useState(false);

  const { data, isPending } = useQuery({
    queryKey: ["product-categories"],
    queryFn: async () => {
      const { data } = await axios.get<ApiResponse>(`/api/category/lists`);
      setHasMore(data.data.current_page < data.data.last_page);
      return data.data.data;
    },
    gcTime: 0,
  });

  return (
    <PageLayout
      title="Product Categories"
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

export default Categories;
