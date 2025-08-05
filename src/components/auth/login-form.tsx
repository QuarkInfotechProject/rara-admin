"use client";
import axios from "axios";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input, PasswordInput } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

interface FormSchema {
  email: string;
  password: string;
}

const formSchema = z.object({
  email: z.string(),
  password: z.string(),
});

const LoginForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { isSubmitting } = form.formState;
  const router = useRouter();

  async function loginUser(formData: FormSchema) {
    try {
      const { data } = await axios.post(`/api/login`, formData);
      toast.success(`${data.message}`);
      router.push("/admin");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message || error.message);
      }
    }
  }

  return (
    <div>
      <Form {...form}>
        <form className="grid gap-4" onSubmit={form.handleSubmit(loginUser)}>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} autoCapitalize="none" autoComplete="email" autoCorrect="off" />
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
                  <PasswordInput {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="w-full" disabled={isSubmitting} loading={isSubmitting}>
            Login
          </Button>
        </form>
      </Form>
    </div>
  );
};
export default LoginForm;
