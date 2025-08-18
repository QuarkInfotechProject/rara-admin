import { useFormContext } from "react-hook-form";
import EditorCard from "@/components/editor-card";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import useFilesSelector from "@/lib/hooks/use-files-selector";
import FilesSelectorInput from "../../media/files-selector-input";
import { FormSchema } from "./product-editor";

function ProductEditorFiles() {
  const form = useFormContext<FormSchema>();
  const productType = form.watch("type");
  const files = form.watch("files");

  const locationCoverFiles = useFilesSelector({
    defaultFilesIds: files?.locationCover ? [files.locationCover] : [],
    callback: (files) => form.setValue("files.locationCover", files[0]),
  });
  const hostCoverFiles = useFilesSelector({
    defaultFilesIds: files?.hostCover ? [files.hostCover] : [],
    callback: (files) => form.setValue("files.hostCover", files[0]),
  });
  const howToGetFiles = useFilesSelector({
    defaultFilesIds: files?.howToGet ? [files.howToGet] : [],
    callback: (files) => form.setValue("files.howToGet", files[0]),
  });
  const featuredImageFiles = useFilesSelector({
    defaultFilesIds: files?.featuredImage ? [files.featuredImage] : [],
    callback: (files) => form.setValue("files.featuredImage", files[0]),
  });
  const featuredImagesFiles = useFilesSelector({
    defaultFilesIds: files?.featuredImages ? files.featuredImages : [],
    isMulti: true,
    callback: (files) => form.setValue("files.featuredImages", files),
  });
  const galleryImagesFiles = useFilesSelector({
    defaultFilesIds: files?.galleryImages ? files.galleryImages : [],
    isMulti: true,
    callback: (files) => form.setValue("files.galleryImages", files),
  });
  const faqImagesFiles = useFilesSelector({
    defaultFilesIds: files?.faqImages ? files.faqImages : [],
    isMulti: true,
    callback: (files) => form.setValue("files.faqImages", files),
  });
  return (
    <div className="editor-grid [--files-selector-img-width:240px]">
      <EditorCard title="Featured Image">
        <FormField
          control={form.control}
          name="files.featuredImage"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <FilesSelectorInput
                  onSelect={featuredImageFiles.selectFiles}
                  selectedFiles={featuredImageFiles.selectedFiles}
                  onRemove={featuredImageFiles.removeFile}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </EditorCard>
      <EditorCard title="Featured Images">
        <FormField
          control={form.control}
          name="files.featuredImages"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <FilesSelectorInput
                  onSelect={featuredImagesFiles.selectFiles}
                  selectedFiles={featuredImagesFiles.selectedFiles}
                  onRemove={featuredImagesFiles.removeFile}
                  isMulti
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </EditorCard>
      <EditorCard title="Gallery Images">
        <FormField
          control={form.control}
          name="files.galleryImages"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <FilesSelectorInput
                  onSelect={galleryImagesFiles.selectFiles}
                  selectedFiles={galleryImagesFiles.selectedFiles}
                  onRemove={galleryImagesFiles.removeFile}
                  isMulti
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </EditorCard>

      <EditorCard title="FAQ Images">
        <p className="text-sm text-muted-foreground">
          Select up to 4 images for FAQ section
        </p>
        <FormField
          control={form.control}
          name="files.faqImages"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <FilesSelectorInput
                  onSelect={faqImagesFiles.selectFiles}
                  selectedFiles={faqImagesFiles.selectedFiles}
                  onRemove={faqImagesFiles.removeFile}
                  isMulti
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </EditorCard>
      <EditorCard title="Location Cover">
        <FormField
          control={form.control}
          name="files.locationCover"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <FilesSelectorInput
                  onSelect={locationCoverFiles.selectFiles}
                  selectedFiles={locationCoverFiles.selectedFiles}
                  onRemove={locationCoverFiles.removeFile}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </EditorCard>
      {productType === "homestay" && (
        <EditorCard title="Host Cover">
          <FormField
            control={form.control}
            name="files.hostCover"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <FilesSelectorInput
                    onSelect={hostCoverFiles.selectFiles}
                    selectedFiles={hostCoverFiles.selectedFiles}
                    onRemove={hostCoverFiles.removeFile}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </EditorCard>
      )}
      <EditorCard title="How To Get">
        <FormField
          control={form.control}
          name="files.howToGet"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <FilesSelectorInput
                  onSelect={howToGetFiles.selectFiles}
                  selectedFiles={howToGetFiles.selectedFiles}
                  onRemove={howToGetFiles.removeFile}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </EditorCard>
    </div>
  );
}

export default ProductEditorFiles;
