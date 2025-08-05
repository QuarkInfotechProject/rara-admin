import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import DatePicker from "../date-picker";
import EditorCard from "../editor-card";
import { BookingEditorSchema } from "./zod-schema";

function BookingEditorPublishControls() {
  const form = useFormContext<BookingEditorSchema>();
  const { isSubmitting } = form.formState;

  return (
    <EditorCard title="Publish">
      <FormField
        control={form.control}
        name="type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Type</FormLabel>
            <Select value={String(field.value)} onValueChange={field.onChange}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="booking">Booking</SelectItem>
                <SelectItem value="inquiry">Inquiry</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="status"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Status</FormLabel>
            <Select value={String(field.value)} onValueChange={field.onChange}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="no_show">No Show</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="from_date"
        render={({ field }) => (
          <FormItem>
            <FormLabel>From Date</FormLabel>
            <FormControl>
              <DatePicker selected={field.value} onSelect={(date) => field.onChange(date?.toISOString())} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="to_date"
        render={({ field }) => (
          <FormItem>
            <FormLabel>To Date</FormLabel>
            <FormControl>
              <DatePicker selected={field.value} onSelect={(date) => field.onChange(date?.toISOString())} />
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

export default BookingEditorPublishControls;
