import server from "@/lib/utils/server";
import { CTA } from "@/types/cta.types";

async function getCTADetails(id: string): Promise<CTA | null> {
  try {
    const request = await server();
    const { data } = await request.get(`/cta/detail/${id}`);

    return {
      id: Number(id),
      ...data.data,
    };
  } catch (error) {
    return null;
  }
}

export default getCTADetails;
