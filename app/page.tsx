"use client";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./lib/firebase";
import { useUserStore } from "./lib/userStore";
import List from "./components/list/List";
import Chat from "./components/chat/Chat";
import Details from "./components/details/Detail";
import Login from "./components/login/login";
import { useChatStore } from "./lib/chatStore";

export default function Home() {
  const { currentUser, isLoading, fetchUserInfo } = useUserStore((state) => ({
    currentUser: state.currentUser,
    isLoading: state.isLoading,
    fetchUserInfo: state.fetchUserInfo,
  }));

  const { chatId } = useChatStore((state) => ({
    chatId: state.chatId,
  }));

  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (user) => {
      fetchUserInfo(user?.uid || null);
    });

    return () => {
      unSub();
    };
  }, [fetchUserInfo]);

  if (isLoading) return (
    <div className="text-black flex items-center justify-center min-h-screen bg-gray-900">
      <div className="spinner-border animate-spin inline-block w-12 h-12 border-4 rounded-full" role="status"></div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {currentUser ? (
        <div className="w-8/9 h-screen-5/5 bg-gray-300 rounded-lg shadow-lg overflow-hidden relative">
          <div className="absolute inset-0 bg-white bg-opacity-50 blur-md"></div>
          <div className="relative z-10 flex p-4 h-full">
            <List />
            <div className="flex-grow h-full flex flex-col">
              {chatId && <Chat />}
            </div>
            {chatId && <Details />}
          </div>
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <Login />
        </div>
      )}
    </div>
  );
}
