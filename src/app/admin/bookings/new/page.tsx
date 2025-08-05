import BookingEditor from "@/components/bookings/booking-editor";
import PageTitle from "@/components/page-title";

function NewBooking() {
  return (
    <div>
      <PageTitle title="New Booking" prevPage="./" />
      <BookingEditor />
    </div>
  );
}

export default NewBooking;
