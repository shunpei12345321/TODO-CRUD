"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  onSuccess?: () => void;
};

export default function PostForm({ onSuccess }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (isSubmitting || !title.trim() || !content.trim()) return;
    
    setIsSubmitting(true);
    setMessage("");

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });

      if (res.ok) {
        setTitle("");
        setContent("");
        setMessage("✅ 投稿が完了しました");

        // 投稿後にダッシュボードへ遷移
        setTimeout(() => {
          if (onSuccess) {
            onSuccess();
          } else {
            router.push("/dashboard");
          }
        }, 1000);
      } else {
        const errorData = await res.json();
        setMessage(`❌ ${errorData.error || "投稿に失敗しました"}`);
      }
    } catch (error) {
      setMessage("❌ 投稿に失敗しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-4 border rounded mb-6">
      <input
        type="text"
        placeholder="タイトル"
        className="border p-2 w-full mb-3"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="本文"
        className="border p-2 w-full mb-3"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <div className="flex justify-between items-center">
        <button
          onClick={() => router.push("/dashboard")}
          className="text-gray-500 hover:underline"
        >
          ← 戻る
        </button>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || !title.trim() || !content.trim()}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "投稿中..." : "投稿する"}
        </button>
      </div>
      {message && <p className="mt-2 text-sm text-red-500">{message}</p>}
    </div>
  );
}
