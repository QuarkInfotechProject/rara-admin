"use client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import FilterPopup from "@/components/filter-popup";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import applyFilters from "@/lib/utils/apply-filters";
import displayError from "@/lib/utils/display-error";
import { zodResolver } from "@hookform/resolvers/zod";
import ProductTypeSelector from "../product-type-selector";

const formSchema = z.object({
  type: z.string(),
});

function TagFilter() {
  const [open, setOpen] = useState(false);
  const searchParams = useSearchParams();
  const type = searchParams.get("type") || "all";

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      type,
    },
    resolver: zodResolver(formSchema),
  });

  const router = useRouter();

  function handleFilter(values: z.infer<typeof formSchema>) {
    try {
      const { pageURL } = applyFilters(values);
      setOpen(false);
      router.push(pageURL.href);
    } catch (error) {
      displayError(error, {});
    }
  }

  return (
    <FilterPopup open={open} onOpenChange={setOpen}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFilter)}>
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <FormControl>
                  <ProductTypeSelector value={field.value} onValueChange={field.onChange} includeAll />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button size="sm">Filter</Button>
        </form>
      </Form>
    </FilterPopup>
  );
}

export default TagFilter;
