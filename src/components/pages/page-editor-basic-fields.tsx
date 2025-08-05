import { useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import EditorCard from "../editor-card";
import { PageEditorSchema } from "./zod-schema";
import dynamic from "next/dynamic";
const CkEditor = dynamic(() => import("@/components/ck-editor"), { ssr: false });

function PageEditorBasicFields() {
  const form = useFormContext<PageEditorSchema>();

  return (
    <>
      <EditorCard title="Page Details">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="New Page" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="header"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Header</FormLabel>
              <FormControl>
                <Input placeholder="Header" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </EditorCard>
      <EditorCard title="Content 1">
        <FormField
          control={form.control}
          name="content1"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <CkEditor
                  id="content1"
                  initialData={field.value ?? ""}
                  onChange={(content) => {
                    form.setValue("content1", content);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </EditorCard>
      <EditorCard title="Content 2">
        <FormField
          control={form.control}
          name="content2"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <CkEditor
                  id="content2"
                  initialData={field.value ?? ""}
                  onChange={(content) => {
                    form.setValue("content2", content);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </EditorCard>
      <EditorCard title="Content 3">
        <FormField
          control={form.control}
          name="content3"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <CkEditor
                  id="content3"
                  initialData={field.value ?? ""}
                  onChange={(content) => {
                    form.setValue("content3", content);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </EditorCard>
    </>
  );
}

export default PageEditorBasicFields;
