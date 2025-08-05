import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import axios from "axios";
import displayError from "@/lib/utils/display-error";
import toast from "react-hot-toast";
import { queryClient } from "@/lib/context/react-query-context";

interface Props {
  id: number;
  status: number;
}

function UserActions({ id, status }: Props) {
  async function blockUnblockUser() {
    const toastId = toast.loading("Updating user status...");
    try {
      await axios.get(`/api/user/toggle-block-unblock/${id}`);
      await queryClient.invalidateQueries({
        queryKey: ["users"],
      });
      toast.success("User status updated successfully!", { id: toastId });
    } catch (error) {
      displayError(error, { toastId });
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
          <Link href={`/admin/users/view?id=${id}`}>View</Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={blockUnblockUser}>{status === 1 ? "Block" : "Unblock"}</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UserActions;
