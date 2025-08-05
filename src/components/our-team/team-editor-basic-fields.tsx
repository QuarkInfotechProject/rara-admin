import { useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import EditorCard from "../editor-card";
import { TeamEditorSchema } from "./zod-schema";

function TeamEditorBasicFields() {
  const form = useFormContext<TeamEditorSchema>();

  return (
    <EditorCard title="Team Member Details">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input placeholder="John" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="position"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Position</FormLabel>
            <Input placeholder="Manager" {...field} />
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="linkedIn_link"
        render={({ field }) => (
          <FormItem>
            <FormLabel>LinkedIn Profile Url</FormLabel>
            <Input placeholder="https://linkedin.com" {...field} />
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="bio"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Bio</FormLabel>
            <FormControl>
              <Textarea rows={8} {...field} placeholder="Write the bio here" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </EditorCard>
  );
}

export default TeamEditorBasicFields;
