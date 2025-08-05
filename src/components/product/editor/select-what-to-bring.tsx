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

function SelectWhatToBring() {
  const form = useFormContext<FormSchema>();
  const { data, isPending } = useQuery<
    {
      id: number;
      name: string;
    }[]
  >({
    queryKey: ["product-editor-amenities"],
    queryFn: async () => {
      const { data } = await axios.post("/api/product/amenity-list", {
        filters: {
          category: "whattobring",
        },
      });
      return data.data;
    },
  });

  const defaultOptions = useMemo(() => {
    const selected = new Set(form.getValues("what_to_bring") ?? []);
    const filteredOptions = data ? data.filter((item) => selected.has(item.id)) : [];
    return filteredOptions.map((option) => ({ label: option.name, value: option.id }));
  }, [data, form]);

  return (
    <FormField
      control={form.control}
      name="what_to_bring"
      render={({ field }) => (
        <FormItem>
          <FormLabel>What to bring</FormLabel>
          <FormControl>
            {isPending ? (
              <Skeleton className="w-ful h-[38px]" />
            ) : (
              <Select
                classNamePrefix="chn_select"
                isMulti
                defaultValue={defaultOptions}
                options={data?.map((tag) => ({ label: tag.name, value: tag.id }))}
                onChange={(options) => {
                  form.setValue(
                    "what_to_bring",
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

export default SelectWhatToBring;
