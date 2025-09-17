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

interface ExperienceOption {
  id: number;
  name: string;
}

interface SelectOption {
  label: string;
  value: number;
}

function SelectRelatedExperiences() {
  const form = useFormContext<FormSchema>();

  const { data } = useQuery<ExperienceOption[]>({
    queryKey: ["product-editor-experiences"],
    queryFn: async () => {
      const response = await axios.get("/api/product/select-list/activities");
      return response.data?.data || response.data || [];
    },
  });

  // Create select options from fetched data
  const options = useMemo((): SelectOption[] => {
    if (!data) return [];

    return data.map((experience) => ({
      label: experience.name,
      value: experience.id,
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
          <FormLabel>Related activities (Optional)</FormLabel>
          <FormControl>
            <Select
              classNamePrefix="chn_select"
              isMulti
              isClearable
              placeholder="Select activities..."
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
              noOptionsMessage={() => "No activities found"}
              menuIsOpen={undefined}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export default SelectRelatedExperiences;
