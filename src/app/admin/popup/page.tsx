"use client";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
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
import FAQActions from "@/components/faqs/faq-actions";

interface Popup {
  id: number;
  title: string;
  status: "Active" | "Inactive" | "Scheduled";
  publishedDate: string;
}

const staticPopups: Popup[] = [
  {
    id: 1,
    title: "Summer Sale 2024: Up to 50% Off on All Tours",
    status: "Active",
    publishedDate: "2024-06-01",
  },
  {
    id: 2,
    title: "New Himalayan Trekking Routes Available Now",
    status: "Active",
    publishedDate: "2024-05-15",
  },
  {
    id: 3,
    title: "Monsoon Special: Book Community Homestays",
    status: "Scheduled",
    publishedDate: "2024-07-01",
  },
  {
    id: 4,
    title: "Early Bird Discount: Kathmandu Valley Tours",
    status: "Active",
    publishedDate: "2024-04-20",
  },
  {
    id: 5,
    title: "Winter Adventure Package: Limited Slots Available",
    status: "Inactive",
    publishedDate: "2024-01-10",
  },
  {
    id: 6,
    title: "Cultural Festival Tours: Experience Nepali Traditions",
    status: "Active",
    publishedDate: "2024-05-01",
  },
  {
    id: 7,
    title: "Newsletter Signup: Get 10% Off Your First Booking",
    status: "Inactive",
    publishedDate: "2024-03-15",
  },
];

function HomePopups() {
  return (
    <PageLayout
      title="Home Popups"
      description="Manage your homepage popup notifications."
      actions={
        <Link href="/admin/popup/new">
          <Button size="sm" className="gap-1">
            <PlusCircle size={16} />
            <span className="sr-only sm:not-sr-only">Add Popup</span>
          </Button>
        </Link>
      }
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Published Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {staticPopups.map((popup) => (
            <TableRow className="py-2" key={popup.id}>
              <TableCell className="font-medium">{popup.title}</TableCell>
              <TableCell>
                <Badge className="capitalize" variant="outline">
                  {popup.status}
                </Badge>
              </TableCell>
              <TableCell>{popup.publishedDate}</TableCell>
              <TableCell className="w-20">
                <FAQActions id={popup.id} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </PageLayout>
  );
}

export default HomePopups;
