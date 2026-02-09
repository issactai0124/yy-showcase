
import React, { useState, useRef } from 'react';
import { Article } from '../types';

interface ArticleFormProps {
  item?: Article;
  onClose: () => void;
  onSave: (title: string, content: string, imageUrl?: string) => Promise<void>;
}

const ArticleForm: React.FC<ArticleFormProps> = ({ item, onClose, onSave }) => {
  const [title, setTitle] = useState(item?.title || '');
  const [content, setContent] = useState(item?.content || '');
  const [imageUrl, setImageUrl] = useState(item?.imageUrl || null);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.src = reader.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;
          let width = img.width;
          let height = img.height;
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          setImageUrl(canvas.toDataURL('image/jpeg', 0.7));
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!title || !content) return;
    setIsSaving(true);
    await onSave(title, content, imageUrl || undefined);
    setIsSaving(false);
  };

  return (
    <div className="fixed inset-0 bg-slate-50 z-50 flex flex-col h-screen overflow-hidden">
      {/* 頂部導覽 */}
      <header className="bg-white border-b border-slate-200 py-4 px-6 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center space-x-3">
          <button onClick={onClose} className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <h1 className="text-xl font-bold text-slate-800">{item ? '修改公告' : '發佈公告'}</h1>
        </div>
        <button 
          onClick={handleSave} 
          disabled={!title || !content || isSaving}
          className="app-btn-primary py-2 px-6 flex items-center space-x-2"
        >
          {isSaving ? (
            <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          ) : (
            <span>{item ? '更新' : '發佈'}</span>
          )}
        </button>
      </header>

      {/* 內容區塊 */}
      <main className="flex-1 overflow-y-auto p-4 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white p-6 lg:p-10 rounded-2xl shadow-sm border border-slate-200 space-y-8">
            
            {/* 公告標題 */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
              <label className="sm:w-28 text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0">公告標題</label>
              <input 
                className="flex-1 app-input bg-slate-50 border-slate-200 focus:bg-white transition-all font-bold text-lg" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                placeholder="請輸入一個吸引人的標題" 
              />
            </div>

            {/* 配圖 */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-6">
              <label className="sm:w-28 text-xs font-bold text-slate-400 uppercase tracking-wider pt-2 shrink-0">配圖 (16:9)</label>
              <div className="flex-1">
                {imageUrl ? (
                  <div className="relative rounded-xl overflow-hidden group">
                    <img src={imageUrl} alt="Preview" className="w-full aspect-video object-cover border border-slate-100" />
                    <button 
                      onClick={() => setImageUrl(null)}
                      className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-all"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                ) : (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full aspect-video bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-all text-slate-400"
                  >
                    <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    <span className="text-sm font-medium">點擊選擇公告配圖</span>
                  </div>
                )}
                <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
              </div>
            </div>
            
            {/* 詳細內容 */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-6">
              <label className="sm:w-28 text-xs font-bold text-slate-400 uppercase tracking-wider pt-2 shrink-0">詳細內容</label>
              <textarea 
                rows={12} 
                className="flex-1 app-input bg-slate-50 border-slate-200 focus:bg-white transition-all text-base resize-none" 
                value={content} 
                onChange={(e) => setContent(e.target.value)} 
                placeholder="在此輸入公告的詳細內容..." 
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ArticleForm;
