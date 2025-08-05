"use client";
import axios from "axios";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import LoadingSkeletion from "@/components/loading-skeletion";
import PageLayout from "@/components/page-layout";
import AmenityActions from "@/components/product/amenity/amenity-actions";
import AmenityFilter from "@/components/product/amenity/amenity-filter";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Amenity } from "@/types/products.types";
import { useQuery } from "@tanstack/react-query";

function AmenityPage() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");

  const { data, isPending } = useQuery({
    queryKey: ["amenity", category],
    queryFn: async () => {
      const { data } = await axios.post(`/api/amenity/list`, {
        filters: {
          category,
        },
      });
      const amenityData = data.data.data as Amenity[];
      return amenityData;
    },
  });

  return (
    <PageLayout
      title="Amenities"
      description="Manage your amenities."
      actions={
        <>
          <AmenityFilter />
          <Link href="/admin/product/amenity/new">
            <Button size="sm" className="gap-1">
              <PlusCircle size={16} />
              <span className="sr-only sm:not-sr-only">Add Amenity</span>
            </Button>
          </Link>
        </>
      }
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Icon</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isPending && <LoadingSkeletion columns={4} />}
          {!isPending &&
            data?.map((amenity) => (
              <TableRow className="*:py-2" key={amenity.id}>
                <TableCell className="font-medium truncate">{amenity.name}</TableCell>
                <TableCell className="font-medium truncate">{amenity.icon}</TableCell>
                <TableCell className="capitalize">{amenity.category}</TableCell>
                <TableCell className="w-20">
                  <AmenityActions id={amenity.id} />
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </PageLayout>
  );
}

export default AmenityPage;
