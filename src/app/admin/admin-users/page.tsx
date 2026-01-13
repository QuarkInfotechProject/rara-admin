"use client";
import axios from "axios";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import LoadingSkeletion from "@/components/loading-skeletion";
import PageLayout from "@/components/page-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import UserFilter from "@/components/admin-users/user-filter";
import { PaginatedResponse } from "@/types/index.types";
import { Group, AdminUser } from "@/types/users.types";
import { useQuery } from "@tanstack/react-query";
import UserActions from "@/components/admin-users/user-actions";

function AdminUsersContent() {
  const [hasMore, setHasMore] = useState(false);
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) ?? 1;
  const name = searchParams.get("name");
  const email = searchParams.get("email");
  const status = searchParams.get("status");

  const { data, isPending } = useQuery({
    queryKey: ["admin-users", page, name, email, status],
    queryFn: async () => {
      const users = await axios.post<PaginatedResponse<AdminUser>>(
        `/api/users`,
        {
          name,
          email,
          status,
        },
        {
          params: {
            page,
          },
        }
      );
      const groups = await axios.get<PaginatedResponse<Group>>("/api/group");

      const usersData = users.data.data.data.map((user) => ({
        ...user,
        groupId: groups.data.data.data.find((group) => group.id === user.groupId)?.name,
      }));
      setHasMore(users.data.data.current_page < users.data.data.last_page);
      return usersData;
    },
    gcTime: 0,
  });

  return (
    <PageLayout
      title="Admin Users"
      description="Manage your admin users."
      actions={
        <>
          <UserFilter />
          <Link href="/admin/admin-users/new">
            <Button size="sm" className="gap-1">
              <PlusCircle size={16} />
              <span className="sr-only sm:not-sr-only">Add User</span>
            </Button>
          </Link>
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
            <TableHead>Role</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isPending && <LoadingSkeletion columns={5} />}
          {!isPending &&
            data?.map((user) => (
              <TableRow className="*:py-2" key={user.id}>
                <TableCell className="font-medium truncate capitalize">{user.fullName}</TableCell>
                <TableCell>
                  <Badge className="capitalize" variant="outline">
                    {user.status === 1 ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.groupId}</TableCell>
                <TableCell className="w-20">
                  <UserActions uuid={user.uuid} status={user.status} />
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </PageLayout>
  );
}

function AdminUsers() {
  return (
    <Suspense fallback={<LoadingSkeletion columns={5} />}>
      <AdminUsersContent />
    </Suspense>
  );
}

export default AdminUsers;

