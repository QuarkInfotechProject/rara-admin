import { notFound } from "next/navigation";
import PageTitle from "@/components/page-title";
import UserEditor from "@/components/users/user-editor";
import getUserDetails from "@/lib/utils/server/get-user-details";

interface Props {
  searchParams: Promise<{
    id: string;
  }>;
}

async function EditUser({ searchParams }: Props) {
  const { id } = await searchParams;
  const data = await getUserDetails(id);

  if (!data) {
    notFound();
  }

  return (
    <div>
      <PageTitle title="Edit User" prevPage="./" />
      <UserEditor initialData={data} />
    </div>
  );
}

export default EditUser;
export const dynamic = "force-dynamic";
