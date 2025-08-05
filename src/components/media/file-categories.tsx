import axios from "axios";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DialogOrDrawer,
  DialogOrDrawerContent,
  DialogOrDrawerHeader,
  DialogOrDrawerTitle,
  DialogOrDrawerTrigger,
} from "@/components/ui/dialog-or-drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMediaFilter } from "@/lib/context/media-filter-context";
import { MediaCategory } from "@/types/media.types";
import { IconFolder, IconLoader2 } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import FileCategoryContextMenu from "./file-category-context-menu";
import FileCategoryEditor from "./file-category-editor";

function FileCategories() {
  const [showCategoryEditor, setShowCategoryEditor] = useState(false);
  const { category: activeCategory, setCategory } = useMediaFilter();
  const { data: categories, isPending } = useQuery<MediaCategory[]>({
    queryKey: ["media-categories"],
    queryFn: async () => {
      const { data } = await axios.get("/api/file-categories");
      return data?.data;
    },
  });

  return (
    <ScrollArea className="h-[70vh] border p-2 rounded-lg">
      <DialogOrDrawer open={showCategoryEditor} onOpenChange={setShowCategoryEditor}>
        <DialogOrDrawerTrigger asChild>
          <Button size="sm" variant="secondary" className="w-full mb-2">
            Add Category
          </Button>
        </DialogOrDrawerTrigger>
        <DialogOrDrawerContent>
          <DialogOrDrawerHeader>
            <DialogOrDrawerTitle>New Category</DialogOrDrawerTitle>
          </DialogOrDrawerHeader>
          <div className="p-4 md:p-0">
            <FileCategoryEditor onSuccess={() => setShowCategoryEditor(false)} />
          </div>
        </DialogOrDrawerContent>
      </DialogOrDrawer>
      {isPending ? (
        <div className="flex items-center justify-center h-full">
          <IconLoader2 className="animate-spin" />
        </div>
      ) : (
        categories?.map((category) => (
          <FileCategoryContextMenu category={category} key={category.id}>
            <Button
              type="button"
              key={category.id}
              className="w-full justify-start"
              variant={category.id === Number(activeCategory) ? "secondary" : "ghost"}
              onClick={() => setCategory(String(category.id))}
            >
              <div className="grid grid-cols-[20px_1fr] gap-2 items-center">
                <IconFolder size={20} />
                <span className="truncate">{category.name}</span>
              </div>
            </Button>
          </FileCategoryContextMenu>
        ))
      )}
    </ScrollArea>
  );
}

export default FileCategories;
