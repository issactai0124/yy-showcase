import React, { useState } from "react";
import { UserState } from "../types";

interface SettingsTabProps {
  userState: UserState;
  onStateChange: (state: UserState) => void;
  onLogout: () => void;
  onNameChange: (newName: string) => void;
}

const SettingsTab: React.FC<SettingsTabProps> = ({
  userState,
  onStateChange,
  onLogout,
  onNameChange,
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(userState.userName || "");

  const getFontLabel = (val: number) => {
    if (val < 0.9) return "細";
    else if (val < 1.1) return "中";
    else if (val < 1.3) return "大";
    else return "巨";
  };

  return (
    <div className="p-4 pb-20 space-y-8">
      {/* Account Settings */}
      <section>
        <h2 className="text-blue-600 font-bold text-sm uppercase tracking-wider mb-4 px-2">
          帳戶設定
        </h2>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 divide-y divide-slate-100 overflow-hidden">
          <div className="p-4 flex items-center justify-between">
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
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">名稱</p>
                <p className="text-slate-900 font-bold">
                  {userState.userName || "未輸入"}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setTempName(userState.userName || "");
                setIsEditingName(true);
              }}
              className="bg-blue-50 text-blue-600 font-bold text-sm px-4 py-2 rounded-xl transition-all hover:bg-blue-100 active:scale-95 shadow-sm"
            >
              更改名稱
            </button>
          </div>

          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-slate-50 text-slate-400 rounded-lg">
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
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">電話號碼</p>
                <p className="text-blue-600 font-bold">{userState.userPhone}</p>
              </div>
            </div>
            <svg
              className="w-5 h-5 text-slate-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
        </div>
      </section>

      {/* App Settings */}
      <section>
        <h2 className="text-blue-600 font-bold text-sm uppercase tracking-wider mb-4 px-2">
          應用程式設定
        </h2>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 divide-y divide-slate-100 overflow-hidden">
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-medium text-slate-700">字體大小</span>
              <span className="text-sm font-bold text-slate-900">
                {getFontLabel(userState.fontSize)}
              </span>
            </div>
            <input
              type="range"
              min="0.8"
              max="1.4"
              step="0.2"
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              value={userState.fontSize}
              onChange={(e) =>
                onStateChange({
                  ...userState,
                  fontSize: parseFloat(e.target.value),
                })
              }
            />
          </div>
        </div>
      </section>

      <button
        onClick={onLogout}
        className="w-full py-4 bg-red-50 text-red-600 rounded-2xl font-bold border border-red-100 hover:bg-red-100 transition-colors"
      >
        登出
      </button>

      {/* Edit Name Modal */}
      {isEditingName && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <h2 className="text-xl font-bold mb-4">更改名稱</h2>
            <input
              autoFocus
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white text-slate-900"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
            />
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setIsEditingName(false)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                取消
              </button>
              <button
                onClick={() => {
                  if (tempName) {
                    onNameChange(tempName);
                    setIsEditingName(false);
                  }
                }}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700"
              >
                確認
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsTab;
