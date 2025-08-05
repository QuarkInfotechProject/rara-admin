"use client";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { User } from "@/types/users.types";
import { zodResolver } from "@hookform/resolvers/zod";
import EditorCard from "../editor-card";
import { userSchema, UserSchema } from "./zod-schema";

interface Props {
  initialData?: User;
}

function UserEditor({ initialData }: Props) {
  const form = useForm<UserSchema>({
    resolver: zodResolver(userSchema),
    defaultValues: initialData,
    disabled: true,
  });

  return (
    <Form {...form}>
      <form className="editor-grid">
        <EditorCard title="User Details">
          <FormField
            control={form.control}
            name="full_name"
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
            name="phone_no"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input placeholder="XXXXXXXXXXXX" {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="America" {...field} />
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
                  <Input type="text" placeholder="Active" {...field} value={field.value ? "Active" : "Inactive"} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </EditorCard>
      </form>
    </Form>
  );
}

export default UserEditor;
