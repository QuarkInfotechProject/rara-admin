"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { queryClient } from "@/lib/context/react-query-context";
import displayError from "@/lib/utils/display-error";
import { Email } from "@/types/emails.types";
import { zodResolver } from "@hookform/resolvers/zod";
import EditorCard from "../editor-card";
import { EmailSchema, emaiLSchema } from "./zod-schema";
import dynamic from "next/dynamic";
const CkEditor = dynamic(() => import("@/components/ck-editor"), { ssr: false });

interface Props {
  initialData?: Email;
}

function EmailEditor({ initialData }: Props) {
  const form = useForm<EmailSchema>({
    resolver: zodResolver(emaiLSchema),
    defaultValues: initialData,
  });
  const { isSubmitting } = form.formState;
  const router = useRouter();
  const emailMessage = form.watch("message");

  async function handleSubmit(data: EmailSchema) {
    try {
      await axios.post("/api/emails/update", data);
      await queryClient.invalidateQueries({
        queryKey: ["email-templates"],
      });
      router.push("/admin/email-template");
      toast.success("Email updated successfully!");
    } catch (error) {
      displayError(error, {});
    }
  }

  return (
    <Form {...form}>
      <form className="editor-grid" onSubmit={form.handleSubmit(handleSubmit)}>
        <EditorCard title="Email Details">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="User Registration" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subject</FormLabel>
                <FormControl>
                  <Input placeholder="Write your subject here" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Message</FormLabel>
                <FormControl>
                  <CkEditor
                    id="email-message"
                    initialData={emailMessage}
                    onChange={(content) => {
                      form.setValue("message", content);
                    }}
                  />
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
                  <Textarea rows={4} placeholder="Write your description here" {...field} />
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

export default EmailEditor;
