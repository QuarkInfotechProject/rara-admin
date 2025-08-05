import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import EditorCard from "../editor-card";
import { PromotionSchema } from "./zod-schema";

function PromotionEditorPublishControls() {
  const form = useFormContext<PromotionSchema>();
  const { isSubmitting } = form.formState;

  return (
    <EditorCard title="Publish">
      <FormField
        control={form.control}
        name="is_active"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Status</FormLabel>
            <Select value={field.value?.toString()} onValueChange={field.onChange}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="1">Active</SelectItem>
                <SelectItem value="0">Inactive</SelectItem>
              </SelectContent>
            </Select>
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

export default PromotionEditorPublishControls;
