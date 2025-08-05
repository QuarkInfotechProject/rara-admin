"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import EditorCard from "@/components/editor-card";
import IconPicker from "@/components/media/icon-picker";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { queryClient } from "@/lib/context/react-query-context";
import displayError from "@/lib/utils/display-error";
import { Amenity } from "@/types/products.types";
import { zodResolver } from "@hookform/resolvers/zod";
import CategorySelector from "./category-selector";
import { amenitySchema, AmenitySchema } from "./zod-schema";

interface Props {
  initialData?: Amenity;
  edit?: boolean;
}

function AmenityEditor({ initialData, edit }: Props) {
  const form = useForm<AmenitySchema>({
    resolver: zodResolver(amenitySchema),
    defaultValues: initialData,
  });

  const { isSubmitting } = form.formState;
  const router = useRouter();

  async function handleSubmit(data: AmenitySchema) {
    try {
      await axios.post(edit ? "/api/amenity/update" : "/api/amenity/create", data);
      await queryClient.invalidateQueries({
        queryKey: ["amenity"],
      });
      !edit && router.push("/admin/product/amenity");
      toast.success("Amenity updated successfully");
    } catch (error) {
      displayError(error, {});
    }
  }

  return (
    <Form {...form}>
      <form className="editor-grid" onSubmit={form.handleSubmit(handleSubmit)}>
        <EditorCard title="Amenity Details">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="John" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <CategorySelector value={field.value} onValueChange={field.onChange} />
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
          <FormField
            control={form.control}
            name="icon"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Icon</FormLabel>
                <FormControl>
                  <IconPicker
                    selectedIcon={field.value}
                    onSelect={(icon) => {
                      form.setValue("icon", icon);
                    }}
                  />
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

export default AmenityEditor;
