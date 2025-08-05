import axios from "axios";
import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import displayError from "@/lib/utils/display-error";
import EditorCard from "../editor-card";
import { FormData } from "./zod-schema";

function ReviewEditorReply() {
  const form = useFormContext<FormData>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const reviewId = form.watch("id");
  const replyToPublicReview = form.watch("reply_to_public_review");

  async function handleReply() {
    try {
      setIsSubmitting(true);
      await axios.post("/api/review/reply", {
        id: reviewId,
        reply: replyToPublicReview,
      });
    } catch (error) {
      displayError(error, { fallback: "Failed to reply" });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <EditorCard title="Reply">
      <FormField
        control={form.control}
        name="reply_to_public_review"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Reply To Public Review</FormLabel>
            <FormControl>
              <Textarea placeholder="Write your reply here" {...field} disabled={false} value={field.value ?? ""} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <Button type="button" onClick={handleReply} loading={isSubmitting} disabled={isSubmitting}>
        Reply
      </Button>
    </EditorCard>
  );
}

export default ReviewEditorReply;
