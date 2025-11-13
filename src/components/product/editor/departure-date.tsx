import React from "react";
import { PlusCircle, AlertCircle } from "lucide-react";
import { useFormContext } from "react-hook-form";
import EditorCard from "@/components/editor-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IconX } from "@tabler/icons-react";
import { FormSchema } from "./product-editor";
import { Departure } from "./zod-schema";

const defaultDeparture: Departure = {
  departure_from: "",
  departure_to: "",
  departure_per_price: "",
};

function DepartureDatesField() {
  const form = useFormContext<FormSchema>();
  const departures = form.watch("departures") ?? [];

  function addDeparture(): void {
    const lastPrice =
      departures.length > 0
        ? departures[departures.length - 1].departure_per_price
        : "";

    const newDeparture: Departure = {
      ...defaultDeparture,
      departure_per_price: lastPrice,
    };

    form.setValue("departures", [...departures, newDeparture]);
  }

  function removeDeparture(index: number): void {
    const filteredDepartures = departures.filter((_, i) => i !== index);
    form.setValue("departures", filteredDepartures);
  }

  function changeInput(index: number, data: Partial<Departure>): void {
    const departure = departures[index];

    if (departure) {
      const updatedDeparture: Departure = {
        ...departure,
        ...data,
      };

      const updatedDepartures = [...departures];
      updatedDepartures[index] = updatedDeparture;

      form.setValue("departures", updatedDepartures);
    }
  }

  return (
    <div className="editor-grid">
      <Button
        type="button"
        size="sm"
        className="gap-1 ml-auto w-fit"
        onClick={addDeparture}
      >
        <PlusCircle size={16} />
        <span className="sr-only sm:not-sr-only">Add Departure</span>
      </Button>
      <EditorCard title="Departure Dates">
        {departures.map((departure, index) => (
          <DepartureDate
            key={index}
            index={index}
            {...departure}
            changeInput={changeInput}
            removeDeparture={removeDeparture}
          />
        ))}
      </EditorCard>
    </div>
  );
}

export default DepartureDatesField;

interface DepartureProps {
  index: number;
  departure_from: string;
  departure_to: string;
  departure_per_price: string;
  changeInput: (index: number, data: Partial<Departure>) => void;
  removeDeparture: (index: number) => void;
}

function DepartureDate(props: DepartureProps) {
  const today = new Date().toISOString().split("T")[0];

  const getDateValidationErrors = () => {
    const errors: string[] = [];

    if (props.departure_from && props.departure_from < today) {
      errors.push("Start date cannot be in the past");
    }

    if (
      props.departure_from &&
      props.departure_to &&
      props.departure_to <= props.departure_from
    ) {
      errors.push("End date must be after the start date");
    }

    return errors;
  };

  const validationErrors = getDateValidationErrors();
  const hasError = validationErrors.length > 0;

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    if (value === "" || (Number(value) >= 0 && !isNaN(Number(value)))) {
      props.changeInput(props.index, {
        departure_per_price: value,
      });
    }
  };

  return (
    <div
      className={`relative border rounded-lg p-3 grid gap-4 ${
        hasError
          ? "border-red-300 bg-red-50 dark:bg-red-950/20 dark:border-red-700"
          : "border-dashed"
      }`}
    >
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Departure From</Label>
          <Input
            type="date"
            value={props.departure_from}
            onChange={(e) =>
              props.changeInput(props.index, {
                departure_from: e.target.value,
              })
            }
            min={today}
            placeholder="Select start date"
            className={hasError ? "border-red-300" : ""}
          />
        </div>
        <div>
          <Label>Departure To</Label>
          <Input
            type="date"
            value={props.departure_to}
            onChange={(e) =>
              props.changeInput(props.index, {
                departure_to: e.target.value,
              })
            }
            min={
              props.departure_from
                ? new Date(new Date(props.departure_from).getTime() + 86400000)
                    .toISOString()
                    .split("T")[0]
                : today
            }
            placeholder="Select end date"
            className={hasError ? "border-red-300" : ""}
          />
        </div>
      </div>

      <div>
        <Label>Price Per Person</Label>
        <Input
          type="number"
          step="0.01"
          min="0"
          value={props.departure_per_price}
          onChange={handlePriceChange}
          placeholder="Enter price"
        />
      </div>

      {hasError && (
        <div className="flex gap-2 p-2 bg-red-100 dark:bg-red-900/30 rounded text-sm text-red-800 dark:text-red-200">
          <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
          <div className="flex flex-col gap-1">
            {validationErrors.map((error, idx) => (
              <span key={idx}>{error}</span>
            ))}
          </div>
        </div>
      )}

      <div className="absolute top-2 right-2 text-black dark:text-white *:bg-white dark:*:bg-stone-900 *:border *:rounded-full *:p-1 *:cursor-pointer flex gap-2">
        <IconX
          onClick={() => props.removeDeparture(props.index)}
          className="hover:bg-red-50 dark:hover:bg-red-900/20"
        />
      </div>
    </div>
  );
}
