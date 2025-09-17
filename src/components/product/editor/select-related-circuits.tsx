import axios from "axios";
import React, { useMemo } from "react";
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

interface CircuitOption {
  id: number;
  name: string;
}

interface SelectOption {
  label: string;
  value: number;
}

function SelectRelatedCircuits() {
  const form = useFormContext<FormSchema>();

  const { data } = useQuery<CircuitOption[]>({
    queryKey: ["product-editor-circuits"],
    queryFn: async () => {
      const response = await axios.get("/api/product/select-list/trek");
      return response.data?.data || response.data || [];
    },
  });

  // Create select options from fetched data
  const options = useMemo((): SelectOption[] => {
    if (!data) return [];

    return data.map((circuit) => ({
      label: circuit.name,
      value: circuit.id,
    }));
  }, [data]);

  // Get current form values
  const currentValues = form.watch("related_circuit") || [];

  // Create selected options based on current form values and available options
  const selectedOptions = useMemo(() => {
    if (!options.length || !currentValues.length) return [];

    // Find matching options from the available options
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
          <FormLabel>Related Treks (Optional)</FormLabel>
          <FormControl>
            <Select
              classNamePrefix="chn_select"
              isMulti
              isClearable
              placeholder="Select treks..."
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
              noOptionsMessage={() => "No treks found"}
              menuIsOpen={undefined}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export default SelectRelatedCircuits;
