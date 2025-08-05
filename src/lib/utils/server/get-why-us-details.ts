import server from "@/lib/utils/server";
import { WhyUs } from "@/types/why-us.types";

async function getWhyUsDetails(id: string | number): Promise<WhyUs | null> {
  try {
    const request = await server();
    const { data } = await request.get(`/why-us/detail/${id}`);

    return {
      id: Number(id),
      ...data.data,
      files: { whyUsImage: data.data.whyUsImage.id },
    };
  } catch (error) {
    return null;
  }
}

export default getWhyUsDetails;
