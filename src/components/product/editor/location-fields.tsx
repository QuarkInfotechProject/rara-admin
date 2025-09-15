import { useFormContext } from "react-hook-form";
import EditorCard from "@/components/editor-card";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FormSchema } from "./product-editor";
import dynamic from "next/dynamic";
const CkEditor = dynamic(() => import("@/components/ck-editor"), { ssr: false });

function LocationFields() {
  const form = useFormContext<FormSchema>();
  const howToGet = form.watch("how_to_get");

  return (
    <div className="editor-grid">
      <EditorCard title="Coordinates">
        <FormField
          control={form.control}
          name="latitude"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Latitude</FormLabel>
              <FormControl>
                <Input type="number" placeholder="27.717245" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="longitude"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Longitude</FormLabel>
              <FormControl>
                <Input type="number" placeholder="85.323959" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="Bardali, Nepal" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />        
      </EditorCard>
      <EditorCard title="How to get here">
        <FormField
          control={form.control}
          name="how_to_get"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <CkEditor
                  id="how_to_get"
                  initialData={howToGet}
                  onChange={(content) => {
                    form.setValue("how_to_get", content);
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

export default LocationFields;
