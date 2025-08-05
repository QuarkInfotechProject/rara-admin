import server from "@/lib/utils/server";
import { User } from "@/types/users.types";
import countries from "@/data/countries.json";

async function getUserDetails(id: string | number): Promise<User | null> {
  try {
    const request = await server();
    const { data } = await request.get(`/user/view/${id}`);
    const country = countries.find((country) => country.code === data.data.country);
    return { ...data.data, country: country?.name ?? data.data.country };
  } catch (error) {
    return null;
  }
}

export default getUserDetails;
