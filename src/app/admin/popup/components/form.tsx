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
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import useFilesSelector from "@/lib/hooks/use-files-selector";
import FilesSelectorInput from "@/components/media/files-selector-input";
import toast from "react-hot-toast";

const popupFormSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(200, "Name is too long"),
  link: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  popupImage: z.array(z.number()).optional(),
  status: z.boolean().default(true),
  publishedDate: z.string().min(1, "Published date is required"),
});

type PopupFormValues = z.infer<typeof popupFormSchema>;

interface PopupFormProps {
  initialData?: {
    id?: number;
    name: string;
    url?: string;
    popupImage?: number[];
    status: 0 | 1;
    publishedDate: string;
  };
  isEdit?: boolean;
}

export function PopupForm({ initialData, isEdit = false }: PopupFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<PopupFormValues>({
    resolver: zodResolver(popupFormSchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          link: "",
          popupImage: initialData.popupImage || [],
          status: initialData.status === 1,
          publishedDate: initialData.publishedDate
            ? new Date(initialData.publishedDate).toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0],
        }
      : {
          name: "",
          link: "",
          popupImage: [],
          status: true,
          publishedDate: new Date().toISOString().split("T")[0],
        },
  });

  const popupImage = form.watch("popupImage");

  const { selectedFiles, selectFiles, removeFile } = useFilesSelector({
    defaultFilesIds: popupImage || [],
    callback: updateImage,
  });

  function updateImage(files: number[]) {
    form.setValue("popupImage", files);
  }

  const onSubmit = async (data: PopupFormValues) => {
    setIsLoading(true);
    const loadingToast = toast.loading(
      isEdit ? "Updating popup..." : "Creating popup..."
    );

    try {
      // Format payload according to API requirements
      const payload = {
        name: data.name,
        slug: "home-popup", // Hardcoded slug
        status: data.status,
        files: {
          popupImage: data.popupImage || [],
        },
      };

      const url = isEdit ? "/api/popup/update" : "/api/popup/create";

      const method = isEdit ? "POST" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok || result.code !== 0) {
        throw new Error(result.message || "Failed to save popup");
      }

      toast.success(
        isEdit ? "Popup updated successfully" : "Popup created successfully",
        { id: loadingToast }
      );

      router.push("/admin/popup");
      router.refresh();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to save popup",
        { id: loadingToast }
      );
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
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
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

                  <FormField
                    control={form.control}
                    name="popupImage"
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
                      name="status"
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
