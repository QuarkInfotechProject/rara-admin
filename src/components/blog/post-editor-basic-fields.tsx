import { useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import EditorCard from "../editor-card";
import SEOEditor from "../seo-editor";
import RelatedProductSelector from "./related-product-selector";
import dynamic from "next/dynamic";
const CkEditor = dynamic(() => import("@/components/ck-editor"), { ssr: false });

function PostEditorBasicFields() {
  const form = useFormContext<any>();
  const postType = form.watch("type");
  const postDescription = form.watch("description");
  const postShortDescription = form.watch("short_description");

  return (
    <div>
      <EditorCard title="Blog Details">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="New Post" {...field} />
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
                <Input placeholder="slug" {...field} onChange={(e) => field.onChange(e.target.value)} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {postType === "mediaCoverage" && (
          <FormField
            control={form.control}
            name="media_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Media Name</FormLabel>
                <FormControl>
                  <Input placeholder="Forbes" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <RelatedProductSelector />
      </EditorCard>
      {(postType === "blog" || postType === "report") && (
        <EditorCard title="Description">
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <CkEditor
                    id="post-description"
                    initialData={postDescription}
                    onChange={(content) => {
                      form.setValue("description", content);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </EditorCard>
      )}
      <EditorCard title="Short Description">
        <FormField
          control={form.control}
          name="short_description"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <CkEditor
                  id="post-short-description"
                  initialData={postShortDescription}
                  onChange={(content) => {
                    form.setValue("short_description", content);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </EditorCard>
      {postType === "blog" && <SEOEditor />}
    </div>
  );
}

export default PostEditorBasicFields;
