"use client";
import { useState } from "react";
import FileUploader from "@/components/media/file-uploader";
import MediaCenterFiles from "@/components/media/media-center-files";
import MediaFilters from "@/components/media/media-filters";
import UploadOptions from "@/components/media/upload-options";
import PageLayout from "@/components/page-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MediaFilterContextProvider from "@/lib/context/media-filter-context";

function MediaCenter() {
  const [uploadCategory, setUploadCategory] = useState("all");
  const [tab, setTab] = useState("library");

  return (
    <MediaFilterContextProvider>
      <PageLayout title="Media Center" description="Manage your media files." hidePagination>
        <Tabs value={tab} onValueChange={setTab}>
          <div className="flex justify-between flex-wrap gap-4">
            <TabsList>
              <TabsTrigger value="upload">Upload</TabsTrigger>
              <TabsTrigger value="library">Library</TabsTrigger>
            </TabsList>
            {tab === "upload" && <UploadOptions category={uploadCategory} setCategory={setUploadCategory} />}
            {tab === "library" && <MediaFilters />}
          </div>
          <TabsContent value="upload">
            <FileUploader category={uploadCategory} />
          </TabsContent>
          <TabsContent value="library">
            <MediaCenterFiles />
          </TabsContent>
        </Tabs>
      </PageLayout>
    </MediaFilterContextProvider>
  );
}

export default MediaCenter;
