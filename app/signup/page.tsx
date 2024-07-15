"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "../lib/firebase";
import { doc, setDoc, getDoc,updateDoc } from "firebase/firestore";
import Link from "next/link";
import localforage from "localforage";
import { toast } from 'react-toastify';

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const userUid = await localforage.getItem<string>("userUid");
      if (!userUid) {
        router.push("/signup");
      }
    };

    checkUser();
  }, [router]);

  const handleSignUp = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const userUid = await localStorage.getItem("userUid");
    if (!userUid) {
      console.error("User UID is not available");
      return; // Handle the error accordingly
    }

    const userDocRef = doc(db, "users", userUid);
    await updateDoc(userDocRef, {
      uid: userUid,
      displayName: name,
      email: email,
      createdAt: new Date(),
    });
    const userChatDocRef = doc(db, "userChats", userUid);
    await setDoc(userChatDocRef, {
      chats:[],
    });

    toast.success("Account created")
    router.push("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-gray-300 rounded-lg shadow-lg overflow-hidden relative">
        <div className="absolute inset-0 bg-white bg-opacity-50 blur-md"></div>
        <div className="relative z-10 p-8">
          <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>
          <form onSubmit={handleSignUp}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 mb-2">Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-black w-full p-2 border border-gray-300 rounded-lg"
                placeholder="Enter your name"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="text-black w-full p-2 border border-gray-300 rounded-lg"
                placeholder="Enter your email"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-700 mb-2">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="text-black w-full p-2 border border-gray-300 rounded-lg"
                placeholder="Enter your password"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="confirm-password" className="block text-gray-700 mb-2">Confirm Password</label>
              <input
                type="password"
                id="confirm-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="text-black w-full p-2 border border-gray-300 rounded-lg"
                placeholder="Confirm your password"
              />
            </div>
            <button type="submit" className="w-full bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 mb-4">Sign Up</button>
            <Link href="/" legacyBehavior>
              <a className="w-full bg-gray-500 text-white p-2 rounded-lg hover:bg-gray-600 text-center block">Already have an account? Login</a>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
