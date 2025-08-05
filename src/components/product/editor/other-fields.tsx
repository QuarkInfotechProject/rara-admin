import { useFormContext } from "react-hook-form";
import EditorCard from "@/components/editor-card";
import { FormSchema } from "./product-editor";
import SelectAmenities from "./select-amenities";
import SelectExcluded from "./select-excluded";
import SelectIncluded from "./select-included";
import SelectManagers from "./select-managers";
import SelectNearbyHomestay from "./select-nearby-homestay";
import SelectRelatedBlogs from "./select-related-blogs";
import SelectRelatedCircuits from "./select-related-circuits";
import SelectRelatedExperiences from "./select-related-experiences";
import SelectRelatedHomestay from "./select-related-homestay";
import SelectRelatedPackages from "./select-related-packages";
import SelectTags from "./select-tags";
import SelectWhatToBring from "./select-what-to-bring";

function RelatedFields() {
  const form = useFormContext<FormSchema>();
  const productType = form.watch("type");

  return (
    <div className="editor-grid">
      <EditorCard title="Related">
        {productType === "homestay" && <SelectAmenities />}
        <SelectRelatedBlogs />
        {productType === "experience" && <SelectRelatedHomestay />}
        {productType === "experience" && <SelectRelatedExperiences />}
        {productType === "circuit" && <SelectRelatedCircuits />}
        {productType === "package" && <SelectRelatedPackages />}
      </EditorCard>
      <EditorCard title="Other">
        {productType === "homestay" && <SelectNearbyHomestay />}
        {productType === "homestay" && <SelectManagers />}
        <SelectTags />
        {productType !== "homestay" && <SelectWhatToBring />}
        <SelectIncluded />
        {(productType === "circuit" || productType === "package") && <SelectExcluded />}
      </EditorCard>
    </div>
  );
}

export default RelatedFields;
