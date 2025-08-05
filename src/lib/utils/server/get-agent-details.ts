import server from "@/lib/utils/server";
import { Agent } from "@/types/agents.types";

async function getAgentDetails(id: string): Promise<Agent | null> {
  try {
    const request = await server();
    const { data } = await request.get(`/agent/detail/${id}`);
    return {
      id: Number(id),
      ...data.data,
    };
  } catch (error) {
    return null;
  }
}

export default getAgentDetails;
