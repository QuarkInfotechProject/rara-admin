import { format } from "date-fns";
import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Image as ImageIcon } from "lucide-react";
import EditorCard from "../editor-card";
import { FormData } from "./zod-schema";

function ReviewEditorBasicFields() {
  const form = useFormContext<FormData>();

  return (
    <EditorCard title="Basic">
      <FormField
        control={form.control}
        name="user.full_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Fullname</FormLabel>
            <FormControl>
              <Input placeholder="John" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="product.name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Product</FormLabel>
            <Input placeholder="Good homestay" {...field} />
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="created_at"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Created At</FormLabel>
            <Input
              placeholder="26/01/24"
              {...field}
              value={format(field.value ?? Date.now(), "dd/MM/yyyy")}
            />
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="updated_at"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Updated At</FormLabel>
            <Input
              placeholder="26/01/24"
              {...field}
              value={format(field.value ?? Date.now(), "dd/MM/yyyy")}
            />
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Image Preview Section */}
      <FormField
        control={form.control}
        name="image_url"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Image</FormLabel>
            <FormControl>
              <Input placeholder="https://example.com/image.jpg" {...field} />
            </FormControl>
            <FormMessage />

            {/* Image Preview */}
            {field.value ? (
              <div className="mt-3">
                <div className="w-full max-w-md mx-auto">
                  <div className="aspect-video rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                    <img
                      src={field.value}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                        target.nextElementSibling?.classList.remove("hidden");
                      }}
                    />
                    <div className="hidden flex items-center justify-center h-full text-gray-400">
                      <div className="text-center">
                        <ImageIcon className="mx-auto h-12 w-12 mb-2" />
                        <p className="text-sm">Failed to load image</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-3 w-full max-w-md mx-auto">
                <div className="aspect-video border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                  <div className="text-center text-gray-400">
                    <ImageIcon className="mx-auto h-8 w-8 mb-2" />
                    <p className="text-sm">Enter image URL to preview</p>
                  </div>
                </div>
              </div>
            )}
          </FormItem>
        )}
      />
    </EditorCard>
  );
}

export default ReviewEditorBasicFields;
