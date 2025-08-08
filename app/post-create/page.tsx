import { createClient } from "@/utils/supabase/server";
// import PostForm from "../dashboard/_components/PostForm";
import { redirect } from "next/navigation";
import { UserRepository } from "../_repositories/User";
import PostForm from "./_components/PostForm";

export default async function Page() {
  const supabase = await createClient();

  const {
    data: { user: supabaseUser },
  } = await supabase.auth.getUser();

  if (!supabaseUser) {
    redirect("/login");
  }

  // Supabase ID から DB上の User を取得 or 作成
  let currentUser = await UserRepository.findBySupabaseId(supabaseUser.id);

  if (!currentUser) {
    currentUser = await UserRepository.createUser({
      name: supabaseUser.email?.split("@")[0] || "NoName",
      email: supabaseUser.email || "",
      supabaseId: supabaseUser.id,
    });
  }

  return (
    <div className="max-w-xl mx-auto mt-12 p-6 bg-white border rounded">
      <h1 className="text-2xl font-bold mb-4">新規投稿</h1>

      <PostForm />
    </div>
  );
}

// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import PostForm from "@/app/dashboard/_components/PostForm";

// type Props = {
//   userId: number;
// };

// export default function PostCreatePage({ userId }: Props) {
//   const router = useRouter();
//   const [title, setTitle] = useState("");
//   const [content, setContent] = useState("");
//   const [message, setMessage] = useState("");

//   //   const handleSubmit = async () => {
//   //     // 仮に userId=1（本来はログインユーザーのIDを渡す）
//   //     const res = await fetch("/api/posts", {
//   //       method: "POST",
//   //       headers: { "Content-Type": "application/json" },
//   //       body: JSON.stringify({ title, content, userId: 1 }),
//   //     });

//   //     if (res.ok) {
//   //       router.push("/dashboard");
//   //     } else {
//   //       setMessage("❌ 投稿に失敗しました");
//   //     }
//   //   };

//   const handleSubmit = async () => {
//     const res = await fetch("/api/posts", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ title, content, userId }),
//     });

//     if (res.ok) {
//       setTitle("");
//       setContent("");
//       setMessage("✅ 投稿が完了しました");
//     } else {
//       setMessage("❌ 投稿に失敗しました");
//     }
//   };

//   return (
//     <div className="max-w-xl mx-auto mt-12 p-6 bg-white border rounded">
//       <h1 className="text-2xl font-bold mb-4">新規投稿</h1>
//       <input
//         type="text"
//         placeholder="タイトル"
//         className="border p-2 w-full mb-3"
//         value={title}
//         onChange={(e) => setTitle(e.target.value)}
//       />
//       <textarea
//         placeholder="本文"
//         className="border p-2 w-full mb-3"
//         value={content}
//         onChange={(e) => setContent(e.target.value)}
//       />
//       <div className="flex justify-between items-center">
//         <button
//           onClick={() => router.push("/dashboard")}
//           className="text-gray-500 hover:underline"
//         >
//           ← 戻る
//         </button>
//         <button
//           onClick={handleSubmit}
//           className="bg-blue-600 text-white px-4 py-2 rounded"
//         >
//           投稿する
//         </button>
//       </div>
//       {message && <p className="mt-2 text-sm text-red-500">{message}</p>}
//     </div>
//   );
// }
