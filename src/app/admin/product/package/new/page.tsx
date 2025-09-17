import PageTitle from "@/components/page-title";
import ProductEditor from "@/components/product/editor/product-editor";

function NewPackage() {
  return (
    <div>
      <PageTitle title="New Package" prevPage="./" />
      <ProductEditor productType="tour" />
    </div>
  );
}

export default NewPackage;
