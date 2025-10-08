import server from "@/lib/utils/server";
import { ProductCategory } from "@/types/blog.types";

async function getBlogCategory(id: string): Promise<ProductCategory | null> {
  try {
    const request = await server();
    const { data } = await request.get(`/category/detail/${id}`);
    return { id: Number(id), ...data.data };
  } catch (error) {
    return null;
  }
}

export default getBlogCategory;
