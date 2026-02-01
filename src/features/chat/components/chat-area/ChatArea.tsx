import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageList from "./MessageList";

export default function ChatArea() {
  return (
    <main className="hidden md:flex flex-1 flex-col bg-bg-secondary/20">
      <ChatHeader/>
      <MessageList/>
      <MessageInput/>
    </main>
  )
}