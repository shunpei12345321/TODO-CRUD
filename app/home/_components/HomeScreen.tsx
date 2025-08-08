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
        <Link href="/create" className={styles.createButton}>
          ＋ 新規ユーザー作成
        </Link>
      </div>
      <table className={`table-auto ${styles.userTable}`}>
        <thead>
          <tr>
            <th className={styles.userId}>ユーザーID</th>
            <th className={styles.userName}>名前</th>
            <th className={styles.userEmail}>Email</th>
            <th className={styles.userAction}>操作</th>
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
              <td>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteUser(user.id);
                  }}
                  disabled={deletingId === user.id}
                  className="bg-transparent hover:bg-red-100 text-red-500 p-2 rounded"
                >
                  <Trash2 className="inline" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
