"use client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import applyFilters from "@/lib/utils/apply-filters";
import displayError from "@/lib/utils/display-error";
import { zodResolver } from "@hookform/resolvers/zod";
import FilterPopup from "../filter-popup";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const formSchema = z.object({
  name: z.string(),
  email: z.string(),
  status: z.string(),
});

function UserFilter() {
  const [open, setOpen] = useState(false);
  const searchParams = useSearchParams();
  const status = searchParams.get("status") || "all";
  const name = searchParams.get("name") || "";
  const email = searchParams.get("email") || "";

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      status,
      name,
      email,
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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Search by Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Search by Email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="1">Active</SelectItem>
                      <SelectItem value="3">Inactive</SelectItem>
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

export default UserFilter;
