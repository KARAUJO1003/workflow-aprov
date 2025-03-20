import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return NextResponse.json(
      { error: "Credenciais inválidas" },
      { status: 401 }
    );
  }

  const response = NextResponse.json(
    {
      message: "Login realizado com sucesso!",
      user,
    },
    { status: 200 }
  );

  return response;
}
