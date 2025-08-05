import server from "@/lib/utils/server";
import { Amenity } from "@/types/products.types";

async function getAmenityDetails(id: string): Promise<Amenity | null> {
  try {
    const request = await server();
    const { data } = await request.get(`/amenity/detail/${id}`);

    return {
      id: Number(id),
      ...data.data,
    };
  } catch (error) {
    return null;
  }
}

export default getAmenityDetails;
