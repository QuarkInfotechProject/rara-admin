import { Menu } from "@/types/menu.types";
import server from ".";

async function getAdminMenu(): Promise<Menu[]> {
  try {
    const request = await server();
    console.log("📡 Fetching menu from:", `${process.env.BASE_URL}/menu/active`);
    const {
      data: { data },
    } = await request.get(`/menu/active`);
    return data;
  } catch (error: any) {
    console.error("❌ getAdminMenu Error:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: `${process.env.BASE_URL}/menu/active`,
    });
    throw error;
  }
}

export default getAdminMenu;
