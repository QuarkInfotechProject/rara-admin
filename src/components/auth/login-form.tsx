"use client";
import axios from "axios";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input, PasswordInput } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Mountain, Mail, Lock } from "lucide-react";

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
    <div className="min-h-screen flex items-center justify-center  p-4">
      <div className="w-full">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 px-8 py-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mb-3">
              <Mountain className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">Welcome Admin</h1>
          </div>

          {/* Form */}
          <div className="p-8">
            <Form {...form}>
              <form
                className="space-y-6"
                onSubmit={form.handleSubmit(loginUser)}
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium flex items-center gap-2">
                        <Mail className="w-4 h-4 text-green-600" />
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          autoCapitalize="none"
                          autoComplete="email"
                          autoCorrect="off"
                          placeholder="Enter your email"
                          className="h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-green-600 focus:ring-4 focus:ring-green-600/10 transition-all duration-200"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-sm" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium flex items-center gap-2">
                        <Lock className="w-4 h-4 text-green-600" />
                        Password
                      </FormLabel>
                      <FormControl>
                        <PasswordInput
                          {...field}
                          placeholder="Enter your password"
                          className="h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-green-600 focus:ring-4 focus:ring-green-600/10 transition-all duration-200"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-sm" />
                    </FormItem>
                  )}
                />
                <Button
                  className="w-full h-12 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                  disabled={isSubmitting}
                  loading={isSubmitting}
                >
                  {isSubmitting ? "Signing In..." : "Login"}
                </Button>
              </form>
            </Form>

            {/* Forgot password */}
            <div className="text-center mt-6">
              <a
                href="#"
                className="text-green-600 hover:text-green-700 text-sm font-medium transition-colors duration-200"
              >
                Forgot your password?
              </a>
            </div>
          </div>
        </div>

        {/* Footer text */}
        <p className="text-center text-gray-500 text-sm mt-6">
          Ready to explore new destinations?
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
