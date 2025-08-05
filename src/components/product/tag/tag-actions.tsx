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

function TagActions({ id }: Props) {
  async function deleteTag() {
    const toastId = toast.loading("Deleting tag...");
    try {
      await axios.post(`/api/tag/delete`, {
        id,
      });
      await queryClient.invalidateQueries({
        queryKey: ["tags"],
      });
      toast.success("Tag deleted successfully!", { id: toastId });
    } catch (error) {
      displayError(error, {
        toastId,
        fallback: "Failed to delete tag!",
      });
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
          <Link href={`/admin/product/tag/edit?id=${id}`}>Edit</Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={deleteTag}>Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default TagActions;
