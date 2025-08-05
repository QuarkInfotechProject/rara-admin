"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Form } from "@/components/ui/form";
import { queryClient } from "@/lib/context/react-query-context";
import displayError from "@/lib/utils/display-error";
import { Tag } from "@/types/products.types";
import { zodResolver } from "@hookform/resolvers/zod";
import TagEditorBasicFields from "./tag-editor-basic-fields";
import TagEditorFiles from "./tag-editor-files";
import TagEditorMapFields from "./tag-editor-map-fields";
import TagEditorPublishControls from "./tag-editor-publish-controls";
import { TagSchema, tagSchema } from "./zod-schema";

interface Props {
  initialData?: Tag;
  edit?: boolean;
}

function TagEditor({ initialData, edit }: Props) {
  // const form = useForm<TagSchema>({
  //   resolver: zodResolver(tagSchema),
  //   // @ts-expect-error Display order string and number type difference
  //   defaultValues: initialData,
  // });

   const transformedInitialData = initialData 
    ? {
        ...initialData,
        zoom_level: initialData.zoom_level ? Number(initialData.zoom_level) : 0,
        display_order: initialData.display_order ? Number(initialData.display_order) : 0,
      } 
    : undefined;

  const form = useForm<TagSchema>({
    resolver: zodResolver(tagSchema),
    defaultValues: transformedInitialData as TagSchema | undefined,
  });

  const router = useRouter();

  async function handleSubmit(data: TagSchema) {
    try {
      await axios.post(edit ? "/api/tag/update" : "/api/tag/create", data);
      await queryClient.invalidateQueries({
        queryKey: ["tags"],
      });
      !edit && router.push("/admin/product/tag");
      toast.success("Tag updated successfully!");
    } catch (error) {
      displayError(error, {});
    }
  }

  return (
    <Form {...form}>
      <form className="editor-grid-2" onSubmit={form.handleSubmit(handleSubmit)}>
        <div>
          <TagEditorBasicFields />
          <TagEditorMapFields />
        </div>
        <div className="md:sticky top-4">
          <TagEditorPublishControls />
          <TagEditorFiles />
        </div>
      </form>
    </Form>
  );
}

export default TagEditor;
