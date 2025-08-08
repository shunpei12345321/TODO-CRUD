// app/page.tsx

'use client'; // これが必須！クライアントコンポーネントであることを宣言

import React, { useState } from 'react';
// componentsディレクトリをappの直下に作った前提でパスを修正
import MemoList from './components/MemoList';
import MemoDetail from './components/MemoDetail';

export default function MemoPage() { // ここはPageでもOKだけど、HomePageとかでもいいよ
  // null: メモ一覧を表示
  // 'new': 新規メモ作成画面を表示
  // string (メモID): 特定のメモ詳細画面を表示
  const [selectedMemoId, setSelectedMemoId] = useState<string | 'new' | null>(null);

  // メモが選択された時のハンドラ
  const handleMemoSelect = (id: string) => {
    setSelectedMemoId(id);
  };

  // 新規作成ボタンが押された時のハンドラ
  const handleCreateNew = () => {
    setSelectedMemoId('new');
  };

  // メモ一覧に戻る時のハンドラ
  const handleBackToList = () => {
    setSelectedMemoId(null);
  };

  // selectedMemoIdの状態によって表示するコンポーネントを切り替える
  if (selectedMemoId) {
    // メモが選択されている（または新規作成モード）なら詳細画面を表示
    return <MemoDetail memoId={selectedMemoId} onBack={handleBackToList} />;
  }

  // それ以外はメモ一覧を表示
  return <MemoList onSelectMemo={handleMemoSelect} onCreateNew={handleCreateNew} />;
}