import PageTitle from "@/components/page-title";
import ProductEditor from "@/components/product/editor/product-editor";

function NewExperience() {
  return (
    <div>
      <PageTitle title="New Experience" prevPage="./" />
      <ProductEditor productType="tour" />
    </div>
  );
}

export default NewExperience;
