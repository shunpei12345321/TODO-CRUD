export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { PostRepository } from "@/app/_repositories/Post";
import { createClient } from "@/utils/supabase/server";
// import { getPostById, updatePostById, deletePostById } from "../../../_repositories/Post";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const postId = Number(id);

  if (isNaN(postId)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  const post = await PostRepository.findById(postId);

  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  return NextResponse.json(post, { status: 200 });
}

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
    const postId = Number(id);

    if (isNaN(postId)) {
      return NextResponse.json({ error: "無効なIDです" }, { status: 400 });
    }

    // 既存の投稿を取得して所有者確認
    const existingPost = await PostRepository.findById(postId);
    if (!existingPost) {
      return NextResponse.json({ error: "投稿が見つかりません" }, { status: 404 });
    }

    // 所有者確認（SupabaseのユーザーIDと投稿の所有者を比較）
    if (existingPost.user?.supabaseId !== user.id) {
      return NextResponse.json(
        { error: "この投稿を編集する権限がありません" },
        { status: 403 }
      );
    }

    const { title, content } = await req.json();

    if (!title || !content) {
      return NextResponse.json(
        { error: "タイトルと内容は必須です" },
        { status: 400 }
      );
    }

    const updated = await PostRepository.update(postId, {
      title,
      content,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("投稿更新エラー:", error);
    return NextResponse.json(
      { error: "投稿更新に失敗しました" },
      { status: 500 }
    );
  }
}

// 👇認可前
export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const postId = Number(id);

  if (isNaN(postId)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  const deleted = await PostRepository.deletePostById(postId);

  if (!deleted) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  return NextResponse.json(
    { message: "Post deleted successfully" },
    { status: 200 }
  );
}

// 👇認可処理後
// export async function DELETE(
//   _req: Request,
//   { params }: { params: { postId: string } }
// ) {
//   const supabase = await createClient();
//   const {
//     data: { user },
//   } = await supabase.auth.getUser();

//   if (!user) {
//     return NextResponse.json({ error: "未認証" }, { status: 401 });
//   }

//   const id = Number(params.postId);

//   // PostRepository を使って投稿を取得
//   const post = await PostRepository.findById(id);

//   // 投稿が存在しない、または自分の投稿でない場合は拒否
//   if (!post || String(post.userId) !== user.id) {
//     return NextResponse.json(
//       { error: "削除権限がありません" },
//       { status: 403 }
//     );
//   }

//   // 削除実行
//   const deleted = await PostRepository.deletePostById(id);
//   return NextResponse.json(deleted);
// }
