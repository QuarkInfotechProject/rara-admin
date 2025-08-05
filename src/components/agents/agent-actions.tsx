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

function AgentActions({ id, isActive }: Props) {
  async function toggleAgentStatus() {
    const toastId = toast.loading("Updating agent status...");
    try {
      await axios.get(`/api/agent/enable-disable/${id}`, {
        params: { id },
      });
      await queryClient.invalidateQueries({
        queryKey: ["agents"],
      });
      toast.success("Agent updated successfully!", { id: toastId });
    } catch (error) {
      displayError(error, {
        toastId,
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
          <Link href={`/admin/agents/edit?id=${id}`}>Edit</Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={toggleAgentStatus}>{isActive ? "Disable" : "Enable"}</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default AgentActions;
