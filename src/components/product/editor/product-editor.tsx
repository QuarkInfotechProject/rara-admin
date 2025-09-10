"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ZodSchema } from "zod";
import { Form } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { queryClient } from "@/lib/context/react-query-context";
import displayError from "@/lib/utils/display-error";
import { zodResolver } from "@hookform/resolvers/zod";
import BasicFields from "./basic-fields";
import DescriptionFields from "./description-fields";
import FAQSFields from "./faqs-fields";
import Files from "./files";
import GeneralFields from "./general-fields";
import HighlightsFields from "./highlights-fields";
import ItineraryFields from "./itinerary-fields";
import LocationFields from "./location-fields";
import OtherFields from "./other-fields";
import OverviewFields from "./overview-fields";
import PricingFields from "./pricing-fields";
import PublishControls from "./publish-controls";
import tabFieldsMap from "./tab-fields-map";
import { productSchema, Product } from "./zod-schema";
import toast from "react-hot-toast";
import DossierFields from "./dossier-fields";
import DepartureDatesField from "./departure-date";

interface Props {
  initialData?: Partial<FormSchema>;
  edit?: boolean;
}

export type FormSchema = Product;

// Helper function to convert form data to FormData
function convertToFormData(data: FormSchema): FormData {
  const formData = new FormData();

  const processValue = (key: string, value: any, parentKey?: string) => {
    const fieldName = parentKey ? `${parentKey}[${key}]` : key;

    if (value === null || value === undefined) return;

    if (value instanceof File) {
      formData.append(fieldName, value);
    } else if (Array.isArray(value)) {
      // You can skip this entirely if dossiers is no longer an array
      // Or handle array of primitives
    } else if (typeof value === "object") {
      Object.keys(value).forEach((subKey) => {
        processValue(subKey, value[subKey], fieldName);
      });
    } else {
      formData.append(fieldName, String(value));
    }
  };

  (Object.keys(data) as (keyof FormSchema)[]).forEach((key) => {
    processValue(key as string, data[key]);
  });

  return formData;
}

function ProductEditor({ initialData, edit }: Props) {
  const [activeTab, setActiveTab] = useState("general");
  const [formSchema, setFormSchema] = useState<ZodSchema>(productSchema);
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "product",
      cornerstone: 0,
      is_occupied: 0,
      display_homepage: 0,
      status: "published",
      ...initialData,
    },
  });
  const router = useRouter();
  const errors = form.formState.errors;

  async function handleSubmit(data: FormSchema) {
    try {
      // Check if we have files to determine submission type
      const shouldSendAsFormData = hasFiles(data);

      if (shouldSendAsFormData) {
        const formData = convertToFormData(data);
        await axios.post(
          edit ? `/api/product/update` : `/api/product/create`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        // Check for non-serializable values before sending
        try {
          const jsonString = JSON.stringify(data);
        } catch (jsonError) {
          // Try to identify the problematic fields
          Object.keys(data).forEach((key) => {
            try {
              JSON.stringify((data as any)[key]);
            } catch (fieldError) {
              console.error(
                `Field "${key}" cannot be serialized:`,
                (data as any)[key]
              );
            }
          });
        }

        await axios.post(
          edit ? `/api/product/update` : `/api/product/create`,
          data
        );
      }

      await queryClient.invalidateQueries({
        queryKey: ["products"],
      });
      toast.success("Product updated successfully");
      !edit && router.push(`/admin/product`);
    } catch (error) {
      displayError(error, {});
    }
  }

  function hasFiles(data: FormSchema): boolean {
    // Check if there's a dossiers field with a file
    if ("dossiers" in data && data.dossiers) {
      const dossiers = (data as any).dossiers;

      // Handle single object format (from backend)
      if (!Array.isArray(dossiers)) {
        const hasFile = dossiers.pdf_file && dossiers.pdf_file instanceof File;
        return hasFile;
      }
    }

    return false;
  }

  useEffect(() => {
    if (hasAnyProperty(errors, tabFieldsMap.general)) {
      setActiveTab("general");
      return;
    } else if (hasAnyProperty(errors, tabFieldsMap.description)) {
      setActiveTab("description");
      return;
    } else if (hasAnyProperty(errors, tabFieldsMap.location)) {
      setActiveTab("location");
      return;
    } else if (hasAnyProperty(errors, tabFieldsMap.overview)) {
      setActiveTab("overview");
      return;
    } else if (hasAnyProperty(errors, tabFieldsMap.itinerary)) {
      setActiveTab("itinerary");
      return;
    } else if (hasAnyProperty(errors, tabFieldsMap.dossiers)) {
      setActiveTab("dossiers");
      return;
    } else if (hasAnyProperty(errors, tabFieldsMap.faqs)) {
      setActiveTab("faqs");
      return;
    } else if (hasAnyProperty(errors, tabFieldsMap.departure)) {
      setActiveTab("departure");
      return;
    } else if (hasAnyProperty(errors, tabFieldsMap.files)) {
      setActiveTab("files");
      return;
    } else if (hasAnyProperty(errors, tabFieldsMap.other)) {
      setActiveTab("other");
      return;
    }
  }, [errors]);

  return (
    <Form {...form}>
      <form
        className="grid lg:grid-cols-[1fr_300px] gap-4 lg:gap-8"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <Tabs
          defaultValue="general"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="flex-wrap h-fit mb-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
            <TabsTrigger value="location">Location</TabsTrigger>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="faqs">FAQs</TabsTrigger>
            <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
            <TabsTrigger value="dossiers">Dossiers</TabsTrigger>
            <TabsTrigger value="departure">Departure</TabsTrigger>
            <TabsTrigger value="files">Files</TabsTrigger>
            <TabsTrigger value="other">Other</TabsTrigger>
          </TabsList>
          <TabsContent value="general">
            <GeneralFields />
          </TabsContent>
          <TabsContent value="description">
            <DescriptionFields />
          </TabsContent>
          <TabsContent value="pricing">
            <PricingFields />
          </TabsContent>
          <TabsContent value="location">
            <LocationFields />
          </TabsContent>
          <TabsContent value="overview">
            <OverviewFields />
          </TabsContent>
          <TabsContent value="faqs">
            <FAQSFields />
          </TabsContent>
          <TabsContent value="itinerary">
            <ItineraryFields />
          </TabsContent>
          <TabsContent value="dossiers">
            <DossierFields />
          </TabsContent>
          <TabsContent value="departure">
            <DepartureDatesField />
          </TabsContent>
          <TabsContent value="files">
            <Files />
          </TabsContent>
          <TabsContent value="other">
            <OtherFields />
          </TabsContent>
        </Tabs>
        <div className="md:sticky top-4 flex flex-col gap-4 lg:gap-8">
          <PublishControls edit={edit} />
          <BasicFields />
        </div>
      </form>
    </Form>
  );
}

export default ProductEditor;

function hasAnyProperty(obj: any, properties: string[]) {
  return properties.some((property) => property in obj);
}
