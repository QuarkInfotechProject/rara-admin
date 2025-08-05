import { notFound } from "next/navigation";
import PageTitle from "@/components/page-title";
import WhyUsEditor from "@/components/why-us/why-us-editor";
import getWhyUsDetails from "@/lib/utils/server/get-why-us-details";

interface Props {
  searchParams: Promise<{
    id: string;
  }>;
}

async function EditWhyUs({ searchParams }: Props) {
  const { id } = await searchParams;
  const data = await getWhyUsDetails(id);

  if (!data) {
    notFound();
  }

  return (
    <div>
      <PageTitle title="Edit Why Us" prevPage="./" />
      <WhyUsEditor edit initialData={data} />
    </div>
  );
}

export default EditWhyUs;
export const dynamic = "force-dynamic";
