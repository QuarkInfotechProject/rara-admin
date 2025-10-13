import { useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import EditorCard from "../editor-card";
import { BookingEditorSchema } from "./zod-schema";

function BookingEditorGuestFields() {
  const form = useFormContext<BookingEditorSchema>();

  return (
    <EditorCard title="Guests">
      <FormField
        control={form.control}
        name="adult"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Adults</FormLabel>
            <FormControl>
              <Input type="number" {...field} />
            </FormControl>

            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="children"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Childrens</FormLabel>
            <FormControl>
              <Input type="number" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {/* <FormField
        control={form.control}
        name="infant"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Infants</FormLabel>
            <FormControl>
              <Input type="number" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      /> */}
    </EditorCard>
  );
}

export default BookingEditorGuestFields;
