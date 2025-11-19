"use client";
import axios from "axios";
import { CircleUser } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import displayError from "@/lib/utils/display-error";

function HeaderMenu() {
  const router = useRouter();
  async function handleLogout() {
    try {
      await axios.post("/api/logout");
      router.push("/login");
    } catch (error) {
      toast.error("Failed to logout!");
    }
  }

  async function handlePurgeCache() {
    const toastId = toast.loading("Purging cache...");
    try {
      await axios.post("/api/revalidate", {
        paths: ["/"],
        tags: ["promotions"],
        purgeEverything: true,
      });
      toast.success("Cache purged successfully!", { id: toastId });
    } catch (error) {
      displayError(error, { toastId });
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="icon" className="rounded-full">
          <CircleUser className="h-5 w-5" />
          <span className="sr-only">Toggle user menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href="/admin/change-password">Change password</Link>
        </DropdownMenuItem>
        {/* <DropdownMenuItem onClick={handlePurgeCache}>Purge Cache</DropdownMenuItem> */}
        <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default HeaderMenu;
