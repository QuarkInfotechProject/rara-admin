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

// Define product types
export type ProductType = "trek" | "tour" | "activities";

interface Props {
  initialData?: any;
  edit?: boolean;
  productType: ProductType; // Make this required
}

export type FormSchema = Product;

// Helper function to get API endpoints based on product type
function getApiEndpoints(productType: ProductType) {
  const endpoints = {
    trek: {
      create: "product/trek/create",
      update: "product/trek/update",
    },
    tour: {
      create: "product/tour/create",
      update: "product/tour/update",
    },
    activities: {
      create: "product/activities/create",
      update: "product/activities/update",
    },
  };

  return endpoints[productType];
}

// Helper function to get redirect path based on product type
function getRedirectPath(productType: ProductType) {
  return `/admin/product/${productType}`;
}

// Enhanced convertToFormData function with better overview handling
function convertToFormData(data: FormSchema): FormData {
  const formData = new FormData();

  // Define array fields that should always be included in FormData
  const arrayFields = [
    "related_circuit",
    "related_homestay",
    "related_experience",
    "related_package",
    "nearby_homestay",
    "tags",
    "included",
    "related_blogs",
    "amenity",
    "excluded",
    "what_to_bring",
  ];

  // Handle dossiers specially
  if (data.dossiers && Array.isArray(data.dossiers)) {
    data.dossiers.forEach((dossier, index) => {
      // Handle content
      if (dossier.content) {
        formData.append(`dossiers[content]`, dossier.content);
      }

      // Handle pdf_file based on type
      if (dossier.pdf_file) {
        if (dossier.pdf_file instanceof File) {
          // New file upload
          formData.append(`dossiers[pdf_file]`, dossier.pdf_file);
        } else if (typeof dossier.pdf_file === "string") {
          // Existing URL - keep as is
          formData.append(`dossiers[pdf_file]`, dossier.pdf_file);
        } else if (typeof dossier.pdf_file === "number") {
          // File ID
          formData.append(`dossiers[pdf_file]`, String(dossier.pdf_file));
        }
      }
    });
  }

  // Handle category as single value
  if (data.category !== null && data.category !== undefined) {
    formData.append("category", String(data.category));
  }

  // Handle overview object specially
  if (data.overview && typeof data.overview === "object") {
    Object.entries(data.overview).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        // Convert group_size to number if it's a string
        if (key === "group_size" && typeof value === "string") {
          const numValue = Number(value) || 0;
          formData.append(`overview[${key}]`, String(numValue));
        } else {
          formData.append(`overview[${key}]`, String(value));
        }
      }
    });
  }

  // Handle array fields specially to ensure they're always included
  arrayFields.forEach((fieldName) => {
    const fieldValue = data[fieldName as keyof FormSchema];
    if (fieldValue && Array.isArray(fieldValue) && fieldValue.length > 0) {
      fieldValue.forEach((item, index) => {
        formData.append(`${fieldName}[${index}]`, String(item));
      });
    } else {
      // Include empty array indicator for backend
      formData.append(`${fieldName}[]`, "");
    }
  });

  const processValue = (key: string, value: any, parentKey?: string) => {
    const fieldName = parentKey ? `${parentKey}[${key}]` : key;

    if (value === null || value === undefined) return;

    // Skip dossiers, array fields, category, and overview since we handled them above
    if (
      key === "dossiers" ||
      key === "overview" ||
      key === "category" ||
      arrayFields.includes(key)
    ) {
      return;
    }

    if (value instanceof File) {
      formData.append(fieldName, value);
    } else if (Array.isArray(value)) {
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

  // Process other fields
  (Object.keys(data) as (keyof FormSchema)[]).forEach((key) => {
    processValue(key as string, data[key]);
  });

  return formData;
}

// Helper function to safely convert values to numbers
function safeNumberArray(value: any): number[] {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value
      .map((item) => {
        // Handle objects with id property (like {id: 2, name: "Trek-85"})
        if (typeof item === "object" && item !== null && "id" in item) {
          const num = Number(item.id);
          return isNaN(num) ? null : num;
        }
        // Handle direct numbers or string numbers
        const num = Number(item);
        return isNaN(num) ? null : num;
      })
      .filter((item) => item !== null) as number[];
  }
  return [];
}

// Helper function to safely convert category value to number
function safeCategoryNumber(value: any): number | null {
  if (!value) return null;

  // Handle object with id property
  if (typeof value === "object" && value !== null && "id" in value) {
    const num = Number(value.id);
    return isNaN(num) ? null : num;
  }

  // Handle direct numbers or string numbers
  const num = Number(value);
  return isNaN(num) ? null : num;
}

