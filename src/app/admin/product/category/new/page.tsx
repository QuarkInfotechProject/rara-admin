import PageTitle from "@/components/page-title";
import CategoryEditor from "@/components/product/category-editor";

function NewCategory() {
  return (
    <div>
      <PageTitle title="New Category" prevPage="./" />
      <CategoryEditor />
    </div>
  );
}

export default NewCategory;
