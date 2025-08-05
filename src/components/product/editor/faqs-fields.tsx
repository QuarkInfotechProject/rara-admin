import { PlusCircle } from "lucide-react";
import { useFormContext } from "react-hook-form";
import EditorCard from "@/components/editor-card";
import { Button } from "@/components/ui/button";
import { FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { IconX } from "@tabler/icons-react";
import { FormSchema } from "./product-editor";

const defaultFaq = {
  question: "",
  answer: "",
  order: 1,
};

function FAQSFields() {
  const form = useFormContext<FormSchema>();
  const faqs = form.watch("faqs") ?? [];

  function addFAQ() {
    form.setValue("faqs", [...faqs, defaultFaq]);
  }

  function removeFAQ(index: number) {
    const filteredFaqs = faqs.filter((_, i) => i !== index);
    form.setValue("faqs", filteredFaqs);
  }

  function changeInput(index: number, data: { question?: string; answer?: string; order?: number }) {
    let faq = faqs[index];
    if (faq) {
      faq = {
        ...faq,
        ...data,
      };
      faqs[index] = faq;
      form.setValue("faqs", faqs);
    }
  }

  return (
    <div className="editor-grid">
      <Button type="button" size="sm" className="gap-1 ml-auto w-fit" onClick={addFAQ}>
        <PlusCircle size={16} />
        <span className="sr-only sm:not-sr-only">Add</span>
      </Button>
      <EditorCard title="FAQs">
        <FormField
          control={form.control}
          name="faqs"
          render={({ field }) => (
            <FormItem>
              {faqs.map((faq, index) => (
                <FAQ key={index} index={index} {...faq} changeInput={changeInput} removeFAQ={removeFAQ} />
              ))}
              <FormMessage />
            </FormItem>
          )}
        />
      </EditorCard>
    </div>
  );
}

export default FAQSFields;

interface Props {
  index: number;
  question: string;
  answer: string;
  order: number;
  changeInput: Function;
  removeFAQ: Function;
}

function FAQ(props: Props) {
  return (
    <div className="relative border border-dashed rounded-lg p-3 grid gap-4">
      <Label>Question</Label>
      <Input
        value={props.question}
        onChange={(e) =>
          props.changeInput(props.index, {
            question: e.target.value,
          })
        }
        placeholder="Question"
      />
      <Label>Answer</Label>
      <Textarea
        value={props.answer}
        onChange={(e) =>
          props.changeInput(props.index, {
            answer: e.target.value,
          })
        }
        placeholder="Write your answer here"
      />
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
      <div className="absolute top-2 right-2 text-black dark:text-white *:bg-white dark:*:bg-stone-900 *:border *:rounded-full *:p-1 *:cursor-pointer flex gap-2">
        <IconX onClick={() => props.removeFAQ(props.index)} />
      </div>
    </div>
  );
}
