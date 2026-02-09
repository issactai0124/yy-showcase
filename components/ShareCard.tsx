
import React from 'react';
import { Article } from '../types';

interface ShareCardProps {
  article: Article;
}

const ShareCard: React.FC<ShareCardProps> = ({ article }) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('zh-HK', {
      year: 'numeric',
      month: 'long',
      day: '2-digit',
      weekday: 'long'
    }).format(date);
  };

  return (
    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 w-[400px] min-h-[500px] flex flex-col justify-between text-white font-sans">
      <div>
        <div className="flex items-center space-x-2 mb-8">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight">YY-showcase</span>
        </div>
        
        <h1 className="text-3xl font-extrabold mb-4 leading-tight">
          {article.title}
        </h1>
        
        <div className="w-12 h-1 bg-blue-300 rounded-full mb-6"></div>
        
        {article.imageUrl && (
          <div className="mb-6 rounded-2xl overflow-hidden border border-white/20 shadow-xl">
            <img src={article.imageUrl} alt="Article cover" className="w-full aspect-video object-cover" />
          </div>
        )}

        <p className={`text-blue-50 leading-relaxed whitespace-pre-wrap ${article.imageUrl ? 'text-sm line-clamp-6' : 'text-lg line-clamp-[10]'}`}>
          {article.content}
        </p>
      </div>

      <div className="mt-8 pt-6 border-t border-blue-400/30 flex justify-between items-end">
        <div>
          <p className="text-blue-200 text-sm font-medium">{formatDate(article.date)}</p>
          <p className="text-white/60 text-xs mt-1">Community Hub</p>
        </div>
        <div className="bg-white/10 px-3 py-1 rounded-full border border-white/20">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Live Update</span>
        </div>
      </div>
    </div>
  );
};

export default ShareCard;
