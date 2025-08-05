import { useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import useFilesSelector from "@/lib/hooks/use-files-selector";
import EditorCard from "../editor-card";
import FilesSelectorInput from "../media/files-selector-input";
import { TeamEditorSchema } from "./zod-schema";

function TeamEditorFiles() {
  const form = useFormContext<TeamEditorSchema>();
  const profilePic = form.watch("files.ourTeamProfilePic");

  const { selectedFiles, selectFiles, removeFile } = useFilesSelector({
    defaultFilesIds: profilePic ? [profilePic] : [],
    callback: updateFile,
  });

  function updateFile(files: number[]) {
    if (files[0]) {
      form.setValue("files", { ourTeamProfilePic: files[0] });
    }
  }

  return (
    <EditorCard title="Profile Pic">
      <FormField
        control={form.control}
        name="files.ourTeamProfilePic"
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

export default TeamEditorFiles;
