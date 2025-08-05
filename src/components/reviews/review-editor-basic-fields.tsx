import { format } from "date-fns";
import { useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import EditorCard from "../editor-card";
import { FormData } from "./zod-schema";

function ReviewEditorBasicFields() {
  const form = useFormContext<FormData>();

  return (
    <EditorCard title="Basic">
      <FormField
        control={form.control}
        name="user.full_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Fullname</FormLabel>
            <FormControl>
              <Input placeholder="John" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="product.name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Product</FormLabel>
            <Input placeholder="Good homestay" {...field} />
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="created_at"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Created At</FormLabel>
            <Input placeholder="26/01/24" {...field} value={format(field.value ?? Date.now(), "dd/MM/yyyy")} />
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="updated_at"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Updated At</FormLabel>
            <Input placeholder="26/01/24" {...field} value={format(field.value ?? Date.now(), "dd/MM/yyyy")} />
            <FormMessage />
          </FormItem>
        )}
      />
    </EditorCard>
  );
}

export default ReviewEditorBasicFields;