// Helper function to process initial data
function processInitialData(initialData: any) {
  if (!initialData) return null;

  const processed = { ...initialData };

  // Convert dossiers from object to array if needed
  if (processed.dossiers && !Array.isArray(processed.dossiers)) {
    processed.dossiers = [
      {
        content: processed.dossiers.content || "test data static here",
        pdf_file: processed.dossiers.pdf_file || null,
      },
    ];
  } else if (!processed.dossiers) {
    processed.dossiers = [];
  }

  // Process array fields that might have similar issues
  processed.related_circuit = safeNumberArray(processed.related_circuit);
  processed.related_homestay = safeNumberArray(processed.related_homestay);
  processed.related_experience = safeNumberArray(processed.related_experience);
  processed.related_package = safeNumberArray(processed.related_package);
  processed.nearby_homestay = safeNumberArray(processed.nearby_homestay);
  processed.tags = safeNumberArray(processed.tags);
  processed.included = safeNumberArray(processed.included);
  processed.related_blogs = safeNumberArray(processed.related_blogs);
  processed.amenity = safeNumberArray(processed.amenity);
  processed.excluded = safeNumberArray(processed.excluded);
  processed.what_to_bring = safeNumberArray(processed.what_to_bring);

  // Process category as single value
  processed.category = safeCategoryNumber(processed.category);

  // Ensure numeric fields are properly converted
  processed.cornerstone = Number(processed.cornerstone) || 0;
  processed.is_occupied = Number(processed.is_occupied) || 0;
  processed.display_homepage = Number(processed.display_homepage) || 0;
  processed.latitude = Number(processed.latitude) || 0;
  processed.longitude = Number(processed.longitude) || 0;

  // Ensure overview is an object
  if (!processed.overview || typeof processed.overview !== "object") {
    processed.overview = {};
  }

  return processed;
}

// Helper function to get default type based on product type
function getDefaultType(
  productType: ProductType
): "trek" | "tour" | "activities" {
  return productType;
}

// Updated ProductEditor component with proper product type handling
function ProductEditor({ initialData, edit, productType }: Props) {
  const [activeTab, setActiveTab] = useState("general");
  const [formSchema, setFormSchema] = useState<ZodSchema>(productSchema);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Process initial data to ensure proper format
  const getProcessedDefaultValues = () => {
    // Base defaults with dynamic type based on productType
    const baseDefaults = {
      type: getDefaultType(productType),
      cornerstone: 0,
      is_occupied: 0,
      display_homepage: 0,
      status: "published",
      related_circuit: [],
      dossiers: [],
      tags: [],
      category: null,
      included: [],
      related_blogs: [],
      amenity: [],
      excluded: [],
      what_to_bring: [],
      nearby_homestay: [],
      related_homestay: [],
      related_experience: [],
      related_package: [],
      hosts: [],
      highlights: [],
      itinerary: [],
      faqs: [],
      prices: [],
      departures: [],
      overview: {
        duration: "",
        overview_location: "",
        trip_grade: "",
        max_altitude: "",
        group_size: 0,
        activities: "",
        best_time: "",
        starts: "",
      },
      meta: {
        metaTitle: "",
        keywords: "",
        metaDescription: "",
      },
    };

    if (!initialData) {
      return baseDefaults;
    }

    const processed = processInitialData(initialData);

    const result = {
      ...baseDefaults,
      ...processed,
      // Ensure type matches productType even if initialData has different type
      type: getDefaultType(productType),
    };

    return result;
  };

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: getProcessedDefaultValues(),
  });

  const router = useRouter();
  const errors = form.formState.errors;

  async function handleSubmit(data: FormSchema) {
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Validate overview object has proper structure
      if (!data.overview || typeof data.overview !== "object") {
        throw new Error("Overview data is required");
      }

      // Ensure group_size is a number
      if (
        data.overview.group_size &&
        typeof data.overview.group_size === "string"
      ) {
        data.overview.group_size = Number(data.overview.group_size) || 0;
      }

      // Get the appropriate API endpoints based on product type
      const endpoints = getApiEndpoints(productType);
      const endpoint = edit ? endpoints.update : endpoints.create;

      const formData = convertToFormData(data);

      // If editing, add the product ID to formData
      if (edit && initialData?.id) {
        formData.append("id", String(initialData.id));
      }

      const response = await axios.post(`/api/${endpoint}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      await queryClient.invalidateQueries({
        queryKey: ["products"],
      });

      // Invalidate specific product type queries
      await queryClient.invalidateQueries({
        queryKey: [productType],
      });

      toast.success(
        edit
          ? `${productType} updated successfully`
          : `${productType} created successfully`
      );

      if (!edit) {
        router.push(getRedirectPath(productType));
      }
    } catch (error) {
      displayError(error, {});
    } finally {
      setIsSubmitting(false);
    }
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
            <div>
              <GeneralFields productType={productType} />
            </div>
          </TabsContent>
          <TabsContent value="description">
            <div>
              <DescriptionFields />
            </div>
          </TabsContent>
          <TabsContent value="pricing">
            <div>
              <PricingFields />
            </div>
          </TabsContent>
          <TabsContent value="location">
            <div>
              <LocationFields />
            </div>
          </TabsContent>
          <TabsContent value="overview">
            <div>
              <OverviewFields />
            </div>
          </TabsContent>
          <TabsContent value="faqs">
            <div>
              <FAQSFields />
            </div>
          </TabsContent>
          <TabsContent value="itinerary">
            <div>
              <ItineraryFields />
            </div>
          </TabsContent>
          <TabsContent value="dossiers">
            <div>
              <DossierFields />
            </div>
          </TabsContent>
          <TabsContent value="departure">
            <div>
              <DepartureDatesField />
            </div>
          </TabsContent>
          <TabsContent value="files">
            <div>
              <Files />
            </div>
          </TabsContent>
          <TabsContent value="other">
            <div>
              <OtherFields productType={productType} />
            </div>
          </TabsContent>
        </Tabs>
        <div className="md:sticky top-4 flex flex-col gap-4 lg:gap-8">
          <PublishControls edit={edit} isSubmitting={isSubmitting} />
          <div>
            <BasicFields />
          </div>
        </div>
      </form>
    </Form>
  );
}

export default ProductEditor;

function hasAnyProperty(obj: any, properties: string[]) {
  return properties.some((property) => property in obj);
}
