import { useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import EditorCard from "../editor-card";
import { BookingEditorSchema } from "./zod-schema";

function BookingEditorBasicFields() {
  const form = useFormContext<BookingEditorSchema>();

  return (
    <EditorCard title="Basic">
      <FormField
        control={form.control}
        name="fullname"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Fullname</FormLabel>
            <FormControl>
              <Input placeholder="John mark" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="mobile_number"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Mobile Number</FormLabel>
            <FormControl>
              <Input placeholder="+19123456789" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input placeholder="john@gmail.com" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="country"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Country</FormLabel>
            <FormControl>
              <Input placeholder="USA" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {/* <FormField
        control={form.control}
        name="ceo"
        render={({ field }) => (
          <FormItem>
            <FormLabel>CEO</FormLabel>
            <FormControl>
              <Input placeholder="CEO" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      /> */}
      {/* <FormField
        control={form.control}
        name="group_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Group name</FormLabel>
            <FormControl>
              <Input placeholder="Group A" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      /> */}
      {/* <FormField
        control={form.control}
        name="room_required"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Room Required</FormLabel>
            <FormControl>
              <Input placeholder="Single room" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      /> */}
    </EditorCard>
  );
}

export default BookingEditorBasicFields;
