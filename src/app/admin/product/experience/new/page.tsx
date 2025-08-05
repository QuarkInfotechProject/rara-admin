import PageTitle from "@/components/page-title";
import ProductEditor from "@/components/product/editor/product-editor";

function NewExperience() {
  return (
    <div>
      <PageTitle title="New Experience" prevPage="./" />
      <ProductEditor
        initialData={{
          type: "experience",
        }}
      />
    </div>
  );
}

export default NewExperience;
