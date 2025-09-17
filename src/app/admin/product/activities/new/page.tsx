import PageTitle from "@/components/page-title";
import ProductEditor from "@/components/product/editor/product-editor";

function NewActivities() {
  return (
    <div>
      <PageTitle title="New Activities" prevPage="./" />
      <ProductEditor productType="activities" />
    </div>
  );
}

export default NewActivities;
