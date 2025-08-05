import React from "react";
import {
  DialogOrDrawer,
  DialogOrDrawerContent,
  DialogOrDrawerHeader,
  DialogOrDrawerTitle,
} from "@/components/ui/dialog-or-drawer";
import ServiceOrderVoucher from "./service-order-voucher";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Resolution, usePDF } from "react-to-pdf";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ApiResponse } from "@/types/index.types";
import { BookingDetail } from "@/types/bookings.types";
import { IconLoader2 } from "@tabler/icons-react";

interface Props {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  bookingId: number;
}

function DownloadBookingServiceOrder({ open, onOpenChange, bookingId }: Props) {
  const { data, isPending } = useQuery({
    queryKey: ["booking-service-order-voucher", bookingId],
    queryFn: async () => {
      const { data } = await axios.get<ApiResponse<BookingDetail>>(`/api/booking/detail/${bookingId}`);
      return data.data;
    },
    enabled: open,
  });
  const { toPDF, targetRef } = usePDF({
    filename: `booking-service-order-voucher-${bookingId}.pdf`,
    page: {
      margin: 0,
    },
  });

  return (
    <DialogOrDrawer open={open} onOpenChange={onOpenChange}>
      <DialogOrDrawerContent className="max-w-4xl">
        <DialogOrDrawerHeader>
          <DialogOrDrawerTitle>Booking Service Order</DialogOrDrawerTitle>
        </DialogOrDrawerHeader>
        <ScrollArea className="h-[80vh]">
          {isPending ? (
            <div className="py-10">
              <IconLoader2 className="animate-spin mx-auto" />
            </div>
          ) : (
            <ServiceOrderVoucher
              ref={targetRef}
              fromDate={data?.booking_details.from_date}
              toDate={data?.booking_details.to_date}
              room={data?.booking_details.room_required}
              bookingNo={data?.booking_details.ref_no}
              ceo={data?.booking_details.ceo}
              group={data?.booking_details.group_name}
              guests={data?.booking_details.adult}
              note={data?.additional_info.additional_note}
            />
          )}
        </ScrollArea>
        <Button className="m-3 md:m-0" size="sm" onClick={() => toPDF()} disabled={isPending}>
          Download
        </Button>
      </DialogOrDrawerContent>
    </DialogOrDrawer>
  );
}

export default DownloadBookingServiceOrder;
