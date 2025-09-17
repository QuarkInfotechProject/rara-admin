import { useFormContext } from "react-hook-form";
import EditorCard from "@/components/editor-card";
import { FormSchema } from "./product-editor";
// import SelectAmenities from "./select-amenities";
import SelectExcluded from "./select-excluded";
import SelectIncluded from "./select-included";
import SelectRelatedBlogs from "./select-related-blogs";
import SelectTags from "./select-tags";
import SelectWhatToBring from "./select-what-to-bring";
import SelectRelatedCircuits from "./select-related-circuits";

function RelatedFields() {
  const form = useFormContext<FormSchema>();
  const productType = form.watch("type");

  return (
    <div className="editor-grid">
      <EditorCard title="Related">
        {/* <SelectAmenities /> */}
        <SelectRelatedBlogs />
        <SelectRelatedCircuits />
      </EditorCard>
      <EditorCard title="Other">
        <SelectTags />
        <SelectWhatToBring />
        <SelectIncluded />
        <SelectExcluded />
      </EditorCard>
    </div>
  );
}

export default RelatedFields;
