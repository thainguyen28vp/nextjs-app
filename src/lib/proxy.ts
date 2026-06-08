import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { sendRequest } from "@/lib/api";

const API_MAP = {
  dashboard: process.env.API_URL,
  erp: process.env.ERP_API,
  report: process.env.REPORT_API,
  hrm: process.env.HRM_API,
};

const PUBLIC_PATH_PREFIXES = ["user/login", "auth/", "public/", "assets/"];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATH_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

async function buildHeaders(
  pathname: string,
  reqHeaders: Headers
): Promise<Record<string, string>> {
  const headers: Record<string, string> = {};

  const platform = reqHeaders.get("platform");
  if (platform) headers["platform"] = platform;

  if (!isPublicPath(pathname)) {
    const session = await auth();
    const token = (session?.user as any)?.accessToken;
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  return headers;
}

export async function proxyHandler(
  req: NextRequest,
  paramsPromise: Promise<{ path: string[]; service: string }>,
  method: string
) {
  const { path, service } = await paramsPromise;
  const pathname = path.join("/");
  const searchParams = req.nextUrl.searchParams;



  const baseUrl = API_MAP[service as keyof typeof API_MAP];
  if (!baseUrl) {
    return NextResponse.json({ error: "Service not found" }, { status: 404 });
  }
  const backendUrl = `${baseUrl}/${service}/${pathname}`;


  const headers = await buildHeaders(pathname, req.headers);

  let body;
  if (method !== "GET" && method !== "DELETE") {
    body = await req.json().catch(() => undefined);
  }


  try {
    console.log("Response data:", backendUrl);

    const data = await sendRequest({
      url: backendUrl,
      method,
      headers,
      body,
      queryParams: Object.fromEntries(searchParams.entries()),
    });

    return NextResponse.json(data);
  } catch (error: any) {
    console.error(`PROXY ERROR (Failed to call Backend ${backendUrl}):`, error);
    return NextResponse.json({
      error: error.message || "Lỗi gọi Backend",
      backendUrl
    }, { status: 500 });
  }
}
