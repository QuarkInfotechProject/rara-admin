import { useFormContext } from "react-hook-form";
import EditorCard from "@/components/editor-card";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormSchema } from "./product-editor";

interface Props {
  edit: boolean | undefined;
  isSubmitting?: boolean; // Add this prop to receive loading state
}

function PublishControls({ edit, isSubmitting: externalSubmitting }: Props) {
  const form = useFormContext<FormSchema>();
  const { isSubmitting: formSubmitting } = form.formState;

  // Use external submitting state if provided, otherwise fall back to form state
  const isLoading = externalSubmitting ?? formSubmitting;

  const handlePublish = () => {
    console.log("🎯 Publish button clicked"); // Debug log
    // The form submission will be handled by the form's onSubmit
  };

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
      <Button
        type="submit"
        className="w-full"
        disabled={isLoading}
        loading={isLoading}
        onClick={handlePublish}
      >
        {edit ? "Update" : "Publish"}
      </Button>
    </EditorCard>
  );
}

export default PublishControls;
