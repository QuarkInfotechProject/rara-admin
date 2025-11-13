"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
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
  productType: ProductType;
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

  if (data.dossiers && Array.isArray(data.dossiers)) {
    data.dossiers.forEach((dossier) => {
      if (dossier.content) {
        formData.append(`dossiers[content]`, dossier.content);
      }

      if (dossier.pdf_file) {
        if (dossier.pdf_file instanceof File) {
          formData.append(`dossiers[pdf_file]`, dossier.pdf_file);
        } else if (typeof dossier.pdf_file === "string") {
          formData.append(`dossiers[pdf_file]`, dossier.pdf_file);
        } else if (typeof dossier.pdf_file === "number") {
          formData.append(`dossiers[pdf_file]`, String(dossier.pdf_file));
        }
      }
    });
  }

  if (data.category !== null && data.category !== undefined) {
    formData.append("category", String(data.category));
  }

  if (data.overview && typeof data.overview === "object") {
    Object.entries(data.overview).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        if (key === "group_size" && typeof value === "string") {
          const numValue = Number(value) || 0;
          formData.append(`overview[${key}]`, String(numValue));
        } else {
          formData.append(`overview[${key}]`, String(value));
        }
      }
    });
  }

  arrayFields.forEach((fieldName) => {
    const fieldValue = data[fieldName as keyof FormSchema];
    if (fieldValue && Array.isArray(fieldValue) && fieldValue.length > 0) {
      fieldValue.forEach((item) => {
        formData.append(`${fieldName}[]`, String(item));
      });
    } else {
      formData.append(`${fieldName}[]`, "");
    }
  });

  const processValue = (key: string, value: any, parentKey?: string) => {
    const fieldName = parentKey ? `${parentKey}[${key}]` : key;

    if (value === null || value === undefined) return;

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

  (Object.keys(data) as (keyof FormSchema)[]).forEach((key) => {
    processValue(key as string, data[key]);
  });

  return formData;
}

function safeNumberArray(value: any): number[] {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (typeof item === "object" && item !== null && "id" in item) {
          const num = Number(item.id);
          return isNaN(num) ? null : num;
        }
        const num = Number(item);
        return isNaN(num) ? null : num;
      })
      .filter((item) => item !== null) as number[];
  }
  return [];
}

function safeCategoryNumber(value: any): number | null {
  if (!value) return null;

  if (typeof value === "object" && value !== null) {
    if ("category_detail" in value && value.category_detail?.id) {
      const num = Number(value.category_detail.id);
      return isNaN(num) ? null : num;
    }

    if ("id" in value) {
      const num = Number(value.id);
      return isNaN(num) ? null : num;
    }
  }

  const num = Number(value);
  return isNaN(num) ? null : num;
}

function processInitialData(initialData: any) {
  if (!initialData) return null;

  const processed = { ...initialData };

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

  processed.category = safeCategoryNumber(processed.category);

  processed.cornerstone = Number(processed.cornerstone) || 0;
  processed.is_occupied = Number(processed.is_occupied) || 0;
  processed.display_homepage = Number(processed.display_homepage) || 0;
  processed.latitude = Number(processed.latitude) || 0;
  processed.longitude = Number(processed.longitude) || 0;

  if (!processed.overview || typeof processed.overview !== "object") {
    processed.overview = {};
  }

  return processed;
}

function getDefaultType(
  productType: ProductType
): "trek" | "tour" | "activities" {
  return productType;
}

function ProductEditor({ initialData, edit, productType }: Props) {
  const [activeTab, setActiveTab] = useState("general");
  const [formSchema, setFormSchema] = useState<ZodSchema>(productSchema);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const autoSaveIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const draftKeyRef = useRef<string>("");

  const getProcessedDefaultValues = () => {
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
      category_details: "this is category details",
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

  // Initialize draft key
  useEffect(() => {
    draftKeyRef.current = `product_draft_${productType}_${
      initialData?.id || "new"
    }`;
  }, [productType, initialData?.id]);

  // Load saved draft on mount
  useEffect(() => {
    const loadSavedDraft = async () => {
      try {
        // Try to load from sessionStorage first (fastest)
        const savedDraft = sessionStorage.getItem(draftKeyRef.current);
        if (savedDraft) {
          const draftData = JSON.parse(savedDraft);
          form.reset(draftData);
          toast.success("Draft restored from last session");
          return;
        }

        // If no sessionStorage, try localStorage as backup
        const localDraft = localStorage.getItem(draftKeyRef.current);
        if (localDraft) {
          const draftData = JSON.parse(localDraft);
          form.reset(draftData);
          toast.success("Draft restored from storage");
        }
      } catch (err) {
        console.error("Failed to load draft:", err);
      }
    };

    loadSavedDraft();
  }, []);

  // Auto-save to localStorage/sessionStorage
  const saveDraftLocally = (data: any) => {
    try {
      // Filter out File objects before saving
      const serializableData: any = {};

      Object.keys(data).forEach((key) => {
        const value = data[key];

        // Skip File objects
        if (
          value &&
          typeof value === "object" &&
          value.constructor.name === "File"
        ) {
          return;
        }

        if (Array.isArray(value)) {
          serializableData[key] = value.filter(
            (item) =>
              !(
                item &&
                typeof item === "object" &&
                item.constructor.name === "File"
              )
          );
        } else if (typeof value === "object" && value !== null) {
          serializableData[key] = Object.keys(value).reduce(
            (obj: any, subKey) => {
              const subValue = value[subKey];
              if (
                !(
                  subValue &&
                  typeof subValue === "object" &&
                  subValue.constructor.name === "File"
                )
              ) {
                obj[subKey] = subValue;
              }
              return obj;
            },
            {}
          );
        } else {
          serializableData[key] = value;
        }
      });

      sessionStorage.setItem(
        draftKeyRef.current,
        JSON.stringify(serializableData)
      );
      localStorage.setItem(
        draftKeyRef.current,
        JSON.stringify(serializableData)
      );
      setLastSaved(new Date());
    } catch (err) {
      console.error("Failed to save draft locally:", err);
    }
  };

  // Setup auto-save intervals
  useEffect(() => {
    const subscription = form.watch((data: any) => {
      // Save to local storage immediately
      saveDraftLocally(data);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [form]);

  // Clean up draft after successful submission
  const clearDraft = () => {
    try {
      sessionStorage.removeItem(draftKeyRef.current);
      localStorage.removeItem(draftKeyRef.current);
    } catch (err) {
      console.error("Failed to clear draft:", err);
    }
  };

  async function handleSubmit(data: FormSchema) {
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (!data.overview || typeof data.overview !== "object") {
        throw new Error("Overview data is required");
      }

      if (
        data.overview.group_size &&
        typeof data.overview.group_size === "string"
      ) {
        data.overview.group_size = Number(data.overview.group_size) || 0;
      }

      const endpoints = getApiEndpoints(productType);
      const endpoint = edit ? endpoints.update : endpoints.create;

      const formData = convertToFormData(data);

      if (edit && initialData?.id) {
        formData.append("id", String(initialData.id));
      }

      const response = await axios.post(`/api/${endpoint}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Clear draft after successful submission
      clearDraft();

      await queryClient.invalidateQueries({
        queryKey: ["products"],
      });

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
          <div className="text-sm text-gray-500">
            {lastSaved && <p>Last saved: {lastSaved.toLocaleTimeString()}</p>}
            {autoSaveEnabled && (
              <p className="text-xs text-green-600">Auto-save enabled</p>
            )}
          </div>
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