import { useFormContext } from "react-hook-form";
import EditorCard from "@/components/editor-card";
import { Label } from "@/components/ui/label";
import { FormSchema } from "./product-editor";
import { Upload, ExternalLink } from "lucide-react";
import { useRef, useEffect } from "react";

type DossierType = {
  content: string;
  pdf_file: File | string | number | null;
};

const defaultDossier: DossierType = {
  content: "",
  pdf_file: null,
};

function DossierFields() {
  const form = useFormContext<FormSchema>();

  // Initialize with default dossier if none exists
  useEffect(() => {
    const currentDossiers = form.getValues("dossiers");

    if (
      !currentDossiers ||
      (Array.isArray(currentDossiers) && currentDossiers.length === 0)
    ) {
      form.setValue("dossiers", [defaultDossier], { shouldValidate: false });
    }
  }, [form]);

  const dossiers = form.watch("dossiers") || [];

  // Ensure we always have at least one dossier to display
  const displayDossiers =
    Array.isArray(dossiers) && dossiers.length > 0
      ? dossiers
      : [defaultDossier];

  function changeInput(
    index: number,
    data: { content?: string; pdf_file?: File | string | number | null }
  ) {
    const currentDossiers = form.getValues("dossiers") || [];
    const workingDossiers = [...currentDossiers];

    // Ensure the index exists
    while (workingDossiers.length <= index) {
      workingDossiers.push({ ...defaultDossier });
    }

    // Update the specific dossier
    workingDossiers[index] = {
      ...workingDossiers[index],
      ...data,
    };

    form.setValue("dossiers", workingDossiers, {
      shouldValidate: false,
      shouldDirty: true,
      shouldTouch: true,
    });
  }

  return (
    <div className="editor-grid">
      <EditorCard title="Dossier">
        <div className="space-y-4">
          {displayDossiers.map((dossier, index) => (
            <DossierItem
              key={`dossier-${index}`}
              index={index}
              content={dossier?.content || ""}
              pdf_file={dossier?.pdf_file ?? null}
              changeInput={(data) => changeInput(index, data)}
            />
          ))}
        </div>
      </EditorCard>
    </div>
  );
}

export default DossierFields;

interface DossierItemProps {
  index: number;
  content: string;
  pdf_file: File | string | number | null;
  changeInput: (data: {
    content?: string;
    pdf_file?: File | string | number | null;
  }) => void;
}

function DossierItem(props: DossierItemProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    if (file && file.type === "application/pdf") {
      props.changeInput({ pdf_file: file });
    } else if (file) {
      alert("Please select a PDF file only");
      e.target.value = "";
      props.changeInput({ pdf_file: null });
    } else {
      props.changeInput({ pdf_file: null });
    }
  };

  const handleRemoveFile = () => {
    props.changeInput({ pdf_file: null });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Check what type of file we have
  const getFileInfo = () => {
    if (props.pdf_file instanceof File) {
      return {
        type: "new_file",
        name: props.pdf_file.name,
        size: `${Math.round(props.pdf_file.size / 1024)} KB`,
        url: null,
      };
    } else if (
      typeof props.pdf_file === "string" &&
      props.pdf_file.startsWith("http")
    ) {
      return {
        type: "existing_url",
        name: props.pdf_file.split("/").pop() || "Existing PDF File",
        size: null,
        url: props.pdf_file,
      };
    } else if (typeof props.pdf_file === "string") {
      return {
        type: "existing_file",
        name: props.pdf_file,
        size: null,
        url: null,
      };
    } else if (typeof props.pdf_file === "number") {
      return {
        type: "file_id",
        name: `File ID: ${props.pdf_file}`,
        size: null,
        url: null,
      };
    }

    return null;
  };

  const fileInfo = getFileInfo();
  const hasFile = fileInfo !== null;

  return (
    <div className="relative border border-dashed rounded-lg p-4 grid gap-4">
      <div>
        <Label className="text-sm font-medium mb-2 block">
          Dossier PDF File
        </Label>

        {/* Upload Area */}
        <div className="relative">
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="hidden"
            id={`file-upload-${props.index}`}
          />
          <label
            htmlFor={`file-upload-${props.index}`}
            className="block bg-gray-900 border-2 border-dashed border-gray-600 rounded-lg p-8 flex flex-col items-center justify-center hover:bg-gray-800 hover:border-gray-500 transition-colors cursor-pointer"
          >
            <Upload className="w-6 h-6 text-white mb-2" />
            <span className="text-white text-sm font-medium">
              {hasFile ? "Replace PDF" : "Upload PDF"}
            </span>
            <span className="text-gray-400 text-xs mt-1">
              Click to browse or drag and drop
            </span>
          </label>
        </div>

        {/* File Status Display */}
        {hasFile && fileInfo && (
          <div className="mt-3">
            {/* New File Upload */}
            {fileInfo.type === "new_file" && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-800 font-medium">
                      📄 New File: {fileInfo.name}
                    </p>
                    {fileInfo.size && (
                      <p className="text-xs text-blue-600 mt-1">
                        Size: {fileInfo.size}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="text-red-500 hover:text-red-700 text-sm font-medium"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}

            {/* Existing URL File */}
            {fileInfo.type === "existing_url" && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-green-800 font-medium">
                      ✅ Current File: {fileInfo.name}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <a
                        href={fileInfo.url!}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:text-blue-800 underline inline-flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        View Current PDF
                      </a>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="text-red-500 hover:text-red-700 text-sm font-medium ml-2"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}

            {/* Other file types */}
            {(fileInfo.type === "existing_file" ||
              fileInfo.type === "file_id") && (
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-800 font-medium">
                      📎 {fileInfo.name}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="text-red-500 hover:text-red-700 text-sm font-medium"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Content Editor - Uncomment if needed
      <div>
        <Label className="text-sm font-medium mb-2 block">Description</Label>
        <CkEditor
          id={`dossier-${props.index}`}
          initialData={props.content}
          onChange={(content) => props.changeInput({ content })}
        />
      </div> */}
    </div>
  );
}
