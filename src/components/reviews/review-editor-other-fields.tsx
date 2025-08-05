import { useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import EditorCard from "../editor-card";
import { FormData } from "./zod-schema";

function ReviewEditorOtherFields() {
  const form = useFormContext<FormData>();

  return (
    <EditorCard title="Other">
      <FormField
        control={form.control}
        name="public_review"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Public Review</FormLabel>
            <FormControl>
              <Textarea placeholder="Found very confirting" rows={4} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="private_review"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Private Review</FormLabel>
            <Textarea placeholder="Little messy" rows={4} {...field} />
            <FormMessage />
          </FormItem>
        )}
      />
    </EditorCard>
  );
}

export default ReviewEditorOtherFields;
