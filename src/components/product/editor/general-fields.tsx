import { useFormContext } from "react-hook-form";
import EditorCard from "@/components/editor-card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SEOEditor from "../../seo-editor";
import { FormSchema } from "./product-editor";

function GeneralFields() {
  const form = useFormContext<FormSchema>();

  return (
    <div className="editor-grid">
      <EditorCard title="Basic">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="trek">Trek</SelectItem>
                  <SelectItem value="tour">Tour</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category_details"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category Description</FormLabel>
              <FormControl>
                <Input
                  placeholder="Brief description of the category, e.g., Luxury trekking experience in the Himalayas"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Everest Base Camp Trek" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input placeholder="everest-base-camp-trek" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tagline"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tagline</FormLabel>
              <FormControl>
                <Input
                  placeholder="Journey to the roof of the world"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="short_code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Short Code</FormLabel>
              <FormControl>
                <Input placeholder="EBC2024" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* <FormField
          control={form.control}
          name="youtube_link"
          render={({ field }) => (
            <FormItem>
              <FormLabel>YouTube Link</FormLabel>
              <FormControl>
                <Input placeholder="https://youtube.com/watch?v=example" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}
        <FormField
          control={form.control}
          name="night"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Days</FormLabel>
              <FormControl>
                <Input type="number" placeholder="14" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </EditorCard>
      <SEOEditor />
    </div>
  );
}

export default GeneralFields;
