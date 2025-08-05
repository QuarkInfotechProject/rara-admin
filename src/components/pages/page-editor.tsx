"use client";
import axios from "axios";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Form } from "@/components/ui/form";
import { queryClient } from "@/lib/context/react-query-context";
import displayError from "@/lib/utils/display-error";
import { Page } from "@/types/pages.types";
import { zodResolver } from "@hookform/resolvers/zod";
import SEOEditor from "../seo-editor";
import PageEditorBasicFields from "./page-editor-basic-fields";
import PageEditorFiles from "./page-editor-files";
import PageEditorPublishControls from "./page-editor-publish-controls";
import { pageEditorSchema, PageEditorSchema } from "./zod-schema";

interface Props {
  initialData?: Page;
}

function PageEditor({ initialData }: Props) {
  const form = useForm<PageEditorSchema>({
    resolver: zodResolver(pageEditorSchema),
    defaultValues: {
      ...(initialData as PageEditorSchema),
      is_active: initialData?.is_active ?? 1,
    },
  });

  async function handleSubmit(data: PageEditorSchema) {
    try {
      await axios.post("/api/page/update", data);
      await queryClient.invalidateQueries({
        queryKey: ["pages"],
      });
      toast.success("Page updated successfully");
    } catch (error) {
      displayError(error, {});
    }
  }

  return (
    <Form {...form}>
      <form className="editor-grid-2" onSubmit={form.handleSubmit(handleSubmit)}>
        <div>
          <PageEditorBasicFields />
          <SEOEditor />
        </div>
        <div>
          <PageEditorPublishControls edit />
          <PageEditorFiles />
        </div>
      </form>
    </Form>
  );
}

export default PageEditor;
