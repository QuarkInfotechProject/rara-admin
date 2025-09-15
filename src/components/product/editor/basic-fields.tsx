import { useFormContext } from "react-hook-form";
import EditorCard from "@/components/editor-card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormSchema } from "./product-editor";

function BasicFields() {
  const form = useFormContext<FormSchema>();
  const productType = form.watch("type");

  return (
    <EditorCard title="Basic">
      <FormField
        control={form.control}
        name="cornerstone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Cornerstone</FormLabel>
            <FormControl>
              <Select
                value={field.value.toString()}
                onValueChange={field.onChange}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="1">Yes</SelectItem>
                  <SelectItem value="0">No</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="is_occupied"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Is Occupied</FormLabel>
            <Select
              value={field.value.toString()}
              onValueChange={field.onChange}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="1">Yes</SelectItem>
                <SelectItem value="0">No</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      {/* {productType === "trek" && (
        <FormField
          control={form.control}
          name="max_occupant"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Max Occupants</FormLabel>
              <FormControl>
                <Input type="number" placeholder="1" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )} */}
      <FormField
        control={form.control}
        name="display_homepage"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Display on Homepage</FormLabel>
            <FormControl>
              <Select
                value={field.value.toString()}
                onValueChange={field.onChange}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="1">Yes</SelectItem>
                  <SelectItem value="0">No</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </EditorCard>
  );
}

export default BasicFields;
