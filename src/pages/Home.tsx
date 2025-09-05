import Chat from "../components/Chat";
import ChatList from "../components/ChatList";
import BasicLayout from "../layouts/BasicLayout";

export default function HomePage() {
  return (
    <BasicLayout>
      <div className="flex h-full">
        <ChatList/>
        <Chat/>
      </div>
    </BasicLayout>
  )
}