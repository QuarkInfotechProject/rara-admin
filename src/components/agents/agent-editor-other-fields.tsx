import { useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import EditorCard from "../editor-card";
import { AgentEditorSchema } from "./zod-schema";

function AgentEditorOtherFields() {
  const form = useFormContext<AgentEditorSchema>();

  return (
    <EditorCard title="Other">
      <FormField
        control={form.control}
        name="homestay_margin"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Homestay Margin</FormLabel>
            <FormControl>
              <Input placeholder="10" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="experience_margin"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Experience Margin</FormLabel>
            <FormControl>
              <Input placeholder="12" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="package_margin"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Package Margin</FormLabel>
            <FormControl>
              <Input placeholder="15" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="pan_no"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Pan Number</FormLabel>
            <FormControl>
              <Input placeholder="15" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </EditorCard>
  );
}

export default AgentEditorOtherFields;
