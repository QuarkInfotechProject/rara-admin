"use client";
import axios from "axios";
import { useState } from "react";
import BookingActions from "@/components/bookings/booking-actions";
import BookingFilter from "@/components/bookings/booking-filter";
import LoadingSkeletion from "@/components/loading-skeletion";
import PageLayout from "@/components/page-layout";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Booking } from "@/types/bookings.types";
import { PaginatedResponse } from "@/types/index.types";
import { useQuery } from "@tanstack/react-query";
import useBookingsFilter from "./_hooks/use-bookings-filter";
import HasRespondedToggle from "@/components/bookings/has-responded-toggle";
import { differenceInCalendarDays } from "date-fns";
import { cn } from "@/lib/utils";
import BookingStatusTabs from "@/components/bookings/booking-status-tabs";

function Bookings() {
  const [hasMore, setHasMore] = useState(false);
  const filters = useBookingsFilter();

  const { data, isPending } = useQuery({
    queryKey: ["bookings", filters],
    queryFn: async () => {
      const { data } = await axios.post<PaginatedResponse<Booking>>(
        `/api/booking/paginate`,
        {
          filters,
        },
        {
          params: {
            page: filters.page,
          },
        }
      );
      setHasMore(data.data.current_page < data.data.last_page);
      return data.data.data;
    },
    gcTime: 0,
  });

  function findColor(date: string) {
    const difference = differenceInCalendarDays(new Date(), new Date(date));
    //Today
    if (difference === 0) {
      return "bg-red-300 dark:bg-red-600";
    }
    //Next day
    if (difference === -1) {
      return "bg-green-300 dark:bg-green-600";
    }
    //Yesterday
    if (difference === 1) {
      return "bg-yellow-300 dark:bg-yellow-600";
    }
    return "";
  }

  return (
    <PageLayout
      title="Bookings"
      description="Manage your bookings."
      actions={
        <>
          <BookingFilter />
          {/* <Link href="/admin/bookings/new">
            <Button size="sm" className="gap-1">
              <PlusCircle size={16} />
              <span className="sr-only sm:not-sr-only">Add Booking</span>
            </Button>
          </Link> */}
        </>
      }
      hasMore={hasMore}
    >
      <BookingStatusTabs />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Client</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Product Type</TableHead>
            <TableHead>Booking Type</TableHead>
            <TableHead>From</TableHead>
            <TableHead>To</TableHead>
            <TableHead>Responded</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isPending && <LoadingSkeletion columns={7} />}
          {!isPending &&
            data?.map((booking) => (
              <TableRow
                className={cn("*:py-2", findColor(booking.from_date))}
                key={booking.id}
              >
                <TableCell className="font-medium truncate">
                  {booking.fullname}
                </TableCell>
                <TableCell className="font-medium truncate">
                  {booking.product_name}
                </TableCell>
                <TableCell>
                  <Badge className="capitalize bg-background" variant="outline">
                    {booking.status}
                  </Badge>
                </TableCell>
                <TableCell className="capitalize">
                  {booking.product_type}
                </TableCell>
                <TableCell className="capitalize">{booking.type}</TableCell>
                <TableCell>{booking.from_date}</TableCell>
                <TableCell>{booking.to_date}</TableCell>
                <TableCell className="w-11">
                  <HasRespondedToggle
                    id={booking.id}
                    hasResponded={booking.has_responded === 0}
                  />
                </TableCell>
                <TableCell className="w-12">
                  <BookingActions id={booking.id} />
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </PageLayout>
  );
}

export default Bookings;
