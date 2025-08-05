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
      <Link className={cn(filter.product_type === "homestay" && selectedClass)} href="?product_type=homestay">
        Homestay
      </Link>
      <Link className={cn(filter.product_type === "experience" && selectedClass)} href="?product_type=experience">
        Experience
      </Link>
      <Link className={cn(filter.product_type === "package" && selectedClass)} href="?product_type=package">
        Package
      </Link>
      <Link className={cn(filter.product_type === "circuit" && selectedClass)} href="?product_type=circuit">
        Circuit
      </Link>
    </div>
  );
}

export default BookingStatusTabs;
