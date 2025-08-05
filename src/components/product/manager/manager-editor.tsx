"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import EditorCard from "@/components/editor-card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { queryClient } from "@/lib/context/react-query-context";
import displayError from "@/lib/utils/display-error";
import { Manager } from "@/types/products.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { managerSchema, ManagerSchema } from "./zod-schema";

interface Props {
  initialData?: Manager;
  edit?: boolean;
}

function ManagerEditor({ initialData, edit }: Props) {
  const form = useForm<ManagerSchema>({
    resolver: zodResolver(managerSchema),
    defaultValues: initialData,
  });
  const { isSubmitting } = form.formState;
  const router = useRouter();

  async function handleSubmit(data: ManagerSchema) {
    try {
      await axios.post(edit ? "/api/manager/update" : "/api/manager/create", data);
      await queryClient.invalidateQueries({
        queryKey: ["manager"],
      });
      !edit && router.push("/admin/product/manager");
      toast.success("Manager updated successfully!");
    } catch (error) {
      displayError(error, {});
    }
  }

  return (
    <Form {...form}>
      <form className="editor-grid" onSubmit={form.handleSubmit(handleSubmit)}>
        <EditorCard title="Manager Details">
          <div className="grid sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Firstname</FormLabel>
                  <FormControl>
                    <Input placeholder="John" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lastname</FormLabel>
                  <FormControl>
                    <Input placeholder="Mark" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="phone_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input placeholder="+1123456789" {...field} />
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
                  <Input placeholder="hello@john.com" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea rows={8} {...field} placeholder="Write your description here" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </EditorCard>
        <Button className="w-40" disabled={isSubmitting} loading={isSubmitting}>
          Publish
        </Button>
      </form>
    </Form>
  );
}

export default ManagerEditor;
