import axios from "axios";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
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
import DownloadBookingServiceOrder from "./download-booking-service-order";

interface Props {
  id: number;
}

function BookingActions({ id }: Props) {
  const [showBookingServiceOrder, setShowBookingServiceOrder] = useState(false);

  async function changeStatus(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    const target = e.target as HTMLDivElement;
    const value = target.dataset.value;

    if (!value) return;
    const toastId = toast.loading("Updating status...");
    try {
      await axios.put(`/api/booking/change-status`, { id, status: value });
      await queryClient.invalidateQueries({
        queryKey: ["bookings"],
      });
      toast.success("Status updated successfully!", { id: toastId });
    } catch (error) {
      displayError(error, {
        toastId,
      });
    }
  }

  return (
    <div className="flex items-center gap-1">
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
            <Link href={`/admin/bookings/edit?id=${id}`}>Edit</Link>
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Change status</DropdownMenuSubTrigger>
            <DropdownMenuSubContent onClick={changeStatus}>
              <DropdownMenuItem data-value="pending">Pending</DropdownMenuItem>
              <DropdownMenuItem data-value="in-progress">In Progress</DropdownMenuItem>
              <DropdownMenuItem data-value="confirmed">Confirmed</DropdownMenuItem>
              <DropdownMenuItem data-value="cancelled">Cancelled</DropdownMenuItem>
              <DropdownMenuItem data-value="completed">Completed</DropdownMenuItem>
              <DropdownMenuItem data-value="no-show">No Show</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuItem onClick={() => setShowBookingServiceOrder(true)}>View Service Order</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DownloadBookingServiceOrder
        open={showBookingServiceOrder}
        onOpenChange={setShowBookingServiceOrder}
        bookingId={id}
      />
    </div>
  );
}

export default BookingActions;
