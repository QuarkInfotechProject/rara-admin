import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import EditorCard from "../editor-card";
import { FormData } from "./zod-schema";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import axios from "axios";
import { queryClient } from "@/lib/context/react-query-context";
import displayError from "@/lib/utils/display-error";

function ReviewEditorRatings() {
  const form = useFormContext<FormData>();
  const isApproved = form.watch("approved"); // Now it's a boolean
  const reviewId = form.watch("id");

  async function toggleReviewStatus() {
    const toastId = toast.loading("Updating review...");
    try {
      await axios.get(`/api/review/approve-toggle/${reviewId}`);
      await queryClient.invalidateQueries({
        queryKey: ["reviews"],
      });
      form.setValue("approved", !isApproved); // Toggle boolean
      toast.success("Review updated successfully!", { id: toastId });
    } catch (error) {
      displayError(error, { toastId, fallback: "Failed to updated review!" });
    }
  }

  return (
    <EditorCard title="Ratings">
      <FormField
        control={form.control}
        name="cleanliness"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Cleanliness</FormLabel>
            <FormControl>
              <Input placeholder="5" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="hospitality"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Hospitality</FormLabel>
            <Input placeholder="5" {...field} />
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="value_for_money"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Value For Money</FormLabel>
            <Input placeholder="5" {...field} />
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="communication"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Communication</FormLabel>
            <Input placeholder="5" {...field} />
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="overall_rating"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Overall Rating</FormLabel>
            <Input placeholder="5" {...field} />
            <FormMessage />
          </FormItem>
        )}
      />
      <Button className="w-full" type="button" onClick={toggleReviewStatus}>
        {isApproved ? "Reject" : "Approve"}
      </Button>
    </EditorCard>
  );
}

export default ReviewEditorRatings;
