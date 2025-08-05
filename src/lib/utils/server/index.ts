import axios from "axios";
import { cookies } from "next/headers";

async function server() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin-token")?.value;
  const server = axios.create({
    baseURL: process.env.BASE_URL,
    fetchOptions: {
      cache: "no-cache",
    },
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return server;
}

export default server;
