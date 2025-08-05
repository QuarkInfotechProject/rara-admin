import { useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import useFilesSelector from "@/lib/hooks/use-files-selector";
import EditorCard from "../editor-card";
import FilesSelectorInput from "../media/files-selector-input";
import { PromotionSchema } from "./zod-schema";

function PromotionEditorFiles() {
  const form = useFormContext<PromotionSchema>();
  const desktopImage = form.watch("files.promotionImageDesktop");
  const mobileImage = form.watch("files.promotionImageMobile");

  const desktopFileSelector = useFilesSelector({
    defaultFilesIds: desktopImage ? [desktopImage] : [],
    callback: (files) => form.setValue("files.promotionImageDesktop", files[0]),
  });
  const mobileFileSelector = useFilesSelector({
    defaultFilesIds: mobileImage ? [mobileImage] : [],
    callback: (files) => form.setValue("files.promotionImageMobile", files[0]),
  });

  return (
    <>
      <EditorCard title="Desktop Image">
        <FormField
          control={form.control}
          name="files.promotionImageDesktop"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <FilesSelectorInput
                  selectedFiles={desktopFileSelector.selectedFiles}
                  onSelect={desktopFileSelector.selectFiles}
                  onRemove={desktopFileSelector.removeFile}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </EditorCard>
      <EditorCard title="Mobile Image">
        <FormField
          control={form.control}
          name="files.promotionImageMobile"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <FilesSelectorInput
                  selectedFiles={mobileFileSelector.selectedFiles}
                  onSelect={mobileFileSelector.selectFiles}
                  onRemove={mobileFileSelector.removeFile}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </EditorCard>
    </>
  );
}

export default PromotionEditorFiles;
