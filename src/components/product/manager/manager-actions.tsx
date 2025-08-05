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
}

function ManagerActions({ id }: Props) {
  async function deleteManager() {
    const toastId = toast.loading("Deleting manager...");
    try {
      await axios.post(`/api/manager/delete`, {
        id,
      });
      await queryClient.invalidateQueries({
        queryKey: ["manager"],
      });
      toast.success("Manager deleted successfully!", { id: toastId });
    } catch (error) {
      displayError(error, { toastId, fallback: "Failed to delete manager!" });
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
          <Link href={`/admin/product/manager/edit?id=${id}`}>Edit</Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={deleteManager}>Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default ManagerActions;
