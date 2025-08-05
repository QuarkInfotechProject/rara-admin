import { useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import EditorCard from "../editor-card";
import { AgentEditorSchema } from "./zod-schema";

function AgentEditorNoteField() {
  const form = useFormContext<AgentEditorSchema>();

  return (
    <EditorCard title="Note">
      <FormField
        control={form.control}
        name="notes"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Textarea placeholder="Write notes here" rows={7} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </EditorCard>
  );
}

export default AgentEditorNoteField;
