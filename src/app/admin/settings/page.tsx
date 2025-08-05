"use client";
import axios from "axios";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import PageLayout from "@/components/page-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { queryClient } from "@/lib/context/react-query-context";
import displayError from "@/lib/utils/display-error";
import { ApiResponse } from "@/types/index.types";
import { Setting } from "@/types/settings.types";
import { IconLoader2 } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";

const Settings = () => {
  const [selectedSection, setSelectedSection] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const { data, isPending } = useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      const { data } = await axios.get<ApiResponse<Setting[]>>("/api/settings");
      return data.data;
    },
  });

  const sections = useMemo(() => {
    const sectionsData = Array.from(new Set(data?.map((item) => item.section)));
    setSelectedSection(sectionsData[0]);
    return sectionsData;
  }, [data]);

  const settingsGroupedBySection = useMemo(() => {
    const groupedSettings = new Map<string, Setting[]>();
    data?.forEach((setting) => {
      const section = setting.section;
      if (!groupedSettings.has(section)) {
        groupedSettings.set(section, []);
      }
      groupedSettings.get(section)?.push(setting);
    });
    return Array.from(groupedSettings);
  }, [data]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    try {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const entries = Array.from(formData.entries());
      const idsAndValues = entries.map(([id, value]) => ({ id, value }));
      const postData = {
        section: selectedSection,
        configs: idsAndValues,
      };
      setIsLoading(true);
      await axios.post("/api/settings/update", postData);
      await queryClient.invalidateQueries({
        queryKey: ["settings"],
      });
      toast.success("Settings updated successfully");
    } catch (error) {
      displayError(error, {});
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <PageLayout title="Settings" description="Control how your app works." hidePagination>
      {isPending && <IconLoader2 className="animate-spin mx-auto my-10" />}
      <Tabs value={selectedSection} onValueChange={setSelectedSection} hidden={isPending}>
        <TabsList className="flex-wrap h-fit gap-y-2">
          {sections.map((section) => (
            <TabsTrigger key={section} value={section} className="capitalize">
              {section.replaceAll("_", " ")}
            </TabsTrigger>
          ))}
        </TabsList>
        {settingsGroupedBySection.map(([section, settings]) => (
          <TabsContent key={section} value={section}>
            <form className="grid gap-4 md:gap-8 py-4" onSubmit={handleSubmit}>
              {settings.map((setting) => (
                <Label key={setting.uuid}>
                  {setting.title}
                  <Input className="mt-2" name={setting.uuid} defaultValue={setting.value} />
                </Label>
              ))}
              <Button className="w-fit" disabled={isLoading} loading={isLoading}>
                Update
              </Button>
            </form>
          </TabsContent>
        ))}
      </Tabs>
    </PageLayout>
  );
};

export default Settings;
