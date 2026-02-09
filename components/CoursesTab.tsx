import React, { useState } from "react";
import { Course, UserState } from "../types";
import * as fb from "../services/firebase";

interface CoursesTabProps {
  courses: Course[];
  userState: UserState;
  onEnroll: (courseId: string, phone: string) => void;
  onOpenForm: (item?: Course) => void;
  onDeleteCourse: (id: string) => void;
  onRemoveEnrollment?: (courseId: string, phone: string) => void;
  getUserName?: (phone: string) => string;
}

const CoursesTab: React.FC<CoursesTabProps> = ({
  courses,
  userState,
  onEnroll,
  onOpenForm,
  onDeleteCourse,
  onRemoveEnrollment,
  getUserName,
}) => {
  const [enrollDialog, setEnrollDialog] = useState<Course | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [removeStudentDialog, setRemoveStudentDialog] = useState<{
    course: Course;
    phone: string;
  } | null>(null);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("zh-HK", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const getStudentDisplayName = (phone: string) => {
    const name = getUserName?.(phone);
    if (!name || name === phone) return phone;
    return `${name} | ${phone}`;
  };

  return (
    <div className="p-4 pb-20 space-y-8">
      <section>
        <h2 className="text-blue-600 font-bold text-sm uppercase tracking-wider mb-4 px-2">
          可供報名課程
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
            <span>新增課程資訊</span>
          </button>
        )}

        <div className="space-y-4">
          {courses.map((course) => {
            const isEnrolled = course.enrolledUsers.includes(
              userState.userPhone!,
            );
            return (
              <div
                key={course.id}
                className="bg-white rounded-2xl shadow-sm border border-slate-200 divide-y divide-slate-100 overflow-hidden"
              >
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
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-500">
                        {course.name}
                      </p>
                      <p className="text-blue-600 font-bold">
                        {formatDate(course.date)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    {userState.isAdmin && (
                      <>
                        <button
                          onClick={() => onOpenForm(course)}
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
                          onClick={() => setConfirmDeleteId(course.id)}
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
                      </>
                    )}
                    <button
                      disabled={isEnrolled}
                      onClick={() => setEnrollDialog(course)}
                      className={`font-bold text-sm px-4 py-2 rounded-xl transition-all ml-2 ${isEnrolled ? "text-slate-400 bg-slate-50" : "text-blue-600 bg-blue-50 hover:bg-blue-100 shadow-sm"}`}
                    >
                      {isEnrolled ? "已報名" : "立即報名"}
                    </button>
                  </div>
                </div>

                <div className="p-4">
                  <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                    {course.desc}
                  </p>
                </div>

                {userState.isAdmin && (
                  <div className="bg-slate-50/50 p-4">
                    <h4 className="text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-tighter">
                      學員名單 ({course.enrolledUsers.length})
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {course.enrolledUsers.map((phone) => (
                        <div
                          key={phone}
                          className="flex justify-between items-center text-xs bg-white p-2.5 rounded-lg border border-slate-100 shadow-sm"
                        >
                          <span className="font-bold text-slate-700 truncate mr-2">
                            {getStudentDisplayName(phone)}
                          </span>
                          <button
                            onClick={() =>
                              setRemoveStudentDialog({ course, phone })
                            }
                            className="text-red-300 hover:text-red-500 transition-colors shrink-0"
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
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      ))}
                      {course.enrolledUsers.length === 0 && (
                        <p className="text-xs text-slate-300 italic">
                          暫無學員報名
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 報名確認對話框 */}
      {enrollDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl animate-bounce-in">
            <h2 className="text-xl font-bold mb-4 text-slate-900">
              確認報名課程
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 ml-1 uppercase tracking-wider">
                  報名課程
                </label>
                <input
                  readOnly
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-700 outline-none font-bold"
                  value={enrollDialog.name}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 ml-1 uppercase tracking-wider">
                  報名帳號 (電話號碼)
                </label>
                <input
                  readOnly
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-white text-blue-600 font-bold outline-none"
                  value={userState.userPhone || ""}
                />
                <p className="text-[10px] text-slate-400 mt-1 ml-1">
                  系統將使用此電話號碼進行課程登記
                </p>
              </div>

              <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                <div className="flex items-center space-x-2 text-blue-600">
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
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-xs font-bold uppercase tracking-wider">
                    開課時間
                  </span>
                </div>
                <p className="text-sm font-medium text-blue-800 mt-1">
                  {formatDate(enrollDialog.date)}
                </p>
              </div>
            </div>

            <div className="mt-8 flex justify-end space-x-3">
              <button
                onClick={() => setEnrollDialog(null)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors font-medium"
              >
                取消
              </button>
              <button
                onClick={() => {
                  onEnroll(enrollDialog.id, userState.userPhone!);
                  setEnrollDialog(null);
                }}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-all shadow-md active:scale-95"
              >
                確認報名
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 刪除學員確認對話框 - 管理員專用 */}
      {removeStudentDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl animate-bounce-in">
            <div className="flex items-center space-x-3 mb-4 text-red-600">
              <div className="p-2 bg-red-50 rounded-lg">
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
                    d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12h-6"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-bold">移除學員名單</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 ml-1 uppercase tracking-wider">
                  相關課程
                </label>
                <input
                  readOnly
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-700 outline-none font-bold"
                  value={removeStudentDialog.course.name}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 ml-1 uppercase tracking-wider">
                  學員資料
                </label>
                <input
                  readOnly
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-white text-red-600 font-bold outline-none"
                  value={getStudentDisplayName(removeStudentDialog.phone)}
                />
              </div>

              <p className="text-xs text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-100 italic">
                確認後，該學員將被從此課程名單中移除。
              </p>
            </div>

            <div className="mt-8 flex justify-end space-x-3">
              <button
                onClick={() => setRemoveStudentDialog(null)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors font-medium"
              >
                返回
              </button>
              <button
                onClick={() => {
                  onRemoveEnrollment?.(
                    removeStudentDialog.course.id,
                    removeStudentDialog.phone,
                  );
                  setRemoveStudentDialog(null);
                }}
                className="px-6 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-all shadow-md active:scale-95"
              >
                確認移除
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmDeleteId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <h2 className="text-xl font-bold mb-2 text-slate-900">
              確認刪除課程？
            </h2>
            <p className="text-slate-500 text-sm mb-4">
              此動作將永久移除該課程及其所有報名資料，您確定要繼續嗎？
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
                  onDeleteCourse(confirmDeleteId);
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

export default CoursesTab;
