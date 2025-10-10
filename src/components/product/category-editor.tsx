"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { queryClient } from "@/lib/context/react-query-context";
import displayError from "@/lib/utils/display-error";
import sanitizeSlug from "@/lib/utils/sanitizeSlug";
import { zodResolver } from "@hookform/resolvers/zod";
import EditorCard from "../editor-card";
import SEOEditor from "../seo-editor";
import { ProductCategory, productCategorySchema } from "./zod-schema";
import dynamic from "next/dynamic";

const CkEditor = dynamic(() => import("@/components/ck-editor"), { ssr: false });

interface Props {
  initialData?: ProductCategory;
  edit?: boolean;
}

function CategoryEditor({ initialData, edit }: Props) {
  const form = useForm<z.infer<typeof productCategorySchema>>({
    resolver: zodResolver(productCategorySchema),
    defaultValues: initialData,
  });
  const description = form.watch("description");
  const { isSubmitting } = form.formState;
  const router = useRouter();

  async function handleSubmit(data: ProductCategory) {
    try {
      await axios.post(
        edit ? "/api/category/update" : "/api/category/create",
        data
      );
      await queryClient.invalidateQueries({
        queryKey: ["blog-categories"],
      });
      !edit && router.push("/admin/product/category");
      toast.success("Category updated successfully");
    } catch (error) {
      displayError(error, {});
    }
  }

  return (
    <Form {...form}>
      <form className="editor-grid" onSubmit={form.handleSubmit(handleSubmit)}>
        <EditorCard title="Category Details">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="New Category" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <Input placeholder="slug" {...field} onChange={(e) => field.onChange(sanitizeSlug(e.target.value))} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </EditorCard>
        <EditorCard title="Description">
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <CkEditor
                    id="category-description"
                    initialData={description}
                    onChange={(content) => {
                      form.setValue("description", content);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </EditorCard>
        <SEOEditor />
        <Button className="w-40" disabled={isSubmitting} loading={isSubmitting}>
          Publish
        </Button>
      </form>
    </Form>
  );
}

export default CategoryEditor;
