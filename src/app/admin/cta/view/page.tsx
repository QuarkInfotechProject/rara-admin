import { notFound } from "next/navigation";
import CTAEditor from "@/components/cta/cta-editor";
import PageTitle from "@/components/page-title";
import getCTADetails from "@/lib/utils/server/get-cta-details";

interface Props {
  searchParams: Promise<{
    id: string;
  }>;
}

async function ViewCTA({ searchParams }: Props) {
  const { id } = await searchParams;
  const data = await getCTADetails(id);

  if (!data) {
    notFound();
  }

  return (
    <div>
      <PageTitle title={`CTA #${data.id}`} prevPage="./" />
      <CTAEditor initialData={data} readonly />
    </div>
  );
}

export default ViewCTA;
export const dynamic = "force-dynamic";
