import server from "@/lib/utils/server";
import { Tag } from "@/types/products.types";

async function getProductTagDetails(id: string): Promise<Tag | null> {
  try {
    const request = await server();
    const { data } = await request.get(`/tag/detail/${id}`);

    return {
      id: Number(id),
      ...data.data,
      files: {
        tagProfile: data.data?.tagProfile?.id,
      },
    };
  } catch (error) {
    return null;
  }
}

export default getProductTagDetails;
