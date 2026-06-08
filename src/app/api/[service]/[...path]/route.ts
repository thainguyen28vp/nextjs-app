import { NextRequest } from "next/server";
import { proxyHandler } from "@/lib/proxy";

type RouteParams = { params: Promise<{ path: string[]; service: string }> };

export const GET = (req: NextRequest, { params }: RouteParams) =>
  proxyHandler(req, params, "GET");

export const POST = (req: NextRequest, { params }: RouteParams) =>
  proxyHandler(req, params, "POST");

export const PUT = (req: NextRequest, { params }: RouteParams) =>
  proxyHandler(req, params, "PUT");

export const PATCH = (req: NextRequest, { params }: RouteParams) =>
  proxyHandler(req, params, "PATCH");

export const DELETE = (req: NextRequest, { params }: RouteParams) =>
  proxyHandler(req, params, "DELETE");
