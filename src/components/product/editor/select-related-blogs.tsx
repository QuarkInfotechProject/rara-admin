import axios from "axios";
import React, { useMemo } from "react";
import { useFormContext } from "react-hook-form";
import Select from "react-select";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { FormSchema } from "./product-editor";

function SelectRelatedBlogs() {
  const form = useFormContext<FormSchema>();
  const { data, isPending } = useQuery<
    {
      id: number;
      name: string;
    }[]
  >({
    queryKey: ["product-editor-related-blogs"],
    queryFn: async () => {
      const { data } = await axios.get("/api/product/blog-list");
      return data.data;
    },
  });

  const defaultOptions = useMemo(() => {
    const selected = new Set(form.getValues("related_blogs") ?? []);
    const filteredOptions = data ? data.filter((item) => selected.has(item.id)) : [];
    return filteredOptions.map((option) => ({ label: option.name, value: option.id }));
  }, [data, form]);

  return (
    <FormField
      control={form.control}
      name="related_blogs"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Blogs</FormLabel>
          <FormControl>
            {isPending ? (
              <Skeleton className="w-ful h-[38px]" />
            ) : (
              <Select
                classNamePrefix="chn_select"
                isMulti
                defaultValue={defaultOptions}
                options={data?.map((blog) => ({ label: blog.name, value: blog.id }))}
                onChange={(options) => {
                  form.setValue(
                    "related_blogs",
                    options.map((option) => option.value)
                  );
                }}
              />
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export default SelectRelatedBlogs;
