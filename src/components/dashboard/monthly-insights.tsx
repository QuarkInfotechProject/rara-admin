"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const chartConfig = {
  bookings: {
    label: "Bookings",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

interface Props {
  data: {
    label: string;
    value: number;
  }[];
}

function MonthlyInsights({ data }: Props) {
  return (
    <Card className="flex flex-col justify-between">
      <CardHeader>
        <CardTitle className="text-lg">Monthly Insights</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer className="h-full" config={chartConfig}>
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="label"
              tickLine={false}
              tickMargin={10}
              fontSize={16}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Bar dataKey="value" fill="var(--color-bookings)" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export default MonthlyInsights;
