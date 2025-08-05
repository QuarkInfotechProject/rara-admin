import axios from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { queryClient } from "@/lib/context/react-query-context";
import displayError from "@/lib/utils/display-error";
import { MediaCategory } from "@/types/media.types";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  id: z.number().optional(),
  name: z.string(),
  url: z
    .string()
    .transform((v) => v.toLowerCase())
    .refine(
      (v) => /^[a-zA-Z0-9-]+$/.test(v),
      "Please enter a valid slug containing only letters, numbers, and hyphens."
    ),
});

interface Props {
  initialData?: MediaCategory;
  edit?: boolean;
  onSuccess?: () => void;
}

function FileCategoryEditor({ initialData, edit, onSuccess }: Props) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });
  const { isSubmitting } = form.formState;

  async function handleSubmit(data: z.infer<typeof formSchema>) {
    try {
      await axios.post(edit ? "/api/file-categories/update" : "/api/file-categories/create", data);
      await queryClient.invalidateQueries({
        queryKey: ["media-categories"],
      });
      onSuccess?.();
    } catch (error) {
      displayError(error, {
        fallback: "Failed to publish category",
      });
    }
  }

  return (
    <Form {...form}>
      <form className="editor-grid" onSubmit={form.handleSubmit(handleSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting} loading={isSubmitting}>
          Publish
        </Button>
      </form>
    </Form>
  );
}

export default FileCategoryEditor;
