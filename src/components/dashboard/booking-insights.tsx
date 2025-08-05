import React from "react";
import MonthlyInsights from "./monthly-insights";
import TopProducts from "./top-products";
import TopAgents from "./top-agents";
import axios from "axios";
import { ApiResponse } from "@/types/index.types";
import { BookingInsights as BookingInsightsType } from "@/types/dashboard.types";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  date: {
    startDate: string;
    endDate: string;
  };
}

function BookingInsights({ date }: Props) {
  const { data, isPending } = useQuery({
    queryKey: ["booking-insights", date],
    queryFn: async () => {
      const bookingInsights = await axios.post<ApiResponse<BookingInsightsType>>(
        "/api/dashboard/booking-insights",
        date
      );
      const monthlyInsights = bookingInsights.data.data.monthly_trends.map((trend) => ({
        label: trend.label,
        value: trend.total,
      }));
      return {
        bookingInsights: bookingInsights.data.data,
        monthlyInsights,
      };
    },
  });

  if (isPending) {
    return (
      <>
        <Skeleton className="w-full h-full min-h-96 rounded-xl" />
        <Skeleton className="w-full h-full min-h-96 rounded-xl" />
        <Skeleton className="w-full h-full min-h-96 rounded-xl" />
      </>
    );
  }

  return (
    <>
      <MonthlyInsights data={data?.monthlyInsights ?? []} />
      <TopProducts data={data?.bookingInsights?.top_products ?? []} />
      <TopAgents data={data?.bookingInsights?.top_agents ?? []} />
    </>
  );
}

export default BookingInsights;
