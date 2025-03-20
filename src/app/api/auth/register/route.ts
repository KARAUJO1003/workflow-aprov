import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { name, email, password, role } = await request.json();

  if (!name || !email || !password || !role) {
    return NextResponse.json(
      { message: "Please fill all fields!" },
      { status: 400 }
    );
  }

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password,
      role,
    },
  });

  return NextResponse.json(
    { message: "Created sucessfully!", user },
    { status: 201 }
  );
}
