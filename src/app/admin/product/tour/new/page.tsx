import PageTitle from "@/components/page-title";
import ProductEditor from "@/components/product/editor/product-editor";

function NewTrek() {
  return (
    <div>
      <PageTitle title="New Tour" prevPage="./" />
      <ProductEditor />
    </div>
  );
}

export default NewTrek;
