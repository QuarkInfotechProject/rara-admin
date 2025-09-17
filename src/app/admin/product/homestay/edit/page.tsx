import { notFound } from "next/navigation";
import PageTitle from "@/components/page-title";
import ProductEditor from "@/components/product/editor/product-editor";
import getProductDetails from "@/lib/utils/server/get-product-details";

interface Props {
  searchParams: Promise<{
    id: string;
  }>;
}

async function EditHomestay({ searchParams }: Props) {
  const { id } = await searchParams;
  const data = await getProductDetails(id, "trek");

  if (!data) {
    notFound();
  }

  return (
    <div>
      <PageTitle title="Edit Homestay" prevPage="./" />
      <ProductEditor productType="tour" initialData={data} edit={true} />{" "}
    </div>
  );
}

export default EditHomestay;
export const dynamic = "force-dynamic";
