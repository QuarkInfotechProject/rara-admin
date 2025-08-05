import server from "@/lib/utils/server";
import { Booking } from "@/types/bookings.types";

async function getBookingDetails(id: string): Promise<Booking | null> {
  try {
    const request = await server();
    const { data } = await request.get(`/booking/update/detail/${id}`);
    return {
      id: Number(id),
      ...data.data,
    };
  } catch (error) {
    return null;
  }
}

export default getBookingDetails;
