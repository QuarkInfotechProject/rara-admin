import axios from "axios";
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { MediaCategory } from "@/types/media.types";
import { useQuery } from "@tanstack/react-query";

interface Props {
  category: string;
  setCategory: React.Dispatch<React.SetStateAction<string>>;
  className?: string;
}

function FileCategorySelector({ category, setCategory, className }: Props) {
  const { data: categories, isPending } = useQuery<MediaCategory[]>({
    queryKey: ["media-categories"],
    queryFn: async () => {
      const { data } = await axios.get("/api/file-categories");
      return data?.data;
    },
  });

  return (
    <Select value={category} onValueChange={setCategory} disabled={isPending}>
      <SelectTrigger className={cn("w-fit  [&_span]:flex [&_span]:gap-2", className)}>
        <SelectValue className="capitalize" placeholder={isPending ? "Loading..." : "Category"} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All</SelectItem>
        {categories?.map((category) => (
          <SelectItem className="capitalize" key={category.id} value={category.id.toString()}>
            {category.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default FileCategorySelector;
