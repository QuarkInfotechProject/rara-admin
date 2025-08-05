import { addDays } from "date-fns";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  try {
    const res = await fetch(`${process.env.BASE_URL}/login`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const data = await res.json();

    if (res.ok) {
      const tokenValue = data.data.token;
      const expiresAt = addDays(new Date(), 30);
      const cookieStore = await cookies();
      cookieStore.set({
        name: "admin-token",
        value: tokenValue,
        httpOnly: true,
        sameSite: true,
        secure: true,
        path: "/",
        expires: expiresAt,
      });
      return NextResponse.json(data);
    } else {
      throw Error(data.error ?? "Something went wrong");
    }
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: String(error),
      },
      {
        status: 500,
      }
    );
  }
}
