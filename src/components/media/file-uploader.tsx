"use client";
import axios from "axios";
import { UploadCloud } from "lucide-react";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Input } from "@/components/ui/input";
import { queryClient } from "@/lib/context/react-query-context";
import { IconFile, IconLoader2, IconX } from "@tabler/icons-react";

interface Props {
  category: string;
}

function FileUploader({ category }: Props) {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [filesToUpload, setFilesToUpload] = useState<File[]>([]);

  async function uploadImage(file: File, category: string) {
    try {
      const formData = new FormData();
      formData.append("files[]", file);
      formData.append("fileCategoryId", category === "all" ? "" : category);
      await axios.post("/api/media", formData);
      setUploadedFiles((prevUploadedFiles) => {
        return [...prevUploadedFiles, file];
      });
    } catch (error) {
      console.log(error);
    }
    setFilesToUpload((prevUploadProgress) => {
      return prevUploadProgress.filter((prevFile) => prevFile.name !== file.name && prevFile.size !== file.size);
    });
  }

  const removeUploadedFile = (file: File) => {
    setUploadedFiles((prevUploadedFiles) => {
      return prevUploadedFiles.filter((prevFile) => prevFile.name !== file.name && prevFile.size !== file.size);
    });
  };

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setFilesToUpload((prevUploadProgress) => {
        return [
          ...prevUploadProgress,
          ...acceptedFiles.map((file) => {
            uploadImage(file, category);
            return file;
          }),
        ];
      });
      await queryClient.invalidateQueries({
        queryKey: ["file-selector"],
      });
    },
    [category]
  );

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div>
      <div>
        <label
          {...getRootProps()}
          className="relative flex flex-col items-center justify-center w-full py-6 border-2 border-border border-dashed rounded-lg cursor-pointer bg-background"
        >
          <div className=" text-center">
            <div className=" border p-2 rounded-md max-w-min mx-auto">
              <UploadCloud size={20} />
            </div>

            <p className="mt-2 text-sm text-gray-600">
              <span className="font-semibold text-foreground">Drag files</span>
            </p>
            <p className="text-xs text-muted-foreground">
              Click to upload files &#40;files should be under 10 MB &#41;
            </p>
          </div>
        </label>
        <Input
          {...getInputProps()}
          id="dropzone-file"
          accept=".jpg,.jpeg,.png,.gif,.svg,.pdf"
          type="file"
          className="hidden"
        />
      </div>
      <div className="max-h-[60vh] overflow-auto">
        {filesToUpload.length > 0 && (
          <div>
            <p className="font-medium my-2 mt-6 text-muted-foreground text-sm">Files to upload</p>
            <div className="space-y-2 pr-3">
              {filesToUpload.map((file) => {
                return (
                  <div
                    key={file.name}
                    className="flex justify-between gap-2 rounded-lg overflow-hidden border border-border group pr-2"
                  >
                    <div className="flex items-center flex-1 p-2">
                      <IconFile stroke={1.5} />
                      <div className="w-full ml-2 space-y-1">
                        <div className="text-sm flex justify-between">
                          <p className="text-muted-foreground">{file.name.slice(0, 25)}</p>
                          <IconLoader2 size={16} className="animate-spin -mr-2" />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {uploadedFiles.length > 0 && (
          <div>
            <p className="font-medium my-2 mt-6 text-muted-foreground text-sm">Uploaded Files</p>
            <div className="space-y-2 pr-3">
              {uploadedFiles.map((file) => {
                return (
                  <div
                    key={file.lastModified}
                    className="flex justify-between gap-2 rounded-lg overflow-hidden border border-hover pr-2 transition-all"
                  >
                    <div className="flex items-center flex-1 p-2">
                      <IconFile stroke={1.5} />
                      <div className="w-full ml-2 space-y-1">
                        <div className="text-sm flex justify-between">
                          <p className="text-muted-foreground ">{file.name.slice(0, 25)}</p>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => removeUploadedFile(file)}
                      className="bg-red-500 text-white transition-all items-center justify-center px-2 flex -mr-2"
                    >
                      <IconX size={20} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default FileUploader;
