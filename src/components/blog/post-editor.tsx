"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { ZodSchema } from "zod";
import { Form } from "@/components/ui/form";
import { queryClient } from "@/lib/context/react-query-context";
import calculateReadTime from "@/lib/utils/calculateReadTime";
import displayError from "@/lib/utils/display-error";
import { zodResolver } from "@hookform/resolvers/zod";
import { baseSchema } from "../product/editor/zod-schema";
import PostEditorBasicFields from "./post-editor-basic-fields";
import PostEditorDetails from "./post-editor-details";
import PostEditorFiles from "./post-editor-files";
import PostEditorOtherFields from "./post-editor-other-fields";
import PostEditorPublishControls from "./post-editor-publish-controls";
import { blogMediaCoverageSchema, blogPostSchema, blogReportSchema, FormData } from "./zod-schema";

interface Props {
  initialData?: FormData;
  edit?: boolean;
}

function PostEditor({ initialData, edit }: Props) {
  const [formSchema, setFormSchema] = useState<ZodSchema>(baseSchema);
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "blog",
      status: "published",
      display_homepage: 1,
      ...initialData,
    },
  });

  const postType = form.watch("type");
  const router = useRouter();

  async function handleSubmit(values: FormData) {
    try {
      const data: any = { ...values };
      if (values.type === "blog") {
        data.read_time = calculateReadTime(values.description)?.toString();
      }
      await axios.post(edit ? "/api/blog/update" : "/api/blog/create", data);
      await queryClient.invalidateQueries({
        queryKey: ["blog"],
      });
      !edit && router.push("/admin/blog");
      toast.success("Post updated successfully");
    } catch (error) {
      displayError(error, {
        fallback: "Failed to add post",
      });
    }
  }

  useEffect(() => {
    switch (postType) {
      case "blog":
        setFormSchema(blogPostSchema);
        break;
      case "mediaCoverage":
        setFormSchema(blogMediaCoverageSchema);
        break;
      case "report":
        setFormSchema(blogReportSchema);
        break;
    }
  }, [postType]);

  return (
    <Form {...form}>
      <form className="editor-grid-2" onSubmit={form.handleSubmit(handleSubmit)}>
        <PostEditorBasicFields />
        <div className="md:sticky top-4">
          <PostEditorPublishControls edit={edit} />
          {postType === "blog" && <PostEditorDetails />}
          <PostEditorOtherFields />
          <PostEditorFiles />
        </div>
      </form>
    </Form>
  );
}

export default PostEditor;
