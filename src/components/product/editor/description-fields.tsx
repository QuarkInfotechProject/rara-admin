import { useFormContext } from "react-hook-form";
import EditorCard from "@/components/editor-card";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { FormSchema } from "./product-editor";
import dynamic from "next/dynamic";
const CkEditor = dynamic(() => import("@/components/ck-editor"), { ssr: false });

function DescriptionFields() {
  const form = useFormContext<FormSchema>();
  const description = form.watch("description");
  const shortDescription = form.watch("intro");
  const impact = form.watch("impact");

  return (
    <div className="editor-grid">
      <EditorCard title="intro">
        <FormField
          control={form.control}
          name="intro"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <CkEditor
                  id="intro"
                  initialData={shortDescription}
                  onChange={(content) => {
                    form.setValue("intro", content);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </EditorCard>
      <EditorCard title="Description">
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <CkEditor
                  id="description"
                  initialData={description}
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
      <EditorCard title="Impact">
        <FormField
          control={form.control}
          name="impact"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <CkEditor
                  id="impact"
                  initialData={impact}
                  onChange={(content) => {
                    form.setValue("impact", content);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </EditorCard>
    </div>
  );
}

export default DescriptionFields;
