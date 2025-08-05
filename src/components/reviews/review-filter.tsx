"use client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import applyFilters from "@/lib/utils/apply-filters";
import displayError from "@/lib/utils/display-error";
import { zodResolver } from "@hookform/resolvers/zod";
import AuthorSelector from "../blog/author-selector";
import FilterPopup from "../filter-popup";
import ProductSelector from "../product/product-selector";

const formSchema = z.object({
  product_id: z.string().nullable(),
  user_id: z.string().nullable(),
  approved: z.string().nullable(),
});

function ReviewFilter() {
  const [open, setOpen] = useState(false);
  const searchParams = useSearchParams();
  const productId = searchParams.get("product_id") ?? "all";
  const userId = searchParams.get("user_id") ?? "all";
  const approved = searchParams.get("approved") ?? "all";

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      product_id: productId,
      user_id: userId,
      approved,
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
            name="product_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product</FormLabel>
                <FormControl>
                  <ProductSelector className="w-full" value={field.value!} onValueChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="user_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>User</FormLabel>
                <FormControl>
                  <AuthorSelector onValueChange={field.onChange} value={field.value!} includeAll />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="approved"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Approved</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} defaultValue={field.value!}>
                    <SelectTrigger className=" capitalize">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent className=" *:capitalize">
                      <SelectItem value="1">Yes</SelectItem>
                      <SelectItem value="0">No</SelectItem>
                    </SelectContent>
                  </Select>
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

export default ReviewFilter;
