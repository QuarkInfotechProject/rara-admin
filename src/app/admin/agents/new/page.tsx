import AgentEditor from "@/components/agents/agent-editor";
import PageTitle from "@/components/page-title";

function NewAgent() {
  return (
    <div>
      <PageTitle title="New Agent" prevPage="./" />
      <AgentEditor />
    </div>
  );
}

export default NewAgent;
