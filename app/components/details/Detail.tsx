import { useEffect } from 'react';
import { auth } from "@/app/lib/firebase";
import { useUserStore } from "@/app/lib/userStore";
import Image from "next/image";
import { useChatStore } from '@/app/lib/chatStore';

function Details() {
  const { chatUser, fetchChatUserInfo } = useUserStore();
  const { chatId, user } = useChatStore(); // Assurez-vous d'avoir accès à user de chatStore

  useEffect(() => {
    if (user?.uid) {
      fetchChatUserInfo(user.uid);
    }
  }, [user?.uid, fetchChatUserInfo]);

  return (
    <div className="text-black p-4 space-y-4">
      <div className="flex items-center space-x-4">
        <img src="./avatar.png" alt="" className="w-16 h-16 rounded-full" />
        <div>
          <h2 className="font-bold text-lg">{chatUser?.displayName}</h2>
          <p className="text-sm text-gray-500">Lorem ipsum dolor sit,</p>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-4 space-y-4">
        <div>
          <div className="flex items-center justify-between">
            <span className="font-medium">Chat Settings</span>
            <img src="./arrowUp.png" alt="" className="w-4 h-4" />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <span className="font-medium">Privacy & Help</span>
            <img src="./arrowUp.png" alt="" className="w-4 h-4" />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <span className="font-medium">Shared Photos</span>
            <img src="./arrowDown.png" alt="" className="w-4 h-4" />
          </div>
          <div className="flex items-center justify-between mt-2 p-2 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <img src="./egg.png" alt="" className="w-8 h-8" />
              <span className="text-sm">photo_2024_2.png</span>
            </div>
            <img src="./download.png" alt="" className="w-4 h-4" />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <span className="font-medium">Shared Files</span>
            <img src="./arrowUp.png" alt="" className="w-4 h-4" />
          </div>
        </div>
      </div>

      <button className="w-full py-2 bg-red-400 text-white font-bold rounded-lg">Block User</button>
      <button className="w-full py-2 bg-blue-400 text-white font-bold rounded-lg" onClick={() => auth.signOut()}>Logout</button>
    </div>
  );
}

export default Details;
