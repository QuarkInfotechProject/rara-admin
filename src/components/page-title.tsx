import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

interface Props {
  title: string;
  prevPage?: string;
}

function PageTitle({ title, prevPage }: Props) {
  return (
    <div className="flex items-center gap-4 mb-4 sm:mb-8">
      {prevPage && (
        <Button variant="outline" size="icon" className="h-7 w-7" asChild>
          <Link href={prevPage}>
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
      )}
      <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">{title}</h1>
    </div>
  );
}

export default PageTitle;
