"use client";
import axios from "axios";
import { useState } from "react";
import LoadingSkeletion from "@/components/loading-skeletion";
import PageLayout from "@/components/page-layout";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CarRentalPaginationResponse } from "@/types/carRental.types";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import CarRentalActions from "@/components/car-rental/car-rental-actions";

function CarRentals() {
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);

  const { data, isPending } = useQuery({
    queryKey: ["car-rentals", page],
    queryFn: async () => {
      const { data } = await axios.post<CarRentalPaginationResponse>(
        `/api/car-rental/paginate`,
        {},
        {
          params: {
            page,
          },
        }
      );
      setHasMore(data.data.current_page < data.data.last_page);
      return data.data.data;
    },
    gcTime: 0,
  });

  return (
    <PageLayout
      title="Car Rentals"
      description="Manage your car rental requests."
      hasMore={hasMore}
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Pickup Time</TableHead>
            <TableHead>Pickup Address</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isPending && <LoadingSkeletion columns={8} />}
          {!isPending &&
            data?.map((rental) => (
              <TableRow className="*:py-2" key={rental.id}>
                <TableCell className="font-medium truncate">
                  {rental.user_name}
                </TableCell>
                <TableCell className="truncate">{rental.email}</TableCell>
                <TableCell className="truncate">{rental.contact}</TableCell>
                <TableCell>
                  <Badge className="capitalize bg-background" variant="outline">
                    {rental.status}
                  </Badge>
                </TableCell>
                <TableCell className="capitalize">{rental.type}</TableCell>
                <TableCell>
                  {format(new Date(rental.pickup_time), "PPp")}
                </TableCell>
                <TableCell className="truncate max-w-[200px]">
                  {rental.pickup_address}
                </TableCell>
                <TableCell className="w-12">
                  <CarRentalActions id={rental.id} />
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </PageLayout>
  );
}

export default CarRentals;
