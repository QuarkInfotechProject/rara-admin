import { useFormContext } from "react-hook-form";
import EditorCard from "@/components/editor-card";
import { FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormSchema } from "./product-editor";

function PricingFields() {
  const form = useFormContext<FormSchema>();
  const price = form.watch("prices")?.[0] ?? {
    original_price_usd: 0,
    discounted_price_usd: 0,
  };

  function changeInput(data: {
    original_price_usd?: number;
    discounted_price_usd?: number;
  }) {
    const newPrice = {
      ...price,
      ...data,
    };
    form.setValue("prices", [newPrice]); // single price array
  }

  return (
    <div className="editor-grid">
      <EditorCard title="Price">
        <FormField
          control={form.control}
          name="prices"
          render={() => (
            <FormItem>
              <div className="grid gap-4">
                <div>
                  <Label>Original Price (USD)</Label>
                  <Input
                    type="number"
                    value={price.original_price_usd}
                    onChange={(e) =>
                      changeInput({
                        original_price_usd: Number(e.target.value),
                      })
                    }
                  />
                </div>

                <div>
                  <Label>Discounted Price (USD)</Label>
                  <Input
                    type="number"
                    value={price.discounted_price_usd}
                    onChange={(e) =>
                      changeInput({
                        discounted_price_usd: Number(e.target.value),
                      })
                    }
                  />
                </div>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </EditorCard>
    </div>
  );
}

export default PricingFields;
