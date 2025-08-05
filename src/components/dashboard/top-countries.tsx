"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TopCountry } from "@/types/dashboard.types";
import { ApiResponse } from "@/types/index.types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import countriesJson from "@/data/countries.json";

interface Props {
  date: {
    startDate: string;
    endDate: string;
  };
}

function TopCountries({ date }: Props) {
  const { data, isPending } = useQuery({
    queryKey: ["top-countries", date],
    queryFn: async () => {
      const response = await axios.post<ApiResponse<TopCountry[]>>("/api/dashboard/top-country", date);
      const countryMap = Object.fromEntries(countriesJson.map((c) => [c.code.toLowerCase(), c.name]));
      const countries = (response.data?.data ?? []).map((country) => ({
        ...country,
        country: countryMap[country.country] ?? country.country,
      }));
      return countries;
    },
  });

  if (isPending) {
    return <Skeleton className="w-full h-full min-h-96 rounded-xl" />;
  }

  if (data?.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Top Countries</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-screen max-h-96">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.map((country) => (
                <TableRow key={country.country}>
                  <TableCell>{country.country}</TableCell>
                  <TableCell>{country.total}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

export default TopCountries;
