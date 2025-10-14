"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import useFilesSelector from "@/lib/hooks/use-files-selector";
import FilesSelectorInput from "@/components/media/files-selector-input";

const popupFormSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title is too long"),
  description: z.string().optional(),
  imageId: z.number().optional(),
  link: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  publishedDate: z.string().min(1, "Published date is required"),
  isActive: z.boolean().default(true),
});

type PopupFormValues = z.infer<typeof popupFormSchema>;

interface PopupFormProps {
  initialData?: PopupFormValues & { id?: number };
  isEdit?: boolean;
}

export function PopupForm({ initialData, isEdit = false }: PopupFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<PopupFormValues>({
    resolver: zodResolver(popupFormSchema),
    defaultValues: initialData || {
      title: "",
      description: "",
      imageId: undefined,
      link: "",
      publishedDate: new Date().toISOString().split("T")[0],
      isActive: true,
    },
  });

  const imageId = form.watch("imageId");

  const { selectedFiles, selectFiles, removeFile } = useFilesSelector({
    defaultFilesIds: imageId ? [imageId] : [],
    callback: updateImage,
  });

  function updateImage(files: number[]) {
    if (files[0]) {
      form.setValue("imageId", files[0]);
    } else {
      form.setValue("imageId", undefined);
    }
  }

  const onSubmit = async (data: PopupFormValues) => {
    setIsLoading(true);
    try {
      console.log("Form data:", data);

      // Replace with your actual API call
      // if (isEdit) {
      //   await axios.put(`/api/home-popups/${initialData?.id}`, data);
      // } else {
      //   await axios.post("/api/home-popups", data);
      // }

      await new Promise((resolve) => setTimeout(resolve, 1000));

      router.push("/admin/home-popups");
      router.refresh();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-10 gap-6">
            <div className="col-span-5">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {isEdit ? "Edit Popup" : "Create New Popup"}
                  </CardTitle>
                  <CardDescription>
                    {isEdit
                      ? "Update the popup information below."
                      : "Fill in the details to create a new homepage popup."}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="imageId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Popup Image</FormLabel>
                          <FormControl>
                            <FilesSelectorInput
                              selectedFiles={selectedFiles}
                              onSelect={selectFiles}
                              onRemove={removeFile}
                              recommendedSize="1200x800"
                            />
                          </FormControl>
                          <FormDescription>
                            Select an image for the popup from media library.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                  <FormField
                    control={form.control}
                    name="link"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Link URL</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://example.com"
                            {...field}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormDescription>
                          Optional link where users will be redirected when
                          clicking the popup.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>

            <div className="col-span-5">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="isActive"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Active</FormLabel>
                            <FormDescription>
                              Enable or disable this popup.
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              disabled={isLoading}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full"
                    >
                      {isLoading && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      {isEdit ? "Update Popup" : "Create Popup"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.back()}
                      disabled={isLoading}
                      className="w-full"
                    >
                      Cancel
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
