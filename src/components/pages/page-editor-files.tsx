import { useFormContext } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useFilesSelector from "@/lib/hooks/use-files-selector";
import FilesSelectorInput from "../media/files-selector-input";
import { PageEditorSchema } from "./zod-schema";

function PageEditorFiles() {
  const form = useFormContext<PageEditorSchema>();
  const featuredImage = form.watch("files.featuredImage");
  const { selectedFiles, selectFiles, removeFile } = useFilesSelector({
    defaultFilesIds: featuredImage ? [featuredImage] : [],
    callback: updateFile,
  });

  function updateFile(files: number[]) {
    if (files[0]) {
      form.setValue("files", {
        featuredImage: files[0],
      });
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Featured Image</CardTitle>
      </CardHeader>
      <CardContent>
        <FilesSelectorInput
          selectedFiles={selectedFiles}
          onSelect={selectFiles}
          onRemove={removeFile}
          recommendedSize="1200x630"
        />
      </CardContent>
    </Card>
  );
}

export default PageEditorFiles;
