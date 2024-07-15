"use client";
import { useRouter } from "next/navigation";
import { auth, twitterProvider } from "../../lib/firebase";
import { signInWithPopup } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import Link from "next/link";

export default function Login() {
  const router = useRouter();

  const handleTwitterLogin = async () => {
    try {
      const result = await signInWithPopup(auth, twitterProvider);
      const user = result.user;
      console.log("User Info: ", user);
  
      // Stocker user.uid dans localStorage
      localStorage.setItem("userUid", user.uid);
      
      console.log(user.uid)
  
      // Vérifiez si l'utilisateur existe déjà dans Firestore
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);
  
      if (userDoc.exists()) {
        // Si l'utilisateur existe, rediriger vers le dashboard
        router.push("/");
      } else {
        // Sinon, stocker l'utilisateur dans Firestore
        await setDoc(userDocRef, {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          createdAt: new Date(),
        });
  
        // Rediriger vers la page de signup
        router.push("/signup");
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error during sign in: ", error.message);
      } else {
        console.error("Unexpected error", error);
      }
    }
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-gray-300 rounded-lg shadow-lg overflow-hidden relative w-full max-w-md">
        <div className="absolute inset-0 bg-white bg-opacity-50 blur-md"></div>

        <div className="relative z-10 p-8">
          <h2 className="text-3xl font-bold mb-4 text-center">Welcome to ReactChat</h2>
          <p className="text-center mb-6">Connect with your friends and family instantly!</p>
          
          <button
            type="button"
            onClick={handleTwitterLogin}
            className="w-full bg-blue-400 text-white p-2 rounded-lg hover:bg-blue-500 mb-4"
          >
            Login with Twitter
          </button>

          <div className="text-center mt-6">
            <p className="text-gray-700">Don't have an account? <Link href="/signup" className="text-blue-500">Sign up</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}
