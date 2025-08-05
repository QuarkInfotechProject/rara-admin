"use client";
import axios from "axios";
import LoadingSkeletion from "@/components/loading-skeletion";
import PageLayout from "@/components/page-layout";
import PagesActions from "@/components/pages/pages-actions";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ApiResponse } from "@/types/index.types";
import { Page } from "@/types/pages.types";
import { useQuery } from "@tanstack/react-query";

function AllPages() {
  const { data, isPending } = useQuery({
    queryKey: ["pages"],
    queryFn: async () => {
      const { data } = await axios.get<ApiResponse<Page[]>>(`/api/page/list`);
      const pagesData = data.data;
      return pagesData;
    },
  });

  return (
    <PageLayout title="Pages" description="Manage your page content.">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isPending && <LoadingSkeletion columns={4} />}
          {!isPending &&
            data?.map((page) => (
              <TableRow className="*:py-2" key={page.slug}>
                <TableCell className="font-medium truncate">{page.title}</TableCell>
                <TableCell>
                  <Badge className="capitalize" variant="outline">
                    {page.is_active ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell>{page.slug}</TableCell>
                <TableCell className="w-20">
                  <PagesActions type={page.type} />
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </PageLayout>
  );
}

export default AllPages;
