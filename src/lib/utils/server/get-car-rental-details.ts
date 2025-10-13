  import server from "@/lib/utils/server";
  import { CarRental } from "@/types/carRental.types";

  async function getCarRentalDetails(id: string): Promise<CarRental | null> {
    try {
      const request = await server();
      const { data } = await request.get(`/car-rental/detail/${id}`);
      return {
        id: Number(id),
        ...data.data,
      };
    } catch (error) {
      return null;
    }
  }

  export default getCarRentalDetails;
