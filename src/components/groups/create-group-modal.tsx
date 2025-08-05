"use client";
import axios from "axios";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { queryClient } from "@/lib/context/react-query-context";
import displayError from "@/lib/utils/display-error";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogOrDrawer, DialogOrDrawerContent, DialogOrDrawerTrigger } from "@/components/ui/dialog-or-drawer";
import { DialogTitle } from "@/components/ui/dialog";

interface Props {
  children: React.ReactNode;
}

const formSchema = z.object({
  groupName: z.string(),
});

type FormSchema = z.infer<typeof formSchema>;

function CreateGroupModal({ children }: Props) {
  const [open, setOpen] = useState(false);
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
  });
  const { isSubmitting } = form.formState;

  async function handleSubmit(data: FormSchema) {
    try {
      await axios.post("/api/group/create", data);
      await queryClient.invalidateQueries({
        queryKey: ["admin-groups"],
      });
      setOpen(false);
      toast.success("Group added successfully!");
    } catch (error) {
      displayError(error, {});
    }
  }

  return (
    <DialogOrDrawer open={open} onOpenChange={setOpen}>
      <DialogOrDrawerTrigger asChild>{children}</DialogOrDrawerTrigger>
      <DialogOrDrawerContent>
        <DialogTitle className="hidden md:block">Create Role</DialogTitle>
        <Form {...form}>
          <form className="editor-grid max-md:p-5" onSubmit={form.handleSubmit(handleSubmit)}>
            <FormField
              control={form.control}
              name="groupName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Manager" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-fit" disabled={isSubmitting} loading={isSubmitting}>
              Publish
            </Button>
          </form>
        </Form>
      </DialogOrDrawerContent>
    </DialogOrDrawer>
  );
}

export default CreateGroupModal;
