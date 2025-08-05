"use client";
import axios from "axios";
import { format } from "date-fns";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import PostActions from "@/components/blog/post-actions";
import PostFilter from "@/components/blog/post-filter";
import LoadingSkeletion from "@/components/loading-skeletion";
import PageLayout from "@/components/page-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PaginatedBlogResponse } from "@/types/blog.types";
import { PaginatedResponse } from "@/types/index.types";
import { useQuery } from "@tanstack/react-query";

function Blog() {
  const [hasMore, setHasMore] = useState(false);
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) ?? 1;
  const search = searchParams.get("search");
  const category = searchParams.get("category");
  const status = searchParams.get("status");
  const type = searchParams.get("type");
  const author = searchParams.get("author");

  const { data, isPending } = useQuery({
    queryKey: ["blog", page, category, status, type, author],
    queryFn: async () => {
      const { data } = await axios.post<PaginatedResponse<PaginatedBlogResponse>>(
        `/api/blog/paginate`,
        {
          filters: {
            search,
            status,
            author,
            type,
            category,
          },
        },
        {
          params: {
            page,
          },
        }
      );
      const postData = data.data.data;
      setHasMore(data.data.current_page < data.data.last_page);
      return postData;
    },
    gcTime: 0,
  });

  return (
    <PageLayout
      title="Blog"
      description="Manage your blog posts, media coverage and reports."
      actions={
        <>
          <PostFilter />
          <Link href="/admin/blog/new">
            <Button size="sm" className="gap-1">
              <PlusCircle size={16} />
              <span className="sr-only sm:not-sr-only">Add post</span>
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
            <TableHead>Type</TableHead>
            <TableHead>Created at</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isPending && <LoadingSkeletion />}
          {!isPending &&
            data?.map((post) => (
              <TableRow className="*:py-2" key={post.id}>
                <TableCell className="font-medium truncate">{post.title}</TableCell>
                <TableCell>
                  <Badge className="capitalize" variant="outline">
                    {post.status}
                  </Badge>
                </TableCell>
                <TableCell className="capitalize">{post.type}</TableCell>
                <TableCell>{format(new Date(post.created_at), "dd LLL yyyy")}</TableCell>
                <TableCell className="w-11">
                  <PostActions id={post.id} />
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </PageLayout>
  );
}

export default Blog;
