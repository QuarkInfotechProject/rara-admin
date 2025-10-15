"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { PopupForm } from "../../components/form";
import PageTitle from "@/components/page-title";

interface PopupData {
  id: number;
  name: string;
  url: string;
  status: 0 | 1;
  popupImage: number[];
  publishedDate: string;
  updated_at: string;
}

interface ApiResponse {
  code: number;
  message: string;
  data: PopupData;
}

const Edit = () => {
  const params = useParams();
  const router = useRouter();
  const [popupData, setPopupData] = useState<PopupData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const popupUrl = params?.id as string;

  useEffect(() => {
    if (!popupUrl) {
      setError("Popup ID not found");
      setIsLoading(false);
      return;
    }

    const fetchPopupData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/popup/show/${popupUrl}`);

        if (!response.ok) {
          throw new Error("Failed to fetch popup details");
        }

        const result: ApiResponse = await response.json();

        if (result.code === 0) {
          setPopupData(result.data);
        } else {
          throw new Error(result.message || "Failed to fetch popup details");
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An error occurred";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPopupData();
  }, [popupUrl]);

  if (isLoading) {
    return (
      <div className="w-full flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Loading popup details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !popupData) {
    return (
      <div className="w-full flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-4">
          <p className="text-destructive">{error || "Popup not found"}</p>
          <button
            onClick={() => router.back()}
            className="text-sm text-primary hover:underline"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <PageTitle
        title="Edit Popup"
        prevPage=".././"
      />

      <PopupForm initialData={popupData} isEdit={true} />
    </div>
  );
};

export default Edit;
