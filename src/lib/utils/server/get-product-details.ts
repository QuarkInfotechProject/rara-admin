import server from "@/lib/utils/server";

async function getProductDetails(
  id: string,
  type: "homestay" | "experience" | "circuit" | "package"
): Promise<any | null> {
  try {
    const request = await server();
    const { data } = await request.get(`/product/${type}/detail/${id}`);
    return {
      ...data.data,
      cornerstone: data.data.cornerstone ? 1 : 0,
      is_occupied: data.data.is_occupied ? 1 : 0,
      display_homepage: data.data.display_homepage ? 1 : 0,
    };
  } catch (error) {
    return null;
  }
}

export default getProductDetails;
