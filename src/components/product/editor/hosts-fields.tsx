import { PlusCircle } from "lucide-react";
import { useFormContext } from "react-hook-form";
import EditorCard from "@/components/editor-card";
import FilesSelectorInput from "@/components/media/files-selector-input";
import { Button } from "@/components/ui/button";
import { FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import useFilesSelector from "@/lib/hooks/use-files-selector";
import { IconX } from "@tabler/icons-react";
import { FormSchema } from "./product-editor";

const defaultHost: {
  fullname: string;
  description: string;
  hostFiles?: { profileImage: number };
} = {
  fullname: "",
  description: "",
};

function HostsFields() {
  const form = useFormContext<FormSchema>();
  const hosts = form.watch("hosts") ?? [];

  function addHosts() {
    form.setValue("hosts", [...hosts, defaultHost]);
  }

  function removeHost(index: number) {
    const filteredHosts = hosts.filter((_, i) => i !== index);
    form.setValue("hosts", filteredHosts);
  }

  function changeInput(
    index: number,
    data: { fullname?: string; description?: string; hostFiles?: { profileImage: number } }
  ) {
    let host = hosts[index];
    if (host) {
      host = {
        ...host,
        ...data,
      };
      hosts[index] = host;
      form.setValue("hosts", hosts);
    }
  }

  return (
    <div className="editor-grid">
      <Button type="button" size="sm" className="gap-1 ml-auto w-fit" onClick={addHosts}>
        <PlusCircle size={16} />
        <span className="sr-only sm:not-sr-only">Add</span>
      </Button>
      <EditorCard title="Hosts">
        <FormField
          control={form.control}
          name="hosts"
          render={({ field }) => (
            <FormItem>
              {hosts.map((host, index) => (
                <Host key={index} index={index} {...host} changeInput={changeInput} removeHost={removeHost} />
              ))}
              <FormMessage />
            </FormItem>
          )}
        />
      </EditorCard>
    </div>
  );
}

export default HostsFields;

interface HostProps {
  index: number;
  fullname: string;
  description: string;
  hostFiles?: { profileImage: number } | null;
  changeInput: Function;
  removeHost: Function;
}

function Host(props: HostProps) {
  const { selectedFiles, selectFiles, removeFile } = useFilesSelector({
    defaultFilesIds: props?.hostFiles?.profileImage ? [props.hostFiles.profileImage] : [],
    callback: (files) => props.changeInput(props.index, { hostFiles: { profileImage: files[0] } }),
  });

  return (
    <div className="relative border border-dashed rounded-lg p-3 grid gap-4" key={props.index}>
      <Label>Fullname</Label>
      <Input
        value={props.fullname}
        onChange={(e) =>
          props.changeInput(props.index, {
            fullname: e.target.value,
          })
        }
        placeholder="Fullname"
      />
      <Label>Description</Label>
      <Textarea
        value={props.description}
        onChange={(e) =>
          props.changeInput(props.index, {
            description: e.target.value,
          })
        }
        placeholder="Write your description here"
      />
      <Label>
        Image <span className="font-normal">(Recommended Size: 800x700)</span>
      </Label>
      <FilesSelectorInput
        imageClassName="size-20 md:size-40"
        onSelect={selectFiles}
        selectedFiles={selectedFiles}
        onRemove={removeFile}
      />
      <div className="absolute top-2 right-2 text-black dark:text-white *:bg-white dark:*:bg-stone-900 *:border *:rounded-full *:p-1 *:cursor-pointer flex gap-2">
        <IconX onClick={() => props.removeHost(props.index)} />
      </div>
    </div>
  );
}
