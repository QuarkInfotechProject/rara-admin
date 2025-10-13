import axios from "axios";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import Select from "react-select";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useQuery } from "@tanstack/react-query";
import EditorCard from "../editor-card";
import ProductSelector from "../product/product-selector";
import { BookingEditorSchema } from "./zod-schema";

function BookingEditorOtherFields() {
  const form = useFormContext<BookingEditorSchema>();

  const {
    data: activities,
    isLoading,
    isError,
  } = useQuery<{ id: number; name: string }[]>({
    queryKey: ["product-selector-activities"],
    queryFn: async () => {
      const { data } = await axios.get("/api/product/select-list/activities");
      return data?.data;
    },
  });

  // Map activities to select options
  const productOptions =
    activities?.map((item) => ({
      value: item.id,
      label: item.name,
    })) ?? [];

  // Handle initial data conversion from API format to number array
  useEffect(() => {
    if (activities && activities.length > 0) {
      const currentActivities = form.getValues("preference_activities");

      if (currentActivities && currentActivities.length > 0) {
        const firstItem = currentActivities[0];

        // Check if data is still in API format {id, name}
        if (
          typeof firstItem === "object" &&
          firstItem !== null &&
          "id" in firstItem
        ) {
          const ids = currentActivities.map((item: any) => item.id);
          form.setValue("preference_activities", ids, {
            shouldValidate: false,
            shouldDirty: false,
          });
        }
      }
    }
  }, [activities, form]);

  return (
    <EditorCard title="Other">
      <FormField
        control={form.control}
        name="product_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Product</FormLabel>
            <ProductSelector
              value={field.value}
              onValueChange={field.onChange}
            />
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="preference_activities"
        render={({ field }) => {
          // Convert stored IDs to select format for display
          const selectedOptions = productOptions.filter(
            (opt) =>
              Array.isArray(field.value) && field.value.includes(opt.value)
          );

          return (
            <FormItem>
              <FormLabel>Additional Activities</FormLabel>

              {isLoading && <p className="text-sm text-gray-500">Loading...</p>}
              {isError && (
                <p className="text-sm text-red-500">
                  Failed to load activities list
                </p>
              )}

              {!isLoading && !isError && (
                <Select
                  classNamePrefix="chn_select"
                  options={productOptions}
                  isMulti
                  value={selectedOptions}
                  onChange={(selected) => {
                    const ids = selected
                      ? selected.map((opt) => opt.value)
                      : [];
                    field.onChange(ids);
                  }}
                />
              )}

              <FormMessage />
            </FormItem>
          );
        }}
      />
    </EditorCard>
  );
}

export default BookingEditorOtherFields;
