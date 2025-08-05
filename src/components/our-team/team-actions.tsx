import axios from "axios";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { queryClient } from "@/lib/context/react-query-context";
import displayError from "@/lib/utils/display-error";

interface Props {
  id: number;
  isActive: boolean;
}

function OurTeamActions({ id, isActive }: Props) {
  async function deleteTeamMember() {
    const toastId = toast.loading("Deleting team member...");
    try {
      await axios.delete(`/api/our-our-team/delete/${id}`);
      await queryClient.invalidateQueries({
        queryKey: ["our-team"],
      });
      toast.success("Team member deleted successfully!", { id: toastId });
    } catch (error) {
      displayError(error, { toastId, fallback: "Failed to delete team member!" });
    }
  }

  async function changeStatus(newStatus: number) {
    const toastId = toast.loading("Updating status...");
    try {
      if (newStatus) {
        await axios.get(`/api/our-team/enable/${id}`);
      } else {
        await axios.get(`/api/our-team/disable/${id}`);
      }
      await queryClient.invalidateQueries({
        queryKey: ["our-team"],
      });
      toast.success("Status updated successfully!", { id: toastId });
    } catch (error) {
      displayError(error, { toastId, fallback: "Failed to update status!" });
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button aria-haspopup="true" size="icon" variant="ghost">
          <MoreHorizontal size={20} />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem asChild>
          <Link href={`/admin/our-team/edit?id=${id}`}>Edit</Link>
        </DropdownMenuItem>
        {isActive ? (
          <DropdownMenuItem onClick={() => changeStatus(0)}>Disable</DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={() => changeStatus(1)}>Enable</DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={deleteTeamMember}>Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default OurTeamActions;
