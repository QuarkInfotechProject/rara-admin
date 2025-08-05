import { notFound } from "next/navigation";
import BookingEditor from "@/components/bookings/booking-editor";
import PageTitle from "@/components/page-title";
import getBookingDetails from "@/lib/utils/server/get-booking-details";

interface Props {
  searchParams: Promise<{
    id: string;
  }>;
}

async function EditBooking({ searchParams }: Props) {
  const { id } = await searchParams;
  const data = await getBookingDetails(id);

  if (!data) {
    notFound();
  }

  return (
    <div>
      <PageTitle title="Edit Booking" prevPage="./" />
      <BookingEditor edit initialData={data} />
    </div>
  );
}

export default EditBooking;
export const dynamic = "force-dynamic";
