import server from "@/lib/utils/server";
import { FAQ } from "@/types/faqs.types";

async function getFAQDetails(id: string): Promise<FAQ | null> {
  try {
    const request = await server();
    const { data } = await request.get(`/faqs/detail/${id}`);

    return {
      id: Number(id),
      ...data.data,
    };
  } catch (error) {
    return null;
  }
}

export default getFAQDetails;
