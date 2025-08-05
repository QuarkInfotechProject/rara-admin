import axios from "axios";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ListAuthors } from "@/types/blog.types";
import { ApiResponse } from "@/types/index.types";
import { useQuery } from "@tanstack/react-query";

interface Props {
  value: number | string | null | undefined;
  onValueChange: (value: string) => void;
  includeAll?: boolean;
}

function AuthorSelector({ value, onValueChange, includeAll }: Props) {
  const { data: authors, isPending } = useQuery({
    queryKey: ["blog-author-selector"],
    queryFn: async () => {
      const { data } = await axios.get<ApiResponse<ListAuthors[]>>("/api/blog/admin-user-list");
      return data.data;
    },
  });

  return (
    <Select value={value ? String(value) : undefined} onValueChange={onValueChange} disabled={isPending}>
      <SelectTrigger>
        <SelectValue placeholder={isPending ? "Loading..." : "Author"} />
      </SelectTrigger>
      <SelectContent>
        {includeAll && <SelectItem value="all">All</SelectItem>}
        {authors?.map((author) => (
          <SelectItem key={author.id} value={String(author.id)}>
            {author.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default AuthorSelector;
