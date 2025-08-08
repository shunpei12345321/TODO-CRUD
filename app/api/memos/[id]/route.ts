// app/api/memos/[id]/route.ts
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { MemoRepository } from "@/app/_repositories/Memo";
import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/utils/prismaSingleton";

// メモ更新リクエストボディの型定義
interface MemoUpdateRequestBody {
  title?: string;
  items?: string | null;
  textContent?: string | null;
  images?: string | null;
  urls?: string | null;
  type?: "checklist" | "text";
}

// GET - 単一メモの取得
export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // 認証確認
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "認証が必要です" },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    const memoId = Number(id);

    if (isNaN(memoId)) {
      return NextResponse.json({ error: "無効なIDです" }, { status: 400 });
    }

    const memo = await MemoRepository.findById(memoId);

    if (!memo) {
      return NextResponse.json({ error: "メモが見つかりません" }, { status: 404 });
    }

    // ユーザー所有者確認のためのデータベースユーザー取得
    const dbUser = await prisma.user.findUnique({
      where: { supabaseId: user.id }
    });

    if (!dbUser || memo.userId !== dbUser.id) {
      return NextResponse.json(
        { error: "このメモを閲覧する権限がありません" },
        { status: 403 }
      );
    }

    return NextResponse.json(memo, { status: 200 });
  } catch (error) {
    console.error("メモ取得エラー:", error);
    return NextResponse.json(
      { error: "メモの取得に失敗しました" },
      { status: 500 }
    );
  }
}

// PUT - メモの更新
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // 認証確認
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "認証が必要です" },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    const memoId = Number(id);

    if (isNaN(memoId)) {
      return NextResponse.json({ error: "無効なIDです" }, { status: 400 });
    }

    // 既存のメモを取得して所有者確認
    const existingMemo = await MemoRepository.findById(memoId);
    if (!existingMemo) {
      return NextResponse.json({ error: "メモが見つかりません" }, { status: 404 });
    }

    // ユーザー所有者確認
    const dbUser = await prisma.user.findUnique({
      where: { supabaseId: user.id }
    });

    if (!dbUser || existingMemo.userId !== dbUser.id) {
      return NextResponse.json(
        { error: "このメモを編集する権限がありません" },
        { status: 403 }
      );
    }

    const { title, type, items, textContent, images, urls } = await req.json();

    if (!title || !title.trim()) {
      return NextResponse.json(
        { error: "タイトルは必須です" },
        { status: 400 }
      );
    }

    if (!["checklist", "text"].includes(type)) {
      return NextResponse.json({ error: "タイプが不正です" }, { status: 400 });
    }

    const updatedMemo = await MemoRepository.update(memoId, {
      title,
      type,
      items: type === "checklist" ? items || "" : "",
      textContent: type === "text" ? textContent || "" : "",
      images: images || "",
      urls: urls || "",
    });

    return NextResponse.json(updatedMemo);
  } catch (error) {
    console.error("メモ更新エラー:", error);
    return NextResponse.json(
      { error: "メモの更新に失敗しました" },
      { status: 500 }
    );
  }
}

// DELETE - メモの削除
export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // 認証確認
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "認証が必要です" },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    const memoId = Number(id);

    if (isNaN(memoId)) {
      return NextResponse.json({ error: "無効なIDです" }, { status: 400 });
    }

    // 既存のメモを取得して所有者確認
    const existingMemo = await MemoRepository.findById(memoId);
    if (!existingMemo) {
      return NextResponse.json({ error: "メモが見つかりません" }, { status: 404 });
    }

    // ユーザー所有者確認
    const dbUser = await prisma.user.findUnique({
      where: { supabaseId: user.id }
    });

    if (!dbUser || existingMemo.userId !== dbUser.id) {
      return NextResponse.json(
        { error: "このメモを削除する権限がありません" },
        { status: 403 }
      );
    }

    const deleted = await MemoRepository.deleteById(memoId);

    return NextResponse.json(
      { message: "メモが削除されました", deleted },
      { status: 200 }
    );
  } catch (error) {
    console.error("メモ削除エラー:", error);
    return NextResponse.json(
      { error: "メモの削除に失敗しました" },
      { status: 500 }
    );
  }
}