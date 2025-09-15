import { useFormContext } from "react-hook-form";
import EditorCard from "@/components/editor-card";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { FormSchema } from "./product-editor";
import dynamic from "next/dynamic";
const CkEditor = dynamic(() => import("@/components/ck-editor"), {
  ssr: false,
});

function DescriptionFields() {
  const form = useFormContext<FormSchema>();
  const description = form.watch("description");
  const shortDescription = form.watch("short_description");
  const impact = form.watch("impact");

  return (
    <div className="editor-grid">
      <EditorCard title="Intro">
        <p className="text-sm text-muted-foreground mb-4">
          Write a engaging introduction (1-3 Sentence) that captures the essence
          of the experience and entices readers to learn more.
        </p>
        <FormField
          control={form.control}
          name="short_description"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <CkEditor
                  id="short_description"
                  initialData={shortDescription}
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

      <EditorCard title="Highlights">
        <p className="text-sm text-muted-foreground mb-4">
          Write the major highlights of this experience in bullet points.
          Include key features, unique aspects, and what makes it special.
          <br />
        </p>

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

      <EditorCard title="Message">
        <p className="text-sm text-muted-foreground mb-4">
          Please provide any important information or instructions you would
          like the user to see regarding this enquiry.
        </p>

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
