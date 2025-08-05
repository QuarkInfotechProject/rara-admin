import PageTitle from "@/components/page-title";
import UserEditor from "@/components/admin-users/user-editor";

function NewUser() {
  return (
    <div>
      <PageTitle title="New User" prevPage="./" />
      <UserEditor />
    </div>
  );
}

export default NewUser;
