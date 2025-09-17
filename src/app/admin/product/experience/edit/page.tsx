import { notFound } from "next/navigation";
import PageTitle from "@/components/page-title";
import ProductEditor from "@/components/product/editor/product-editor";
import getProductDetails from "@/lib/utils/server/get-product-details";

interface Props {
  searchParams: Promise<{
    id: string;
  }>;
}

async function EditExperience({ searchParams }: Props) {
  const { id } = await searchParams;
  const data = await getProductDetails(id, "trek");

  if (!data) {
    notFound();
  }

  return (
    <div>
      <PageTitle title="Edit Experience" prevPage="./" />
      <ProductEditor productType="tour" initialData={data} edit={true} />{" "}
    </div>
  );
}

export default EditExperience;
export const dynamic = "force-dynamic";
