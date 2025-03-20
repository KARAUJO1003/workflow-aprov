"use server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function register(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  console.log("Registering user", name, email, password);

  const hashedPassword = await bcrypt.hash(password, 10);

  return await prisma.user
    .create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "USER", // or any default role you want to assign
      },
    })
    .then(() => {
      return {
        message: "Created sucessfully!",
        description: "User created successfully!",
      };
    })
    .catch((error) => {
      return {
        message: "Error",
        description: error.response.data.message,
        error: error.response.data,
      };
    });
}

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  console.log("Logging in user", email);

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new Error("No user found");
  }

  const passwordValid = await bcrypt.compare(password, user.password);

  if (!passwordValid) {
    throw new Error("Invalid password");
  }

  await fetch("http://localhost:3000/api/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
    }),
  })
    .then(async () => {
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
        expiresIn: "1h",
      });
      const hasCookie = (await cookies()).get("token") || null;

      if (hasCookie) {
        (await cookies()).delete("token");
      }

      (await cookies()).set("token", token, {
        httpOnly: true,
        path: "/",
      });
    })
    .finally(() => {
      redirect("/");
    });

  return {
    message: "Logged in",
    description: "User logged in successfully!",
  };
}
