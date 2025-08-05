import axios from "axios";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AgentSelectResponse } from "@/types/agents.types";
import { ApiResponse } from "@/types/index.types";
import { useQuery } from "@tanstack/react-query";

interface Props {
  value: number | string | null | undefined;
  onValueChange: (value: string) => void;
  includeAll?: boolean;
}

function AgentSelector({ value, onValueChange, includeAll }: Props) {
  const { data: agents, isPending } = useQuery({
    queryKey: ["agent-selector"],
    queryFn: async () => {
      const { data } = await axios.get<ApiResponse<AgentSelectResponse[]>>("/api/booking/list/agent-select");
      return data.data;
    },
  });

  return (
    <Select value={value ? String(value) : undefined} onValueChange={onValueChange} disabled={isPending}>
      <SelectTrigger>
        <SelectValue placeholder={isPending ? "Loading..." : "Agent"} />
      </SelectTrigger>
      <SelectContent>
        {includeAll && <SelectItem value="all">All</SelectItem>}
        {agents?.map((agent) => (
          <SelectItem key={agent.id} value={String(agent.id)}>
            {agent.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default AgentSelector;
