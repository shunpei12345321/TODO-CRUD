"use client";
import Link from "next/link";
import { User } from "../../_repositories/User";
import styles from "./HomeScreen.module.css";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

type Props = {
  users: User[];
};

export default function HomeScreen({ users }: Props) {
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const router = useRouter();

  const handleDeleteUser = async (id: number) => {
    if (!confirm("このユーザーを削除してもよろしいですか？")) return;

    setDeletingId(id);
    const res = await fetch(`/api/users/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      location.reload(); // ✅ 簡易：削除後に再読み込み
    } else {
      alert("削除に失敗しました");
      setDeletingId(null);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <h2 className={styles.title}>ユーザーリスト</h2>
        {/* <Link href="/create" className={styles.createButton}>
          ＋ 新規ユーザー作成
        </Link> */}
      </div>
      <table className={`table-auto ${styles.userTable}`}>
        <thead>
          <tr>
            <th className={styles.userId}>ユーザーID</th>
            <th className={styles.userName}>名前</th>
            <th className={styles.userEmail}>Email</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr
              key={user.id}
              onClick={() => router.push(`/edit/${user.id}`)}
              className="cursor-pointer hover:bg-gray-100 transition-colors"
            >
              <td className={styles.userId}>{user.id}</td>
              <td className={styles.userName}>{user.name}</td>
              <td className={styles.userEmail}>{user.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
