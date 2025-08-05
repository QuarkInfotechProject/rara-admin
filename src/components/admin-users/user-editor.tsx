"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { queryClient } from "@/lib/context/react-query-context";
import displayError from "@/lib/utils/display-error";
import { AdminUser } from "@/types/users.types";
import { zodResolver } from "@hookform/resolvers/zod";
import EditorCard from "../editor-card";
import RoleSelector from "./role-selector";
import { adminUserSchema, AdminUserSchema } from "./zod-schema";

interface Props {
  initialData?: AdminUser;
  edit?: boolean;
}

function UserEditor({ initialData, edit }: Props) {
  const form = useForm<AdminUserSchema>({
    resolver: zodResolver(adminUserSchema),
    defaultValues: initialData,
  });
  const { isSubmitting } = form.formState;
  const router = useRouter();

  async function handleSubmit(data: AdminUserSchema) {
    try {
      await axios.post(edit ? "/api/users/update" : "/api/users/create", data);
      await queryClient.invalidateQueries({
        queryKey: ["admin-users"],
      });
      router.push("/admin/admin-users");
      toast.success("User updated successfully!");
    } catch (error) {
      displayError(error, {});
    }
  }

  return (
    <Form {...form}>
      <form className="editor-grid" onSubmit={form.handleSubmit(handleSubmit)}>
        <EditorCard title="User Details">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="John wick" {...field} />
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
                  <Input type="email" placeholder="info@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="XXXXXXXXXXXX" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="groupId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <FormControl>
                  <RoleSelector value={field.value} onValueChange={field.onChange} />
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

export default UserEditor;
