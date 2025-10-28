import { useSearchParams } from "next/navigation";

function useBookingsFilter() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) ?? 1;
  const product_name = searchParams.get("product_name") ?? undefined;
  const fullname = searchParams.get("fullname") ?? undefined;
  const email = searchParams.get("email") ?? undefined;
  const status = searchParams.get("status") ?? undefined;
  const from_date = searchParams.get("from_date") ?? undefined;
  const to_date = searchParams.get("to_date") ?? undefined;
  const agent = searchParams.get("agent") ?? undefined;
  const product_type = searchParams.get("product_type") ?? undefined;

  return {
    page,
    product_name,
    fullname,
    product_type,
    email,
    status,
    from_date,
    to_date,
    agent,
  };
}

export default useBookingsFilter;
