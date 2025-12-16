"use client";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import LoadingSkeletion from "@/components/loading-skeletion";
import PageLayout from "@/components/page-layout";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import jsonToCsvExport from "json-to-csv-export";

// Define the Subscriber type based on API response
interface Subscriber {
  id: number;
  email: string;
  created_at: string;
  updated_at: string;
}

interface SubscribersResponse {
  status: string;
  code: number;
  data: {
    current_page: number;
    data: Subscriber[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
  };
}

const NewsLetter = () => {
  const [hasMore, setHasMore] = useState(false);
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const queryClient = useQueryClient();

  const { data, isPending } = useQuery({
    queryKey: ["newsletter-subscribers", page],
    queryFn: async () => {
      const { data } = await axios.get<SubscribersResponse>(`/api/subscribers`, {
        params: { page },
      });
      setHasMore(data.data.current_page < data.data.last_page);
      return data.data.data;
    },
    gcTime: 0,
  });

  const handleDelete = async (subscriberId: number) => {
    if (confirm("Are you sure you want to delete this subscriber?")) {
      const toastId = toast.loading("Deleting subscriber...");
      try {
        await axios.delete(`/api/subscribers/${subscriberId}`);
        await queryClient.invalidateQueries({
          queryKey: ["newsletter-subscribers"],
        });
        toast.success("Subscriber deleted successfully", { id: toastId });
      } catch (error) {
        toast.error("Failed to delete subscriber", { id: toastId });
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleExport = () => {
    if (!data || data.length === 0) {
      toast.error("No data to export");
      return;
    }

    const exportData = data.map((subscriber) => ({
      ID: subscriber.id,
      Email: subscriber.email,
      "Subscribed Date": formatDate(subscriber.created_at),
    }));

    jsonToCsvExport({
      data: exportData,
      filename: `newsletter-subscribers-${new Date().toISOString().split("T")[0]}`,
      delimiter: ",",
      headers: ["ID", "Email", "Subscribed Date"],
    });

    toast.success("Subscribers exported successfully");
  };

  return (
    <PageLayout
      title="Newsletter Subscribers"
      description="Manage your newsletter subscriber list."
      hasMore={hasMore}
      actions={
        <Button size="sm" className="gap-1" onClick={handleExport} disabled={isPending || !data?.length}>
          <Download size={16} />
          <span className="sr-only sm:not-sr-only">Export</span>
        </Button>
      }
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">ID</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Subscribed Date</TableHead>
            <TableHead className="w-20">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isPending && <LoadingSkeletion columns={4} />}
          {!isPending &&
            data?.map((subscriber) => (
              <TableRow className="*:py-2" key={subscriber.id}>
                <TableCell className="text-muted-foreground">
                  {subscriber.id}
                </TableCell>
                <TableCell className="font-medium">
                  {subscriber.email}
                </TableCell>
                <TableCell>{formatDate(subscriber.created_at)}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(subscriber.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          {!isPending && data?.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={4}
                className="text-center text-muted-foreground py-8"
              >
                No subscribers yet
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </PageLayout>
  );
};

export default NewsLetter;
