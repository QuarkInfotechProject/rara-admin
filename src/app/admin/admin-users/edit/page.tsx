import { notFound } from "next/navigation";
import PageTitle from "@/components/page-title";
import getAdminUserDetails from "@/lib/utils/server/get-admin-user-details";
import UserEditor from "@/components/admin-users/user-editor";

interface Props {
  searchParams: Promise<{
    uuid: string;
  }>;
}

async function EditUser({ searchParams }: Props) {
  const { uuid } = await searchParams;
  const data = await getAdminUserDetails(uuid);

  if (!data) {
    notFound();
  }

  return (
    <div>
      <PageTitle title="Edit User" prevPage="./" />
      <UserEditor edit initialData={data} />
    </div>
  );
}

export default EditUser;
export const dynamic = "force-dynamic";
