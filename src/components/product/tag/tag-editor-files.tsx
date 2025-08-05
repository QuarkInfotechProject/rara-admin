import { useFormContext } from "react-hook-form";
import EditorCard from "@/components/editor-card";
import FilesSelectorInput from "@/components/media/files-selector-input";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import useFilesSelector from "@/lib/hooks/use-files-selector";
import { TagSchema } from "./zod-schema";

function TagEditorFiles() {
  const form = useFormContext<TagSchema>();
  const tagProfileImage = form.watch("files.tagProfile");
  const { selectedFiles, selectFiles, removeFile } = useFilesSelector({
    defaultFilesIds: tagProfileImage ? [tagProfileImage] : [],
    callback: updateFile,
  });

  function updateFile(files: number[]) {
    const fileId = files[0];
    if (fileId) {
      form.setValue("files.tagProfile", fileId);
    }
  }

  return (
    <EditorCard title="Featured Image">
      <FormField
        control={form.control}
        name="files.tagProfile"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <FilesSelectorInput selectedFiles={selectedFiles} onSelect={selectFiles} onRemove={removeFile} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </EditorCard>
  );
}

export default TagEditorFiles;
