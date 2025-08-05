import { useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import EditorCard from "../editor-card";
import { AgentEditorSchema } from "./zod-schema";

function AgentEditorBankFields() {
  const form = useFormContext<AgentEditorSchema>();

  return (
    <EditorCard title="Bank">
      <FormField
        control={form.control}
        name="bank_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Bank Name</FormLabel>
            <FormControl>
              <Input placeholder="Nepal Bank" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="bank_account_number"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Bank Account Number</FormLabel>
            <FormControl>
              <Input placeholder="1234567890" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="bank_ifsc_code"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Bank IFSC Code</FormLabel>
            <FormControl>
              <Input placeholder="IFSC1234567890" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </EditorCard>
  );
}

export default AgentEditorBankFields;
