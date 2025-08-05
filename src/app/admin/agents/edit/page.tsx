import { notFound } from "next/navigation";
import AgentEditor from "@/components/agents/agent-editor";
import PageTitle from "@/components/page-title";
import getAgentDetails from "@/lib/utils/server/get-agent-details";

interface Props {
  searchParams: Promise<{
    id: string;
  }>;
}

async function EditAgent({ searchParams }: Props) {
  const { id } = await searchParams;
  const data = await getAgentDetails(id);

  if (!data) {
    notFound();
  }

  return (
    <div>
      <PageTitle title="Edit Agent" prevPage="./" />
      <AgentEditor edit initialData={data} />
    </div>
  );
}

export default EditAgent;
export const dynamic = "force-dynamic";
