"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./EditScreen.module.css";

type Props = {
  userId: number;
};

export default function EditScreen({ userId }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch(`/api/users/${userId}`);
      if (res.ok) {
        const user = await res.json();
        setName(user.name);
        setEmail(user.email);
      }
    };
    fetchUser();
  }, [userId]);

  const handleUpdateUser = async () => {
    if (!name || !email) {
      alert("名前とメールを入力してください");
      return;
    }

    const res = await fetch(`/api/users/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }),
    });

    if (res.ok) {
      router.push("/dashboard");
    } else {
      const data = await res.json();
      alert(data.error || "更新に失敗しました");
    }
  };

  return (
    <div className={styles.container}>
      {/* 左上の戻るボタン */}
      <button onClick={() => router.back()} className={styles.backButton}>
        戻る
      </button>

      {/* 中央のフォーム */}
      <form
        className={styles.formWrapper}
        onSubmit={(e) => {
          e.preventDefault();
          handleUpdateUser();
        }}
      >
        <h1 className={styles.title}>ユーザー編集</h1>
        <label className={styles.labelId}>ユーザーID: {userId}</label>

        <label className={styles.label} htmlFor="name-input">
          名前
        </label>
        <input
          id="name-input"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="名前"
          className={styles.input}
          required
        />
        <label className={styles.label} htmlFor="email-input">
          メールアドレス
        </label>
        <input
          id="email-input"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="メールアドレス"
          className={styles.input}
          required
        />

        <button type="submit" className={styles.updateButton}>
          更新
        </button>
      </form>
    </div>
  );
}
