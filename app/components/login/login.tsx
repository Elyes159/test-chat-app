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
  
      // Stocker user.uid dans localStorage
      localStorage.setItem("userUid", user.uid);
  
      // Vérifier si l'utilisateur existe déjà dans Firestore
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnapshot = await getDoc(userDocRef);
  
      if (userDocSnapshot.exists()) {
        try {
          const userData = userDocSnapshot.data(); // Données Firestore de l'utilisateur
          
          const response = await fetch("http://localhost:4000/user/stockInMongo", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: userData.email,
              nom: userData.displayName,
              idTwitter: user.providerData[0].displayName, // Si createdAt est un timestamp Firestore
              // Autres données que vous voulez envoyer à votre API
            }),
          });
  
          if (response.ok) {
            console.log("User data stored successfully in MongoDB");
          } else {
            console.error("Failed to store user data in MongoDB");
          }
        } catch (error) {
          if (error instanceof Error) {
            console.error("Error during API call: ", error.message);
          } else {
            console.error("An unknown error occurred");
          }
        }
        router.push("/");
      } else {
        // Si l'utilisateur n'existe pas encore dans Firestore, vous pouvez le créer ici
        await setDoc(userDocRef, {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          createdAt: new Date(),
        });

        // Ensuite, rediriger vers la page de signup
        router.push("/signup");
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error during sign in: ", error.message);
      } else {
        console.error("An unknown error occurred");
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
            <p className="text-gray-700">Don&apos;t have an account? <Link href="/signup" className="text-blue-500">Sign up</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}
