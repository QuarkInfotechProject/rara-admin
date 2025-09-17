import { useFormContext } from "react-hook-form";
import EditorCard from "@/components/editor-card";
import { FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormSchema } from "./product-editor";

const overviewFields = [
  {
    key: "duration",
    label: "Duration",
    placeholder: "e.g., 7 days",
    type: "text",
  },
  {
    key: "overview_location",
    label: "Location",
    placeholder: "e.g., Kathmandu, Nepal",
    type: "text",
  },
  {
    key: "trip_grade",
    label: "Trip Grade",
    placeholder: "e.g., Moderate, Challenging",
    type: "text",
  },
  {
    key: "max_altitude",
    label: "Maximum Altitude",
    placeholder: "e.g., 5545m",
    type: "text",
  },
  {
    key: "group_size",
    label: "Group Size",
    placeholder: "e.g., 12",
    type: "number",
  },
  {
    key: "activities",
    label: "Activities",
    placeholder: "e.g., Trekking, Climbing",
    type: "text",
  },
  {
    key: "best_time",
    label: "Best Time",
    placeholder: "e.g., March-May, September-November",
    type: "text",
  },
  {
    key: "starts",
    label: "Starts",
    placeholder: "e.g., Kathmandu",
    type: "text",
  },
] as const;

function OverviewFields() {
  const form = useFormContext<FormSchema>();
  const overview = form.watch("overview") ?? {};

  function changeInput(field: string, value: string) {
    const updatedOverview = {
      ...overview,
      [field]:
        field === "group_size" ? (value === "" ? 0 : Number(value)) : value,
    };

    form.setValue("overview", updatedOverview, {
      shouldValidate: true,
      shouldDirty: true,
    });
  }

  return (
    <div className="editor-grid">
      <EditorCard title="Overview Details">
        <FormField
          control={form.control}
          name="overview"
          render={() => (
            <FormItem>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {overviewFields.map(({ key, label, placeholder, type }) => (
                  <div key={key} className="grid gap-2">
                    <Label>{label}</Label>
                    <Input
                      type={type}
                      value={
                        key === "group_size"
                          ? overview?.[key] === 0
                            ? ""
                            : overview?.[key] ?? ""
                          : overview?.[key] ?? ""
                      }
                      onChange={(e) => changeInput(key, e.target.value)}
                      placeholder={placeholder}
                    />
                  </div>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </EditorCard>
    </div>
  );
}

export default OverviewFields;
