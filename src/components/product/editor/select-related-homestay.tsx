import axios from "axios";
import React, { useMemo, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import Select from "react-select";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useQuery } from "@tanstack/react-query";
import { FormSchema } from "./product-editor";

interface HomestayOption {
  id: number;
  name: string;
}

interface SelectOption {
  label: string;
  value: number;
}

function SelectRelatedHomestays() {
  const form = useFormContext<FormSchema>();

  const { data } = useQuery<HomestayOption[]>({
    queryKey: ["product-editor-homestays"],
    queryFn: async () => {
      const response = await axios.get("/api/product/select-list/tour");
      return response.data?.data || response.data || [];
    },
  });

  // Create select options from fetched data
  const options = useMemo((): SelectOption[] => {
    if (!data) return [];

    return data.map((homestay) => ({
      label: homestay.name,
      value: homestay.id,
    }));
  }, [data]);

  const currentValues = form.watch("related_circuit") || [];

  const selectedOptions = useMemo(() => {
    if (!options.length || !currentValues.length) return [];

    const selected = [];

    for (const value of currentValues) {
      const numValue = Number(value);
      const matchingOption = options.find(
        (option) => option.value === numValue
      );
      if (matchingOption) {
        selected.push(matchingOption);
      }
    }

    return selected;
  }, [options, currentValues]);

  return (
    <FormField
      control={form.control}
      name="related_circuit"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Related Tours (Optional)</FormLabel>
          <FormControl>
            <Select
              classNamePrefix="chn_select"
              isMulti
              isClearable
              placeholder="Select tours..."
              value={selectedOptions}
              options={options}
              onChange={(selectedOptions) => {
                const values = selectedOptions
                  ? selectedOptions.map((option) => option.value)
                  : [];
                form.setValue("related_circuit", values, {
                  shouldValidate: true,
                  shouldDirty: true,
                });
              }}
              noOptionsMessage={() => "No tour found"}
              menuIsOpen={undefined}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export default SelectRelatedHomestays;
