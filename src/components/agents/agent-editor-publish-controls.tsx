import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import DatePicker from "../date-picker";
import EditorCard from "../editor-card";
import { AgentEditorSchema } from "./zod-schema";

function AgentEditorPublishControls() {
  const form = useFormContext<AgentEditorSchema>();
  const { isSubmitting } = form.formState;

  return (
    <EditorCard title="Publish">
      <FormField
        control={form.control}
        name="is_active"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Status</FormLabel>
            <Select value={String(field.value)} onValueChange={field.onChange}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="1">Published</SelectItem>
                <SelectItem value="0">Draft</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="contract_start_date"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Contract Start Date</FormLabel>
            <FormControl>
              <DatePicker selected={field.value} onSelect={field.onChange} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="contract_end_date"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Contract End Date</FormLabel>
            <FormControl>
              <DatePicker selected={field.value} onSelect={field.onChange} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <Button className="w-full" disabled={isSubmitting} loading={isSubmitting}>
        Publish
      </Button>
    </EditorCard>
  );
}

export default AgentEditorPublishControls;
