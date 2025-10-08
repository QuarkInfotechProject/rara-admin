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

function SelectCategory() {
  const form = useFormContext<FormSchema>();
  const { data, isPending } = useQuery<
    {
      id: number;
      category_name: string;
    }[]
  >({
    queryKey: ["product-editor-category"],
    queryFn: async () => {
      const { data } = await axios.get("/api/category/active/list");
      return data.data;
    },
  });

  const defaultOptions = useMemo(() => {
    const selected = new Set(form.getValues("category") ?? []);
    const filteredOptions = data ? data.filter((item) => selected.has(item.id)) : [];
    return filteredOptions.map((option) => ({
      label: option.category_name,
      value: option.id,
    }));
  }, [data, form]);

  return (
    <FormField
      control={form.control}
      name="category"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Category</FormLabel>
          <FormControl>
            {isPending ? (
              <Skeleton className="w-full h-[38px]" />
            ) : (
              <Select
                classNamePrefix="chn_select"
                isMulti
                defaultValue={defaultOptions}
                options={data?.map((tag) => ({
                  label: tag.category_name,
                  value: tag.id,
                }))}
                onChange={(options) => {
                  form.setValue(
                    "category",
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

export default SelectCategory;
