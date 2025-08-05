import { useFormContext } from "react-hook-form";
import useFilesSelector from "@/lib/hooks/use-files-selector";
import EditorCard from "../editor-card";
import FilesSelector from "../media/files-selector-input";
import { FormData } from "./zod-schema";

function PostEditorFiles() {
  const form = useFormContext<FormData>();
  const postType = form.watch("type");
  const featuredImage = form.watch("files.featuredImage");
  const report = form.watch("files.report");
  const defaultFileId = postType !== "report" ? featuredImage : report;
  const { selectedFiles, selectFiles, removeFile } = useFilesSelector({
    defaultFilesIds: defaultFileId ? [defaultFileId] : [],
    callback: updateFile,
  });
  const mediaImageId = form.watch("files.mediaImage");
  const mediaImage = useFilesSelector({
    defaultFilesIds: mediaImageId ? [mediaImageId] : [],
    callback: (files) => form.setValue("files.mediaImage", files[0]),
  });

  function updateFile(files: number[]) {
    const data: any = {};
    const fileId = files[0];
    if (postType !== "report" && fileId) {
      data.featuredImage = fileId;
    } else if (fileId) {
      data.report = fileId;
    }
    form.setValue("files", data);
  }

  return (
    <>
      <EditorCard title={postType !== "report" ? "Featured Image" : "File"}>
        <FilesSelector
          selectedFiles={selectedFiles}
          onSelect={selectFiles}
          onRemove={removeFile}
          recommendedSize={postType === "blog" ? "800x800" : undefined}
        />
      </EditorCard>
      {(postType === "mediaCoverage" || postType === "blog") && (
        <EditorCard title="Media Image">
          <FilesSelector
            selectedFiles={mediaImage.selectedFiles}
            onSelect={mediaImage.selectFiles}
            onRemove={mediaImage.removeFile}
            recommendedSize={"800x800"}
          />
        </EditorCard>
      )}
    </>
  );
}

export default PostEditorFiles;
