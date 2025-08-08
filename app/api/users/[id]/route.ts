export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { UserRepository } from "@/app/_repositories/User";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const userId = Number(id);

  if (isNaN(userId)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  const user = await UserRepository.findUnique(userId);

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(user, { status: 200 });
}

// export async function GET(_req: NextRequest, context: any) {

//   const id = Number(context.params.id);

//   if (isNaN(id)) {
//     return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
//   }

//   const user = await UserRepository.findUnique(id);

//   if (!user) {
//     return NextResponse.json({ error: "User not found" }, { status: 404 });
//   }

//   return NextResponse.json(user, { status: 200 });
// }

// 下👇この書き方だと警告が出る
// export async function PUT(req: NextRequest, context: any) {
//   const id = Number(context.params.id);
//   const { name, email } = await req.json();

//   if (!name || !email) {
//     return NextResponse.json(
//       { error: "名前とメールが必要です" },
//       { status: 400 }
//     );
//   }

//   try {
//     const updated = await UserRepository.update(id, { name, email });
//     return NextResponse.json(updated, { status: 200 });
//   } catch (e) {
//     console.error("PUT error:", e);
//     return NextResponse.json({ error: "更新に失敗しました" }, { status: 500 });
//   }
// }

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params; // ← ここで await
  const userId = Number(id);
  const { name, email } = await req.json();

  if (!name || !email) {
    return NextResponse.json(
      { error: "名前とメールが必要です" },
      { status: 400 }
    );
  }

  try {
    const updated = await UserRepository.update(userId, { name, email });
    return NextResponse.json(updated, { status: 200 });
  } catch (e) {
    console.error("PUT error:", e);
    return NextResponse.json({ error: "更新に失敗しました" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, context: any) {
  const id = Number(context.params.id);

  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    const deletedUser = await UserRepository.deleteById(id);
    return NextResponse.json(deletedUser, { status: 200 });
  } catch (error) {
    console.error("DELETE error:", error);
    return NextResponse.json({ error: "削除に失敗しました" }, { status: 500 });
  }
}
