import { PlusCircle } from "lucide-react";
import { useFormContext } from "react-hook-form";
import EditorCard from "@/components/editor-card";
import { Button } from "@/components/ui/button";
import { FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IconX } from "@tabler/icons-react";
import { FormSchema } from "./product-editor";

const defaultOverviews = {
  name: "",
  description: "",
};

function OverviewFields() {
  const form = useFormContext<FormSchema>();
  const overviews = form.watch("overview") ?? [];

  function addOverview() {
    form.setValue("overview", [...overviews, defaultOverviews]);
  }

  function removeOverview(index: number) {
    const filteredOverviews = overviews.filter((_, i) => i !== index);
    form.setValue("overview", filteredOverviews);
  }

  function changeInput(index: number, data: { name?: string; description?: string }) {
    let overview = overviews[index];
    if (overview) {
      overview = {
        ...overview,
        ...data,
      };
      overviews[index] = overview;
      form.setValue(
        "overview",
        overviews.map((f, i) => (i === index ? overview : f))
      );
    }
  }

  return (
    <div className="editor-grid">
      <Button type="button" size="sm" className="gap-1 ml-auto w-fit" onClick={addOverview}>
        <PlusCircle size={16} />
        <span className="sr-only sm:not-sr-only">Add</span>
      </Button>
      <EditorCard title="Overviews">
        <FormField
          control={form.control}
          name="hosts"
          render={({ field }) => (
            <FormItem>
              {overviews.map((overview, index) => (
                <Overview
                  key={index}
                  index={index}
                  {...overview}
                  changeInput={changeInput}
                  removeOverview={removeOverview}
                />
              ))}
              <FormMessage />
            </FormItem>
          )}
        />
      </EditorCard>
    </div>
  );
}

export default OverviewFields;

interface OverviewProps {
  index: number;
  name: string;
  description: string;
  changeInput: Function;
  removeOverview: Function;
}

function Overview(props: OverviewProps) {
  return (
    <div className="relative border border-dashed rounded-lg p-3 grid gap-4">
      <Label>Title</Label>
      <Input
        value={props.name}
        onChange={(e) =>
          props.changeInput(props.index, {
            name: e.target.value,
          })
        }
        placeholder="Title"
      />
      <Label>Description</Label>
      <Input
        value={props.description}
        onChange={(e) =>
          props.changeInput(props.index, {
            description: e.target.value,
          })
        }
        placeholder="Write your description here"
      />
      <div className="absolute top-2 right-2 text-black dark:text-white *:bg-white dark:*:bg-stone-900 *:border *:rounded-full *:p-1 *:cursor-pointer flex gap-2">
        <IconX onClick={() => props.removeOverview(props.index)} />
      </div>
    </div>
  );
}
