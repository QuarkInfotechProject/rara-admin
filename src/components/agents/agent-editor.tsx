"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Form } from "@/components/ui/form";
import { queryClient } from "@/lib/context/react-query-context";
import displayError from "@/lib/utils/display-error";
import { Agent } from "@/types/agents.types";
import { zodResolver } from "@hookform/resolvers/zod";
import AgentEditorBankFields from "./agent-editor-bank-fields";
import AgentEditorBasicFields from "./agent-editor-basic-fields";
import AgentEditorLocationFields from "./agent-editor-location-fields";
import AgentEditorNoteField from "./agent-editor-note-field";
import AgentEditorOtherFields from "./agent-editor-other-fields";
import AgentEditorPublishControls from "./agent-editor-publish-controls";
import { AgentEditorSchema, agentEditorSchema } from "./zod-schema";

interface Props {
  initialData?: Agent;
  edit?: boolean;
}

function AgentEditor({ initialData, edit }: Props) {
  const form = useForm<AgentEditorSchema>({
    resolver: zodResolver(agentEditorSchema),
    defaultValues: {
      is_active: 1,
      ...initialData,
    },
  });
  const router = useRouter();

  async function handleSubmit(values: AgentEditorSchema) {
    try {
      await axios.post(edit ? `/api/agent/update` : "/api/agent/create", values);
      await queryClient.invalidateQueries({
        queryKey: ["agents"],
      });
      !edit && router.push("/admin/agents");
      toast.success("Agent updated successfully");
    } catch (error) {
      displayError(error, {});
    }
  }

  return (
    <Form {...form}>
      <form className="editor-grid-2" onSubmit={form.handleSubmit(handleSubmit)}>
        <div>
          <AgentEditorBasicFields />
          <AgentEditorLocationFields />
          <AgentEditorBankFields />
        </div>
        <div>
          <AgentEditorPublishControls />
          <AgentEditorOtherFields />
          <AgentEditorNoteField />
        </div>
      </form>
    </Form>
  );
}

export default AgentEditor;
