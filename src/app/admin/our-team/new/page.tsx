import TeamEditor from "@/components/our-team/team-editor";
import PageTitle from "@/components/page-title";

function NewTeamMember() {
  return (
    <div>
      <PageTitle title="New Team Member" prevPage="./" />
      <TeamEditor />
    </div>
  );
}

export default NewTeamMember;
