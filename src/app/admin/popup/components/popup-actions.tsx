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
  url: string;
}

function PopupActions({ id, url }: Props) {
  async function deletePopup() {
    const toastId = toast.loading("Deleting popup...");
    try {
      await axios.delete(`/api/popup/destroy/${id}`);
      await queryClient.invalidateQueries({
        queryKey: ["popup"],
      });
      toast.success("Popup deleted successfully!", { id: toastId });
    } catch (error) {
      displayError(error, { toastId, fallback: "Failed to delete popup!" });
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
          <Link href={`/admin/popup/edit/${url}`}>Edit</Link>
        </DropdownMenuItem>
        {/* <DropdownMenuItem onClick={deletePopup}>Delete</DropdownMenuItem> */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default PopupActions;
