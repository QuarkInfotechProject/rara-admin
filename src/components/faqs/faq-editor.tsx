"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { queryClient } from "@/lib/context/react-query-context";
import displayError from "@/lib/utils/display-error";
import { FAQ } from "@/types/faqs.types";
import { zodResolver } from "@hookform/resolvers/zod";
import EditorCard from "../editor-card";
import CategorySelector from "./category-selector";
import { faqSchema, FAQSchema } from "./zod-schema";

interface Props {
  initialData?: FAQ;
  edit?: boolean;
}

function FAQEditor({ initialData, edit }: Props) {
  const form = useForm<FAQSchema>({
    resolver: zodResolver(faqSchema),
    defaultValues: initialData,
  });
  const { isSubmitting } = form.formState;
  const router = useRouter();

  async function handleSubmit(data: FAQSchema) {
    try {
      await axios.post(edit ? "/api/faqs/edit" : "/api/faqs/add", data);
      await queryClient.invalidateQueries({
        queryKey: ["faqs"],
      });
      !edit && router.push("/admin/faqs");
      toast.success("FAQ updated successfully");
    } catch (error) {
      displayError(error, {});
    }
  }

  return (
    <Form {...form}>
      <form className="editor-grid" onSubmit={form.handleSubmit(handleSubmit)}>
        <EditorCard title="FAQ Details">
          <FormField
            control={form.control}
            name="question"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Question</FormLabel>
                <FormControl>
                  <Input placeholder="New Question" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="category"
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
            name="answer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Answer</FormLabel>
                <FormControl>
                  <Textarea rows={8} {...field} placeholder="Write your answer here" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="order"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Order</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </EditorCard>
        <Button className="w-40" disabled={isSubmitting} loading={isSubmitting}>
          Publish
        </Button>
      </form>
    </Form>
  );
}

export default FAQEditor;
