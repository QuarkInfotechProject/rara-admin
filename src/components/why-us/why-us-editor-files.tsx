import { useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import useFilesSelector from "@/lib/hooks/use-files-selector";
import EditorCard from "../editor-card";
import FilesSelectorInput from "../media/files-selector-input";
import { WhyUsSchema } from "./zod-schema";

function WhyUsEditorFiles() {
  const form = useFormContext<WhyUsSchema>();
  const whyUsImage = form.watch("files.whyUsImage");

  const { selectedFiles, selectFiles, removeFile } = useFilesSelector({
    defaultFilesIds: whyUsImage ? [whyUsImage] : [],
    callback: updateFile,
  });

  function updateFile(files: number[]) {
    if (files[0]) {
      form.setValue("files", { whyUsImage: files[0] });
    }
  }

  return (
    <EditorCard title="Featured Image">
      <FormField
        control={form.control}
        name="files.whyUsImage"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <FilesSelectorInput
                selectedFiles={selectedFiles}
                onSelect={selectFiles}
                onRemove={removeFile}
                recommendedSize="800x800"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </EditorCard>
  );
}

export default WhyUsEditorFiles;
