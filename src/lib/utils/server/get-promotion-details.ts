import server from "@/lib/utils/server";
import { PromotionDetail } from "@/types/promotions.types";

async function getPromotionDetails(id: string | number): Promise<PromotionDetail | null> {
  try {
    const request = await server();
    const { data } = await request.get(`/promotion/detail/${id}`);

    return {
      id: Number(id),
      ...data.data,
      files: {
        promotionImageDesktop: data.data.promotionImageDesktop.id,
        promotionImageMobile: data.data.promotionImageMobile.id,
      },
    };
  } catch (error) {
    return null;
  }
}

export default getPromotionDetails;
