// components/MemoDetail.tsx

import React, { useEffect, useState, useRef } from 'react';
import './MemoDetail.css';
import Image from 'next/image';

// Memoの型定義
interface Memo {
  id: string;
  title: string;
  items: { text: string; checked: boolean }[] | string | null;
  type: "checklist" | "text";
  textContent: string | null;
  images: { id: number; url: string; caption?: string }[] | string | null;
  urls: { id: number; url: string; title: string; description?: string }[] | string | null;
  createdAt: string;
  updatedAt: string;
}

interface MemoDetailProps {
  memoId: string | 'new';
  onBack: () => void;
}

// 安全なJSONパース用のヘルパー関数
const safeJsonParse = (jsonString: string | null | undefined, fallback: any = []) => {
  if (!jsonString || jsonString.trim() === '') {
    return fallback;
  }
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.warn('JSON parse error:', error, 'for string:', jsonString);
    return fallback;
  }
};

function MemoDetail({ memoId, onBack }: MemoDetailProps) {
  //const [memo, setMemo] = useState<Memo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [memoType, setMemoType] = useState<"checklist" | "text">('checklist');
  const [items, setItems] = useState<{ text: string; checked: boolean }[]>([]);
  const [textContent, setTextContent] = useState<string>('');
  const [images, setImages] = useState<{ id: string; url: string; caption?: string }[]>([]);
  const [urls, setUrls] = useState<{ id: string; url: string; title: string; description?: string }[]>([]);
  
  // UI状態管理
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [newUrl, setNewUrl] = useState('');
  const [newUrlTitle, setNewUrlTitle] = useState('');
  const [newUrlDescription, setNewUrlDescription] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchMemo = async () => {
      setIsLoading(true);
      setError(null);
      if (memoId !== 'new') {
        try {
          const response = await fetch(`/api/memos/${memoId}`);
          
          if (!response.ok) {
            const contentType = response.headers.get("content-type");
            let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
            
            if (contentType && contentType.indexOf("application/json") !== -1) {
              try {
                const errorData = await response.json();
                errorMessage = `${errorMessage} - ${errorData.error || 'Unknown error'}`;
              } catch (jsonError) {
                console.error('Failed to parse error JSON:', jsonError);
              }
            }
            throw new Error(errorMessage);
          }

          const data: Memo = await response.json();
          
         // setMemo(data);
          setTitle(data.title);
          setMemoType(data.type || 'checklist');

          // アイテムの設定
          if (data.type === 'checklist') {
            setItems(typeof data.items === 'string' ? safeJsonParse(data.items, []) : data.items || []);
            setTextContent('');
          } else if (data.type === 'text') {
            setTextContent(data.textContent || '');
            setItems([]);
          }

          // 画像の設定
          setImages(typeof data.images === 'string' ? safeJsonParse(data.images, []) : data.images || []);
          
          // URLの設定
          setUrls(typeof data.urls === 'string' ? safeJsonParse(data.urls, []) : data.urls || []);

        } catch (e: unknown) {
  console.error('メモ詳細の取得に失敗しました:', e);

  if (e instanceof Error) {
    setError(`メモ詳細の読み込みに失敗しました: ${e.message}`);
  } else {
    setError('メモ詳細の読み込みに失敗しました（詳細不明）');
  }

  resetFormData();
} finally {
  setIsLoading(false);
}
      } else {
        resetFormData();
        setIsLoading(false);
      }
    };
    fetchMemo();
  }, [memoId]);

  const resetFormData = () => {
    setTitle('');
    setItems([]);
    setTextContent('');
    setImages([]);
    setUrls([]);
    setMemoType('checklist');
    //setMemo(null);
  };

  // タイプ変更時の処理
  const handleTypeChange = (newType: "checklist" | "text") => {
    setMemoType(newType);
    if (newType === 'checklist') {
      setTextContent('');
    } else {
      setItems([]);
    }
  };

  const handleItemChange = (index: number) => {
    const newItems = [...items];
    newItems[index].checked = !newItems[index].checked;
    setItems(newItems);
  };

  const handleAddItem = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.currentTarget.value.trim() !== '') {
      setItems([...items, { text: e.currentTarget.value.trim(), checked: false }]);
      e.currentTarget.value = '';
    }
  };

  const handleRemoveItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  // 画像関連の処理
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const newImage = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            url: event.target?.result as string,
            caption: file.name
          };
          setImages(prev => [...prev, newImage]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleRemoveImage = (imageId: string) => {
    setImages(prev => prev.filter(img => img.id !== imageId));
  };

  const handleImageCaptionChange = (imageId: string, caption: string) => {
    setImages(prev => prev.map(img => 
      img.id === imageId ? { ...img, caption } : img
    ));
  };

  // URL関連の処理
  const handleAddUrl = () => {
    if (newUrl.trim() !== '' && newUrlTitle.trim() !== '') {
      const newUrlObj = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        url: newUrl.trim(),
        title: newUrlTitle.trim(),
        description: newUrlDescription.trim() || undefined
      };
      setUrls(prev => [...prev, newUrlObj]);
      setNewUrl('');
      setNewUrlTitle('');
      setNewUrlDescription('');
      setShowUrlInput(false);
    }
  };

  const handleRemoveUrl = (urlId: string) => {
    setUrls(prev => prev.filter(url => url.id !== urlId));
  };

  const handleSaveMemo = async () => {
    try {
      const memoData = {
        title: title.trim(),
        type: memoType,
        items: memoType === 'checklist' && items.length > 0 ? JSON.stringify(items) : null,
        textContent: memoType === 'text' ? textContent : null,
        images: images.length > 0 ? JSON.stringify(images) : null,
        urls: urls.length > 0 ? JSON.stringify(urls) : null,
      };

      let response;
      if (memoId === 'new') {
        response = await fetch('/api/memos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(memoData),
        });
      } else {
        response = await fetch(`/api/memos/${memoId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(memoData),
        });
      }

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const errorData = await response.json();
          errorMessage = `${errorMessage} - ${errorData.error || 'Unknown error'}`;
        } catch (jsonError) {
          console.error('Failed to parse save error JSON:', jsonError);
        }
        throw new Error(errorMessage);
      }

      const savedMemo = await response.json();
      console.log('メモが保存されました:', savedMemo);
      onBack();
    } catch (e: unknown) {
  console.error('メモの保存に失敗しました:', e);

  if (e instanceof Error) {
    setError(`メモの保存に失敗しました: ${e.message}`);
  } else {
    setError('メモの保存に失敗しました（詳細不明）');
  }
}
  };

  if (isLoading) {
    return <div className="memo-detail-container"><p>メモを読み込み中...</p></div>;
  }

  if (error) {
    return (
      <div className="memo-detail-container">
        <p className="error-message">{error}</p>
        <button className="back-button" onClick={onBack}>← メモ一覧へ戻る</button>
      </div>
    );
  }

  return (
    <div className="memo-detail-container">
      <button className="back-button" onClick={onBack}>← メモ一覧へ戻る</button>

      <input
        type="text"
        className="memo-title-input"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="メモのタイトル"
      />

      {/* タイプ選択 - 既存メモでも変更可能 */}
      <div className="memo-type-selection">
        <label>
          <input
            type="radio"
            value="checklist"
            checked={memoType === 'checklist'}
            onChange={() => handleTypeChange('checklist')}
          />
          チェックリスト
        </label>
        <label>
          <input
            type="radio"
            value="text"
            checked={memoType === 'text'}
            onChange={() => handleTypeChange('text')}
          />
          テキストメモ
        </label>
      </div>

      <div className="memo-content-box">
        {memoType === 'checklist' ? (
          <div className="checklist-content">
            {items.map((item, index) => (
              <div key={index} className="memo-item-checkbox">
                <input
                  type="checkbox"
                  id={`item-${index}`}
                  checked={item.checked}
                  onChange={() => handleItemChange(index)}
                />
                <label htmlFor={`item-${index}`}>{item.text}</label>
                <button 
                  className="remove-item-button"
                  onClick={() => handleRemoveItem(index)}
                  title="アイテムを削除"
                >
                  ×
                </button>
              </div>
            ))}
            <input
              type="text"
              className="add-item-input"
              placeholder="新しいアイテムを追加 (Enter)"
              onKeyDown={handleAddItem}
            />
          </div>
        ) : (
          <textarea
            className="text-memo-input"
            placeholder="ここにメモの内容を入力..."
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
          ></textarea>
        )}

        {/* 画像セクション */}
        {images.length > 0 && (
          <div className="images-section">
            <h4>画像</h4>
            <div className="images-grid">
              {images.map((image) => (
                <div key={image.id} className="image-item">
                  <Image
              src={image.url}
              alt={image.caption || ''}
              width={400} // 実際の表示サイズに合わせて調整
              height={300}
              className="memo-image"
            />
            <input
                    type="text"
                    value={image.caption || ''}
                    onChange={(e) => handleImageCaptionChange(image.id, e.target.value)}
                    placeholder="画像の説明"
                    className="image-caption-input"
                  />
                  <button 
                    className="remove-image-button"
                    onClick={() => handleRemoveImage(image.id)}
                    title="画像を削除"
                  >
                    削除
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* URL セクション */}
        {urls.length > 0 && (
          <div className="urls-section">
            <h4>リンク</h4>
            <div className="urls-list">
              {urls.map((urlItem) => (
                <div key={urlItem.id} className="url-item">
                  <a href={urlItem.url} target="_blank" rel="noopener noreferrer" className="url-link">
                    {urlItem.title}
                  </a>
                  {urlItem.description && (
                    <p className="url-description">{urlItem.description}</p>
                  )}
                  <button 
                    className="remove-url-button"
                    onClick={() => handleRemoveUrl(urlItem.id)}
                    title="リンクを削除"
                  >
                    削除
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* URL入力フォーム */}
        {showUrlInput && (
          <div className="url-input-form">
            <input
              type="url"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              placeholder="URLを入力"
              className="url-input"
            />
            <input
              type="text"
              value={newUrlTitle}
              onChange={(e) => setNewUrlTitle(e.target.value)}
              placeholder="リンクのタイトル"
              className="url-title-input"
            />
            <textarea
              value={newUrlDescription}
              onChange={(e) => setNewUrlDescription(e.target.value)}
              placeholder="説明（オプション）"
              className="url-description-input"
            />
            <div className="url-input-actions">
              <button onClick={handleAddUrl} className="add-url-confirm-button">
                追加
              </button>
              <button 
                onClick={() => {
                  setShowUrlInput(false);
                  setNewUrl('');
                  setNewUrlTitle('');
                  setNewUrlDescription('');
                }} 
                className="add-url-cancel-button"
              >
                キャンセル
              </button>
            </div>
          </div>
        )}

        {/* ボタンエリア */}
        <div className="attachment-buttons">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            style={{ display: 'none' }}
          />
          <button 
            className="image-button"
            onClick={() => fileInputRef.current?.click()}
          >
            画像
          </button>
          <button 
            className="attach-button"
            onClick={() => setShowUrlInput(true)}
          >
            リンク
          </button>
        </div>
      </div>

      <div className="memo-actions">
        <button className="save-button" onClick={handleSaveMemo}>保存</button>
      </div>
    </div>
  );
}

export default MemoDetail;