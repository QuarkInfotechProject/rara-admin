import { PlusCircle } from "lucide-react";
import { useFormContext } from "react-hook-form";
import EditorCard from "@/components/editor-card";
import { Button } from "@/components/ui/button";
import { FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IconX } from "@tabler/icons-react";
import { FormSchema } from "./product-editor";

const defaultPrice = {
  number_of_people: 1,
  original_price_usd: 0,
  discounted_price_usd: 0,
};

function PricingFields() {
  const form = useFormContext<FormSchema>();
  const prices = form.watch("prices") ?? [];

  function addPrice() {
    form.setValue("prices", [...prices, defaultPrice]);
  }

  function removePrice(index: number) {
    const filteredPrices = prices.filter((_, i) => i !== index);
    form.setValue("prices", filteredPrices);
  }

  function changeInput(
    index: number,
    data: { number_of_people?: number; original_price_usd?: number; discounted_price_usd?: number }
  ) {
    let price = prices[index];
    if (price) {
      price = {
        ...price,
        ...data,
      };
      prices[index] = price;
      form.setValue("prices", prices);
    }
  }

  return (
    <div className="editor-grid">
      <Button type="button" size="sm" className="gap-1 ml-auto w-fit" onClick={addPrice}>
        <PlusCircle size={16} />
        <span className="sr-only sm:not-sr-onl ">Add</span>
      </Button>
      <EditorCard title="Prices">
        <FormField
          control={form.control}
          name="prices"
          render={({ field }) => (
            <FormItem>
              {prices.map((price, index) => (
                <Price key={index} index={index} {...price} changeInput={changeInput} removePrice={removePrice} />
              ))}
              <FormMessage />
            </FormItem>
          )}
        />
      </EditorCard>
    </div>
  );
}

export default PricingFields;

interface Props {
  index: number;
  number_of_people: number;
  original_price_usd: number;
  discounted_price_usd: number;
  changeInput: Function;
  removePrice: Function;
}

function Price(props: Props) {
  return (
    <div className="relative border border-dashed rounded-lg p-3 grid gap-4">
      <Label>Number of people</Label>
      <Input
        value={props.number_of_people}
        onChange={(e) =>
          props.changeInput(props.index, {
            number_of_people: Number(e.target.value),
          })
        }
      />
      <Label>Original price (USD)</Label>
      <Input
        value={props.original_price_usd}
        onChange={(e) =>
          props.changeInput(props.index, {
            original_price_usd: Number(e.target.value),
          })
        }
      />
      <Label>Discounted price (USD)</Label>
      <Input
        type="number"
        value={props.discounted_price_usd}
        onChange={(e) =>
          props.changeInput(props.index, {
            discounted_price_usd: Number(e.target.value),
          })
        }
      />
      <div className="absolute top-2 right-2 text-black dark:text-white *:bg-white dark:*:bg-stone-900 *:border *:rounded-full *:p-1 *:cursor-pointer flex gap-2">
        <IconX onClick={() => props.removePrice(props.index)} />
      </div>
    </div>
  );
}
