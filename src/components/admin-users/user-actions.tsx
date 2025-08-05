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
  uuid: string;
  status: number;
}

function UserActions({ uuid, status }: Props) {
  async function toggleUserStatus() {
    const toastId = toast.loading("Updating user status...");
    try {
      await axios.post(status === 1 ? "/api/users/deactivate" : "/api/users/activate", {
        uuid,
      });
      await queryClient.invalidateQueries({
        queryKey: ["admin-users"],
      });
      toast.success("User status updated successfully!", { id: toastId });
    } catch (error) {
      displayError(error, { toastId: toastId, fallback: "Failed to update user status!" });
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
          <Link href={`/admin/admin-users/edit?uuid=${uuid}`}>Edit</Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={toggleUserStatus}>{status === 1 ? "Deactivate" : "Activate"}</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UserActions;
