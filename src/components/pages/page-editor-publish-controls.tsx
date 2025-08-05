import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageEditorSchema } from "./zod-schema";

interface Props {
  edit: boolean | undefined;
}

function PageEditorPublishControls({ edit }: Props) {
  const form = useFormContext<PageEditorSchema>();
  const { isSubmitting } = form.formState;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Publish</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <FormField
          control={form.control}
          name="is_active"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select value={field.value?.toString()} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="1">Active</SelectItem>
                  <SelectItem value="0">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-full" disabled={isSubmitting} loading={isSubmitting}>
          Publish
        </Button>
      </CardContent>
    </Card>
  );
}

export default PageEditorPublishControls;
