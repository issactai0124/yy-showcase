
export interface Article {
  id: string;
  title: string;
  content: string;
  likedBy: string[];
  date: Date;
  imageUrl?: string;
}

export interface Course {
  id: string;
  name: string;
  desc: string;
  date: Date;
  enrolledUsers: string[];
}

export interface UserState {
  isLoggedIn: boolean;
  userPhone: string | null;
  userName: string | null;
  isAdmin: boolean;
  fontSize: number;
}
