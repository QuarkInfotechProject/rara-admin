import { useFormContext } from "react-hook-form";
import EditorCard from "@/components/editor-card";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { TagSchema } from "./zod-schema";

function TagEditorMapFields() {
  const form = useFormContext<TagSchema>();

  return (
    <EditorCard title="Bounds">
      <FormField
        control={form.control}
        name="latitude"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Latitude</FormLabel>
            <FormControl>
              <Input placeholder="27.71314672" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="longitude"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Longitude</FormLabel>
            <FormControl>
              <Input placeholder="85.26345256" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </EditorCard>
  );
}

export default TagEditorMapFields;
