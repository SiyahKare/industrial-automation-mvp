import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(_req: NextRequest) {
  // Her şeyi olduğu gibi geçir - auth devre dışı
  return NextResponse.next();
}

// Hiçbir route'a uygulama - tamamen pasif
export const config = { matcher: [] };

