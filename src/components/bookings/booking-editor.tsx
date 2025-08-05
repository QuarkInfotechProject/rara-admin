"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Form } from "@/components/ui/form";
import { queryClient } from "@/lib/context/react-query-context";
import displayError from "@/lib/utils/display-error";
import { zodResolver } from "@hookform/resolvers/zod";
import BookingEditorBasicFields from "./booking-editor-basic-fields";
import BookingEditorGuestFields from "./booking-editor-guest-fields";
import BookingEditorOtherFields from "./booking-editor-other-fields";
import BookingEditorPublishControls from "./booking-editor-publish-controls";
import BookingEditorUserDetails from "./booking-editor-user-details";
import { BookingEditorSchema, bookingEditorSchema } from "./zod-schema";
import BookingEditorNotesFields from "./booking-editor-notes-fields";

interface Props {
  initialData?: any;
  edit?: boolean;
}

function BookingEditor({ initialData, edit }: Props) {
  const form = useForm<BookingEditorSchema>({
    resolver: zodResolver(bookingEditorSchema),
    defaultValues: {
      type: "booking",
      adult: 0,
      children: 0,
      infant: 0,
      ...initialData,
    },
  });
  const router = useRouter();

  async function handleSubmit(values: BookingEditorSchema) {
    try {
      await axios.post(edit ? `/api/booking/update` : "/api/booking/new", values);
      await queryClient.invalidateQueries({
        queryKey: ["bookings"],
      });
      toast.success("Booking updated successfully");
      !edit && router.push("/admin/bookings");
    } catch (error) {
      displayError(error, {});
    }
  }

  return (
    <Form {...form}>
      <form className="editor-grid-2" onSubmit={form.handleSubmit(handleSubmit)}>
        <div>
          <BookingEditorBasicFields />
          <BookingEditorNotesFields />
          <BookingEditorOtherFields />
        </div>
        <div>
          <BookingEditorPublishControls />
          <BookingEditorGuestFields />
          <BookingEditorUserDetails />
        </div>
      </form>
    </Form>
  );
}

export default BookingEditor;
