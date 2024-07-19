'use client';

import Image from "next/image";
import { useEffect, useState } from "react";
import AddUser from "./addUser/addUser";
import { useUserStore } from "@/app/lib/userStore";
import { doc, getDoc, onSnapshot, DocumentData } from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import { useChatStore } from "@/app/lib/chatStore";

export default function ChatList() {
  const [addMode, setAddMode] = useState(false);
  const [chats, setChats] = useState<{
    lastMessage: string;
    chatId: string;
    receiverId: string;
    updatedAt: number;
    user: DocumentData; // Changez ceci pour rendre 'user' requis
  }[]>([]);

  const { currentUser } = useUserStore();
  const { changeChat, chatId } = useChatStore((state) => ({
    changeChat: state.changeChat,
    chatId: state.chatId
  }));

  useEffect(() => {
    if (currentUser?.uid) {
      const unSub = onSnapshot(doc(db, "userChats", currentUser.uid), async (res) => {
        const data = res.data();
        if (data && data.chats) {
          const items = data.chats;
          const promises = items.map(async (item: { receiverId: string; }) => {
            const userDocRef = doc(db, "users", item.receiverId);
            const userDocSnap = await getDoc(userDocRef);
            const user = userDocSnap.data();

            return { ...item, user };
          });

          const chatData = await Promise.all(promises);
          const sortedChats = chatData.sort((a, b) => b.updatedAt - a.updatedAt); // Tri par updatedAt décroissant
          setChats(sortedChats);
        } else {
          setChats([]); 
        }
      });
      return () => {
        unSub();
      };
    }
  }, [currentUser?.uid]);

  const handleSelect = (chat: { chatId: string; user: any }) => {
    if (chat.chatId && chat.user) {
      // Stocker les informations de l'utilisateur sélectionné dans le local storage
      localStorage.setItem('selectedUser', JSON.stringify({
        chatId: chat.chatId,
        displayName: chat.user.displayName,
        photoURL: chat.user.photoURL,
      }));
  
      // Changer le chat
      changeChat(chat.chatId, chat.user);
    } else {
      console.error("Invalid chat selected", chat);
    }
  };

  return (
    <div className="text-black p-4 h-screen flex flex-col">
      <div className="bg-gray-400 bg-opacity-50 backdrop-filter backdrop-blur-md rounded-lg px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-2" style={{ width: "250px", height: "20px" }}>
          <img src="/search.png" alt="Search Icon" className="w-4 h-4" />
          <input type="text" placeholder="Search" className="border border-transparent px-2 py-1 rounded-md focus:outline-none focus:border-transparent bg-transparent w-full" />
        </div>
        
        <div className="bg-gray-200 rounded-full p-1">
          <img
            src={addMode ? "/minus.png" : "/plus.png"}
            alt="Plus Icon"
            onClick={() => setAddMode((prev) => !prev)}
            className="w-4 h-4 cursor-pointer"
          />
        </div>
      </div>

      <div className="flex flex-col flex-1 overflow-y-auto mt-4">
        {chats.map(chat => (
          <div className="flex items-center space-x-4 cursor-pointer" key={chat.chatId} onClick={() => handleSelect(chat)}>
            <Image src={chat.user?.photoURL} alt="Avatar" width={48} height={48} className="rounded-full" />
            <div>
              <span className="block font-bold">{chat.user?.displayName ?? 'Unknown'}</span>
              <p className="text-sm text-black">{chat.lastMessage}</p>
            </div>
          </div>
        ))}
        <hr className="my-4 border-gray-400" />
      </div>
     
      {addMode && <AddUser />}
    </div>
  );
}
