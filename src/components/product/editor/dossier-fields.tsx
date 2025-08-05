import { useFormContext } from "react-hook-form";
import EditorCard from "@/components/editor-card";
import { Label } from "@/components/ui/label";
import { FormSchema } from "./product-editor";
import { Upload } from "lucide-react";
import dynamic from "next/dynamic";
import { useRef, useEffect } from "react";

const CkEditor = dynamic(() => import("@/components/ck-editor"), {
  ssr: false,
});

// Dossier type supports File, string, number or null for pdf_file
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
  let dossiers = form.watch("dossiers");

  // Handle both single object and array formats
  useEffect(() => {
    const currentDossiers = form.getValues("dossiers");

    // If dossiers is a single object (from backend), convert to array format
    if (currentDossiers && !Array.isArray(currentDossiers)) {
      const singleDossier = currentDossiers as any;
      const convertedDossier = {
        content: singleDossier.content || "",
        pdf_file: singleDossier.pdf_file || null,
      };
      form.setValue("dossiers", [convertedDossier], { shouldValidate: false });
      return;
    }

    // Only set default if dossiers is undefined, null, or empty array
    if (
      !currentDossiers ||
      (Array.isArray(currentDossiers) && currentDossiers.length === 0)
    ) {
      form.setValue("dossiers", [defaultDossier], { shouldValidate: false });
    }
  }, []); // Empty dependency array - only run once on mount

  // Ensure we have a valid array for rendering
  const displayDossiers = (() => {
    // Handle single object format from backend
    if (dossiers && !Array.isArray(dossiers)) {
      const singleDossier = dossiers as any;
      return [
        {
          content: singleDossier.content || "",
          pdf_file: singleDossier.pdf_file || null,
        },
      ];
    }

    // Handle array format
    return Array.isArray(dossiers) && dossiers.length > 0
      ? dossiers
      : [defaultDossier];
  })();

  function changeInput(
    index: number,
    data: { content?: string; pdf_file?: File | string | number | null }
  ) {
    const currentDossiers = form.getValues("dossiers");
    let workingDossiers;

    // Handle single object format from backend
    if (currentDossiers && !Array.isArray(currentDossiers)) {
      const singleDossier = currentDossiers as any;
      workingDossiers = [
        {
          content: singleDossier.content || "",
          pdf_file: singleDossier.pdf_file || null,
        },
      ];
    } else {
      workingDossiers =
        Array.isArray(currentDossiers) && currentDossiers.length > 0
          ? currentDossiers
          : [defaultDossier];
    }

    const updatedDossiers = [...workingDossiers];

    // Make sure index exists
    if (index >= updatedDossiers.length) {
      while (updatedDossiers.length <= index) {
        updatedDossiers.push(defaultDossier);
      }
    }

    updatedDossiers[index] = {
      ...updatedDossiers[index],
      ...data,
    };

    form.setValue("dossiers", updatedDossiers, {
      shouldValidate: false,
      shouldDirty: true,
      shouldTouch: true,
    });

    setTimeout(() => {
      form.trigger(`dossiers.${index}.pdf_file`);
    }, 0);
  }

  return (
    <div className="editor-grid">
      <EditorCard title="Dossier">
        <div className="space-y-4">
          {displayDossiers.map((dossier, index) => (
            <DossierItem
              key={index}
              index={index}
              content={dossier.content || ""}
              pdf_file={dossier.pdf_file ?? null}
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

  // Helper to display file name
  const getFileDisplayName = () => {
    if (props.pdf_file instanceof File) {
      return props.pdf_file.name;
    } else if (typeof props.pdf_file === "string") {
      return props.pdf_file.split("/").pop() || props.pdf_file;
    } else if (typeof props.pdf_file === "number") {
      return `File ID: ${props.pdf_file}`;
    }
    return "";
  };

  // Helper to display file size (in KB)
  const getFileSizeDisplay = () => {
    if (props.pdf_file instanceof File) {
      return `${Math.round(props.pdf_file.size / 1024)} KB`;
    }
    return "";
  };

  return (
    <div className="relative border border-dashed rounded-lg p-4 grid gap-4">
      <div>
        <Label className="text-sm font-medium mb-2 block">
          Dossier PDF File
        </Label>

        {/* Custom Upload Button */}
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
            <span className="text-white text-sm font-medium">Upload PDF</span>
          </label>
        </div>

        {/* File Preview */}
        {props.pdf_file && (
          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-800 font-medium">
                  ✓ Selected: {getFileDisplayName()}
                </p>
                {getFileSizeDisplay() && (
                  <p className="text-xs text-green-600 mt-1">
                    Size: {getFileSizeDisplay()}
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
      </div>

      <div>
        <Label className="text-sm font-medium mb-2 block">Description</Label>
        <CkEditor
          id={`dossier-${props.index}`}
          initialData={props.content}
          onChange={(content) => props.changeInput({ content })}
        />
      </div>
    </div>
  );
}
