"use client";
import axios from "axios";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import LoadingSkeletion from "@/components/loading-skeletion";
import PageLayout from "@/components/page-layout";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import WhyUsActions from "@/components/why-us/why-us-actions";
import { ApiResponse } from "@/types/index.types";
import { ListWhyUs } from "@/types/why-us.types";
import { useQuery } from "@tanstack/react-query";

function WhyUs() {
  const { data, isPending } = useQuery({
    queryKey: ["why-us"],
    queryFn: async () => {
      const { data } = await axios.get<ApiResponse<ListWhyUs[]>>(`/api/why-us/list`);
      const whyUsData = data.data;
      return whyUsData;
    },
  });

  return (
    <PageLayout
      title="Why Us"
      description="Manage why us."
      actions={
        <Link href="/admin/why-us/new">
          <Button size="sm" className="gap-1">
            <PlusCircle size={16} />
            <span className="sr-only sm:not-sr-only">Add Why Us</span>
          </Button>
        </Link>
      }
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Order</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isPending && <LoadingSkeletion columns={3} />}
          {!isPending &&
            data?.map((whyus) => (
              <TableRow className="*:py-2" key={whyus.id}>
                <TableCell className="font-medium truncate">{whyus.title}</TableCell>
                <TableCell className="capitalize">{whyus.order}</TableCell>
                <TableCell className="w-20">
                  <WhyUsActions id={whyus.id} />
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </PageLayout>
  );
}

export default WhyUs;
