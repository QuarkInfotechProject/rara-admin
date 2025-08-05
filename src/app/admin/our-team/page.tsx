"use client";
import axios from "axios";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import LoadingSkeletion from "@/components/loading-skeletion";
import OurTeamActions from "@/components/our-team/team-actions";
import PageLayout from "@/components/page-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ApiResponse } from "@/types/index.types";
import { TeamMember } from "@/types/team.types";
import { useQuery } from "@tanstack/react-query";

function OurTeam() {
  const { data, isPending } = useQuery({
    queryKey: ["our-team"],
    queryFn: async () => {
      const { data } = await axios.get<ApiResponse<TeamMember[]>>(`/api/our-team/list`);
      const teamData = data.data;
      return teamData;
    },
  });

  return (
    <PageLayout
      title="Our Team"
      description="Manage your team members."
      actions={
        <Link href="/admin/our-team/new">
          <Button size="sm" className="gap-1">
            <PlusCircle size={16} />
            <span className="sr-only sm:not-sr-only">Add Team Member</span>
          </Button>
        </Link>
      }
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Position</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isPending && <LoadingSkeletion columns={4} />}
          {!isPending &&
            data?.map((team) => (
              <TableRow className="*:py-2" key={team.id}>
                <TableCell className="font-medium truncate">{team.name}</TableCell>
                <TableCell>
                  <Badge className="capitalize" variant="outline">
                    {team.is_active ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="capitalize">{team.position}</TableCell>
                <TableCell className="w-20">
                  <OurTeamActions id={team.id} isActive={Boolean(team.is_active)} />
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </PageLayout>
  );
}

export default OurTeam;
