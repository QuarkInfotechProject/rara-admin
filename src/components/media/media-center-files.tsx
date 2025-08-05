import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useMediaFiles } from "@/lib/hooks/use-media-files";
import { File } from "@/types/media.types";
import { IconLink } from "@tabler/icons-react";
import FileCategories from "./file-categories";
import FilePopup from "./file-popup";

function MediaCenterFiles() {
  const searchParams = useSearchParams();
  const fileId = searchParams.get("file");
  const router = useRouter();
  const { files, isFetching, loadMoreTriggerRef } = useMediaFiles();

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[300px_1fr] gap-4">
      <div className="hidden xl:block">
        <FileCategories />
      </div>
      <ScrollArea className="h-[70vh] border rounded-lg p-4">
        <div className="grid grid-cols-2 min-[440px]:grid-cols-3 md:grid-cols-4 min-[960px]:grid-cols-5 gap-4">
          {files && files.map((file) => <FileCard key={file.id} file={file} />)}
          {isFetching && <LoadingSkeletions />}
          {!isFetching && !files?.length && <p className="text-center col-span-5">No files found.</p>}
          <div className="block w-1 h-0.5" ref={loadMoreTriggerRef}></div>
        </div>
      </ScrollArea>
      {fileId && (
        <FilePopup
          fileId={Number(fileId)}
          open
          onOpenChange={(open) => {
            !open && router.back();
          }}
        />
      )}
    </div>
  );
}

export default MediaCenterFiles;

function LoadingSkeletions() {
  return (
    <>
      {Array.from(new Array(10)).map((_, index) => (
        <Skeleton key={index} className="rounded-lg w-full h-auto object-cover aspect-square" />
      ))}
    </>
  );
}

function FileCard({ file }: { file: File }) {
  return (
    <div className="relative">
      <Link
        key={file.id}
        href={{
          pathname: "/admin/media",
          query: {
            file: file.id,
          },
        }}
      >
        <Image
          width={200}
          height={200}
          className="w-full h-auto object-contain select-none aspect-square bg-gradient-to-r from-slate-50 to-zinc-100 rounded-lg"
          draggable={false}
          src={file.thumbnailUrl.endsWith(".pdf") ? "/images/placeholders/pdf.png" : file.thumbnailUrl}
          alt={file.filename}
        />
      </Link>
      <Link
        className="border border-gray-300 rounded-full p-1 absolute top-1 right-1 z-10 text-black bg-white flex items-center justify-center"
        target="_blank"
        title={file.filename}
        href={file.imageUrl}
      >
        <IconLink stroke={1.5} size={20} />
      </Link>
    </div>
  );
}
