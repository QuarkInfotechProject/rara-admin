import { Menu } from "@/types/menu.types";
import server from ".";

async function getAdminMenu(): Promise<Menu[]> {
  const request = await server();
  const {
    data: { data },
  } = await request.get(`/menu/active`);
  return data;
}

export default getAdminMenu;
