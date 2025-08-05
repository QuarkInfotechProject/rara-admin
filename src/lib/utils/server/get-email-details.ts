import server from "@/lib/utils/server";
import { Email } from "@/types/emails.types";

async function getEmailDetails(name: string): Promise<Email | null> {
  try {
    const request = await server();
    const { data } = await request.get(`/emails/show/${name}`);
    return {
      name,
      ...data.data,
    };
  } catch (error) {
    return null;
  }
}

export default getEmailDetails;
