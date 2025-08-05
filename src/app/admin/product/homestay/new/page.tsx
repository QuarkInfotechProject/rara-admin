import PageTitle from "@/components/page-title";
import ProductEditor from "@/components/product/editor/product-editor";

function NewHomestay() {
  return (
    <div>
      <PageTitle title="New Homestay" prevPage="./" />
      <ProductEditor
        initialData={{
          type: "homestay",
        }}
      />
    </div>
  );
}

export default NewHomestay;
