import PageTitle from "@/components/page-title";
import ProductEditor from "@/components/product/editor/product-editor";

function NewHomestay() {
  return (
    <div>
      <PageTitle title="New Homestay" prevPage="./" />
      <ProductEditor productType="tour" />
    </div>
  );
}

export default NewHomestay;
