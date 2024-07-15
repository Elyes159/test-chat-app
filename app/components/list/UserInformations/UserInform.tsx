import Image from "next/image";
import { useUserStore } from "../../../lib/userStore";

export default function UserInform() {
  const { currentUser } = useUserStore();

  return (
    <div className="text-black p-2 flex justify-between">
      {/* Left section */}
      <div className="flex space-x-6">
        <div className="w-8 h-8">
        <Image
            src={currentUser && currentUser.photoURL ? currentUser.photoURL : "/avatar.png"}
            alt="Avatar"
            width={48}
            height={48}
            className="rounded-full"
          />
          </div>
        <h2 className="text-xl font-bold">{currentUser ? currentUser.displayName : "Loading..."}</h2>
      </div>
      
      {/* Right section */}
      <div className="flex items-center space-x-4">
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      </div>
      <div className="flex items-center space-x-4">
        <Image src="/more.png" alt="More Icon" width={24} height={24} />
        <Image src="/video.png" alt="Video Icon" width={24} height={24} />
        <Image src="/edit.png" alt="Edit Icon" width={24} height={24} />
      </div>
    </div>
  );
}
