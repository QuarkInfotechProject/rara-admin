"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Form } from "@/components/ui/form";
import { queryClient } from "@/lib/context/react-query-context";
import displayError from "@/lib/utils/display-error";
import { WhyUs } from "@/types/why-us.types";
import { zodResolver } from "@hookform/resolvers/zod";
import WhyUsEditorBasicFields from "./why-us-basic-details";
import WhyUsEditorFiles from "./why-us-editor-files";
import WhyUsEditorPublishControls from "./why-us-editor-publish-controls";
import { whyUsSchema, WhyUsSchema } from "./zod-schema";

interface Props {
  initialData?: WhyUs;
  edit?: boolean;
}

function WhyUsEditor({ initialData, edit }: Props) {
  const form = useForm<WhyUsSchema>({
    resolver: zodResolver(whyUsSchema),
    defaultValues: { is_active: 1, ...initialData },
  });
  const router = useRouter();

  async function handleSubmit(data: WhyUsSchema) {
    try {
      await axios.post(edit ? "/api/why-us/update" : "/api/why-us/create", data);
      await queryClient.invalidateQueries({
        queryKey: ["why-us"],
      });
      !edit && router.push("/admin/why-us");
      toast.success("Why Us updated successfully");
    } catch (error) {
      displayError(error, {});
    }
  }

  return (
    <Form {...form}>
      <form className="editor-grid-2" onSubmit={form.handleSubmit(handleSubmit)}>
        <div>
          <WhyUsEditorBasicFields />
        </div>
        <div>
          <WhyUsEditorPublishControls />
          <WhyUsEditorFiles />
        </div>
      </form>
    </Form>
  );
}

export default WhyUsEditor;
