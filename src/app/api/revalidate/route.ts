import axios, { AxiosError } from "axios";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin-token")?.value;
    const payload = await request.json();

    const { data } = await axios.post(`${process.env.NEXT_PUBLIC_USER_ORIGIN}/api/revalidate`, payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "api-token": process.env.NEXT_USER_API_TOKEN,
      },
    });

    return NextResponse.json(data);
  } catch (error: any) {
    console.log(error);
    const axiosError: AxiosError = error;
    return NextResponse.json(axiosError.response?.data, { status: error?.response?.status });
  }
}
