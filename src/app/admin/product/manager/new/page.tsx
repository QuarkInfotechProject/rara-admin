import PageTitle from "@/components/page-title";
import ManagerEditor from "@/components/product/manager/manager-editor";

function NewManager() {
  return (
    <div>
      <PageTitle title="New Manager" prevPage="./" />
      <ManagerEditor />
    </div>
  );
}

export default NewManager;
