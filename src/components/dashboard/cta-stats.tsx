import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ApiResponse } from "@/types/index.types";
import { CTAStats as CTAStatsType } from "@/types/dashboard.types";
import { Skeleton } from "@/components/ui/skeleton";

function CTAStats() {
  const { data, isPending } = useQuery({
    queryKey: ["cta-stats"],
    queryFn: async () => {
      const ctaStats = await axios.get<ApiResponse<CTAStatsType>>("/api/dashboard/cta-stats");
      return ctaStats.data.data;
    },
  });

  if (isPending) {
    return <Skeleton className="w-full h-full min-h-96 rounded-xl" />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">CTA Stats</CardTitle>
      </CardHeader>
      <CardContent className="[_h3]:font-medium [&_h4]:text-lg">
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 *:border-r border p-4 rounded-lg">
          <div>
            <h3>Total CTAs</h3>
            <h4>{data?.total.all_ctas}</h4>
          </div>
          <div>
            <h3>Total Contacts</h3>
            <h4>{data?.total.unique_contacts}</h4>
          </div>
        </div>
        <CardTitle className="text-lg my-2">Status</CardTitle>
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 *:border-r border p-4 rounded-lg">
          <div>
            <h3>New</h3>
            <h4>{data?.total.unique_contacts}</h4>
          </div>
          <div>
            <h3>Processing</h3>
            <h4>{data?.total.unique_contacts}</h4>
          </div>
          <div>
            <h3>Contacted</h3>
            <h4>{data?.total.unique_contacts}</h4>
          </div>
          <div>
            <h3>Completed</h3>
            <h4>{data?.total.unique_contacts}</h4>
          </div>
          <div>
            <h3>On hold</h3>
            <h4>{data?.total.unique_contacts}</h4>
          </div>
          <div>
            <h3>Cancelled</h3>
            <h4>{data?.total.unique_contacts}</h4>
          </div>
        </div>
        <CardTitle className="text-lg my-2">Type</CardTitle>
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 *:border-r border p-4 rounded-lg">
          <div>
            <h3>Contact</h3>
            <h4>{data?.type_counts.contact}</h4>
          </div>
          <div>
            <h3>Volunteer</h3>
            <h4>{data?.type_counts.volunteer}</h4>
          </div>
          <div>
            <h3>Partner</h3>
            <h4>{data?.type_counts.partner}</h4>
          </div>
          <div>
            <h3>Host</h3>
            <h4>{data?.type_counts.host}</h4>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default CTAStats;
