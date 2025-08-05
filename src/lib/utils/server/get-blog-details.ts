import server from "@/lib/utils/server";
import { BlogMediaCoverage, BlogPost, BlogReport } from "@/types/blog.types";

async function getBlogDetails(id: string): Promise<BlogPost | BlogReport | BlogMediaCoverage | null> {
  try {
    const request = await server();
    const { data } = await request.get(`/blog/detail/${id}`);

    return {
      id: Number(id),
      ...data.data,
      blog_category_id: data.data?.blog_category,
      admin_user_id: data.data?.admin_user,
      related_product: data.data?.related_products,
      files: {
        featuredImage: data.data?.featured_image?.id,
        mediaImage: data.data.media_image?.id,
        report: data.data?.report?.id,
      },
    };
  } catch (error) {
    return null;
  }
}

export default getBlogDetails;
