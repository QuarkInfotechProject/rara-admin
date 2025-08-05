import server from "@/lib/utils/server";
import { ReviewDetail } from "@/types/reviews.types";

async function getReviewDetails(id: string | number): Promise<ReviewDetail | null> {
  try {
    const request = await server();
    const { data } = await request.get(`/review/detail/${id}`);

    return {
      id: Number(id),
      ...data.data,
    };
  } catch (error) {
    return null;
  }
}

export default getReviewDetails;
