"use client";
import axios from "axios";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import LoadingSkeletion from "@/components/loading-skeletion";
import PageLayout from "@/components/page-layout";
import ManagerActions from "@/components/product/manager/manager-actions";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ApiResponse } from "@/types/index.types";
import { Manager } from "@/types/products.types";
import { useQuery } from "@tanstack/react-query";

function ManagerPage() {
  const { data, isPending } = useQuery({
    queryKey: ["manager"],
    queryFn: async () => {
      const { data } = await axios.get<ApiResponse<Manager[]>>(`/api/manager/list`);
      const managerData = data.data;
      return managerData;
    },
  });

  return (
    <PageLayout
      title="Manager"
      description="Manage your managers."
      actions={
        <Link href="/admin/product/manager/new">
          <Button size="sm" className="gap-1">
            <PlusCircle size={16} />
            <span className="sr-only sm:not-sr-only">Add Manager</span>
          </Button>
        </Link>
      }
      hidePagination
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isPending && <LoadingSkeletion columns={4} />}
          {!isPending &&
            data?.map((manager) => (
              <TableRow className="*:py-2" key={manager.id}>
                <TableCell className="font-medium truncate">
                  {manager.firstname} {manager.lastname}
                </TableCell>
                <TableCell className="capitalize">{manager.email}</TableCell>
                <TableCell className="capitalize">{manager.phone_number}</TableCell>
                <TableCell className="w-20">
                  <ManagerActions id={manager.id} />
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </PageLayout>
  );
}

export default ManagerPage;
