import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import EditorCard from "../editor-card";
import { BookingEditorSchema } from "./zod-schema";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

function BookingEditorNotesFields() {
  const form = useFormContext<BookingEditorSchema>();

  return (
    <EditorCard title="Notes">
      <FormField
        control={form.control}
        name="accommodation_preference"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Accommodation Preference</FormLabel>
            <FormControl>
              <Input
                placeholder="e.g., local, standard, luxury"
                {...field}
                value={field.value ?? ""}
                readOnly
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="transportation_preference"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Transportation Preference</FormLabel>
            <FormControl>
              <Input
                placeholder="e.g., mixed, private, public"
                {...field}
                value={field.value ?? ""}
                readOnly
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="special_requirement"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Dietry Requirements</FormLabel>
            <FormControl>
              <Textarea
                rows={7}
                placeholder="Write your note here"
                {...field}
                value={field.value ?? ""}
                readOnly
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="special_message"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Customer Note</FormLabel>
            <FormControl>
              <Textarea
                rows={7}
                placeholder="Write your note here"
                {...field}
                value={field.value ?? ""}
                readOnly
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </EditorCard>
  );
}

export default BookingEditorNotesFields;
