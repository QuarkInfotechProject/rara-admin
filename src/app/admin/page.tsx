"use client";
import CTAStats from "@/components/dashboard/cta-stats";
import TopCountries from "@/components/dashboard/top-countries";
import { addDays, format, subDays } from "date-fns";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import BookingInsights from "@/components/dashboard/booking-insights";
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";
import { DateRange } from "react-day-picker";
import BookingByStatus from "@/components/dashboard/booking-by-status";
import RatingStats from "@/components/dashboard/rating-stats";

function Dashboard() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: subDays(new Date(), 28),
    to: new Date(),
  });
  const [datesPayload, setDatesPayload] = useState<{
    startDate: string;
    endDate: string;
  }>({
    startDate: format(date?.from ?? new Date(), "yyyy-MM-dd"),
    endDate: format(date?.to ?? addDays(new Date(), 7), "yyyy-MM-dd"),
  });

  function updateDatesPayload() {
    setDatesPayload({
      startDate: format(date?.from ?? new Date(), "yyyy-MM-dd"),
      endDate: format(date?.to ?? addDays(new Date(), 7), "yyyy-MM-dd"),
    });
  }

  return (
    <main>
      <div className="flex gap-5 mb-5">
        <DatePickerWithRange value={date} onValueChange={setDate} />
        <Button onClick={updateDatesPayload}>Submit</Button>
      </div>
      <section className="grid lg:grid-cols-2 gap-5">
        <BookingInsights date={datesPayload} />
        <CTAStats />
        <TopCountries date={datesPayload} />
        <RatingStats />
        <BookingByStatus date={datesPayload} />
      </section>
    </main>
  );
}

export default Dashboard;
export const dynamic = "force-dynamic";
