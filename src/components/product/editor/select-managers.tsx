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

function SelectManagers() {
  const form = useFormContext<FormSchema>();
  const { data, isPending } = useQuery<
    {
      id: number;
      fullname: string;
    }[]
  >({
    queryKey: ["product-editor-managers"],
    queryFn: async () => {
      const { data } = await axios.get("/api/product/manager-list");
      return data.data;
    },
  });

  const defaultOptions = useMemo(() => {
    const selected = form.getValues("manager_id");
    const filteredOptions = data ? data.filter((item) => item.id === selected) : [];
    return filteredOptions.map((option) => ({ label: option.fullname, value: option.id }));
  }, [data, form]);

  return (
    <FormField
      control={form.control}
      name="manager_id"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Manager</FormLabel>
          <FormControl>
            {isPending ? (
              <Skeleton className="w-ful h-[38px]" />
            ) : (
              <Select
                classNamePrefix="chn_select"
                defaultValue={defaultOptions}
                options={data?.map((manager) => ({ label: manager.fullname, value: manager.id }))}
                onChange={(option) => {
                  if (option) {
                    form.setValue("manager_id", Number(option.value));
                  }
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

export default SelectManagers;
