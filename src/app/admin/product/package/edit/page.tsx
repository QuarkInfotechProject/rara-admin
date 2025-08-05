import { notFound } from "next/navigation";
import PageTitle from "@/components/page-title";
import ProductEditor from "@/components/product/editor/product-editor";
import getProductDetails from "@/lib/utils/server/get-product-details";

interface Props {
  searchParams: Promise<{
    id: string;
  }>;
}

async function EditPackage({ searchParams }: Props) {
  const { id } = await searchParams;
  const data = await getProductDetails(id, "package");

  if (!data) {
    notFound();
  }

  return (
    <div>
      <PageTitle title="Edit Package" prevPage="./" />
      <ProductEditor edit initialData={data} />
    </div>
  );
}

export default EditPackage;
export const dynamic = "force-dynamic";
