import axios from "axios";
import React, { useMemo, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import Select from "react-select";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { FormSchema } from "./product-editor";

interface CircuitOption {
  id: number;
  name: string;
}

interface SelectOption {
  label: string;
  value: number;
}

function SelectRelatedCircuits() {
  const form = useFormContext<FormSchema>();

  const { data, isPending, error, isSuccess } = useQuery<CircuitOption[]>({
    queryKey: ["product-editor-circuits"],
    queryFn: async () => {
      console.log("🚀 Fetching circuits from API...");
      const response = await axios.get("/api/product/select-list/trek");
      console.log("📡 Raw API Response:", response);
      console.log("📡 Response Data:", response.data);

      // Check different possible data structures
      let circuits = [];
      if (response.data?.data) {
        circuits = response.data.data;
      } else if (Array.isArray(response.data)) {
        circuits = response.data;
      } else {
        console.warn("⚠️ Unexpected API response structure:", response.data);
        circuits = [];
      }

      console.log("✅ Processed circuits data:", circuits);
      console.log("✅ Circuits length:", circuits.length);
      console.log("✅ First circuit:", circuits[0]);

      if (!Array.isArray(circuits)) {
        console.error("❌ Circuits data is not an array:", circuits);
        return [];
      }

      // Validate circuit structure
      const validCircuits = circuits.filter((circuit) => {
        const isValid =
          circuit && typeof circuit.id !== "undefined" && circuit.name;
        if (!isValid) {
          console.warn("⚠️ Invalid circuit:", circuit);
        }
        return isValid;
      });

      console.log("✅ Valid circuits:", validCircuits);
      return validCircuits;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });

  // Safely get current form values - ensure it's always an array
  const currentRelatedCircuits = useMemo(() => {
    const value = form.watch("related_circuit");
    console.log(
      "👀 Current related_circuit value from form:",
      value,
      typeof value
    );

    if (!value) return [];
    if (!Array.isArray(value)) {
      console.warn("⚠️ related_circuit is not an array:", value, typeof value);
      return [];
    }
    return value;
  }, [form]);

  // Initialize field if needed
  useEffect(() => {
    const currentValue = form.getValues("related_circuit");
    console.log("🔍 Initial related_circuit value:", currentValue);

    if (
      currentValue === undefined ||
      currentValue === null ||
      !Array.isArray(currentValue)
    ) {
      console.log("🔧 Initializing related_circuit as empty array");
      form.setValue("related_circuit", [], { shouldDirty: false });
    }
  }, [form]);

  // Create all available options
  const allOptions = useMemo((): SelectOption[] => {
    console.log("🔨 Creating allOptions from data:", data);

    if (!data || !Array.isArray(data)) {
      console.log("❌ No data or data is not array:", data);
      return [];
    }

    const options = data
      .map((circuit) => {
        if (!circuit || typeof circuit.id === "undefined" || !circuit.name) {
          console.warn("⚠️ Invalid circuit data:", circuit);
          return null;
        }

        return {
          label: circuit.name,
          value: circuit.id,
        };
      })
      .filter(Boolean) as SelectOption[];

    console.log("✅ Created options:", options);
    return options;
  }, [data]);

  // Create default selected options
  const defaultOptions = useMemo((): SelectOption[] => {
    console.log("🔨 Creating defaultOptions...");
    console.log("- data:", data);
    console.log("- currentRelatedCircuits:", currentRelatedCircuits);

    // Return empty array if no data or no current selections
    if (!data || !Array.isArray(data) || currentRelatedCircuits.length === 0) {
      console.log("❌ No data, not array, or no current selections");
      return [];
    }

    const selectedIds = new Set<number>();

    // Process current selections
    currentRelatedCircuits.forEach((id) => {
      if (typeof id === "number") {
        selectedIds.add(id);
      } else if (typeof id === "string" && !isNaN(Number(id))) {
        selectedIds.add(Number(id));
      } else {
        console.warn("⚠️ Invalid ID in related_circuit:", id, typeof id);
      }
    });

    console.log("🎯 Selected IDs:", Array.from(selectedIds));

    // Find matching options from data
    const matchingOptions = data.filter((circuit) =>
      selectedIds.has(circuit.id)
    );

    console.log("🎯 Matching circuits:", matchingOptions);

    const result = matchingOptions.map((option) => ({
      label: option.name,
      value: option.id,
    }));

    console.log("✅ Default options result:", result);
    return result;
  }, [data, currentRelatedCircuits]);

  // Debug logging on every render
  useEffect(() => {
    console.log("=== SelectRelatedCircuits Debug Info ===");
    console.log("isPending:", isPending);
    console.log("isSuccess:", isSuccess);
    console.log("error:", error);
    console.log("data:", data);
    console.log("data type:", typeof data);
    console.log("data isArray:", Array.isArray(data));
    console.log("data length:", data?.length);
    console.log("currentRelatedCircuits:", currentRelatedCircuits);
    console.log("allOptions:", allOptions);
    console.log("allOptions length:", allOptions.length);
    console.log("defaultOptions:", defaultOptions);
    console.log("=======================================");
  }, [
    isPending,
    isSuccess,
    error,
    data,
    currentRelatedCircuits,
    allOptions,
    defaultOptions,
  ]);

  // Handle error state
  if (error) {
    console.error("❌ Error loading circuits:", error);
    return (
      <FormField
        control={form.control}
        name="related_circuit"
        render={() => (
          <FormItem>
            <FormLabel>Related Treks (Optional)</FormLabel>
            <FormControl>
              <div className="p-2 text-red-600 bg-red-50 border border-red-200 rounded">
                Failed to load treks: {error.message}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }

  return (
    <FormField
      control={form.control}
      name="related_circuit"
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            Related Treks (Optional)
            {data && (
              <span className="text-sm text-gray-500 ml-2">
                ({allOptions.length} available)
              </span>
            )}
          </FormLabel>
          <FormControl>
            {isPending ? (
              <div>
                <Skeleton className="w-full h-[38px]" />
                <p className="text-sm text-gray-500 mt-1">Loading treks...</p>
              </div>
            ) : allOptions.length === 0 ? (
              <div className="p-2 text-yellow-600 bg-yellow-50 border border-yellow-200 rounded">
                No treks available. Check API response or data structure.
              </div>
            ) : (
              <Select
                classNamePrefix="chn_select"
                isMulti
                isClearable
                placeholder={`Select from ${allOptions.length} available treks...`}
                value={defaultOptions}
                options={allOptions}
                onChange={(selectedOptions) => {
                  console.log("🔄 Related circuits onChange triggered");
                  console.log("🔄 selectedOptions:", selectedOptions);

                  // Handle null/undefined case
                  if (!selectedOptions) {
                    console.log("📝 Setting to empty array (no selection)");
                    form.setValue("related_circuit", [], {
                      shouldValidate: true,
                      shouldDirty: true,
                    });
                    return;
                  }

                  // Extract and validate IDs
                  const values = selectedOptions
                    .map((option) => {
                      const id = Number(option.value);
                      if (isNaN(id)) {
                        console.warn("❌ Invalid trek ID:", option.value);
                        return null;
                      }
                      return id;
                    })
                    .filter((id): id is number => id !== null);

                  console.log("📝 Setting related_circuit to:", values);

                  // Update form with validated array
                  form.setValue("related_circuit", values, {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                }}
                isLoading={isPending}
                noOptionsMessage={() => "No treks found"}
                loadingMessage={() => "Loading treks..."}
                isDisabled={isPending}
                menuIsOpen={undefined} // Let react-select control this
              />
            )}
          </FormControl>
          <FormMessage />
          {/* Debug info in development */}
          {process.env.NODE_ENV === "development" && (
            <div className="text-xs text-gray-400 mt-1">
              Debug: {data?.length || 0} circuits loaded,{" "}
              {currentRelatedCircuits.length} selected
            </div>
          )}
        </FormItem>
      )}
    />
  );
}

export default SelectRelatedCircuits;
