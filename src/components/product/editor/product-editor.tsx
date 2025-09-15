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
  initialData?: any;
  edit?: boolean;
}

export type FormSchema = Product;

// Helper function to convert form data to FormData
function convertToFormData(data: FormSchema): FormData {
  const formData = new FormData();

  // EXPLICITLY add related_circuit at the beginning
  console.log("🔍 Checking related_circuit in data:", data.related_circuit);

  // Always ensure related_circuit is present
  if (
    !data.related_circuit ||
    !Array.isArray(data.related_circuit) ||
    data.related_circuit.length === 0
  ) {
    console.log(
      "⚠️ related_circuit is missing or empty, adding static value [1]"
    );
    data.related_circuit = [1];
  }

  // Explicitly add related_circuit to FormData first
  data.related_circuit.forEach((id, index) => {
    formData.append(`related_circuit[${index}]`, String(id));
    console.log(`✅ Added related_circuit[${index}]: ${id}`);
  });

  // Special handling for dossiers
  if (data.dossiers && Array.isArray(data.dossiers)) {
    data.dossiers.forEach((dossier, index) => {
      if (dossier.pdf_file instanceof File) {
        formData.append("dossiers[pdf_file]", dossier.pdf_file);
      }
      formData.append(
        "dossiers[content]",
        "Static dossier content - placeholder"
      );
      formData.append("cornerstone", "1");
    });
  }

  const processValue = (key: string, value: any, parentKey?: string) => {
    const fieldName = parentKey ? `${parentKey}[${key}]` : key;

    if (value === null || value === undefined) return;

    // Skip related_circuit since we handled it above
    if (key === "related_circuit") {
      console.log(
        "⏭️ Skipping related_circuit in processValue (already handled)"
      );
      return;
    }

    // Skip dossiers array since we handled it above
    if (key === "dossiers") return;

    if (value instanceof File) {
      formData.append(fieldName, value);
    } else if (Array.isArray(value)) {
      // Handle array of primitives or objects
      value.forEach((item, index) => {
        if (typeof item === "object" && item !== null) {
          Object.keys(item).forEach((subKey) => {
            processValue(subKey, item[subKey], `${fieldName}[${index}]`);
          });
        } else {
          formData.append(`${fieldName}[${index}]`, String(item));
        }
      });
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

// Enhanced function to detect files in nested objects
function hasFiles(data: FormSchema): boolean {
  console.log("🔍 Checking for files in data:", data);

  const checkForFiles = (obj: any, path: string = ""): boolean => {
    if (obj === null || obj === undefined) return false;

    // Check if the current value is a File
    if (obj instanceof File) {
      console.log(`📄 Found File at ${path}:`, obj.name);
      return true;
    }

    // Check if it's a FileList
    if (obj instanceof FileList) {
      console.log(`📄 Found FileList at ${path}:`, obj.length);
      return obj.length > 0;
    }

    // Check arrays
    if (Array.isArray(obj)) {
      return obj.some((item, index) =>
        checkForFiles(item, `${path}[${index}]`)
      );
    }

    // Check objects
    if (typeof obj === "object") {
      return Object.keys(obj).some((key) =>
        checkForFiles(obj[key], path ? `${path}.${key}` : key)
      );
    }

    return false;
  };

  const hasFile = checkForFiles(data);
  console.log("📄 Final file detection result:", hasFile);
  return hasFile;
}

function ProductEditor({ initialData, edit }: Props) {
  const [activeTab, setActiveTab] = useState("general");
  const [formSchema, setFormSchema] = useState<ZodSchema>(productSchema);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "product",
      cornerstone: 0,
      is_occupied: 0,
      display_homepage: 0,
      status: "published",
      related_circuit: [],
      ...initialData,
    },
  });

  const router = useRouter();
  const errors = form.formState.errors;

  async function handleSubmit(data: FormSchema) {
    console.log("🚀 Form submission started", data);

    if (isSubmitting) {
      console.log("⚠️ Already submitting, preventing double submission");
      return;
    }

    setIsSubmitting(true);

    try {
      // Determine the API endpoint based on edit mode
      const endpoint = edit
        ? "product/circuit/update"
        : "product/circuit/create";

      // Always send as FormData since your API expects it
      console.log("📤 Sending as multipart/form-data (API requirement)");
      const formData = convertToFormData(data);

      // If editing, add the product ID to formData (assuming it exists in initialData)
      if (edit && initialData?.id) {
        formData.append("id", String(initialData.id));
      }

      // Log FormData contents for debugging
      console.log("📋 FormData contents:");
      for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`  ${key}: File(${value.name}, ${value.size} bytes)`);
        } else {
          console.log(`  ${key}:`, value);
        }
      }

      // Use your API route handler
      const response = await axios.post(`/api/${endpoint}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("✅ API Response:", response.data);

      console.log("🔄 Invalidating queries...");
      await queryClient.invalidateQueries({
        queryKey: ["products"],
      });

      console.log("🎉 Success! Showing toast and redirecting...");
      toast.success(
        edit ? "Product updated successfully" : "Product created successfully"
      );

      if (!edit) {
        console.log("🔄 Redirecting to product list...");
        router.push(`/admin/product/circuit`);
      }
    } catch (error) {
      console.error("❌ Form submission error:", error);

      // More detailed error logging
      if (axios.isAxiosError(error)) {
        console.error("Axios error details:", {
          message: error.message,
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          headers: error.response?.headers,
        });
      }

      displayError(error, {});
    } finally {
      setIsSubmitting(false);
      console.log("🏁 Form submission completed");
    }
  }

  // Function to fetch initial data if editing
  const fetchProductData = async (productId: string) => {
    try {
      console.log("🔍 Fetching product data for ID:", productId);
      const response = await axios.get(
        `/api/admin/product/circuit/${productId}`
      );
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching product data:", error);
      displayError(error, {});
      return null;
    }
  };

  // Add form validation debugging
  useEffect(() => {
    console.log("🔍 Form errors:", errors);
    console.log("🔍 Form values:", form.getValues());
    console.log("🔍 Form state:", {
      isSubmitting: form.formState.isSubmitting,
      isValid: form.formState.isValid,
      isDirty: form.formState.isDirty,
    });
  }, [errors, form]);

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

  // Add event handler for debugging form submission
  const handleFormSubmit = (e: React.FormEvent) => {
    console.log("🎯 Form submit event triggered", e);
  };

  return (
    <Form {...form}>
      <form
        className="grid lg:grid-cols-[1fr_300px] gap-4 lg:gap-8"
        onSubmit={(e) => {
          console.log("📝 Form onSubmit called");
          handleFormSubmit(e);
          return form.handleSubmit(handleSubmit)(e);
        }}
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
          <PublishControls edit={edit} isSubmitting={isSubmitting} />
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
