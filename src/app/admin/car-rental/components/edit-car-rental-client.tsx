"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface EditCarRentalClientProps {
  id: string;
  initialStatus: string;
}

export default function EditCarRentalClient({
  id,
  initialStatus,
}: EditCarRentalClientProps) {
  const router = useRouter();
  const [status, setStatus] = useState(initialStatus);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStatusUpdate = async () => {
    try {
      setIsSubmitting(true);
      await axios.post("/api/car-rental/change-status", {
        id: id,
        status: status,
      });
      toast.success("Status updated successfully");
      router.refresh();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to update status");
      console.error("Error updating status:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="status">Update Status</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger id="status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="no-show">No Show</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button
          className="w-full"
          onClick={handleStatusUpdate}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Updating..." : "Publish"}
        </Button>
      </CardContent>
    </Card>
  );
}
