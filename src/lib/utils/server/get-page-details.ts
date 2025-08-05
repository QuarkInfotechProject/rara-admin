import server from "@/lib/utils/server";
import { Page } from "@/types/pages.types";

async function getPageDetails(type: string): Promise<Page | null> {
  try {
    const request = await server();
    const { data } = await request.get(`/page/detail/${type}`);

    return {
      ...data.data,
      type,
      files: {
        featuredImage: data.data?.featured_image?.id,
      },
    };
  } catch (error) {
    return null;
  }
}

export default getPageDetails;
