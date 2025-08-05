"use client";
import axios from "axios";
import { PlusCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import CreateGroupModal from "@/components/groups/create-group-modal";
import UpdateGroupModal from "@/components/groups/update-group-modal";
import LoadingSkeletion from "@/components/loading-skeletion";
import PageLayout from "@/components/page-layout";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PaginatedResponse } from "@/types/index.types";
import { Group } from "@/types/users.types";
import { IconEdit } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";

function Roles() {
  const [hasMore, setHasMore] = useState(false);
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) ?? 1;

  const { data, isPending } = useQuery({
    queryKey: ["admin-groups", page],
    queryFn: async () => {
      const { data } = await axios.get<PaginatedResponse<Group>>("/api/group", {
        params: {
          page,
        },
      });
      setHasMore(data.data.current_page < data.data.last_page);
      return data.data.data;
    },
    gcTime: 0,
  });

  return (
    <PageLayout
      title="Roles"
      description="Manage your roles."
      hasMore={hasMore}
      actions={
        <CreateGroupModal>
          <Button size="sm" className="gap-1">
            <PlusCircle size={16} />
            <span className="sr-only sm:not-sr-only">Add Role</span>
          </Button>
        </CreateGroupModal>
      }
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isPending && <LoadingSkeletion columns={2} />}
          {!isPending &&
            data?.map((group) => (
              <TableRow className="*:py-2" key={group.id}>
                <TableCell className="font-medium truncate capitalize">{group.name}</TableCell>
                <TableCell className="w-20">
                  <UpdateGroupModal id={group.id}>
                    <Button aria-haspopup="true" size="icon" variant="ghost">
                      <IconEdit size={20} stroke={1.5} />
                      <span className="sr-only">Edit</span>
                    </Button>
                  </UpdateGroupModal>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </PageLayout>
  );
}

export default Roles;
