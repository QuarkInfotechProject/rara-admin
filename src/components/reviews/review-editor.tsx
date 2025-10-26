"use client";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { ReviewDetail } from "@/types/reviews.types";
import { zodResolver } from "@hookform/resolvers/zod";
import ReviewEditorOtherFields from "./review-editor-other-fields";
import ReviewEditorRatings from "./review-editor-ratings";
// import ReviewEditorReply from "./review-editor-reply";
import { FormData, formSchema } from "./zod-schema";

interface Props {
  initialData?: ReviewDetail;
  edit?: boolean;
}

function ReviewEditor({ initialData, edit }: Props) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
    disabled: true,
  });

  return (
    <Form {...form}>
      <form className="editor-grid-2">
        <div>
          <ReviewEditorOtherFields />
          {/* <ReviewEditorReply /> */}
        </div>
        <div className="md:sticky top-4">
          <ReviewEditorRatings />
        </div>
      </form>
    </Form>
  );
}

export default ReviewEditor;
