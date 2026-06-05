// app/api/[...path]/route.ts

import { auth } from "@/auth";
import { sendRequest } from "@/utils/api";
import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.API_URL;

/**
 * Các path prefix không cần đính kèm token (public APIs).
 * Ví dụ: login, refresh-token, register, ...
 */
const PUBLIC_PATH_PREFIXES = ["user/login", "auth/", "public/", "assets/"];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATH_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

async function buildHeaders(
  pathname: string,
  reqHeaders: Headers,
): Promise<Record<string, string>> {
  const headers: Record<string, string> = {};

  // Chuyển tiếp một số header từ client nếu cần (tuỳ chỉnh thêm)
  const platform = reqHeaders.get("platform");
  if (platform) headers["platform"] = platform;

  if (!isPublicPath(pathname)) {
    const session = await auth();
    console.log("sessio8a8a8aa8n", session);

    const token = (session?.user as any)?.accessToken;
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  return headers;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const pathname = path.join("/");
  const searchParams = req.nextUrl.searchParams;
  const backendUrl = `${API_URL}/${pathname}`;

  const headers = await buildHeaders(pathname, req.headers);

  const data = await sendRequest({
    url: backendUrl,
    method: "GET",
    headers,
    queryParams: Object.fromEntries(searchParams.entries()),
  });

  return NextResponse.json(data);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const pathname = path.join("/");
  const backendUrl = `${API_URL}/${pathname}`;

  const body = await req.json().catch(() => undefined);
  const headers = await buildHeaders(pathname, req.headers);

  const data = await sendRequest({
    url: backendUrl,
    method: "POST",
    headers,
    body,
  });

  return NextResponse.json(data);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const pathname = path.join("/");
  const backendUrl = `${API_URL}/${pathname}`;

  const body = await req.json().catch(() => undefined);
  const headers = await buildHeaders(pathname, req.headers);

  const data = await sendRequest({
    url: backendUrl,
    method: "PUT",
    headers,
    body,
  });

  return NextResponse.json(data);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const pathname = path.join("/");
  const backendUrl = `${API_URL}/${pathname}`;

  const body = await req.json().catch(() => undefined);
  const headers = await buildHeaders(pathname, req.headers);

  const data = await sendRequest({
    url: backendUrl,
    method: "PATCH",
    headers,
    body,
  });

  return NextResponse.json(data);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const pathname = path.join("/");
  const searchParams = req.nextUrl.searchParams;
  const backendUrl = `${API_URL}/${pathname}`;

  const headers = await buildHeaders(pathname, req.headers);

  const data = await sendRequest({
    url: backendUrl,
    method: "DELETE",
    headers,
    queryParams: Object.fromEntries(searchParams.entries()),
  });

  return NextResponse.json(data);
}
