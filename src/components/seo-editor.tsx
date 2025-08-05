import { useFormContext } from "react-hook-form";
import { z } from "zod";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import EditorCard from "./editor-card";
import MultiOptionInput from "./multi-option-input";

const metaTitle = z.string().max(60, "Meta title must be less than 60 characters");
const metaDescription = z.string().max(200, "Meta description must be less than 200 characters");
const keywords = z.array(z.string());

function SEOEditor() {
  const form = useFormContext();
  const title = form.watch("meta.metaTitle");
  const description = form.watch("meta.metaDescription");

  return (
    <EditorCard title="SEO">
      <FormField
        control={form.control}
        name="meta.metaTitle"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Meta Title ({title?.length ?? 0}/60)</FormLabel>
            <FormControl>
              <Input placeholder="Enter meta title" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="meta.metaDescription"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Meta Description ({description?.length ?? 0}/200)</FormLabel>
            <FormControl>
              <Textarea placeholder="Enter meta description" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="meta.keywords"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Keywords</FormLabel>
            <FormControl>
              <MultiOptionInput
                options={field.value}
                setOptions={(options) => form.setValue("meta.keywords", options)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </EditorCard>
  );
}

export default SEOEditor;
export { metaTitle, metaDescription, keywords };
