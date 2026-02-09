import React from "react";
import { Article } from "../types";

interface ShareCardProps {
  article: Article;
}

const ShareCard: React.FC<ShareCardProps> = ({ article }) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("zh-HK", {
      year: "numeric",
      month: "long",
      day: "2-digit",
      weekday: "long",
    }).format(date);
  };

  return (
    <div className="relative bg-gradient-to-br from-blue-600 to-indigo-700 p-8 w-[400px] h-auto flex flex-col justify-between text-white font-sans antialiased overflow-hidden">
      <div>
        <div className="flex items-center space-x-4 mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl overflow-hidden p-1.5 ring-4 ring-white/20">
            <img
              src="images/logo.png"
              alt="Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold tracking-tight">
              YY-showcase
            </span>
            <span className="text-blue-200 text-[10px] uppercase tracking-widest font-medium opacity-80">
              Community Hub
            </span>
          </div>
        </div>

        <h1 className="text-3xl font-extrabold mb-4 leading-tight drop-shadow-sm">
          {article.title}
        </h1>

        <div className="w-12 h-1 bg-blue-300 rounded-full mb-6"></div>

        {article.imageUrl && (
          <div className="mb-6 rounded-2xl overflow-hidden border border-white/20 shadow-xl">
            <img
              src={article.imageUrl}
              alt="Article cover"
              className="w-full aspect-video object-cover"
            />
          </div>
        )}

        <p
          className={`text-blue-50 leading-relaxed whitespace-pre-wrap break-words overflow-wrap-break-word ${article.imageUrl ? "text-sm" : "text-base"}`}
        >
          {article.content}
        </p>
      </div>

      <div className="mt-8 pt-6 border-t border-blue-400/30 flex justify-between items-center">
        <div>
          <p className="text-blue-200 text-sm font-medium">
            {formatDate(article.date)}
          </p>
          <p className="text-white/60 text-xs mt-1 italic font-medium">
            掃描二維碼了解更多詳情
          </p>
        </div>

        <div className="w-16 h-16 rounded-xl flex items-center justify-center shadow-lg overflow-hidden p-1 ring-2 ring-white/30">
          <img
            src="images/qr-code.png"
            alt="Scan for more"
            className="w-full h-full object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default ShareCard;
