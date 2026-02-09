import React, { useState, useCallback, useEffect } from "react";
import { Article, Course, UserState } from "./types";
import NewsTab from "./components/NewsTab";
import CoursesTab from "./components/CoursesTab";
import SettingsTab from "./components/SettingsTab";
import LoginPrompt from "./components/LoginPrompt";
import ArticleForm from "./components/ArticleForm";
import CourseForm from "./components/CourseForm";
import Layout from "./components/Layout";
import { storage } from "./utils/storage";
import * as fb from "./services/firebase";

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [formView, setFormView] = useState<{
    type: "article" | "course";
    item?: any;
  } | null>(null);
  const [userState, setUserState] = useState<UserState>(() =>
    storage.get("hk_hub_session", {
      isLoggedIn: false,
      userPhone: null,
      userName: null,
      isAdmin: false,
      fontSize: 1.2,
    }),
  );

  const [articles, setArticles] = useState<Article[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [usersMap, setUsersMap] = useState<Record<string, any>>({});

  useEffect(() => {
    document.documentElement.style.fontSize = `${userState.fontSize}rem`;
  }, [userState.fontSize]);

  useEffect(() => {
    const unsubA = fb.subscribeToArticles(setArticles);
    const unsubC = fb.subscribeToCourses((data) => {
      setCourses(data);
      setIsLoading(false);
    });
    const unsubU = fb.subscribeToUsers(setUsersMap);
    return () => {
      unsubA();
      unsubC();
      unsubU();
    };
  }, []);

  // 當 usersMap 更新時，同步當前登入用戶的 isAdmin 狀態
  useEffect(() => {
    if (
      userState.isLoggedIn &&
      userState.userPhone &&
      usersMap[userState.userPhone]
    ) {
      const liveAdminStatus = !!usersMap[userState.userPhone].isAdmin;
      if (liveAdminStatus !== userState.isAdmin) {
        setUserState((prev) => ({ ...prev, isAdmin: liveAdminStatus }));
      }
    }
  }, [usersMap, userState.userPhone, userState.isLoggedIn, userState.isAdmin]);

  useEffect(() => {
    storage.set("hk_hub_session", userState);
  }, [userState]);

  const handleLogin = (phone: string, userData: any) => {
    setUserState((prev) => ({
      ...prev,
      isLoggedIn: true,
      userPhone: phone,
      userName: userData.name,
      // 完全依賴資料庫傳回的 isAdmin 標記
      isAdmin: userData.isAdmin === true,
    }));
  };

  const handleLogout = () => {
    setUserState((prev) => ({
      ...prev,
      isLoggedIn: false,
      userPhone: null,
      isAdmin: false,
    }));
    setActiveTab(0);
  };

  const getUserName = useCallback(
    (phone: string) => {
      return usersMap[phone]?.name || phone;
    },
    [usersMap],
  );

  if (isLoading)
    return (
      <div className="h-screen flex items-center justify-center bg-blue-50 text-blue-600 italic">
        載入中...
      </div>
    );

  // 處理頁面渲染
  if (formView?.type === "article") {
    return (
      <ArticleForm
        item={formView.item}
        onClose={() => setFormView(null)}
        onSave={async (title, content, imageUrl) => {
          if (formView.item) {
            await fb.updateArticle(formView.item.id, title, content, imageUrl);
          } else {
            await fb.addArticle(title, content, imageUrl);
          }
          setFormView(null);
        }}
      />
    );
  }

  if (formView?.type === "course") {
    return (
      <CourseForm
        item={formView.item}
        onClose={() => setFormView(null)}
        onSave={async (name, date, desc) => {
          if (formView.item) {
            await fb.updateCourse(formView.item.id, name, date, desc);
          } else {
            await fb.addCourse(name, date, desc);
          }
          setFormView(null);
        }}
      />
    );
  }

  return (
    <div>
      <Layout
        activeTab={activeTab}
        onTabChange={setActiveTab}
        title={["最新公告", "課程報名", "個人設定"][activeTab]}
      >
        <div className="fade-in max-w-2xl mx-auto">
          {activeTab === 0 && (
            <NewsTab
              articles={articles}
              userState={userState}
              onOpenForm={(item) => setFormView({ type: "article", item })}
              onDeleteArticle={fb.deleteArticle}
              onToggleLike={(id) => {
                const a = articles.find((x) => x.id === id);
                if (a && userState.userPhone)
                  fb.toggleArticleLike(
                    id,
                    userState.userPhone,
                    a.likedBy.includes(userState.userPhone),
                  );
              }}
              getUserName={getUserName}
            />
          )}
          {activeTab === 1 &&
            (userState.isLoggedIn ? (
              <CoursesTab
                courses={courses}
                userState={userState}
                onEnroll={fb.enrollInCourse}
                onOpenForm={(item) => setFormView({ type: "course", item })}
                onDeleteCourse={fb.deleteCourse}
                onRemoveEnrollment={fb.cancelEnrollment}
                getUserName={getUserName}
              />
            ) : (
              <LoginPrompt onLoginSuccess={handleLogin} />
            ))}
          {activeTab === 2 &&
            (userState.isLoggedIn ? (
              <SettingsTab
                userState={userState}
                onStateChange={setUserState}
                onLogout={handleLogout}
                onNameChange={async (n) => {
                  await fb.updateUserName(userState.userPhone!, n);
                  setUserState((prev) => ({ ...prev, userName: n }));
                }}
              />
            ) : (
              <LoginPrompt onLoginSuccess={handleLogin} />
            ))}
        </div>
      </Layout>
    </div>
  );
};

export default App;
