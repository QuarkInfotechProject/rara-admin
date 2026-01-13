"use client";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import LoadingSkeletion from "@/components/loading-skeletion";
import PageLayout from "@/components/page-layout";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import UserFilter from "@/components/users/user-filter";
import { PaginatedResponse } from "@/types/index.types";
import { User } from "@/types/users.types";
import { useQuery } from "@tanstack/react-query";
import UserActions from "@/components/users/user-actions";
import jsonToCsvExport from "json-to-csv-export";
import { Button } from "@/components/ui/button";
import { IconFileExport } from "@tabler/icons-react";

function UsersContent() {
  const [hasMore, setHasMore] = useState(false);
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) ?? 1;
  const status = searchParams.get("status");
  const name = searchParams.get("full_name");
  const email = searchParams.get("email");
  const phone = searchParams.get("phone_no");

  const { data, isPending } = useQuery({
    queryKey: ["users", page, name, email, status, phone],
    queryFn: async () => {
      const users = await axios.post<PaginatedResponse<User>>(
        `/api/user/paginate`,
        {
          filters: {
            full_name: name,
            email,
            status,
            phone_no: phone,
          },
        },
        {
          params: {
            page,
          },
        }
      );
      setHasMore(users.data.data.current_page < users.data.data.last_page);
      return users.data.data.data;
    },
    gcTime: 0,
  });

  return (
    <PageLayout
      title="Users"
      description="Manage your users."
      actions={
        <>
          <Button variant="outline" size="sm" className="gap-1" onClick={() => jsonToCsvExport({ data: data ?? [] })}>
            <IconFileExport size={16} />
            <span className="sr-only sm:not-sr-only">Export</span>
          </Button>
          <UserFilter />
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
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isPending && <LoadingSkeletion columns={5} />}
          {!isPending &&
            data?.map((user) => (
              <TableRow className="*:py-2" key={user.id}>
                <TableCell className="font-medium truncate capitalize">{user.full_name}</TableCell>
                <TableCell>
                  <Badge className="capitalize" variant="outline">
                    {user.status === 1 ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell className="w-20">
                  <UserActions id={user.id} status={user.status} />
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </PageLayout>
  );
}

function Users() {
  return (
    <Suspense fallback={<LoadingSkeletion columns={5} />}>
      <UsersContent />
    </Suspense>
  );
}

export default Users;

