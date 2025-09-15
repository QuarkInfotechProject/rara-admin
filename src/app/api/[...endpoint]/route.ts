import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "@/types/index.types";

interface Params {
  endpoint: string[];
}

// Create axios instance with better defaults
const apiClient = axios.create({
  timeout: 30000, // 30 seconds timeout
  headers: {
    Connection: "keep-alive",
    "Keep-Alive": "timeout=5, max=1000",
  },
  // Retry configuration
  maxRedirects: 3,
});

// Add retry interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;

    // Don't retry if we've already retried or if it's not a network error
    if (!config || config.__isRetryRequest || !isRetryableError(error)) {
      return Promise.reject(error);
    }

    // Mark as retry attempt
    config.__isRetryRequest = true;

    // Wait before retry (exponential backoff)
    const retryCount = config.__retryCount || 0;
    const delay = Math.pow(2, retryCount) * 1000; // 1s, 2s, 4s...

    if (retryCount < 3) {
      config.__retryCount = retryCount + 1;
      console.log(
        `Retrying request (attempt ${config.__retryCount}/3) after ${delay}ms`
      );

      await new Promise((resolve) => setTimeout(resolve, delay));
      return apiClient.request(config);
    }

    return Promise.reject(error);
  }
);

// Helper function to determine if error is retryable
function isRetryableError(error: AxiosError): boolean {
  if (!error.code) return false;

  const retryableCodes = [
    "ECONNRESET",
    "ECONNREFUSED",
    "ENOTFOUND",
    "ECONNABORTED",
    "ETIMEDOUT",
    "ENETUNREACH",
  ];

  return retryableCodes.includes(error.code);
}

// Helper function to create axios config
async function createAxiosConfig(
  token: string | undefined,
  searchParams: any
): Promise<AxiosRequestConfig> {
  return {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    params: searchParams,
    timeout: 30000, // 30 second timeout per request
    validateStatus: (status) => status < 500, // Don't throw on 4xx errors
  };
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<Params> }
) {
  const { endpoint } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("admin-token")?.value;
  const searchParams = getSearchParamsAsObject(request.nextUrl.searchParams);

  if (!process.env.BASE_URL) {
    console.error("❌ BASE_URL environment variable is not set!");
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 }
    );
  }

  const url = `${process.env.BASE_URL}/${endpoint.join("/")}`;
  console.log("🌐 GET request to:", url);

  try {
    const config = await createAxiosConfig(token, searchParams);
    const { data } = await apiClient.get<ApiResponse<any>>(url, config);

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("GET Error:", {
      message: error.message,
      code: error.code,
      url,
      status: error.response?.status,
    });

    // Handle specific error cases
    if (error.code === "ECONNRESET" || error.code === "ECONNABORTED") {
      return NextResponse.json(
        { error: "Connection to API server failed. Please try again." },
        { status: 503 } // Service Unavailable
      );
    }

    if (error.code === "ETIMEDOUT") {
      return NextResponse.json(
        { error: "Request timeout. The API server took too long to respond." },
        { status: 504 } // Gateway Timeout
      );
    }

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

    if (!process.env.BASE_URL) {
      console.error("❌ BASE_URL environment variable is not set!");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
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

    const url = `${process.env.BASE_URL}/${endpoint.join("/")}`;
    console.log("🌐 POST request to:", url);

    const { data } = await apiClient.post(url, payload, {
      headers,
      params: searchParams,
      timeout: 60000, // 60 seconds for POST requests (might include file uploads)
    });

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("POST Error:", {
      message: error.message,
      code: error.code,
      status: error.response?.status,
    });

    // Handle specific error cases
    if (error.code === "ECONNRESET" || error.code === "ECONNABORTED") {
      return NextResponse.json(
        { error: "Connection to API server failed. Please try again." },
        { status: 503 }
      );
    }

    if (error.code === "ETIMEDOUT") {
      return NextResponse.json(
        { error: "Request timeout. The operation took too long to complete." },
        { status: 504 }
      );
    }

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

    if (!process.env.BASE_URL) {
      console.error("❌ BASE_URL environment variable is not set!");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

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

    const url = `${process.env.BASE_URL}/${endpoint.join("/")}`;
    console.log("🌐 PUT request to:", url);

    const { data } = await apiClient.put(url, payload, {
      headers,
      params: searchParams,
      timeout: 60000, // 60 seconds for PUT requests
    });

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("PUT Error:", {
      message: error.message,
      code: error.code,
      status: error.response?.status,
    });

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

    // Handle connection errors
    if (error.code === "ECONNRESET" || error.code === "ECONNABORTED") {
      return NextResponse.json(
        { error: "Connection to API server failed. Please try again." },
        { status: 503 }
      );
    }

    if (error.code === "ETIMEDOUT") {
      return NextResponse.json(
        { error: "Request timeout. The operation took too long to complete." },
        { status: 504 }
      );
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

    if (!process.env.BASE_URL) {
      console.error("❌ BASE_URL environment variable is not set!");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    const url = `${process.env.BASE_URL}/${endpoint.join("/")}`;
    console.log("🌐 DELETE request to:", url);

    const { data } = await apiClient.delete(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      params: searchParams,
      timeout: 30000, // 30 seconds for DELETE requests
    });

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("DELETE Error:", {
      message: error.message,
      code: error.code,
      status: error.response?.status,
    });

    // Handle connection errors
    if (error.code === "ECONNRESET" || error.code === "ECONNABORTED") {
      return NextResponse.json(
        { error: "Connection to API server failed. Please try again." },
        { status: 503 }
      );
    }

    if (error.code === "ETIMEDOUT") {
      return NextResponse.json(
        { error: "Request timeout. The operation took too long to complete." },
        { status: 504 }
      );
    }

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

  const url = `${process.env.BASE_URL}/${endpoint.join("/")}`;
  console.log("🌐 POST fallback request to:", url);

  const { data } = await apiClient.post(url, payload, {
    headers,
    params: searchParams,
    timeout: 60000, // 60 seconds
  });

  return NextResponse.json(data);
}

function getSearchParamsAsObject(params: URLSearchParams) {
  const paramsObject: any = {};

  for (const [key, value] of params.entries()) {
    paramsObject[key] = value;
  }

  return paramsObject;
}
