"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookingStatusSummary } from "@/types/dashboard.types";
import { ApiResponse } from "@/types/index.types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import { useMemo, useState } from "react";
import BookingStatusSelector from "../bookings/booking-status-selector";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Label, Legend, Pie, PieChart } from "recharts";

interface Props {
  date: {
    startDate: string;
    endDate: string;
  };
}

const chartConfig = {
  today: {
    label: "Today",
    color: "hsl(var(--chart-1))",
  },
  weekly: {
    label: "Weekly",
    color: "hsl(var(--chart-2))",
  },
  monthly: {
    label: "Monthly",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

function BookingByStatus({ date }: Props) {
  const [status, setStatus] = useState("pending");
  const { data, isPending } = useQuery({
    queryKey: ["booking-by-status", date, status],
    queryFn: async () => {
      const topCountries = await axios.post<ApiResponse<BookingStatusSummary>>("/api/dashboard/booking-status", {
        ...date,
        status,
      });
      return topCountries.data.data;
    },
  });

  const chartData = useMemo(
    () => [
      { label: "today", value: data?.today, fill: "var(--color-today)" },
      { label: "weekly", value: data?.weekly, fill: "var(--color-weekly)" },
      { label: "monthly", value: data?.monthly, fill: "var(--color-monthly)" },
    ],
    [data]
  );

  if (isPending) {
    return <Skeleton className="w-full h-full min-h-44 rounded-xl" />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Bookings by Status</CardTitle>
        <BookingStatusSelector value={status} onValueChange={setStatus} />
      </CardHeader>
      <CardContent className="flex-1">
        <p className="flex justify-between gap-4">
          <span className="font-medium">Total Bookings:</span> <span>{data?.total}</span>
        </p>
        {/* <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[300px]">
          <PieChart>
            <Legend />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie data={chartData} dataKey="value" nameKey="label" label fontSize={16} innerRadius={60} strokeWidth={5}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                        <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-3xl font-bold">
                          {data?.total}
                        </tspan>
                        <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground">
                          Bookings
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer> */}
      </CardContent>
    </Card>
  );
}

export default BookingByStatus;
