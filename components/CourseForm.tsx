import React, { useState } from "react";
import { Course } from "../types";

interface CourseFormProps {
  item?: Course;
  onClose: () => void;
  onSave: (name: string, date: string, desc: string) => Promise<void>;
}

const CourseForm: React.FC<CourseFormProps> = ({ item, onClose, onSave }) => {
  const getTomorrowAtNine = () => {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    date.setHours(9, 0, 0, 0);
    const tzoffset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - tzoffset).toISOString().slice(0, 16);
  };

  const [name, setName] = useState(item?.name || "");
  const [date, setDate] = useState(
    item?.date
      ? new Date(item.date.getTime() - new Date().getTimezoneOffset() * 60000)
          .toISOString()
          .slice(0, 16)
      : getTomorrowAtNine(),
  );
  const [desc, setDesc] = useState(item?.desc || "");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!name || !date || !desc) return;
    setIsSaving(true);
    await onSave(name, date, desc);
    setIsSaving(false);
  };

  return (
    <div className="fixed inset-0 bg-slate-50 z-50 flex flex-col h-screen overflow-hidden">
      <header className="bg-white border-b border-slate-200 py-4 px-6 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center space-x-3">
          <button
            onClick={onClose}
            className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors"
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-slate-800">
            {item ? "修改課程" : "開設新課程"}
          </h1>
        </div>
        <button
          onClick={handleSave}
          disabled={!name || !date || !desc || isSaving}
          className="app-btn-primary py-2 px-6 flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700"
        >
          {isSaving ? (
            <svg
              className="animate-spin h-5 w-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
            <span>{item ? "保存" : "發佈"}</span>
          )}
        </button>
      </header>

      <main className="flex-1 overflow-y-auto p-4 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white p-6 lg:p-10 rounded-2xl shadow-sm border border-slate-200 space-y-8">
            {/* 課程名稱 */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
              <label className="sm:w-28 text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0">
                課程名稱
              </label>
              <input
                className="flex-1 app-input bg-slate-50 border-slate-200 focus:bg-white transition-all font-bold text-lg"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="例如：基礎級"
              />
            </div>

            {/* 開課日期與時間 */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
              <label className="sm:w-28 text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0">
                課程日期
              </label>
              <input
                type="datetime-local"
                className="flex-1 app-input bg-slate-50 border-slate-200 focus:bg-white transition-all font-medium"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            {/* 課程簡介 */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-6">
              <label className="sm:w-28 text-xs font-bold text-slate-400 uppercase tracking-wider pt-2 shrink-0">
                簡介細則
              </label>
              <textarea
                rows={12}
                className="flex-1 app-input bg-slate-50 border-slate-200 focus:bg-white transition-all text-base resize-none"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="請輸入課程詳細介紹、導師、地點等..."
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CourseForm;
