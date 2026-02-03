import BasicLayout from "../layouts/BasicLayout";
import Sidebar from "../features/chat/components/sidebar/Sidebar";
import ChatArea from "../features/chat/components/chat-area/ChatArea";
import { ActiveChatProvider } from "../features/chat/context/SelectedUserForChatProvider";

export default function HomePage() {
  return (
    <BasicLayout>
      <div className="flex h-screen bg-bg-primary text-text-primary overflow-hidden">
        <ActiveChatProvider>
          <Sidebar/> 
          <ChatArea/>
        </ActiveChatProvider>
      </div>
    </BasicLayout>
  )
}