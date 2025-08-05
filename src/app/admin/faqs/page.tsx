"use client";
import axios from "axios";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import FAQActions from "@/components/faqs/faq-actions";
import FAQFilter from "@/components/faqs/faq-filter";
import LoadingSkeletion from "@/components/loading-skeletion";
import PageLayout from "@/components/page-layout";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FAQ } from "@/types/faqs.types";
import { PaginatedResponse } from "@/types/index.types";
import { useQuery } from "@tanstack/react-query";

function FAQs() {
  const [hasMore, setHasMore] = useState(false);
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) ?? 1;
  const category = searchParams.get("category");

  const { data, isPending } = useQuery({
    queryKey: ["faqs", page, category],
    queryFn: async () => {
      const { data } = await axios.post<PaginatedResponse<FAQ>>(
        `/api/faqs/paginate`,
        {
          filters: {
            category,
          },
        },
        {
          params: {
            page,
          },
        }
      );
      const faqData = data.data.data;
      setHasMore(data.data.current_page < data.data.last_page);
      return faqData;
    },
    gcTime: 0,
  });

  return (
    <PageLayout
      title="FAQs"
      description="Manage your frequently asked questions."
      hasMore={hasMore}
      actions={
        <>
          <FAQFilter />
          <Link href="/admin/faqs/new">
            <Button size="sm" className="gap-1">
              <PlusCircle size={16} />
              <span className="sr-only sm:not-sr-only">Add FAQ</span>
            </Button>
          </Link>
        </>
      }
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Question</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isPending && <LoadingSkeletion columns={3} />}
          {!isPending &&
            data?.map((faq) => (
              <TableRow className="*:py-2" key={faq.id}>
                <TableCell className="font-medium truncate">{faq.question}</TableCell>
                <TableCell className="capitalize">{faq.category}</TableCell>
                <TableCell className="w-20">
                  <FAQActions id={faq.id} />
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </PageLayout>
  );
}

export default FAQs;
