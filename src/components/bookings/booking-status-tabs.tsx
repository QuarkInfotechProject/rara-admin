"use client";
import useBookingsFilter from "@/app/admin/bookings/_hooks/use-bookings-filter";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";

const selectedClass = "bg-foreground text-background rounded-full px-5 py-0.5 font-medium";

function BookingStatusTabs() {
  const filter = useBookingsFilter();
  return (
    <div className="flex flex-wrap gap-5 pb-5 items-center">
      <Link className={cn(!filter.product_type && selectedClass)} href="?">
        All
      </Link>
      <Link className={cn(filter.product_type === "trek" && selectedClass)} href="?product_type=trek">
        Trek
      </Link>
      <Link className={cn(filter.product_type === "tour" && selectedClass)} href="?product_type=tour">
        Tour
      </Link>
      <Link className={cn(filter.product_type === "activities" && selectedClass)} href="?product_type=activities">
        Activities
      </Link>
    </div>
  );
}

export default BookingStatusTabs;
