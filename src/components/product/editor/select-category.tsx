import axios from "axios";
import React, { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import Select from "react-select";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { FormSchema } from "./product-editor";

interface Category {
  id: number;
  name: string;
}

function SelectCategory() {
  const form = useFormContext<FormSchema>();
  const { data, isPending } = useQuery<Category[]>({
    queryKey: ["product-editor-category"],
    queryFn: async () => {
      const { data } = await axios.get("/api/category/active/list");
      return data.data;
    },
  });

  return (
    <FormField
      control={form.control}
      name="category"
      render={({ field }) => {
        // Get current value from field
        const currentValue = field.value;

        // Find the selected option based on current field value
        const selectedOption =
          currentValue && data
            ? data.find((item) => item.id === currentValue)
            : null;

        const selectValue = selectedOption
          ? {
              label: selectedOption.name,
              value: selectedOption.id,
            }
          : null;

        return (
          <FormItem>
            <FormLabel>Category</FormLabel>
            <FormControl>
              {isPending ? (
                <Skeleton className="w-full h-[38px]" />
              ) : (
                <Select
                  classNamePrefix="chn_select"
                  value={selectValue}
                  options={data?.map((category) => ({
                    label: category.name,
                    value: category.id,
                  }))}
                  onChange={(option) => {
                    field.onChange(option?.value ?? null);
                  }}
                  isClearable
                />
              )}
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}

export default SelectCategory;
