import axios from "axios";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PaginatedResponse } from "@/types/index.types";
import { Group } from "@/types/users.types";
import { useQuery } from "@tanstack/react-query";

interface Props {
  value: number | string | null | undefined;
  onValueChange: (value: string) => void;
  includeAll?: boolean;
}

function RoleSelector({ value, onValueChange, includeAll }: Props) {
  const { data, isPending } = useQuery({
    queryKey: ["admin-roles"],
    queryFn: async () => {
      const { data } = await axios.get<PaginatedResponse<Group>>("/api/group");
      return data?.data.data;
    },
  });

  return (
    <Select value={value ? String(value) : undefined} onValueChange={onValueChange} disabled={isPending}>
      <SelectTrigger>
        <SelectValue placeholder={isPending ? "Loading..." : "Select a Role"} />
      </SelectTrigger>
      <SelectContent>
        {includeAll && <SelectItem value="all">All</SelectItem>}
        {data?.map((role) => (
          <SelectItem key={role.id} value={String(role.id)}>
            {role.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default RoleSelector;
