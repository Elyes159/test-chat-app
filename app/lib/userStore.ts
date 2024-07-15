// lib/userStore.ts
import { create } from 'zustand';
import { db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';

interface User {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  createdAt: Date;
}

interface UserState {
  currentUser: User | null;
  chatUser: User | null;
  isLoading: boolean;
  fetchUserInfo: (uid: string | null) => Promise<void>;
  fetchChatUserInfo: (uid: string) => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
  currentUser: null,
  chatUser: null,
  isLoading: true,
  fetchUserInfo: async (uid) => {
    if (!uid) {
      set({ currentUser: null, isLoading: false });
      return;
    }

    try {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        set({ currentUser: docSnap.data() as User, isLoading: false });
      } else {
        set({ currentUser: null, isLoading: false });
      }
    } catch (error) {
      set({ currentUser: null, isLoading: false });
    }
  },
  fetchChatUserInfo: async (uid) => {
    if (!uid) {
      set({ chatUser: null, isLoading: false });
      return;
    }

    try {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        set({ chatUser: docSnap.data() as User, isLoading: false });
      } else {
        set({ chatUser: null, isLoading: false });
      }
    } catch (error) {
      set({ chatUser: null, isLoading: false });
    }
  }
}));
