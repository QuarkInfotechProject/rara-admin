import { PlusCircle } from "lucide-react";
import { useFormContext } from "react-hook-form";
import EditorCard from "@/components/editor-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IconX } from "@tabler/icons-react";
import { FormSchema } from "./product-editor";
import dynamic from "next/dynamic";

const CkEditor = dynamic(() => import("@/components/ck-editor"), {
  ssr: false,
});

const defaultItinerary = {
  time_window: "",
  activity: "",
  duration: "",
  location: "",
  maximum_altitude: "",
  activities: "",
  accommodation: "",
  meals: "",
  order: 1,
};

function ItineraryFields() {
  const form = useFormContext<FormSchema>();
  const itineraries = form.watch("itinerary") ?? [];

  function addItinerary() {
    form.setValue("itinerary", [...itineraries, defaultItinerary]);
  }

  function removeItinerary(index: number) {
    const filteredItineraries = itineraries.filter((_, i) => i !== index);
    form.setValue("itinerary", filteredItineraries);
  }

  function changeInput(index: number, data: Partial<typeof defaultItinerary>) {
    let itinerary = itineraries[index];

    if (itinerary) {
      itinerary = {
        ...itinerary,
        ...data,
      };
      itineraries[index] = itinerary;
      form.setValue("itinerary", itineraries);
    }
  }

  return (
    <div className="editor-grid">
      <Button
        type="button"
        size="sm"
        className="gap-1 ml-auto w-fit"
        onClick={addItinerary}
      >
        <PlusCircle size={16} />
        <span className="sr-only sm:not-sr-only">Add</span>
      </Button>
      <EditorCard title="Itineraries">
        {itineraries.map((itinerary, index) => (
          <Itinerary
            key={index}
            index={index}
            {...itinerary}
            changeInput={changeInput}
            removeItinerary={removeItinerary}
          />
        ))}
      </EditorCard>
    </div>
  );
}

export default ItineraryFields;

interface ItineraryProps {
  index: number;
  time_window: string;
  activity: string;
  duration: string;
  location: string;
  maximum_altitude: string;
  activities: string;
  accommodation: string;
  meals: string;
  order: number;
  changeInput: Function;
  removeItinerary: Function;
}

function Itinerary(props: ItineraryProps) {
  return (
    <div className="relative border border-dashed rounded-lg p-4 grid gap-4">
      <div className="grid gap-2">
        <Label>Time Window</Label>
        <Input
          value={props.time_window}
          onChange={(e) =>
            props.changeInput(props.index, {
              time_window: e.target.value,
            })
          }
          placeholder="Time Window"
        />
      </div>

      <div className="grid gap-2">
        <Label>Activity</Label>
        <CkEditor
          id={`${props.index}-itinerary`}
          initialData={props.activity}
          onChange={(content) =>
            props.changeInput(props.index, { activity: content })
          }
        />
      </div>

      {/* Additional Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="grid gap-2">
          <Label>Duration</Label>
          <Input
            value={props.duration}
            onChange={(e) =>
              props.changeInput(props.index, {
                duration: e.target.value,
              })
            }
            placeholder="Enter duration"
          />
        </div>

        <div className="grid gap-2">
          <Label>Location</Label>
          <Input
            value={props.location}
            onChange={(e) =>
              props.changeInput(props.index, {
                location: e.target.value,
              })
            }
            placeholder="Enter location"
          />
        </div>

        <div className="grid gap-2">
          <Label>Maximum Altitude</Label>
          <Input
            value={props.maximum_altitude}
            onChange={(e) =>
              props.changeInput(props.index, {
                maximum_altitude: e.target.value,
              })
            }
            placeholder="Enter max altitude"
          />
        </div>

        <div className="grid gap-2">
          <Label>Activities</Label>
          <Input
            value={props.activities}
            onChange={(e) =>
              props.changeInput(props.index, {
                activities: e.target.value,
              })
            }
            placeholder="Enter activities"
          />
        </div>

        <div className="grid gap-2">
          <Label>Accommodation</Label>
          <Input
            value={props.accommodation}
            onChange={(e) =>
              props.changeInput(props.index, {
                accommodation: e.target.value,
              })
            }
            placeholder="Enter accommodation"
          />
        </div>

        <div className="grid gap-2">
          <Label>Meals</Label>
          <Input
            value={props.meals}
            onChange={(e) =>
              props.changeInput(props.index, {
                meals: e.target.value,
              })
            }
            placeholder="Enter meals"
          />
        </div>
      </div>

      <div className="grid gap-2">
        <Label>Order</Label>
        <Input
          type="number"
          value={props.order}
          onChange={(e) =>
            props.changeInput(props.index, {
              order: Number(e.target.value),
            })
          }
          placeholder="1"
        />
      </div>

      <div className="absolute top-2 right-2 text-black dark:text-white *:bg-white dark:*:bg-stone-900 *:border *:rounded-full *:p-1 *:cursor-pointer flex gap-2">
        <IconX onClick={() => props.removeItinerary(props.index)} />
      </div>
    </div>
  );
}
