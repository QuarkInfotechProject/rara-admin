import { useFormContext } from "react-hook-form";
import EditorCard from "@/components/editor-card";
import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { TagSchema } from "./zod-schema";

function TagEditorPublishControls() {
  const form = useFormContext<TagSchema>();
  const { isSubmitting } = form.formState;

  return (
    <EditorCard title="Publish">
      <FormField
        control={form.control}
        name="display_order"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Order</FormLabel>
            <FormControl>
              <Input placeholder="1" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="zoom_level"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Zoom Level</FormLabel>
            <FormControl>
              <Input placeholder="1" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <Button className="w-full" disabled={isSubmitting} loading={isSubmitting}>
        Publish
      </Button>
    </EditorCard>
  );
}

export default TagEditorPublishControls;
