"use client";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Pagination as PaginationComponent,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface Props {
  hasMore?: boolean;
}

function Pagination({ hasMore }: Props) {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page") || 1);
  const router = useRouter();

  function nextPage() {
    const pageURL = new URL(window.location.href);
    pageURL.searchParams.set("page", `${page + 1}`);
    router.push(pageURL.href);
  }

  function prevPage() {
    if (page === 1) return;
    const pageURL = new URL(window.location.href);
    pageURL.searchParams.set("page", `${page - 1}`);
    router.push(pageURL.href);
  }

  return (
    <PaginationComponent>
      <PaginationContent className="*:cursor-pointer">
        <PaginationItem>
          <PaginationPrevious
            aria-disabled={page === 1}
            className="aria-disabled:opacity-60 aria-disabled:cursor-not-allowed aria-disabled:pointer-events-none"
            onClick={prevPage}
          />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext
            aria-disabled={!hasMore}
            className="aria-disabled:opacity-60 aria-disabled:cursor-not-allowed aria-disabled:pointer-events-none"
            onClick={nextPage}
          />
        </PaginationItem>
      </PaginationContent>
    </PaginationComponent>
  );
}

export default Pagination;
