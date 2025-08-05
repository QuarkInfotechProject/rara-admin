import axios from "axios";
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

interface Props {
  value: string | number | null | undefined;
  onValueChange: React.Dispatch<React.SetStateAction<string>>;
  className?: string;
}

function ProductSelector({ value, onValueChange, className }: Props) {
  const { data: products, isPending } = useQuery<{ id: number; name: string }[]>({
    queryKey: ["product-selector"],
    queryFn: async () => {
      const { data } = await axios.get("/api/booking/list/product-select");
      return data?.data;
    },
  });

  return (
    <Select value={value ? String(value) : undefined} onValueChange={onValueChange} disabled={isPending}>
      <SelectTrigger className={cn(className)}>
        <SelectValue className="capitalize" placeholder={isPending ? "Loading..." : "Product"} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All</SelectItem>
        {products?.map((product) => (
          <SelectItem className="capitalize" key={product.id} value={String(product.id)}>
            {product.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default ProductSelector;
