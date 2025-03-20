import jwt from "jsonwebtoken";
// app/api/auth/verify/route.ts
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const token = request.headers.get("authorization")?.split(" ")[1];

  if (!token) {
    return NextResponse.json({ error: "Token não fornecido" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    return NextResponse.json({ user: decoded }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Token inválido", erro: error },
      { status: 401 }
    );
  }
}
