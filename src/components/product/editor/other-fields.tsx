import { useFormContext } from "react-hook-form";
import EditorCard from "@/components/editor-card";
import { FormSchema } from "./product-editor";
import SelectExcluded from "./select-excluded";
import SelectIncluded from "./select-included";
import SelectRelatedBlogs from "./select-related-blogs";
import SelectTags from "./select-tags";
import SelectWhatToBring from "./select-what-to-bring";
import SelectRelatedCircuits from "./select-related-circuits";
import SelectRelatedHomeStay from "./select-related-homestay";
import SelectRelatedExperiences from "./select-related-experiences";
import { useEffect } from "react";

interface RelatedFieldsProps {
  productType?: "trek" | "tour" | "activities";
}

function RelatedFields({ productType }: RelatedFieldsProps) {
  const form = useFormContext<FormSchema>();

  useEffect(() => {
    const currentType = form.getValues("type");
    const typeToSet = productType || currentType || "trek";

    if (currentType !== typeToSet) {
      form.setValue("type", typeToSet);
    }
  }, [form, productType]);

  // Get the current product type from form or prop
  const currentProductType = productType || form.getValues("type") || "trek";

  // Render the appropriate related component based on product type
  const renderRelatedComponent = () => {
    switch (currentProductType) {
      case "trek":
        return <SelectRelatedCircuits />;
      case "tour":
        return <SelectRelatedHomeStay />;
      case "activities":
        return <SelectRelatedExperiences />;
      default:
        return <SelectRelatedCircuits />;
    }
  };

  return (
    <div className="editor-grid">
      <EditorCard title="Related">
        <SelectRelatedBlogs />
        {renderRelatedComponent()}
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
