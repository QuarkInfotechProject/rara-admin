"use client";
import axios from "axios";
import React, { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { queryClient } from "@/lib/context/react-query-context";
import displayError from "@/lib/utils/display-error";
import { Permission } from "@/types/groups.types";
import { ApiResponse } from "@/types/index.types";
import { useQuery } from "@tanstack/react-query";
import { Checkbox } from "@/components/ui/checkbox";
import { DialogOrDrawer, DialogOrDrawerContent, DialogOrDrawerTrigger } from "@/components/ui/dialog-or-drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DialogTitle } from "@/components/ui/dialog";
import { IconInfoCircle, IconLoader2 } from "@tabler/icons-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Props {
  id: number;
  children: React.ReactNode;
}

function UpdateGroupModal({ id, children }: Props) {
  const [selectedPermissions, setSelectedPermissions] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const permissions = useQuery({
    queryKey: ["admin-groups", id],
    queryFn: async () => {
      const { data } = await axios.get<ApiResponse<Permission[]>>("/api/permission");
      const groupPermissions = await axios.get<ApiResponse<number[]>>(`/api/group/module-mapping?groupId=${id}`);
      const groupPermissionsIds = new Set(groupPermissions.data.data);
      setSelectedPermissions(groupPermissionsIds);
      return data.data;
    },
    enabled: open,
  });

  const uniqueSections = useMemo(
    () => [...new Set(permissions.data?.map((permission) => permission.section))],
    [permissions.data]
  );

  async function handleSubmit() {
    try {
      setIsLoading(true);
      await axios.post("/api/group/assign-module-permission", {
        groupId: id,
        permissionId: Array.from(selectedPermissions),
      });
      await queryClient.invalidateQueries({
        queryKey: ["admin-groups", id],
      });
      toast.success("Group updated successfully!");
      setOpen(false);
    } catch (error) {
      displayError(error, {});
    } finally {
      setIsLoading(false);
    }
  }

  function handleSectionCheckboxToggle(section: string) {
    const areAllPermissionsSelectedInSection = permissions.data
      ?.filter((permission) => permission.section === section)
      .every((permission) => selectedPermissions.has(permission.id));

    if (areAllPermissionsSelectedInSection) {
      const updatedPermissions = [...selectedPermissions].filter(
        (id) => !permissions.data?.find((permission) => permission.section === section && permission.id === id)
      );
      setSelectedPermissions(new Set(updatedPermissions));
    } else {
      // If any permission in the section is not selected, select all
      const permissionsToAdd =
        permissions.data?.filter((permission) => permission.section === section).map((permission) => permission.id) ??
        [];
      setSelectedPermissions(new Set([...selectedPermissions, ...permissionsToAdd]));
    }
  }

  function handlePermissionSelect(permissionId: number) {
    const updatedPermissions = new Set(selectedPermissions);
    if (selectedPermissions.has(permissionId)) {
      updatedPermissions.delete(permissionId);
    } else {
      updatedPermissions.add(permissionId);
    }
    setSelectedPermissions(updatedPermissions);
  }

  return (
    <DialogOrDrawer open={open} onOpenChange={setOpen}>
      <DialogOrDrawerTrigger asChild>{children}</DialogOrDrawerTrigger>
      <DialogOrDrawerContent>
        <DialogTitle className="hidden md:block">Update Role</DialogTitle>
        <TooltipProvider>
          <div className="max-md:p-5">
            <ScrollArea className="h-[70vh]">
              {permissions.isPending && <IconLoader2 className="animate-spin mx-auto my-10" />}
              {uniqueSections.map((section) => (
                <div key={section}>
                  <div className="flex gap-2 items-center mt-2">
                    <Checkbox
                      checked={
                        !!permissions.data
                          ?.filter((permission) => permission.section === section)
                          .every((permission) => selectedPermissions.has(permission.id))
                      }
                      onCheckedChange={() => handleSectionCheckboxToggle(section)}
                    />
                    <h4 className="capitalize">{section}</h4>
                  </div>
                  {permissions.data
                    ?.filter((permission) => permission.section === section)
                    .map((permission) => {
                      return (
                        <PermissionCheckbox
                          key={permission.id}
                          permission={permission}
                          isChecked={selectedPermissions.has(permission.id)}
                          onCheckedChange={() => handlePermissionSelect(permission.id)}
                        />
                      );
                    })}
                </div>
              ))}
            </ScrollArea>
            <Button className="w-fit mt-5" loading={isLoading} disabled={isLoading} onClick={handleSubmit}>
              Update
            </Button>
          </div>
        </TooltipProvider>
      </DialogOrDrawerContent>
    </DialogOrDrawer>
  );
}

export default UpdateGroupModal;

function PermissionCheckbox({
  permission,
  isChecked,
  onCheckedChange,
}: {
  permission: Permission;
  isChecked: boolean;
  onCheckedChange: () => void;
}) {
  return (
    <div className="flex gap-2 items-center ml-5">
      <Checkbox
        defaultChecked={isChecked}
        checked={isChecked}
        name={permission.name}
        value={permission.id}
        onCheckedChange={onCheckedChange}
      />
      <h4 className="capitalize">{permission.name.replaceAll("_", " ")}</h4>
      <Tooltip>
        <TooltipTrigger>
          <IconInfoCircle size={16} />
        </TooltipTrigger>
        <TooltipContent className="capitalize">{permission.description}</TooltipContent>
      </Tooltip>
    </div>
  );
}
