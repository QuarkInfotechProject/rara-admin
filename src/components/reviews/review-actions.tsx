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
import displayError from "@/lib/utils/display-error";
import { useQueryClient } from "@tanstack/react-query";

interface Props {
  id: number;
  isApproved: boolean;
}

function ReviewActions({ id, isApproved }: Props) {
  const queryClient = useQueryClient();

  async function toggleReviewStatus() {
    const toastId = toast.loading("Updating review...");
    try {
      await axios.get(`/api/review/approve-toggle/${id}`);
      await queryClient.invalidateQueries({
        queryKey: ["reviews"],
      });
      toast.success("Review updated successfully!", { id: toastId });
    } catch (error) {
      displayError(error, { toastId, fallback: "Failed to updated review!" });
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
          <Link href={`/admin/reviews/view?id=${id}`}>View</Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={toggleReviewStatus}>{isApproved ? "Reject" : "Approve"}</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default ReviewActions;
