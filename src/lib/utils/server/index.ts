import axios from "axios";
import { cookies } from "next/headers";

async function server() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin-token")?.value;

  // Debug logging
  console.log("🔐 Token check:", {
    hasToken: !!token,
    tokenLength: token?.length,
    tokenPreview: token ? `${token.substring(0, 20)}...` : "undefined",
  });

  // If no token, throw an error that will be caught by error boundary
  if (!token) {
    const error = new Error("Authentication required");
    (error as any).code = "UNAUTHENTICATED";
    throw error;
  }

  const server = axios.create({
    baseURL: process.env.BASE_URL,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return server;
}

export default server;
