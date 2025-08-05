import { notFound } from "next/navigation";
import PageTitle from "@/components/page-title";
import TagEditor from "@/components/product/tag/tag-editor";
import getProductTagDetails from "@/lib/utils/server/get-product-tag-details";

interface Props {
  searchParams: Promise<{
    id: string;
  }>;
}

async function EdiTag({ searchParams }: Props) {
  const { id } = await searchParams;
  const data = await getProductTagDetails(id);

  if (!data) {
    notFound();
  }

  return (
    <div>
      <PageTitle title="Edit Tag" prevPage="./" />
      <TagEditor edit initialData={data} />
    </div>
  );
}

export default EdiTag;
export const dynamic = "force-dynamic";
