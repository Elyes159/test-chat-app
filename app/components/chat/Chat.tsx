'use client';

import Image from "next/image";
import EmojiPicker from "emoji-picker-react";
import { useEffect, useState } from "react";
import { arrayUnion, doc, DocumentData, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import { useChatStore } from "@/app/lib/chatStore";
import { useUserStore } from "@/app/lib/userStore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const storage = getStorage();

const upload = async (file: File) => {
  const storageRef = ref(storage, `images/${file.name}`);
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  return url;
};

export default function Chat() {
  const [chat, setChat] = useState<DocumentData | undefined>(undefined);
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [img, setImg] = useState({
    file: null,
    url: "",
  });
  const { chatId, user } = useChatStore();
  const { currentUser } = useUserStore();

  const handleEmoji = (e: any) => {
    setText((prev) => prev + e.emoji);
    setOpen(false);
  };

  const handleImg = (e: any) => {
    if (e.target.files[0]) {
      setImg({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  useEffect(() => {
    if (!chatId) {
      return;
    }

    const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
      setChat(res.data());
    });

    return () => {
      unSub();
    };
  }, [chatId]);

  const handleSend = async () => {
    if (text === "" && !img.file) return;

    let imgUrl = null;
    try {
      if (img.file) {
        imgUrl = await upload(img.file);
      }
      
      if (chatId) { // Ajoutez une vérification ici
        await updateDoc(doc(db, "chats", chatId), {
          messages: arrayUnion({
            senderId: currentUser?.uid,
            text,
            createdAt: new Date(),
            ...(imgUrl && { img: imgUrl })
          })
        });
      }

      const userIDs = [currentUser?.uid, user?.uid]; // Ajoutez une vérification ici

      userIDs.forEach(async (id) => {
        if (id) { // Ajoutez une vérification ici
          const userChatsRef = doc(db, "userChats", id);
          const userChatsSnapshot = await getDoc(userChatsRef);

          if (userChatsSnapshot.exists()) {
            const userChatsData = userChatsSnapshot.data();
            const chatIndex = userChatsData.chats.findIndex((c: { chatId: string }) => c.chatId === chatId);

            if (chatIndex !== -1) {
              userChatsData.chats[chatIndex].lastMessage = text;
              userChatsData.chats[chatIndex].isSeen = id === currentUser?.uid;
              userChatsData.chats[chatIndex].updatedAt = Date.now();

              await updateDoc(userChatsRef, {
                chats: userChatsData.chats,
              });
            }
          }
        }
      });

      setText("");
    } catch (err) {
      console.log(err);
    }
    setImg({
      file: null,
      url: ""
    });
    setText("");
  };

  const selectedUser = JSON.parse(localStorage.getItem('selectedUser') || '{}');

  return (
    <div className="flex flex-col-reverse overflow-y-auto p-4 space-y-4 border-l-4 border-r-4 border-gray-400">
      {/* Chat header */}
      <div className="border-t border-gray-400 flex-shrink-0">
        <div className="flex items-center p-4 border-l-4 border-r-4">
          <div className="flex items-center space-x-2 mr-4 cursor-pointer">
            <img src="./voice.png" alt="Voice" width={20} height={20} />
            <img src="./camera.png" alt="Camera" width={20} height={20} />
            <label htmlFor="file" className="cursor-pointer">
              <img src="./image.png" alt="Send Image" width={20} height={20} />
            </label>
            <input type="file" id="file" style={{ display: "none" }} onChange={handleImg} />
          </div>
          <input
            type="text"
            value={text}
            placeholder="Type a message"
            className="text-black flex-grow bg-transparent border border-gray-400 rounded-lg p-2 mr-4"
            onChange={(e) => setText(e.target.value)}
          />

          <img
            src="./emojis.png"
            width={20}
            height={20}
            className="mr-4 cursor-pointer"
            onClick={() => setOpen((prev) => !prev)}
          />

          {open && (
            <div className="absolute bottom-16 right-4 z-50">
              <EmojiPicker onEmojiClick={handleEmoji} />
            </div>
          )}

          <button className="bg-blue-500 text-white rounded-lg px-4 py-2" onClick={handleSend}>
            Send
          </button>
        </div>
      </div>

      {/* Scrollable messages container */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4 border-l-4 border-r-4 border-gray-200">
        {chat?.messages?.map((message: { createdAt: string; senderId: string; text: string, img?: string }) => (
          <div key={message.createdAt} className={`flex items-start ${message.senderId === currentUser?.uid ? "justify-end" : ""}`}>
            <div className={`p-4 rounded-lg ${message.senderId === currentUser?.uid ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700"}`}>
              {message.img && <img src={message.img} alt="Sent Image" />}
              <p className="text-sm">{message.text}</p>
            </div>
          </div>
        ))}
        {img.url && (
          <div>
            <img src={img.url} alt="Preview" />
          </div>
        )}
      </div>

      {/* Message input area */}
      <div className="flex text-black border-l-4 border-r-4 border-gray-200 flex-shrink-0">
        {/* Left section */}
        <div className="flex items-center px-8 py-4 space-x-4">
          <Image src={selectedUser.photoURL || "/avatar.png"} alt="Avatar" width={60} height={60} className="rounded-full" />
          <div>
            <span className="block font-bold">{selectedUser.displayName || "Anonymous"}</span>
            <p className="text-sm">Lorem ipsum dolor sit amet,</p>
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center px-8 py-4 space-x-4 ml-auto">
          <img src="./phone.png" alt="Phone" width={20} height={20} />
          <img src="./video.png" alt="Video" width={20} height={20} />
          <img src="./info.png" alt="Info" width={20} height={20} />
        </div>
      </div>
    </div>
  );
}
