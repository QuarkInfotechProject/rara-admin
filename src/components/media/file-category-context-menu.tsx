import axios from "axios";
import { Fragment, useState } from "react";
import toast from "react-hot-toast";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu";
import {
  DialogOrDrawer,
  DialogOrDrawerContent,
  DialogOrDrawerHeader,
  DialogOrDrawerTitle,
} from "@/components/ui/dialog-or-drawer";
import { queryClient } from "@/lib/context/react-query-context";
import displayError from "@/lib/utils/display-error";
import { MediaCategory } from "@/types/media.types";
import FileCategoryEditor from "./file-category-editor";

interface Props {
  children: React.ReactNode;
  category: MediaCategory;
}

function FileCategoryContextMenu({ children, category }: Props) {
  const [showCategoryEditor, setShowCategoryEditor] = useState(false);

  function handleEdit() {
    setShowCategoryEditor(!showCategoryEditor);
  }

  async function handleDelete() {
    const toastId = toast.loading("Deleting category...");
    try {
      await axios.post(`/api/file-categories/destroy`, {
        url: category.url,
      });
      await queryClient.invalidateQueries({
        queryKey: ["media-categories"],
      });
      toast.success("Category deleted successfully", { id: toastId });
    } catch (error) {
      displayError(error, { toastId });
    }
  }

  return (
    <Fragment>
      <ContextMenu>
        <ContextMenuTrigger>{children}</ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onClick={handleEdit}>Edit</ContextMenuItem>
          <ContextMenuItem onClick={handleDelete}>Delete</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
      <DialogOrDrawer open={showCategoryEditor} onOpenChange={setShowCategoryEditor}>
        <DialogOrDrawerContent>
          <DialogOrDrawerHeader>
            <DialogOrDrawerTitle>Edit Category</DialogOrDrawerTitle>
          </DialogOrDrawerHeader>
          <FileCategoryEditor initialData={category} edit onSuccess={() => setShowCategoryEditor(false)} />
        </DialogOrDrawerContent>
      </DialogOrDrawer>
    </Fragment>
  );
}

export default FileCategoryContextMenu;
