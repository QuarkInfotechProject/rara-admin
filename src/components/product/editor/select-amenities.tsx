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

function SelectAmenities() {
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
          category: "amenity",
        },
      });
      return data.data;
    },
  });

  const defaultOptions = useMemo(() => {
    const selected = new Set(form.getValues("amenity") ?? []);
    const filteredOptions = data ? data.filter((item) => selected.has(item.id)) : [];
    return filteredOptions.map((option) => ({ label: option.name, value: option.id }));
  }, [data, form]);

  return (
    <FormField
      control={form.control}
      name="amenity"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Amenities</FormLabel>
          <FormControl>
            {isPending ? (
              <Skeleton className="w-ful h-[38px]" />
            ) : (
              <Select
                classNamePrefix="chn_select"
                isMulti
                defaultValue={defaultOptions}
                options={data?.map((amenity) => ({ label: amenity.name, value: amenity.id }))}
                onChange={(options) => {
                  form.setValue(
                    "amenity",
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

export default SelectAmenities;
