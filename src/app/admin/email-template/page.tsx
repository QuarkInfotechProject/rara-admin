"use client";
import axios from "axios";
import Link from "next/link";
import LoadingSkeletion from "@/components/loading-skeletion";
import PageLayout from "@/components/page-layout";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ApiResponse } from "@/types/index.types";
import { IconEdit } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";

function EmailTemplates() {
  const { data, isPending } = useQuery({
    queryKey: ["email-templates"],
    queryFn: async () => {
      const { data } = await axios.get<ApiResponse<{ name: string; title: string }[]>>("/api/emails");
      return data.data;
    },
  });

  return (
    <PageLayout title="Emails" description="Manage your email templates." hidePagination>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isPending && <LoadingSkeletion columns={3} />}
          {!isPending &&
            data?.map((email) => (
              <TableRow className="*:py-2" key={email.name}>
                <TableCell className="font-medium truncate capitalize">{email.title}</TableCell>
                <TableCell>{email.name}</TableCell>
                <TableCell className="w-20">
                  <Link href={`/admin/email-template/edit/?name=${email.name}`}>
                    <Button aria-haspopup="true" size="icon" variant="ghost">
                      <IconEdit size={20} stroke={1.5} />
                      <span className="sr-only">Edit</span>
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </PageLayout>
  );
}

export default EmailTemplates;
