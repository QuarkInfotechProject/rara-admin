import { useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import EditorCard from "../editor-card";
import AuthorSelector from "./author-selector";
import CategorySelector from "./category-selector";
import { FormData } from "./zod-schema";

function PostEditorDetails() {
  const form = useFormContext<FormData>();

  return (
    <EditorCard title="Details">
      <FormField
        control={form.control}
        name="blog_category_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Category</FormLabel>
            <FormControl>
              <CategorySelector value={field.value} onValueChange={field.onChange} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="admin_user_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Author</FormLabel>
            <FormControl>
              <AuthorSelector value={field.value} onValueChange={field.onChange} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </EditorCard>
  );
}

export default PostEditorDetails;
