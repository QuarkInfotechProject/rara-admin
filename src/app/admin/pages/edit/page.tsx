import { notFound } from "next/navigation";
import PageTitle from "@/components/page-title";
import PageEditor from "@/components/pages/page-editor";
import getPageDetails from "@/lib/utils/server/get-page-details";

interface Props {
  searchParams: Promise<{
    type: string;
  }>;
}

async function EditPage({ searchParams }: Props) {
  const { type } = await searchParams;
  const data = await getPageDetails(type);

  if (!data) {
    notFound();
  }

  return (
    <div>
      <PageTitle title="Edit Page" prevPage="./" />
      <PageEditor initialData={data} />
    </div>
  );
}

export default EditPage;
export const dynamic = "force-dynamic";
