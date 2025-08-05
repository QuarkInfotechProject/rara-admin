import { useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import EditorCard from "../editor-card";
import { FormData } from "./zod-schema";

function PostEditorOtherFields() {
  const form = useFormContext<FormData>();

  return (
    <EditorCard title="Other">
      <FormField
        control={form.control}
        name="display_homepage"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Display Homepage</FormLabel>
            <Select value={String(field.value)} onValueChange={field.onChange}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="1">Yes</SelectItem>
                <SelectItem value="2">No</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="display_order"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Order</FormLabel>
            <FormControl>
              <Input type="number" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </EditorCard>
  );
}

export default PostEditorOtherFields;
