import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BookingInsights } from "@/types/dashboard.types";

interface Props {
  data: BookingInsights["top_agents"];
}

function TopAgents({ data }: Props) {
  if (data?.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Top Agents</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea
          ref={(element) => {
            if (element) {
              element.style.height = element?.clientHeight + "px";
            }
          }}
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Total Bookings</TableHead>
                <TableHead>Completed Bookings</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.map((agent) => (
                <TableRow key={agent.id}>
                  <TableCell>{agent.firstname}</TableCell>
                  <TableCell>{agent.total_bookings}</TableCell>
                  <TableCell>{agent.completed_bookings}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

export default TopAgents;
