"use client";
import axios from "axios";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import LoadingSkeletion from "@/components/loading-skeletion";
import PageLayout from "@/components/page-layout";
import TagActions from "@/components/product/tag/tag-actions";
import TagFilter from "@/components/product/tag/tag-filter";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ApiResponse } from "@/types/index.types";
import { Tag as TagType } from "@/types/products.types";
import { useQuery } from "@tanstack/react-query";

function Tag() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const { data, isPending } = useQuery({
    queryKey: ["tags", type],
    queryFn: async () => {
      const { data } = await axios.post<ApiResponse<TagType[]>>(`/api/tag/list`, {
        filters: {
          type,
        },
      });
      const tagData = data.data;
      return tagData;
    },
  });

  return (
    <PageLayout
      title="Tags"
      description="Manage your tags."
      actions={
        <>
          <TagFilter />
          <Link href="/admin/product/tag/new">
            <Button size="sm" className="gap-1">
              <PlusCircle size={16} />
              <span className="sr-only sm:not-sr-only">Add Tag</span>
            </Button>
          </Link>
        </>
      }
      hidePagination
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isPending && <LoadingSkeletion columns={4} />}
          {!isPending &&
            data?.map((tag) => (
              <TableRow className="*:py-2" key={tag.id}>
                <TableCell className="font-medium truncate">{tag.name}</TableCell>
                <TableCell className="capitalize">{tag.slug}</TableCell>
                <TableCell className="capitalize">{tag.type}</TableCell>
                <TableCell className="w-20">
                  <TagActions id={tag.id} />
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </PageLayout>
  );
}

export default Tag;
