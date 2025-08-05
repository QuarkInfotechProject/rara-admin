import axios, { AxiosError } from "axios";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "@/types/index.types";

interface Params {
  endpoint: string[];
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<Params> }
) {
  const { endpoint } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("admin-token")?.value;
  const searchParams = getSearchParamsAsObject(request.nextUrl.searchParams);

  try {
    const { data } = await axios.get<ApiResponse<any>>(
      `${process.env.BASE_URL}/${endpoint.join("/")}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        params: searchParams,
      }
    );
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("GET Error:", error);
    const axiosError: AxiosError = error;
    return NextResponse.json(
      axiosError.response?.data || { error: "Internal server error" },
      {
        status: axiosError.response?.status || 500,
      }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<Params> }
) {
  try {
    const { endpoint } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("admin-token")?.value;
    const searchParams = getSearchParamsAsObject(request.nextUrl.searchParams);

    // Check if the request contains FormData (for file uploads)
    const contentType = request.headers.get("content-type");
    let payload;
    let headers: Record<string, string> = {
      Authorization: `Bearer ${token}`,
    };

    if (contentType && contentType.includes("multipart/form-data")) {
      // Handle FormData for file uploads
      payload = await request.formData();
      // Don't set Content-Type header - let axios set it automatically with boundary
    } else {
      // Handle JSON payload
      payload = await request.json();
      headers["Content-Type"] = "application/json";
    }

    const { data } = await axios.post(
      `${process.env.BASE_URL}/${endpoint.join("/")}`,
      payload,
      {
        headers,
        params: searchParams,
      }
    );

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("POST Error:", error);
    const axiosError: AxiosError = error;
    return NextResponse.json(
      axiosError.response?.data || { error: "Internal server error" },
      {
        status: axiosError.response?.status || 500,
      }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<Params> }
) {
  try {
    const { endpoint } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("admin-token")?.value;
    const searchParams = getSearchParamsAsObject(request.nextUrl.searchParams);

    // Special handling for routes that don't support PUT - redirect to POST
    const endpointPath = endpoint.join("/");
    if (endpointPath.includes("change-status")) {
      console.warn(`PUT not supported for ${endpointPath}, using POST instead`);
      return await handlePostRequest(request, endpoint, token, searchParams);
    }

    // Check if the request contains FormData (for file uploads)
    const contentType = request.headers.get("content-type");
    let payload;
    let headers: Record<string, string> = {
      Authorization: `Bearer ${token}`,
    };

    if (contentType && contentType.includes("multipart/form-data")) {
      // Handle FormData for file uploads
      payload = await request.formData();
      // Don't set Content-Type header - let axios set it automatically with boundary
    } else {
      // Handle JSON payload
      payload = await request.json();
      headers["Content-Type"] = "application/json";
    }

    const { data } = await axios.put(
      `${process.env.BASE_URL}/${endpoint.join("/")}`,
      payload,
      {
        headers,
        params: searchParams,
      }
    );
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("PUT Error:", error);
    const axiosError: AxiosError = error;

    // If PUT is not supported, try POST as fallback
    if (axiosError.response?.status === 405) {
      console.warn("PUT method not allowed, attempting POST as fallback");
      try {
        const { endpoint } = await params;
        const cookieStore = await cookies();
        const token = cookieStore.get("admin-token")?.value;
        const searchParams = getSearchParamsAsObject(
          request.nextUrl.searchParams
        );
        return await handlePostRequest(request, endpoint, token, searchParams);
      } catch (fallbackError: any) {
        console.error("POST fallback failed:", fallbackError);
        const fallbackAxiosError: AxiosError = fallbackError;
        return NextResponse.json(
          fallbackAxiosError.response?.data || {
            error: "Both PUT and POST methods failed",
          },
          {
            status: fallbackAxiosError.response?.status || 500,
          }
        );
      }
    }

    return NextResponse.json(
      axiosError.response?.data || { error: "Internal server error" },
      {
        status: axiosError.response?.status || 500,
      }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<Params> }
) {
  try {
    const { endpoint } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("admin-token")?.value;
    const searchParams = getSearchParamsAsObject(request.nextUrl.searchParams);

    const { data } = await axios.delete(
      `${process.env.BASE_URL}/${endpoint.join("/")}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        params: searchParams,
      }
    );
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("DELETE Error:", error);
    const axiosError: AxiosError = error;
    return NextResponse.json(
      axiosError.response?.data || { error: "Internal server error" },
      {
        status: axiosError.response?.status || 500,
      }
    );
  }
}

// Helper function to handle POST requests (used for fallback)
async function handlePostRequest(
  request: NextRequest,
  endpoint: string[],
  token: string | undefined,
  searchParams: any
) {
  const contentType = request.headers.get("content-type");
  let payload;
  let headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
  };

  if (contentType && contentType.includes("multipart/form-data")) {
    payload = await request.formData();
  } else {
    payload = await request.json();
    headers["Content-Type"] = "application/json";
  }

  const { data } = await axios.post(
    `${process.env.BASE_URL}/${endpoint.join("/")}`,
    payload,
    {
      headers,
      params: searchParams,
    }
  );

  return NextResponse.json(data);
}

function getSearchParamsAsObject(params: URLSearchParams) {
  const paramsObject: any = {};

  for (const [key, value] of params.entries()) {
    paramsObject[key] = value;
  }

  return paramsObject;
}
