import axios from "axios";
import React, { useMemo } from "react";
import { useFormContext } from "react-hook-form";
import Select from "react-select";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { ListProducts } from "@/types/blog.types";
import { useQuery } from "@tanstack/react-query";
import { FormData } from "./zod-schema";

function RelatedProductSelector() {
  const productsList = ["package","homestay", "experience", "circuit"]
  const { data, isPending } = useQuery<{
    products: ListProducts[];
  }>({
    queryKey: ["post-editor-related-products"],
    
    queryFn: async () => {
      let allProducts: ListProducts[] = [];
       for (const property of productsList) {
        try {
          const response = await axios.get(`/api/product/select-list/${property}`);
          
          if (response.data.data && Array.isArray(response.data.data)) {
            allProducts = [...allProducts, ...response.data.data];
          }
        } catch (error) {
          console.error(`Error fetching ${property} products:`, error);
        }
      }

      return {
        products: allProducts,
      };
      // const products = await axios.get("/api/product/select-list/homestay");
      // console.log("products recieved are :", products.data.data)
      // return {
      //   products: products.data.data as any,
      // };
    },
  });
  const form = useFormContext<FormData>();
  const relatedProducts = form.watch("related_product");
  const productOptions = useMemo(() => {
    return data?.products?.map((product) => {
      return {
        label: product.name,
        value: product.id,
      };
    });
  }, [data?.products]);

  const activeProducts = useMemo(() => {
    return relatedProducts?.map((product) => {
      const productData = data?.products?.find((p) => p.id === product)!;
      return {
        label: productData?.name,
        value: productData?.id,
      };
    });
  }, [data?.products, relatedProducts]);

  return (
    <FormField
      control={form.control}
      name="related_product"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Related Prodcuts</FormLabel>
          <FormControl>
            {isPending ? (
              <Skeleton className="w-full h-[38px]" />
            ) : (
              <Select
              className="z-10"
                classNamePrefix="chn_select"
                isMulti
                defaultValue={activeProducts}
                value={activeProducts}
                options={productOptions}
                onChange={(options) => {
                  form.setValue(
                    "related_product",
                    options.map((option) => option.value)
                  );
                }}
              />
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export default RelatedProductSelector;
