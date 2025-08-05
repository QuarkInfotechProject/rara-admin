import server from "@/lib/utils/server";
import { AdminUser } from "@/types/users.types";

async function getAdminUserDetails(uuid: string): Promise<AdminUser | null> {
  try {
    const request = await server();
    const { data } = await request.get(`/users/show/${uuid}`);
    return {
      ...data.data,
      name: data.data.fullName,
    };
  } catch (error) {
    return null;
  }
}

export default getAdminUserDetails;
