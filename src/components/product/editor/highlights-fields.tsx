import { PlusCircle } from "lucide-react";
import { useFormContext } from "react-hook-form";
import EditorCard from "@/components/editor-card";
import FilesSelectorInput from "@/components/media/files-selector-input";
import { Button } from "@/components/ui/button";
import { FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import useFilesSelector from "@/lib/hooks/use-files-selector";
import { IconX } from "@tabler/icons-react";
import { FormSchema } from "./product-editor";

const defaultHighlight: {
  title: string;
  description: string;
  order: number;
  highlightFiles?: { highlightImage: number };
} = {
  title: "",
  description: "",
  order: 1,
};

function HighlightsFields() {
  const form = useFormContext<FormSchema>();
  const highlights = form.watch("highlights") ?? [];

  function addHighlights() {
    form.setValue("highlights", [...highlights, defaultHighlight]);
  }

  function removeHighlight(index: number) {
    const filteredHighlights = highlights.filter((_, i) => i !== index);
    form.setValue("highlights", filteredHighlights);
  }

  function changeInput(
    index: number,
    data: { title?: string; description?: string; highlightFiles?: { highlightImage: number }; order?: number }
  ) {
    let highlight = highlights[index];
    if (highlight) {
      highlight = {
        ...highlight,
        ...data,
      };
      highlights[index] = highlight;
      form.setValue("highlights", highlights);
    }
  }

  return (
    <div className="editor-grid">
      <Button type="button" size="sm" className="gap-1 ml-auto w-fit" onClick={addHighlights}>
        <PlusCircle size={16} />
        <span className="sr-only sm:not-sr-only">Add</span>
      </Button>
      <EditorCard title="Highlights">
        <FormField
          control={form.control}
          name="files.featuredImage"
          render={({ field }) => (
            <FormItem>
              {highlights.map((highlight, index) => (
                <Highlight
                  key={index}
                  index={index}
                  {...highlight}
                  changeInput={changeInput}
                  removeHighlight={removeHighlight}
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

export default HighlightsFields;

interface HighlightProps {
  index: number;
  title: string;
  description: string;
  order: number;
  highlightFiles?: { highlightImage: number } | null;
  changeInput: Function;
  removeHighlight: Function;
}

function Highlight(props: HighlightProps) {
  const { selectedFiles, selectFiles, removeFile } = useFilesSelector({
    defaultFilesIds: props?.highlightFiles?.highlightImage ? [props.highlightFiles.highlightImage] : [],
    callback: (files) => props.changeInput(props.index, { highlightFiles: { highlightImage: files[0] } }),
  });

  return (
    <div className="relative border border-dashed rounded-lg p-3 grid gap-4" key={props.index}>
      <Label>Title</Label>
      <Input
        value={props.title}
        onChange={(e) =>
          props.changeInput(props.index, {
            title: e.target.value,
          })
        }
        placeholder="Title"
      />
      <Label>Description</Label>
      <Textarea
        value={props.description}
        onChange={(e) =>
          props.changeInput(props.index, {
            description: e.target.value,
          })
        }
        placeholder="Write your description here"
      />
      <Label>Image</Label>
      <FilesSelectorInput
        imageClassName="size-20 md:size-40"
        onSelect={selectFiles}
        selectedFiles={selectedFiles}
        onRemove={removeFile}
      />
      <Label>Order</Label>
      <Input
        type="number"
        value={props.order}
        onChange={(e) =>
          props.changeInput(props.index, {
            order: Number(e.target.value),
          })
        }
        placeholder="1"
      />
      <div className="absolute top-2 right-2 text-black dark:text-white *:bg-white dark:*:bg-stone-900 *:border *:rounded-full *:p-1 *:cursor-pointer flex gap-2">
        <IconX onClick={() => props.removeHighlight(props.index)} />
      </div>
    </div>
  );
}
