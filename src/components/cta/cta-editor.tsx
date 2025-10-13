"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { queryClient } from "@/lib/context/react-query-context";
import displayError from "@/lib/utils/display-error";
import { CTA } from "@/types/cta.types";
import { zodResolver } from "@hookform/resolvers/zod";
import EditorCard from "../editor-card";
import CategorySelector from "../faqs/category-selector";
import { ctaSchema, CTASchema } from "./zod-schema";

interface Props {
  initialData?: CTA;
  readonly?: boolean;
}

function CTAEditor({ initialData, readonly }: Props) {
  const form = useForm<CTASchema>({
    resolver: zodResolver(ctaSchema),
    defaultValues: initialData,
  });
  const { isSubmitting } = form.formState;
  const router = useRouter();

  async function handleSubmit(data: CTASchema) {
    try {
      await axios.post("/api/cta/add", data);
      await queryClient.invalidateQueries({
        queryKey: ["ctas"],
      });
      router.push("/admin/cta");
      toast.success("CTA updated successfully!");
    } catch (error) {
      displayError(error, {});
    }
  }

  return (
    <Form {...form}>
      <form className="editor-grid" onSubmit={form.handleSubmit(handleSubmit)}>
        <EditorCard title="CTA Details">
          <FormField
            control={form.control}
            name="fullname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fullname</FormLabel>
                <FormControl>
                  <Input
                    placeholder="John wick"
                    disabled={readonly}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="info@example.com"
                    disabled={readonly}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone number</FormLabel>
                <FormControl>
                  <Input
                    placeholder="+1123456789"
                    disabled={readonly}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="hidden">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <CategorySelector
                      onValueChange={field.onChange}
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    rows={8}
                    disabled={readonly}
                    {...field}
                    placeholder="Write your description here"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </EditorCard>
        {!readonly && (
          <Button
            className="w-40"
            disabled={isSubmitting}
            loading={isSubmitting}
          >
            Publish
          </Button>
        )}
      </form>
    </Form>
  );
}

export default CTAEditor;
