"use client";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import PageLayout from "@/components/page-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import PopupActions from "./components/popup-actions";

interface Popup {
  id: number;
  name: string;
  url: string;
  status: 0 | 1;
  popupImage: number[];
  publishedDate: string;
  updated_at: string;
}

interface ApiResponse {
  code: number;
  message: string;
  data: Popup[];
}

function HomePopups() {
  const [popups, setPopups] = useState<Popup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPopups = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/popup");

        if (!response.ok) {
          throw new Error("Failed to fetch popups");
        }

        const result: ApiResponse = await response.json();

        if (result.code === 0) {
          setPopups(result.data);
        } else {
          throw new Error(result.message || "Failed to fetch popups");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchPopups();
  }, []);

  const getStatusBadge = (status: 0 | 1) => {
    return status === 1 ? "Active" : "Inactive";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <PageLayout
      title="Home Popups"
      description="Manage your homepage popup notifications."      
    >
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <p className="text-muted-foreground">Loading popups...</p>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center py-8">
          <p className="text-destructive">Error: {error}</p>
        </div>
      ) : popups.length === 0 ? (
        <div className="flex items-center justify-center py-8">
          <p className="text-muted-foreground">No popups found.</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Popup</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Published Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {popups.map((popup) => (
              <TableRow className="py-2" key={popup.id}>
                <TableCell className="font-medium">{popup.name}</TableCell>
                <TableCell>
                  <Badge className="capitalize" variant="outline">
                    {getStatusBadge(popup.status)}
                  </Badge>
                </TableCell>
                <TableCell>{formatDate(popup.publishedDate)}</TableCell>
                <TableCell className="w-20">
                  <PopupActions id={popup.id} url={popup.url} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </PageLayout>
  );
}

export default HomePopups;
