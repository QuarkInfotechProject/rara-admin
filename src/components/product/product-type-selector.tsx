import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import productTypes from "@/data/product-types.json";

interface Props {
  value: number | string | null | undefined;
  onValueChange: (value: string) => void;
  includeAll?: boolean;
}

function ProductTypeSelector({ value, onValueChange, includeAll }: Props) {
  return (
    <Select value={value ? String(value) : undefined} onValueChange={onValueChange}>
      <SelectTrigger>
        <SelectValue placeholder="Product Type" />
      </SelectTrigger>
      <SelectContent>
        {includeAll && <SelectItem value="all">All</SelectItem>}
        {productTypes.map((type) => (
          <SelectItem key={type.slug} value={type.slug}>
            {type.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default ProductTypeSelector;
