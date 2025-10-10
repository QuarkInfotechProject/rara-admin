import React, { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import EditorCard from "@/components/editor-card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import SEOEditor from "../../seo-editor";
import { FormSchema } from "./product-editor";
import SelectCategory from "./select-category";

interface GeneralFieldsProps {
  productType?: "trek" | "tour" | "activities";
}

function GeneralFields({ productType }: GeneralFieldsProps) {
  const form = useFormContext<FormSchema>();

  useEffect(() => {
    const currentType = form.getValues("type");
    const typeToSet = productType || currentType || "trek";

    if (currentType !== typeToSet) {
      form.setValue("type", typeToSet);
    }
  }, [form, productType]);

  return (
    <div className="editor-grid">
      <EditorCard title="Basic">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => <input type="hidden" {...field} />}
        />

        <SelectCategory />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter product name" {...field} />
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
                <Input placeholder="product-slug" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tagline"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tagline</FormLabel>
              <FormControl>
                <Input placeholder="Enter tagline" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="short_code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Short Code</FormLabel>
              <FormControl>
                <Input placeholder="Enter short code" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* <FormField
          control={form.control}
          name="youtube_link"
          render={({ field }) => (
            <FormItem>
              <FormLabel>YouTube Link</FormLabel>
              <FormControl>
                <Input placeholder="https://youtube.com/watch?v=example" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}

        <FormField
          control={form.control}
          name="night"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Days</FormLabel>
              <FormControl>
                <Input type="number" placeholder="14" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </EditorCard>
      <SEOEditor />
    </div>
  );
}

export default GeneralFields;
