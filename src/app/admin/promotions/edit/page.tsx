import { notFound } from "next/navigation";
import PageTitle from "@/components/page-title";
import PromotionEditor from "@/components/promotions/promotion-editor";
import getPromotionDetails from "@/lib/utils/server/get-promotion-details";

interface Props {
  searchParams: Promise<{
    id: string;
  }>;
}

async function EditPromotion({ searchParams }: Props) {
  const { id } = await searchParams;
  const data = await getPromotionDetails(id);

  if (!data) {
    notFound();
  }

  return (
    <div>
      <PageTitle title="Edit Promotion" prevPage="./" />
      <PromotionEditor edit initialData={data} />
    </div>
  );
}

export default EditPromotion;
export const dynamic = "force-dynamic";
