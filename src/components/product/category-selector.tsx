import axios from "axios";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ListBlogCategories } from "@/types/blog.types";
import { ApiResponse } from "@/types/index.types";
import { useQuery } from "@tanstack/react-query";

interface Props {
  value: number | string | null | undefined;
  onValueChange: (value: string) => void;
  includeAll?: boolean;
}

function CategorySelector({ value, onValueChange, includeAll }: Props) {
  const { data: categories, isPending } = useQuery({
    queryKey: ["blog-category-selector"],
    queryFn: async () => {
      const { data } = await axios.get<ApiResponse<ListBlogCategories[]>>("/api/blog/category/list");
      return data.data;
    },
  });

  return (
    <Select value={value ? String(value) : undefined} onValueChange={onValueChange} disabled={isPending}>
      <SelectTrigger>
        <SelectValue placeholder={isPending ? "Loading..." : "Category"} />
      </SelectTrigger>
      <SelectContent>
        {includeAll && <SelectItem value="all">All</SelectItem>}
        {categories?.map((category) => (
          <SelectItem key={category.id} value={String(category.id)}>
            {category.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default CategorySelector;
