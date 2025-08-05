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

function SelectRelatedExperiences() {
  const form = useFormContext<FormSchema>();
  const { data, isPending } = useQuery<
    {
      id: number;
      name: string;
    }[]
  >({
    queryKey: ["product-editor-experiences"],
    queryFn: async () => {
      const { data } = await axios.get("/api/product/select-list/experience");
      return data.data;
    },
  });

  const defaultOptions = useMemo(() => {
    const selected = new Set(form.getValues("related_experience") ?? []);
    const filteredOptions = data ? data.filter((item) => selected.has(item.id)) : [];
    return filteredOptions.map((option) => ({ label: option.name, value: option.id }));
  }, [data, form]);

  return (
    <FormField
      control={form.control}
      name="related_experience"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Experiences</FormLabel>
          <FormControl>
            {isPending ? (
              <Skeleton className="w-ful h-[38px]" />
            ) : (
              <Select
                classNamePrefix="chn_select"
                isMulti
                defaultValue={defaultOptions}
                options={data?.map((experience) => ({ label: experience.name, value: experience.id }))}
                onChange={(options) => {
                  form.setValue(
                    "related_experience",
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

export default SelectRelatedExperiences;
