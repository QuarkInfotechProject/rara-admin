import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BookingInsights } from "@/types/dashboard.types";

interface Props {
  data: BookingInsights["top_products"];
}

function TopProducts({ data }: Props) {
  if (data?.length === 0) {
    return null;
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Top Products</CardTitle>
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
              {data?.map((product) => (
                <TableRow key={product.product_name}>
                  <TableCell>{product.product_name}</TableCell>
                  <TableCell>{product.total}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

export default TopProducts;
