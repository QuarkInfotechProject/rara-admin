import axios from "axios";
import Image from "next/image";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DialogOrDrawer,
  DialogOrDrawerContent,
  DialogOrDrawerDescription,
  DialogOrDrawerHeader,
  DialogOrDrawerTitle,
} from "@/components/ui/dialog-or-drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import displayError from "@/lib/utils/display-error";
import { FileShowResponse } from "@/types/media.types";
import { IconLoader2 } from "@tabler/icons-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import FileEditForm from "./file-edit-form";

interface Props {
  open: boolean;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
  fileId: number;
}

function FilePopup({ fileId, open, onOpenChange }: Props) {
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const queryClient = useQueryClient();
  const { data, isPending } = useQuery<FileShowResponse>({
    queryKey: ["media-file", fileId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/files/show/${fileId}`);
      return {
        ...data.data,
        id: fileId,
      };
    },
    throwOnError: false,
  });

  async function deleteFile() {
    try {
      setIsDeleting(true);
      await axios.post("/api/files/destroy", {
        id: fileId,
      });
      await queryClient.invalidateQueries({
        queryKey: ["file-selector"],
      });
      onOpenChange(false);
    } catch (error) {
      setIsDeleting(false);
      displayError(error, { fallback: "Failed to delete file" });
    }
  }

  return (
    <DialogOrDrawer open={open} onOpenChange={onOpenChange}>
      <DialogOrDrawerContent className="max-w-5xl overflow-hidden">
        <DialogOrDrawerHeader>
          <DialogOrDrawerTitle>Media Details</DialogOrDrawerTitle>
          <DialogOrDrawerDescription>Edit or delete this file.</DialogOrDrawerDescription>
        </DialogOrDrawerHeader>
        <ScrollArea className="h-[70vh] max-h-[70vh] md:max-h-[80vh] md:h-full">
          {!isPending && !data && (
            <div className="flex justify-center items-center">
              <p>File not found</p>
            </div>
          )}
          {isPending && !data && (
            <div className="flex justify-center items-center">
              <IconLoader2 className="animate-spin" />
            </div>
          )}
          {data && (
            <div className="grid md:grid-cols-2 gap-4">
              <div className="relative p-4 flex flex-col gap-4">
                {loading && <Skeleton className="w-full h-auto aspect-square rounded-lg object-contain" />}
                <Image
                  className="w-full h-auto rounded-lg object-contain"
                  style={{
                    display: loading ? "none" : "block",
                  }}
                  width={1000}
                  height={1000}
                  src={data.url}
                  alt={data.alternativeText}
                  onLoad={() => setLoading(false)}
                  onError={() => setLoading(false)}
                />
                <Button type="button" variant="outline" onClick={deleteFile} loading={isDeleting} disabled={isDeleting}>
                  Delete
                </Button>
              </div>
              <div className="md:border-l p-4">
                <FileEditForm file={data} />
              </div>
            </div>
          )}
        </ScrollArea>
      </DialogOrDrawerContent>
    </DialogOrDrawer>
  );
}

export default FilePopup;
