import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { ServerError } from "@/types/index.types";

function displayError(error: any, { toastId, fallback }: { toastId?: string; fallback?: string }) {
  const axiosError = error as AxiosError<ServerError>;
  toast.error(axiosError?.response?.data.error ?? fallback ?? "Something went wrong", {
    id: toastId,
  });
}

export default displayError;
