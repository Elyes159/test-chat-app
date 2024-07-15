'use client';
import { db } from "@/app/lib/firebase";
import { useUserStore } from "@/app/lib/userStore";
import { collection, query, where, getDocs, DocumentData, setDoc, serverTimestamp, doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";
import { useState } from "react";

export default function AddUser() {
    const [username, setUsername] = useState("");
    const [user, setUser] = useState<DocumentData | null>(null);
    const { currentUser } = useUserStore();

    const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const username = formData.get("username") as string;
        
        try {
            const userRef = collection(db, "users");
            const q = query(userRef, where("displayName", "==", username));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                setUser(querySnapshot.docs[0].data());
            }
            
            querySnapshot.forEach((doc) => {
                console.log(doc.id, " => ", doc.data());
            });
        } catch (err) {
            console.log(err);
        }
    };

    const handleAdd = async () => {
        if (!user || !currentUser) {
            console.error("User id or currentUser uid is missing");
            return;
        }
    
        const chatRef = collection(db, "chats");
        const userChatsRef = collection(db, "userChats");
    
        try {
            const newChatRef = doc(chatRef);
    
            await setDoc(newChatRef, {
                createdAt: serverTimestamp(),
                messages: [],
            });
    
            console.log(newChatRef);
    
            const userChatDoc = doc(userChatsRef, user.uid);
            const currentUserChatDoc = doc(userChatsRef, currentUser.uid);
    
            // Check if the user chat document exists, if not create it
            const userChatDocSnapshot = await getDoc(userChatDoc);
            if (!userChatDocSnapshot.exists()) {
                await setDoc(userChatDoc, {
                    chats: []
                });
            }
    
            // Check if the current user chat document exists, if not create it
            const currentUserChatDocSnapshot = await getDoc(currentUserChatDoc);
            if (!currentUserChatDocSnapshot.exists()) {
                await setDoc(currentUserChatDoc, {
                    chats: []
                });
            }
    
            await updateDoc(userChatDoc, {
                chats: arrayUnion({
                    chatId: newChatRef.id,
                    lastMessage: "",
                    receiverId: currentUser.uid,
                    updatedAt: Date.now(),
                }),
            });
    
            await updateDoc(currentUserChatDoc, {
                chats: arrayUnion({
                    chatId: newChatRef.id,
                    lastMessage: "",
                    receiverId: user.uid,
                    updatedAt: Date.now(),
                }),
            });
        } catch (err) {
            console.log(err);
        }
    };
    
    

    return (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-bold mb-4 text-center">Search for User</h2>
            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    placeholder="Username"
                    name="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg mb-4"
                />
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
                >
                    Search
                </button>
            </form>
            {user && (
                <div className="mt-4 flex justify-between">
                    <div className="flex items-center">
                        <img src={user.photoURL} alt="" className="w-10 h-10 rounded-full mr-2" />
                        <span>{user.displayName}</span>
                    </div>
                    <button onClick={handleAdd} className="mt-2 text-blue-500 hover:underline">Add</button>
                </div>
            )}
        </div>
    );
}
