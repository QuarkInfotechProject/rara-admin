import displayError from "@/lib/utils/display-error";
import axios from "axios";
import React from "react";
import toast from "react-hot-toast";
import { Switch } from "@/components/ui/switch";
import { queryClient } from "@/lib/context/react-query-context";

interface Props {
  id: number;
  hasResponded: boolean;
}

function HasRespondedToggle({ id, hasResponded }: Props) {
  async function toggleBookingStatus() {
    const toastId = toast.loading("Updating booking...");
    try {
      await axios.get(`/api/booking/toggle-respond/${id}`, {
        params: { id },
      });
      await queryClient.invalidateQueries({
        queryKey: ["bookings"],
      });
      toast.success("Booking updated successfully!", { id: toastId });
    } catch (error) {
      displayError(error, {
        toastId,
      });
    }
  }
  return (
    <div>
      <Switch defaultChecked={hasResponded} onCheckedChange={toggleBookingStatus} />
    </div>
  );
}

export default HasRespondedToggle;
