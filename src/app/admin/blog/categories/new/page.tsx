import CategoryEditor from "@/components/blog/category-editor";
import PageTitle from "@/components/page-title";

function NewCategory() {
  return (
    <div>
      <PageTitle title="New Category" prevPage="./" />
      <CategoryEditor />
    </div>
  );
}

export default NewCategory;
