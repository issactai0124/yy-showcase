import React, { useState } from "react";
import { Article, UserState } from "../types";
import html2canvas from "html2canvas";
import { createRoot } from "react-dom/client";
import ShareCard from "./ShareCard";
import * as fb from "../services/firebase";

interface NewsTabProps {
  articles: Article[];
  userState: UserState;
  onOpenForm: (item?: Article) => void;
  onDeleteArticle: (id: string) => void;
  onToggleLike: (id: string) => void;
  getUserName: (phone: string) => string;
}

const NewsTab: React.FC<NewsTabProps> = ({
  articles,
  userState,
  onOpenForm,
  onDeleteArticle,
  onToggleLike,
  getUserName,
}) => {
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("zh-HK", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const handleShare = async (article: Article) => {
    setIsGenerating(true);
    const container = document.getElementById("share-capture-zone");
    if (!container) return;
    try {
      const root = createRoot(container);
      root.render(<ShareCard article={article} />);
      await new Promise((resolve) => setTimeout(resolve, 300));
      const canvas = await html2canvas(container, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
      });
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/png"),
      );
      if (!blob) throw new Error("Failed to create image");
      root.unmount();
      container.innerHTML = "";
      const file = new File([blob], `share.png`, { type: "image/png" });
      const shareText =
        "YY-showcase https://issactai0124.github.io/yy-showcase/";
      if (navigator.share) {
        await navigator.share({
          files: [file],
          title: article.title,
          text: shareText,
        });
      } else {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `article-${article.id}.png`;
        link.click();
        try {
          await navigator.clipboard.writeText(shareText);
        } catch (e) {}
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-4 pb-20 space-y-8">
      <section>
        <h2 className="text-blue-600 font-bold text-sm uppercase tracking-wider mb-4 px-2">
          最新發佈
        </h2>

        {userState.isAdmin && (
          <button
            onClick={() => onOpenForm()}
            className="w-full bg-white border-2 border-dashed border-blue-200 text-blue-600 font-bold py-4 rounded-2xl shadow-sm flex items-center justify-center space-x-2 mb-6 hover:bg-blue-50 active:scale-[0.98] transition-all"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span>發佈新公告</span>
          </button>
        )}

        <div className="space-y-4">
          {articles.map((article) => (
            <div
              key={article.id}
              className="bg-white rounded-2xl shadow-sm border border-slate-200 divide-y divide-slate-100 overflow-hidden"
            >
              <div className="p-4 flex items-center justify-between bg-slate-50/30">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500">
                      {formatDate(article.date)}
                    </p>
                    <p className="text-slate-900 font-bold">{article.title}</p>
                  </div>
                </div>
                {userState.isAdmin && (
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => onOpenForm(article)}
                      className="text-blue-400 hover:text-blue-600 p-2 transition-colors"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => setConfirmDeleteId(article.id)}
                      className="text-red-400 hover:text-red-600 p-2 transition-colors"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2.01 0 0116.138 21H7.862a2 2.01 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                )}
              </div>

              {article.imageUrl && (
                <div className="w-full aspect-video overflow-hidden">
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="p-4">
                <p className="text-slate-700 whitespace-pre-wrap text-sm leading-relaxed">
                  {article.content}
                </p>
                {userState.isAdmin && article.likedBy.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-1">
                      已點讚用戶：
                    </p>
                    <p className="text-xs text-slate-500 font-medium italic">
                      {article.likedBy
                        .map((phone) => getUserName(phone))
                        .join("、")}
                    </p>
                  </div>
                )}
              </div>

              <div className="px-4 py-3 bg-slate-50/30 flex justify-between items-center">
                <button
                  onClick={() => onToggleLike(article.id)}
                  className={`flex items-center space-x-1.5 font-bold text-sm ${article.likedBy.includes(userState.userPhone || "") ? "text-pink-600" : "text-slate-500"}`}
                  disabled={!userState.isLoggedIn}
                >
                  <svg
                    className={`w-5 h-5 ${article.likedBy.includes(userState.userPhone || "") ? "fill-current" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                  <span>{article.likedBy.length}</span>
                </button>
                <button
                  onClick={() => handleShare(article)}
                  className="bg-blue-50 text-blue-600 font-bold text-sm px-4 py-2 rounded-xl flex items-center space-x-1 transition-all hover:bg-blue-100 active:scale-95 shadow-sm"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.684 13.342C8.886 12.482 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                    />
                  </svg>
                  <span>分享圖片</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {confirmDeleteId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <h2 className="text-xl font-bold mb-2 text-slate-900">
              確認刪除公告？
            </h2>
            <p className="text-slate-500 text-sm mb-4">
              此動作無法復原，您確定要刪除這條公告嗎？
            </p>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                返回
              </button>
              <button
                onClick={() => {
                  onDeleteArticle(confirmDeleteId);
                  setConfirmDeleteId(null);
                }}
                className="px-6 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-colors"
              >
                確認刪除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsTab;
