import { notFound } from "next/navigation";
import PageTitle from "@/components/page-title";
import ManagerEditor from "@/components/product/manager/manager-editor";
import getManagerDetails from "@/lib/utils/server/get-manager-details";

interface Props {
  searchParams: Promise<{
    id: string;
  }>;
}

async function EditManager({ searchParams }: Props) {
  const { id } = await searchParams;
  const data = await getManagerDetails(id);

  if (!data) {
    notFound();
  }

  return (
    <div>
      <PageTitle title="Edit Manager" prevPage="./" />
      <ManagerEditor edit initialData={data} />
    </div>
  );
}

export default EditManager;
export const dynamic = "force-dynamic";
