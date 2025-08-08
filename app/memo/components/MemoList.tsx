import React, { useEffect, useState } from 'react';
import './MemoList.css'; // スタイルシートを読み込む

// Memoの型定義（Prismaのモデルと合わせる）
interface Memo {
  id: number; // ← ここを number に修正
  title: string;
  items: string;
  createdAt: string;
  updatedAt: string;
}

// 各メモアイテムのコンポーネントのProps
interface MemoItemProps {
  memo: Memo;
  onSelect: (id: number) => void;   // 修正
  onDelete: (id: number) => void;   // 修正
}

function MemoItem({ memo, onSelect, onDelete }: MemoItemProps) {
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(memo.id);
  };

  return (
    <div className="memo-item" onClick={() => onSelect(memo.id)}>
      <div className="memo-content">
        <h3>{memo.title}</h3>
        <p className="memo-date">作成日: {new Date(memo.createdAt).toLocaleDateString()}</p>
      </div>
      <button onClick={handleDeleteClick} className="delete-button">
        削除
      </button>
    </div>
  );
}

// MemoListコンポーネントのProps
interface MemoListProps {
  onSelectMemo: (id: number) => void; // 修正
  onCreateNew: () => void;
}

function MemoList({ onSelectMemo, onCreateNew }: MemoListProps) {
  const [memos, setMemos] = useState<Memo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMemos = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/memos');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: Memo[] = await response.json();
      setMemos(data);
    } catch (e: unknown) {
      console.error('メモデータの取得に失敗しました:', e);
      if (e instanceof Error) {
        setError(`メモの読み込みに失敗しました: ${e.message}`);
      } else {
        setError('メモの読み込みに失敗しました（詳細不明）');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMemos();
  }, []);

  const handleDeleteMemo = async (id: number) => {
    if (window.confirm('本当にこのメモを削除しますか？')) {
      try {
        const response = await fetch(`/api/memos?id=${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setMemos(prevMemos => prevMemos.filter(memo => memo.id !== id));
        } else {
          const errorData = await response.json();
          console.error('メモの削除に失敗しました:', errorData.error);
        }
      } catch (error) {
        console.error('削除中にエラーが発生しました:', error);
      }
    }
  };

  if (isLoading) {
    return <div className="memo-list-container"><p>メモを読み込み中...</p></div>;
  }

  if (error) {
    return <div className="memo-list-container"><p className="error-message">{error}</p></div>;
  }

  return (
    <div className="memo-list-container">
      <h1>メモ</h1>

      <button className="create-new-button" onClick={onCreateNew}>
        新規作成
      </button>

      <div className="memo-items-wrapper">
        {memos.length === 0 ? (
          <p>メモがありません。新規作成しましょう！</p>
        ) : (
          memos.map((memo) => (
            <MemoItem
              key={memo.id}
              memo={memo}
              onSelect={onSelectMemo}
              onDelete={handleDeleteMemo}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default MemoList;
