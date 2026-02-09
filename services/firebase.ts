import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { Article, Course } from '../types';

// 金鑰透過 vite.config.ts 注入 process.env，達成從 .env 導入的效果
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

// 初始化 Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
export const db = firebase.firestore();

// --- 公告 (Articles) ---
export const subscribeToArticles = (callback: (articles: Article[]) => void) => {
  return db.collection('articles').orderBy('date', 'desc').onSnapshot((snapshot) => {
    const articles = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: (doc.data().date as firebase.firestore.Timestamp).toDate()
    })) as Article[];
    callback(articles);
  });
};

export const addArticle = async (title: string, content: string, imageUrl?: string) => {
  await db.collection('articles').add({
    title,
    content,
    imageUrl: imageUrl || null,
    date: firebase.firestore.Timestamp.now(),
    likedBy: []
  });
};

export const updateArticle = async (articleId: string, title: string, content: string, imageUrl?: string) => {
  await db.collection('articles').doc(articleId).update({
    title,
    content,
    imageUrl: imageUrl || null
  });
};

export const deleteArticle = async (articleId: string) => {
  await db.collection('articles').doc(articleId).delete();
};

export const toggleArticleLike = async (articleId: string, phone: string, isLiked: boolean) => {
  const articleRef = db.collection('articles').doc(articleId);
  await articleRef.update({
    likedBy: isLiked 
      ? firebase.firestore.FieldValue.arrayRemove(phone) 
      : firebase.firestore.FieldValue.arrayUnion(phone)
  });
};

// --- 課程 (Courses) ---
export const subscribeToCourses = (callback: (courses: Course[]) => void) => {
  return db.collection('courses').orderBy('date', 'asc').onSnapshot((snapshot) => {
    const courses = snapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
      date: (doc.data().date as firebase.firestore.Timestamp).toDate()
    })) as Course[];
    callback(courses);
  });
};

export const addCourse = async (name: string, date: string, desc: string) => {
  await db.collection('courses').add({
    name,
    desc,
    date: firebase.firestore.Timestamp.fromDate(new Date(date)),
    enrolledUsers: []
  });
};

export const updateCourse = async (courseId: string, name: string, date: string, desc: string) => {
  await db.collection('courses').doc(courseId).update({
    name,
    desc,
    date: firebase.firestore.Timestamp.fromDate(new Date(date))
  });
};

export const deleteCourse = async (courseId: string) => {
  await db.collection('courses').doc(courseId).delete();
};

export const enrollInCourse = async (courseId: string, phone: string) => {
  await db.collection('courses').doc(courseId).update({
    enrolledUsers: firebase.firestore.FieldValue.arrayUnion(phone)
  });
};

export const cancelEnrollment = async (courseId: string, phone: string) => {
  await db.collection('courses').doc(courseId).update({
    enrolledUsers: firebase.firestore.FieldValue.arrayRemove(phone)
  });
};

// --- 用戶 (Users) ---
export const subscribeToUsers = (callback: (users: Record<string, any>) => void) => {
  return db.collection('users').onSnapshot((snapshot) => {
    const users: Record<string, any> = {};
    snapshot.docs.forEach(doc => {
      users[doc.id] = doc.data();
    });
    callback(users);
  });
};

export const getUserData = async (phone: string) => {
  const userSnap = await db.collection('users').doc(phone).get();
  return userSnap.exists ? userSnap.data() : null;
};

export const registerUser = async (phone: string, name: string) => {
  await db.collection('users').doc(phone).set({
    name,
    isAdmin: false,
    createdAt: firebase.firestore.Timestamp.now()
  });
  return { name, isAdmin: false };
};

export const updateUserName = async (phone: string, name: string) => {
  await db.collection('users').doc(phone).set({ name }, { merge: true });
};