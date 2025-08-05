import { notFound } from "next/navigation";
import TeamEditor from "@/components/our-team/team-editor";
import PageTitle from "@/components/page-title";
import getTeamMember from "@/lib/utils/server/get-team-member";

interface Props {
  searchParams: Promise<{
    id: string;
  }>;
}

async function EditTeamMember({ searchParams }: Props) {
  const { id } = await searchParams;
  const data = await getTeamMember(id);

  if (!data) {
    notFound();
  }

  return (
    <div>
      <PageTitle title="Edit Team Member" prevPage="./" />
      <TeamEditor edit initialData={data} />
    </div>
  );
}

export default EditTeamMember;
export const dynamic = "force-dynamic";
