import Image from "next/image";
import UserInform from "./UserInformations/UserInform";
import ChatList from "./chatList/ChatList";

export default function List() {
  return (
    <div className="text-black">
        <UserInform/>
        <ChatList/>
    </div> 
);
}
