import BasicLayout from "../layouts/BasicLayout";
import SideBar from "../features/chat/components/sidebar/SideBar";
import ChatWindow from "../features/chat/components/chat-area/ChatWindow";

export default function HomePage() {
  return (
    <BasicLayout>
      <div className="flex h-screen bg-bg-primary text-text-primary overflow-hidden">
        <SideBar/> 
        <ChatWindow/>
      </div>
    </BasicLayout>
  )
}