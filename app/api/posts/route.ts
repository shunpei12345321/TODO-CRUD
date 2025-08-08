// app/api/posts/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PostRepository } from "@/app/_repositories/Post";
import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/utils/prismaSingleton";

export async function GET() {
  const posts = await PostRepository.findMany();
  return NextResponse.json(posts);
}

export async function POST(req: NextRequest) {
  const { title, content } = await req.json();

  if (!title || !content) {
    return NextResponse.json(
      { error: "タイトルと内容は必須です" },
      { status: 400 }
    );
  }

  try {
    // Supabaseから認証情報を取得
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "認証が必要です" },
        { status: 401 }
      );
    }

    // データベースからユーザーIDを取得
    const dbUser = await prisma.user.findUnique({
      where: { supabaseId: user.id }
    });

    if (!dbUser) {
      return NextResponse.json(
        { error: "ユーザーが見つかりません" },
        { status: 404 }
      );
    }

    const newPost = await PostRepository.create({ 
      title, 
      content, 
      userId: dbUser.id 
    });
    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error("投稿作成エラー:", error);
    return NextResponse.json(
      { error: "投稿作成に失敗しました" },
      { status: 500 }
    );
  }
}
