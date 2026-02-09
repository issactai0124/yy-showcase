import React, { useState } from "react";
import * as fb from "../services/firebase";

interface LoginPromptProps {
  onLoginSuccess: (phone: string, userData: any) => void;
}

const LoginPrompt: React.FC<LoginPromptProps> = ({ onLoginSuccess }) => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [newName, setNewName] = useState("");

  // flow: 'phone' -> 'otp' -> 'name' (optional)
  const [step, setStep] = useState<"phone" | "otp" | "name">("phone");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendCode = () => {
    if (!phone) return;
    setIsLoading(true);
    // 模擬發送驗證碼
    setTimeout(() => {
      setIsLoading(false);
      setStep("otp");
      alert("驗證碼已發送 (Demo: 1234)");
    }, 800);
  };

  /**
   * 驗證 OTP 並檢查資料庫
   */
  const handleVerify = async () => {
    if (otp !== "1234") {
      alert("驗證碼錯誤");
      return;
    }

    setIsLoading(true);
    try {
      const userData = await fb.getUserData(phone);
      if (userData) {
        // 已有用戶，直接登入
        onLoginSuccess(phone, userData);
      } else {
        // 新用戶，要求輸入名稱
        setStep("name");
      }
    } catch (err) {
      alert("登入失敗，請稍後再試");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 註冊新用戶
   */
  const handleRegister = async () => {
    if (!newName.trim()) return;

    setIsLoading(true);
    try {
      const userData = await fb.registerUser(phone, newName.trim());
      onLoginSuccess(phone, userData);
    } catch (err) {
      alert("註冊失敗");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 h-full space-y-8 animate-fade-in">
      <div className="p-6 bg-blue-50 rounded-full text-blue-600">
        {step === "name" ? (
          <svg
            className="w-16 h-16"
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
        ) : (
          <svg
            className="w-16 h-16"
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
        )}
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-900">
          {step === "name" ? "歡迎新朋友" : "請先登入"}
        </h2>
        <p className="text-slate-500 mt-1">
          {step === "name"
            ? "請告訴我們該如何稱呼您"
            : "登入後即可享受完整社群服務"}
        </p>
      </div>

      <div className="w-full space-y-4">
        {step === "phone" && (
          <>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
                +852
              </span>
              <input
                type="tel"
                placeholder="手機號碼"
                className="w-full pl-16 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white text-blue-600 font-bold placeholder-slate-400"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
              />
            </div>
            <button
              disabled={isLoading || !phone}
              onClick={handleSendCode}
              className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold shadow-md hover:bg-blue-700 disabled:bg-blue-300 transition-colors flex items-center justify-center"
            >
              {isLoading ? (
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
                "發送驗證碼"
              )}
            </button>
          </>
        )}

        {step === "otp" && (
          <>
            <div className="text-center p-3 bg-green-50 text-green-700 rounded-lg text-sm border border-green-100">
              驗證碼已發送至 +852 {phone}
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 ml-1">
                驗證碼
              </label>
              <input
                type="text"
                maxLength={4}
                placeholder="Demo Code: 1234"
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white text-center tracking-widest text-xl font-bold text-blue-600 placeholder-slate-400"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>
            <button
              disabled={isLoading}
              onClick={handleVerify}
              className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold shadow-md hover:bg-blue-700 transition-colors flex justify-center"
            >
              {isLoading ? (
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
                "驗證並登入"
              )}
            </button>
            <button
              onClick={() => setStep("phone")}
              className="w-full py-2 text-slate-500 text-sm font-medium hover:text-blue-600"
            >
              更改電話
            </button>
          </>
        )}

        {step === "name" && (
          <>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 ml-1">
                您的名稱
              </label>
              <input
                autoFocus
                type="text"
                placeholder="例如：陳大文"
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white text-blue-600 font-bold"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            </div>
            <button
              disabled={isLoading || !newName.trim()}
              onClick={handleRegister}
              className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold shadow-md hover:bg-blue-700 disabled:bg-blue-300 transition-colors flex justify-center"
            >
              {isLoading ? (
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
                "完成註冊並登入"
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default LoginPrompt;
