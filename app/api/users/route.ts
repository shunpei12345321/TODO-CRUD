export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { UserRepository } from "@/app/_repositories/User";

export async function GET() {
  const users = await UserRepository.findMany();
  return NextResponse.json(users);
}

export async function POST(req: NextRequest) {
  try {
    const { name, email, supabaseId } = await req.json();

    if (!email || !supabaseId) {
      return NextResponse.json(
        { error: "メールとsupabaseIdは必須です" },
        { status: 400 }
      );
    }

    const user = await UserRepository.createUser({
      name,
      email,
      supabaseId,
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error("POST /api/users error:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
