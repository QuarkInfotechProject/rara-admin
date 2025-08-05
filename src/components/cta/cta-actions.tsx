import axios from "axios";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import React from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { queryClient } from "@/lib/context/react-query-context";
import displayError from "@/lib/utils/display-error";

interface Props {
  id: number;
}

function CTAActions({ id }: Props) {
  async function deleteCTA() {
    const toastId = toast.loading("Deleting cta...");
    try {
      await axios.get(`/api/cta/delete/${id}`);
      await queryClient.invalidateQueries({
        queryKey: ["ctas"],
      });
      toast.success("CTA deleted successfully!", { id: toastId });
    } catch (error) {
      displayError(error, { toastId: toastId, fallback: "Failed to delete CTA!" });
    }
  }

  async function changeStatus(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    const target = e.target as HTMLDivElement;
    const value = target.dataset.value;

    if (!value) return;
    const toastId = toast.loading("Updating status...");
    try {
      await axios.post(`/api/cta/change-status`, { id, status: value });
      await queryClient.invalidateQueries({
        queryKey: ["ctas"],
      });
      toast.success("Status updated successfully!", { id: toastId });
    } catch (error) {
      displayError(error, { toastId: toastId, fallback: "Failed to update status!" });
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
          <Link href={`/admin/cta/view?id=${id}`}>View</Link>
        </DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Change status</DropdownMenuSubTrigger>
          <DropdownMenuSubContent onClick={changeStatus}>
            <DropdownMenuItem data-value="new">New</DropdownMenuItem>
            <DropdownMenuItem data-value="processing">Processing</DropdownMenuItem>
            <DropdownMenuItem data-value="contacted">Contacted</DropdownMenuItem>
            <DropdownMenuItem data-value="completed">Completed</DropdownMenuItem>
            <DropdownMenuItem data-value="on-hold">On hold</DropdownMenuItem>
            <DropdownMenuItem data-value="cancelled">Cancelled</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuItem onClick={deleteCTA}>Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default CTAActions;
