"use client";
import axios from "axios";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import displayError from "@/lib/utils/display-error";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const formSchema = z
  .object({
    currentPassword: z.string(),
    newPassword: z.string(),
    confirmPassword: z.string(),
  })
  .refine((obj) => obj.newPassword === obj.confirmPassword, {
    message: "New password and confirm password must match",
    path: ["confirmPassword"],
  });

type FormSchema = z.infer<typeof formSchema>;

function ChangePasswordForm() {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
  });
  const { isSubmitting } = form.formState;

  async function changePassword(values: FormSchema) {
    try {
      await axios.post("/api/change-password", values);
      toast.success("Password updated successfully");
    } catch (error) {
      displayError(error, {});
    }
  }

  return (
    <Form {...form}>
      <form className="grid gap-4" onSubmit={form.handleSubmit(changePassword)}>
        <FormField
          control={form.control}
          name="currentPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Password</FormLabel>
              <FormControl>
                <Input {...field} autoCapitalize="none" autoComplete="email" autoCorrect="off" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-fit" disabled={isSubmitting} loading={isSubmitting}>
          Update
        </Button>
      </form>
    </Form>
  );
}

export default ChangePasswordForm;
