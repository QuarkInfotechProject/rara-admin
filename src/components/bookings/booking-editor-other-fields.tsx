import axios from "axios";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import Select from "react-select";
import {
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { useQuery } from "@tanstack/react-query";
import AgentSelector from "../agents/agent-selector";
import EditorCard from "../editor-card";
import ProductSelector from "../product/product-selector";
import { BookingEditorSchema } from "./zod-schema";

function BookingEditorOtherFields() {
  const [productOptions, setProductOptions] = useState<any>([]);
  const form = useFormContext<BookingEditorSchema>();
  const additionalProducts = form.watch("additional_products") ?? [];
  const { data: products } = useQuery<{ id: number; name: string }[]>({
    queryKey: ["product-selector"],
    queryFn: async () => {
      const { data } = await axios.get("/api/booking/list/product-select");
      return data?.data;
    },
  });

  useEffect(() => {
    if (products) {
      const options = products.map((product: any) => ({
        value: product.id,
        label: product.name,
      }));
      setProductOptions(options);
      const selectedOptions = options.find((p) => additionalProducts.includes(p.value)) ?? [];
      // @ts-ignore
      form.setValue("additional_products", selectedOptions);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products]);

  return (
    <EditorCard title="Other">
      <FormField
        control={form.control}
        name="product_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Product</FormLabel>
            <ProductSelector value={field.value} onValueChange={field.onChange} />
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="agent_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Agent</FormLabel>
            <AgentSelector value={field.value} onValueChange={field.onChange} />
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="additional_products"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Additional Products</FormLabel>
            <Select
              classNamePrefix="chn_select"
              options={productOptions}
              onChange={field.onChange}
              isMulti
              value={field.value}
            />
            <FormMessage />
          </FormItem>
        )}
      />
    </EditorCard>
  );
}

export default BookingEditorOtherFields;
