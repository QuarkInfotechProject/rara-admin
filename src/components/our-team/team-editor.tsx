"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Form } from "@/components/ui/form";
import { queryClient } from "@/lib/context/react-query-context";
import displayError from "@/lib/utils/display-error";
import { TeamMember } from "@/types/team.types";
import { zodResolver } from "@hookform/resolvers/zod";
import TeamEditorBasicFields from "./team-editor-basic-fields";
import TeamEditorFiles from "./team-editor-files";
import TeamEditorPublishControls from "./team-editor-publish-controls";
import { teamEditorSchema, TeamEditorSchema } from "./zod-schema";

interface Props {
  initialData?: TeamMember;
  edit?: boolean;
}

function TeamEditor({ initialData, edit }: Props) {
  const form = useForm<TeamEditorSchema>({
    resolver: zodResolver(teamEditorSchema),
    defaultValues: { is_active: 1, ...initialData },
  });
  const router = useRouter();

  async function handleSubmit(data: TeamEditorSchema) {
    try {
      await axios.post(edit ? "/api/our-team/edit" : "/api/our-team/add", data);
      await queryClient.invalidateQueries({
        queryKey: ["our-team"],
      });
      !edit && router.push("/admin/our-team");
      toast.success("Team member updated successfully");
    } catch (error) {
      displayError(error, {});
    }
  }

  return (
    <Form {...form}>
      <form className="editor-grid-2" onSubmit={form.handleSubmit(handleSubmit)}>
        <div>
          <TeamEditorBasicFields />
        </div>
        <div>
          <TeamEditorPublishControls />
          <TeamEditorFiles />
        </div>
      </form>
    </Form>
  );
}

export default TeamEditor;
