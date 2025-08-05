import axios from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import displayError from "@/lib/utils/display-error";
import { FileShowResponse } from "@/types/media.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import FileCategorySelector from "./file-category-selector";

interface Props {
  file: FileShowResponse;
}

const formSchema = z.object({
  id: z.number(),
  filename: z.string(),
  alternativeText: z.string().optional().default(""),
  title: z.string().optional().default(""),
  caption: z.string().optional().default(""),
  description: z.string().optional().default(""),
  fileCategoryId: z.string().optional().default(""),
});

function FileEditForm({ file }: Props) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      alternativeText: file.alternativeText,
      caption: file.caption,
      description: file.description,
      filename: file.filename,
      id: file.id,
      title: file.title,
    },
  });
  const { isSubmitting } = form.formState;
  const queryClient = useQueryClient();

  async function handleUpdate(values: z.infer<typeof formSchema>) {
    try {
      await axios.post("/api/files/update", values);
      await queryClient.invalidateQueries({
        queryKey: [file.id],
      });
    } catch (error) {
      displayError(error, { fallback: "Failed to update file" });
    }
  }

  return (
    <Form {...form}>
      <form>
        <FormField
          control={form.control}
          name="filename"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Filename</FormLabel>
              <FormControl>
                <Input placeholder="Filename" {...field} />
              </FormControl>
              <FormDescription />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Title" {...field} />
              </FormControl>
              <FormDescription />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Caption</FormLabel>
              <FormControl>
                <Input placeholder="Caption" {...field} />
              </FormControl>
              <FormDescription />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="alternativeText"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Alt</FormLabel>
              <FormControl>
                <Input placeholder="Alt" {...field} />
              </FormControl>
              <FormDescription />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="fileCategoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <FileCategorySelector className="w-full" category={field.value} setCategory={field.onChange} />
              </FormControl>
              <FormDescription />
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
              <FormControl>
                <Textarea placeholder="Write your file description here" {...field} />
              </FormControl>
              <FormDescription />
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="button"
          size="sm"
          className="mt-2"
          loading={isSubmitting}
          onClick={form.handleSubmit(handleUpdate)}
        >
          Update
        </Button>
      </form>
    </Form>
  );
}

export default FileEditForm;
