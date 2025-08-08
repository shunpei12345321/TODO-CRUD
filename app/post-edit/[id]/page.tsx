export const dynamic = "force-dynamic";
import { PostRepository } from "@/app/_repositories/Post";
import PostEditForm from "./_components/PostEditForm";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export default async function PostEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // 認証チェック
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }

  const resolvedParams = await params;
  const postId = Number(resolvedParams.id);

  if (isNaN(postId)) {
    notFound();
  }

  const post = await PostRepository.findById(postId);

  if (!post) {
    notFound();
  }

  if (!post.user) {
    notFound();
  }

  // 投稿の所有者のみ編集可能
  if (post.user.supabaseId !== user.id) {
    redirect("/dashboard");
  }

  return (
    <div className="max-w-xl mx-auto mt-12 p-6 bg-white border rounded">
      <h1 className="text-2xl font-bold mb-4">投稿詳細</h1>
      {/*  */}
      <PostEditForm
        post={
          post as {
            id: number;
            title: string;
            content: string;
            user: {
              supabaseId: string;
              name: string | null;
            };
          }
          // 型を直接かく
        }
      />
    </div>
  );
}
