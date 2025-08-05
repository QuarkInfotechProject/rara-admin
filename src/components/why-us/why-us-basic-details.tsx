import { useFormContext } from "react-hook-form";
import EditorCard from "../editor-card";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { WhyUsSchema } from "./zod-schema";

function WhyUsEditorBasicFields() {
  const form = useFormContext<WhyUsSchema>();
  return (
    <EditorCard title="Why Us Details">
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Title</FormLabel>
            <FormControl>
              <Input placeholder="John" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <Textarea placeholder="Write the description here" {...field} />
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="link"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Link</FormLabel>
            <Input placeholder="https://example.com" {...field} />
            <FormMessage />
          </FormItem>
        )}
      />
    </EditorCard>
  );
}

export default WhyUsEditorBasicFields;
