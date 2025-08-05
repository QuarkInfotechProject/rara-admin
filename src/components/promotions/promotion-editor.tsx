"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Form } from "@/components/ui/form";
import { queryClient } from "@/lib/context/react-query-context";
import displayError from "@/lib/utils/display-error";
import { PromotionDetail } from "@/types/promotions.types";
import { zodResolver } from "@hookform/resolvers/zod";
import PromotionEditorBasicFields from "./promotion-editor-basic-fields";
import PromotionEditorFiles from "./promotion-editor-files";
import PromotionEditorPublishControls from "./promotion-editor-publish-controls";
import { PromotionSchema, promotionSchema } from "./zod-schema";

interface Props {
  initialData?: PromotionDetail;
  edit?: boolean;
}

function PromotionEditor({ initialData, edit }: Props) {
  const form = useForm<PromotionSchema>({
    resolver: zodResolver(promotionSchema),
    defaultValues: { is_active: 1, ...initialData },
  });
  const router = useRouter();

  async function handleSubmit(data: PromotionSchema) {
    try {
      await axios.post(edit ? "/api/promotion/update" : "/api/promotion/create", data);
      await queryClient.invalidateQueries({
        queryKey: ["promotions"],
      });
      !edit && router.push("/admin/promotions");
      toast.success("Promotion updated successfully");
    } catch (error) {
      displayError(error, {});
    }
  }

  return (
    <Form {...form}>
      <form className="editor-grid-2" onSubmit={form.handleSubmit(handleSubmit)}>
        <div>
          <PromotionEditorBasicFields />
        </div>
        <div>
          <PromotionEditorPublishControls />
          <PromotionEditorFiles />
        </div>
      </form>
    </Form>
  );
}

export default PromotionEditor;
