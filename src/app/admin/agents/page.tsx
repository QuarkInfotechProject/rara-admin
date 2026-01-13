"use client";
import axios from "axios";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import AgentActions from "@/components/agents/agent-actions";
import LoadingSkeletion from "@/components/loading-skeletion";
import PageLayout from "@/components/page-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PaginatedAgentResponse } from "@/types/agents.types";
import { PaginatedResponse } from "@/types/index.types";
import { useQuery } from "@tanstack/react-query";

function AgentsContent() {
  const [hasMore, setHasMore] = useState(false);
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) ?? 1;

  const { data, isPending } = useQuery({
    queryKey: ["agents", page],
    queryFn: async () => {
      const { data } = await axios.post<PaginatedResponse<PaginatedAgentResponse>>(
        `/api/agent/paginate`,
        {
          filters: {},
        },
        {
          params: {
            page,
          },
        }
      );
      setHasMore(data.data.current_page < data.data.last_page);
      return data.data.data;
    },
    gcTime: 0,
  });

  return (
    <PageLayout
      title="Agents"
      description="Manage your agents."
      hasMore={hasMore}
      actions={
        <Link href="/admin/agents/new">
          <Button size="sm" className="gap-1">
            <PlusCircle size={16} />
            <span className="sr-only sm:not-sr-only">Add Agent</span>
          </Button>
        </Link>
      }
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isPending && <LoadingSkeletion />}
          {data?.map((agent) => (
            <TableRow className="*:py-2" key={agent.id}>
              <TableCell className="font-medium truncate">
                {agent.firstname} {agent.lastname}
              </TableCell>
              <TableCell>
                <Badge variant="outline">{agent.is_active ? "Active" : "Inactive"}</Badge>
              </TableCell>
              <TableCell>{agent.email}</TableCell>
              <TableCell>{agent.phone}</TableCell>
              <TableCell className="w-20">
                <AgentActions id={agent.id} isActive={!!agent.is_active} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </PageLayout>
  );
}

function Agents() {
  return (
    <Suspense fallback={<LoadingSkeletion />}>
      <AgentsContent />
    </Suspense>
  );
}

export default Agents;

