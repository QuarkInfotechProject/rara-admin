import { useFormContext } from "react-hook-form";
import EditorCard from "@/components/editor-card";
import { FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormSchema } from "./product-editor";

const overviewFields = [
  { key: "duration", label: "Duration" },
  { key: "location", label: "Location" },
  { key: "trip_grade", label: "Trip Grade" },
  { key: "maximum_altitude", label: "Maximum Altitude" },
  { key: "group_size", label: "Group Size" },
  { key: "activities", label: "Activities" },
  { key: "best_time", label: "Best Time" },
  { key: "starts", label: "Starts" },
] as const;

function OverviewFields() {
  const form = useFormContext<FormSchema>();
  const overview = form.watch("overview") ?? {};

  function changeInput(field: string, value: string) {
    form.setValue("overview", {
      ...overview,
      [field]: value,
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
                {overviewFields.map(({ key, label }) => (
                  <div key={key} className="grid gap-2">
                    <Label>{label}</Label>
                    <Input
                      value={overview?.[key] ?? ""}
                      onChange={(e) => changeInput(key, e.target.value)}
                      placeholder={`Enter ${label}`}
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
