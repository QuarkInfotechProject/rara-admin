import PageTitle from "@/components/page-title";
import ProductEditor from "@/components/product/editor/product-editor";

function NewCircuit() {
  return (
    <div>
      <PageTitle title="New Circuit" prevPage="./" />
      <ProductEditor
        initialData={{
          type: "circuit",
        }}
      />
    </div>
  );
}

export default NewCircuit;
