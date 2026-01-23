import { IoShieldCheckmark } from "react-icons/io5";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";

export default function ChatWindow() {
  return (
    <main className="hidden md:flex flex-1 flex-col bg-bg-secondary/20">
      <ChatHeader/>
      <div className="flex-1 overflow-y-auto p-6 space-y-4 flex flex-col">
        <div className="flex flex-col items-start max-w-[75%]">
          <div className="bg-bg-primary border border-bg-tertiary/20 text-text-primary px-4 py-2 rounded-2xl rounded-tl-none shadow-sm text-[15px]">
            The Diffie-Hellman keys are generated. I'm using your X25519 public key for the shared secret.
          </div>
          <span className="text-[10px] text-bg-tertiary mt-1 ml-1 font-medium">10:30 AM</span>
        </div>

        <div className="flex flex-col items-end self-end max-w-[75%]">
          <div className="bg-blue-500 text-white px-4 py-2 rounded-2xl rounded-tr-none shadow-sm text-[15px]">
            Perfect. I've stored the derived secret in my local IndexedDB. All future messages will be AES-256 encrypted.
          </div>
          <div className="flex items-center gap-1 mt-1 mr-1">
             <span className="text-[10px] text-bg-tertiary font-medium">10:32 AM</span>
             <IoShieldCheckmark size={12} className="text-bg-tertiary" />
          </div>
        </div>
      </div>
      <MessageInput/>
    </main>
  )
}