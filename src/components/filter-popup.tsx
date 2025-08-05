import { ListFilter } from "lucide-react";
import React from "react";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

interface Props {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  children: React.ReactNode;
}

function FilterPopup({ open, onOpenChange, children }: Props) {
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1">
          <ListFilter size={16} />
          <span className="sr-only sm:not-sr-only">Filter</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="grid gap-4 [&_form]:grid [&_form]:gap-2" align="end">
        {children}
      </PopoverContent>
    </Popover>
  );
}

export default FilterPopup;
