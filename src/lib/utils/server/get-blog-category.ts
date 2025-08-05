import server from "@/lib/utils/server";
import { BlogCategory } from "@/types/blog.types";

async function getBlogCategory(id: string): Promise<BlogCategory | null> {
  try {
    const request = await server();
    const { data } = await request.get(`/blog/category/detail/${id}`);
    return { id: Number(id), ...data.data };
  } catch (error) {
    return null;
  }
}

export default getBlogCategory;
