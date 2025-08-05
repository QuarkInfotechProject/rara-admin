import { useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import EditorCard from "../editor-card";
import { PromotionSchema } from "./zod-schema";

function PromotionEditorBasicFields() {
  const form = useFormContext<PromotionSchema>();

  return (
    <EditorCard title="Promotion Details">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input placeholder="New sale" {...field} />
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
      <FormField
        control={form.control}
        name="placement_place"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Placement Place</FormLabel>
            <Select value={field.value?.toString()} onValueChange={field.onChange}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select placement" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="homepage">Homepage</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </EditorCard>
  );
}

export default PromotionEditorBasicFields;
