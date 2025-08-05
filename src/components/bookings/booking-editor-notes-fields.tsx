import { useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import EditorCard from "../editor-card";
import { BookingEditorSchema } from "./zod-schema";
import { Textarea } from "@/components/ui/textarea";

function BookingEditorNotesFields() {
  const form = useFormContext<BookingEditorSchema>();

  return (
    <EditorCard title="Notes">
      <FormField
        control={form.control}
        name="note"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Customer Note</FormLabel>
            <FormControl>
              <Textarea rows={7} placeholder="Write your note here" {...field} value={field.value ?? ""} readOnly />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="additional_note"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Additional Note</FormLabel>
            <FormControl>
              <Textarea rows={7} placeholder="Write your note here" {...field} value={field.value ?? ""} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </EditorCard>
  );
}

export default BookingEditorNotesFields;
