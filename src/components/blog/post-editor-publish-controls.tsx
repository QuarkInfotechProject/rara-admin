import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import DatePicker from "../date-picker";
import EditorCard from "../editor-card";
import { FormData } from "./zod-schema";

interface Props {
  edit: boolean | undefined;
}

function PostEditorPublishControls({ edit }: Props) {
  const form = useFormContext<FormData>();
  const { isSubmitting } = form.formState;

  return (
    <EditorCard title="Publish">
      <FormField
        control={form.control}
        name="status"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Status</FormLabel>
            <Select value={field.value} onValueChange={field.onChange}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Type</FormLabel>
            <Select value={field.value} onValueChange={field.onChange} disabled={edit}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="blog">Blog</SelectItem>
                <SelectItem value="mediaCoverage">Media Coverage</SelectItem>
                <SelectItem value="report">Report</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="publish_date"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Schedule (Optional)</FormLabel>
            <FormControl>
              <DatePicker selected={field.value} onSelect={(date) => field.onChange(date?.toISOString())} />
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

export default PostEditorPublishControls;
