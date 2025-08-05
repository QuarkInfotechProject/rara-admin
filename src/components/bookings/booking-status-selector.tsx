import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Props {
  value: number | string | null | undefined;
  onValueChange: (value: string) => void;
  includeAll?: boolean;
}

function BookingStatusSelector({ value, onValueChange, includeAll }: Props) {
  const data = ["pending", "in-progress", "confirmed", "cancelled", "completed", "no-show"];
  return (
    <Select value={value ? String(value) : undefined} onValueChange={onValueChange}>
      <SelectTrigger className="capitalize">
        <SelectValue placeholder="Select a status" />
      </SelectTrigger>
      <SelectContent>
        {includeAll && <SelectItem value="all">All</SelectItem>}
        {data?.map((status) => (
          <SelectItem className="capitalize" key={status} value={status}>
            {status.replaceAll("-", " ")}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default BookingStatusSelector;
