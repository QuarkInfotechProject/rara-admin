import server from "@/lib/utils/server";
import { Manager } from "@/types/products.types";

async function getManagerDetails(id: string): Promise<Manager | null> {
  try {
    const request = await server();
    const { data } = await request.get(`/manager/detail/${id}`);

    return {
      id: Number(id),
      ...data.data,
    };
  } catch (error) {
    return null;
  }
}

export default getManagerDetails;
