import { NextRequest } from "next/server";
import { NextResponse } from "next/server";



export function middleware(req: NextRequest){
    // ejemplo futuro: proteger /admin/* con cookies/session si usas middleware de Auth
  return NextResponse.next();
}