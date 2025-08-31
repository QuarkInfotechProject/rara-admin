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
import HostsFields from "./hosts-fields";
import ItineraryFields from "./itinerary-fields";
import LocationFields from "./location-fields";
import OtherFields from "./other-fields";
import OverviewFields from "./overview-fields";
import PricingFields from "./pricing-fields";
import PublishControls from "./publish-controls";
import tabFieldsMap from "./tab-fields-map";
import {
  baseSchema,
  Circuit,
  circuitSchema,
  Experience,
  experienceSchema,
  Homestay,
  homestaySchema,
  Package,
  packageSchema,
} from "./zod-schema";
import toast from "react-hot-toast";
import DossierFields from "./dossier-fields";

interface Props {
  initialData?: Partial<FormSchema>;
  edit?: boolean;
}

export type FormSchema = Homestay | Package | Circuit | Experience;

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
  const [formSchema, setFormSchema] = useState<ZodSchema>(baseSchema);
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "homestay",
      cornerstone: 0,
      is_occupied: 0,
      display_homepage: 0,
      status: "published",
      ...initialData,
    },
  });
  const productType = form.watch("type");
  const router = useRouter();
  const errors = form.formState.errors;
  async function handleSubmit(data: FormSchema) {
    try {           

      // Always send circuits as FormData, others check for files
      const shouldSendAsFormData = productType === "circuit" || hasFiles(data);

      if (shouldSendAsFormData) {
        const formData = convertToFormData(data);
        await axios.post(
          edit
            ? `/api/product/${productType}/update`
            : `/api/product/${productType}/create`,
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

        // Send as regular JSON if no files and not a circuit
        await axios.post(
          edit
            ? `/api/product/${productType}/update`
            : `/api/product/${productType}/create`,
          data
        );
      }

      await queryClient.invalidateQueries({
        queryKey: ["products"],
      });
      toast.success("Product updated successfully");
      !edit && router.push(`/admin/product/${productType}`);
    } catch (error) {
      displayError(error, {});
    }
  }

  function convertToFormData(data: FormSchema): FormData {
    const formData = new FormData();

    const processValue = (key: string, value: any, parentKey?: string) => {
      const fieldName = parentKey ? `${parentKey}[${key}]` : key;

      if (value === null || value === undefined) {
        // For required fields, send empty string instead of skipping
        if (key === "manager_id" || key === "guide_id" || key === "driver_id") {
          formData.append(fieldName, "");
        }
        return;
      }

      if (value instanceof File) {

        formData.append(fieldName, value);
      } else if (Array.isArray(value)) {
        console.log(
          `Processing array field: ${fieldName}, length:`,
          value.length
        );

        // Special handling for dossiers array - treat as single object
        if (key === "dossiers" && value.length > 0) {
          const dossier = value[0]; // Take first (and only) dossier
          if (typeof dossier === "object" && dossier !== null) {
            Object.keys(dossier).forEach((subKey) => {
              // Send as dossiers[content] and dossiers[pdf_file]
              const dossierFieldName = `${fieldName}[${subKey}]`;
              if (dossier[subKey] instanceof File) {
                formData.append(dossierFieldName, dossier[subKey]);
              } else if (
                dossier[subKey] !== null &&
                dossier[subKey] !== undefined
              ) {
                formData.append(dossierFieldName, String(dossier[subKey]));
              }
            });
          }
        } else {
          // Regular array handling for other fields
          value.forEach((item, index) => {
            if (typeof item === "object" && item !== null) {
              Object.keys(item).forEach((subKey) => {
                processValue(subKey, item[subKey], `${fieldName}[${index}]`);
              });
            } else {              
              formData.append(`${fieldName}[${index}]`, String(item));
            }
          });
        }
      } else if (typeof value === "object") {
       
        Object.keys(value).forEach((subKey) => {
          processValue(subKey, value[subKey], fieldName);
        });
      } else {
        formData.append(fieldName, String(value));
      }
    };

    // Process all fields
    (Object.keys(data) as (keyof FormSchema)[]).forEach((key) => {
      processValue(key as string, data[key]);
    });

    // Ensure required fields are present even if they're missing from data
    const requiredFields = ["manager_id", "guide_id", "driver_id"];
    requiredFields.forEach((field) => {
      if (!formData.has(field)) {
        formData.append(field, "");
      }
    });

    return formData;
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
    switch (productType) {
      case "homestay":
        setFormSchema(homestaySchema);
        break;
      case "package":
        setFormSchema(packageSchema);
        break;
      case "circuit":
        setFormSchema(circuitSchema);
        break;
      case "experience":
        setFormSchema(experienceSchema);
        break;
    }
  }, [productType]);

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
    } else if (hasAnyProperty(errors, tabFieldsMap.hosts)) {
      setActiveTab("hosts");
      return;
    } else if (hasAnyProperty(errors, tabFieldsMap.highlights)) {
      setActiveTab("highlights");
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
            {(productType === "experience" || productType === "circuit") && (
              <TabsTrigger value="overview">Overview</TabsTrigger>
            )}
            <TabsTrigger value="faqs">FAQs</TabsTrigger>
            {productType === "homestay" && (
              <TabsTrigger value="hosts">Hosts</TabsTrigger>
            )}
            {(productType === "homestay" || productType === "package") && (
              <TabsTrigger value="highlights">Highlights</TabsTrigger>
            )}
            {productType !== "homestay" && (
              <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
            )}
            {productType !== "homestay" && (
              <TabsTrigger value="dossiers">Dossiers</TabsTrigger>
            )}
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
          <TabsContent value="hosts">
            <HostsFields />
          </TabsContent>
          <TabsContent value="highlights">
            <HighlightsFields />
          </TabsContent>
          <TabsContent value="itinerary">
            <ItineraryFields />
          </TabsContent>
          <TabsContent value="dossiers">
            <DossierFields />
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
