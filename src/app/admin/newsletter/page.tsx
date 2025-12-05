"use client";
import axios from "axios";
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
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

// Define the Subscriber type
interface Subscriber {
  id: string;
  email: string;
  subscribed_at: string;
}

const NewsLetter = () => {
  // const queryClient = useQueryClient();

  // const { data, isPending } = useQuery({
  //   queryKey: ["newsletter-subscribers"],
  //   queryFn: async () => {
  //     const { data } = await axios.get<ApiResponse<Subscriber[]>>(`/api/newsletter/subscribers`);
  //     return data.data;
  //   },
  // });

  // const deleteMutation = useMutation({
  //   mutationFn: async (subscriberId: string) => {
  //     await axios.delete(`/api/newsletter/subscribers/${subscriberId}`);
  //   },
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ["newsletter-subscribers"] });
  //     toast.success("Subscriber deleted successfully");
  //   },
  //   onError: () => {
  //     toast.error("Failed to delete subscriber");
  //   },
  // });

  // Static data for now
  const data: Subscriber[] = [
    {
      id: "1",
      email: "john.doe@example.com",
      subscribed_at: "2024-01-15T10:30:00Z",
    },
    {
      id: "2",
      email: "jane.smith@example.com",
      subscribed_at: "2024-02-20T14:45:00Z",
    },
    {
      id: "3",
      email: "bob.wilson@example.com",
      subscribed_at: "2024-03-10T09:15:00Z",
    },
    {
      id: "4",
      email: "alice.johnson@example.com",
      subscribed_at: "2024-04-05T16:20:00Z",
    },
    {
      id: "5",
      email: "mike.brown@example.com",
      subscribed_at: "2024-05-12T11:00:00Z",
    },
  ];
  const isPending = false;

  const handleDelete = (subscriberId: string) => {
    if (confirm("Are you sure you want to delete this subscriber?")) {
      // deleteMutation.mutate(subscriberId);
      console.log("Delete subscriber:", subscriberId);
      toast.success("Subscriber deleted successfully");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <PageLayout
      title="Newsletter Subscribers"
      description="Manage your newsletter subscriber list."
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Subscribed Date</TableHead>
            <TableHead className="w-20">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isPending && <LoadingSkeletion columns={3} />}
          {!isPending &&
            data?.map((subscriber) => (
              <TableRow className="*:py-2" key={subscriber.id}>
                <TableCell className="font-medium">
                  {subscriber.email}
                </TableCell>
                <TableCell>{formatDate(subscriber.subscribed_at)}</TableCell>
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
                colSpan={3}
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
