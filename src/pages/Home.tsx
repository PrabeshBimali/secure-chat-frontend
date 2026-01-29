import BasicLayout from "../layouts/BasicLayout";
import Sidebar from "../features/chat/components/sidebar/Sidebar";
import ChatWindow from "../features/chat/components/chat-area/ChatWindow";

export default function HomePage() {
  return (
    <BasicLayout>
      <div className="flex h-screen bg-bg-primary text-text-primary overflow-hidden">
        <Sidebar/> 
        <ChatWindow/>
      </div>
    </BasicLayout>
  )
}