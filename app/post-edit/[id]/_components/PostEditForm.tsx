"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
// import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { createClient } from "@/utils/supabase/client";

// const supabase = createClient();

type Props = {
  post: {
    id: number;
    title: string;
    content: string;
    user: {
      supabaseId: string;
      name: string | null;
    };
  };
};

export default function PostEditForm({ post }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const [message, setMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setCurrentUserId(user?.id || null);
    });
  }, []);

  const handleUpdate = async () => {
    if (!title.trim() || !content.trim()) {
      setMessage("❌ タイトルと内容は必須です");
      return;
    }

    try {
      const res = await fetch(`/api/posts/${post.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });

      if (res.ok) {
        setMessage("✅ 更新しました");
        setIsEditing(false);
        setTimeout(() => setMessage(""), 3000);
      } else {
        const errorData = await res.json();
        setMessage(`❌ ${errorData.error || "更新に失敗しました"}`);
      }
    } catch (error) {
      setMessage("❌ 更新に失敗しました");
    }
  };

  const handleDelete = async () => {
    const confirmed = confirm("本当に削除しますか？");
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/posts/${post.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        router.push("/dashboard");
      } else {
        const errorData = await res.json();
        setMessage(`❌ ${errorData.error || "削除に失敗しました"}`);
      }
    } catch (error) {
      setMessage("❌ 削除に失敗しました");
    }
  };

  return (
    <>
      {/* 投稿内容 */}
      {isEditing ? (
        <>
          <input
            type="text"
            className="border p-2 w-full mb-3"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className="border p-2 w-full mb-3"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </>
      ) : (
        <>
          <h2 className="text-xl font-bold mb-2">{title}</h2>
          <p className="mb-3 whitespace-pre-wrap">{content}</p>
        </>
      )}

      {/* 戻る + 編集・削除ボタン（投稿者本人のみ） */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => router.push("/dashboard")}
          className="text-gray-500 hover:underline"
        >
          ← 戻る
        </button>

        {/* 投稿者本人だけに編集削除ボタンを表示 */}
        {/* {currentUserId &&
          post.userId === currentUserId && */}
        {/* 比較のカラムを間違えている */}
        {currentUserId &&
          post.user?.supabaseId === currentUserId &&
          (isEditing ? (
            <div className="space-x-2">
              <button
                onClick={() => setIsEditing(false)}
                className="text-gray-500 hover:underline"
              >
                キャンセル
              </button>
              <button
                onClick={handleUpdate}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                更新する
              </button>
            </div>
          ) : (
            <div className="flex gap-4 mt-4">
              <button
                onClick={() => setIsEditing(true)}
                className="bg-gray-300 text-black px-4 py-2 rounded"
              >
                編集する
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                削除する
              </button>
            </div>
          ))}
      </div>

      {/* {isEditing ? (
        <>
          <input
            type="text"
            className="border p-2 w-full mb-3"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className="border p-2 w-full mb-3"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </>
      ) : (
        <>
          <h2 className="text-xl font-bold mb-2">{title}</h2>
          <p className="mb-3 whitespace-pre-wrap">{content}</p>
        </>
      )}

      <div className="flex justify-between items-center">
        <button
          onClick={() => router.push("/dashboard")}
          className="text-gray-500 hover:underline"
        >
          ← 戻る
        </button>
        {isEditing ? (
          <div className="space-x-2">
            <button
              onClick={() => setIsEditing(false)}
              className="text-gray-500 hover:underline"
            >
              キャンセル
            </button>
            <button
              onClick={handleUpdate}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              更新する
            </button>
          </div>
        ) : (
          <div className="flex gap-4 mt-4">
            <button
              onClick={() => setIsEditing(true)}
              className="bg-gray-300 text-black px-4 py-2 rounded"
            >
              編集する
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-600 text-white px-4 py-2 rounded"
            >
              削除する
            </button>
          </div>
        )} */}

      {/* {isEditing ? (
          <div className="space-x-2">
            <button
              onClick={() => setIsEditing(false)}
              className="text-gray-500 hover:underline"
            >
              キャンセル
            </button>
            <button
              onClick={handleUpdate}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              更新する
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-gray-300 text-black px-4 py-2 rounded"
          >
            編集する
          </button>
        )} */}
      {/* </div> */}

      {message && <p className="mt-2 text-sm text-red-500">{message}</p>}
    </>
  );
}

// 👇編集のみ
// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";

// type Props = {
//   post: {
//     id: number;
//     title: string;
//     content: string;
//   };
// };

// export default function PostEditForm({ post }: Props) {
//   const router = useRouter();
//   const [title, setTitle] = useState(post.title);
//   const [content, setContent] = useState(post.content);
//   const [message, setMessage] = useState("");

//   const handleUpdate = async () => {
//     const res = await fetch(`/api/posts/${post.id}`, {
//       method: "PUT",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ title, content }),
//     });

//     if (res.ok) {
//       router.push("/dashboard");
//     } else {
//       setMessage("❌ 更新に失敗しました");
//     }
//   };

//   return (
//     <>
//       <input
//         type="text"
//         className="border p-2 w-full mb-3"
//         value={title}
//         onChange={(e) => setTitle(e.target.value)}
//       />
//       <textarea
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
//           onClick={handleUpdate}
//           className="bg-blue-600 text-white px-4 py-2 rounded"
//         >
//           更新する
//         </button>
//       </div>
//       {message && <p className="mt-2 text-sm text-red-500">{message}</p>}
//     </>
//   );
// }
