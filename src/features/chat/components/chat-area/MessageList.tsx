import { IoShieldCheckmark, IoChatbubble } from "react-icons/io5"
import { useSelectedUserForChat } from "../../context/SelectedUserForChatProvider"

interface MessageListProps {
  isMessagesLoading: boolean
}

export default function MessageList(props: MessageListProps) {

  const { isMessagesLoading } = props

  const { selectedUser } = useSelectedUserForChat() 

  if(!selectedUser) {
    return(
      <div className="flex-1 flex flex-col items-center justify-center bg-bg-primary text-text-secondary">
        <div className="w-20 h-20 mb-4 opacity-20">
           <IoChatbubble size={80} />
        </div>
        <h2 className="text-xl font-semibold">No Conversation Selected</h2>
        <p className="text-sm opacity-60">Pick someone from the left to start a chat.</p>
      </div>
    )
  }
  
  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-10 text-bg-tertiary">
        <div className="w-8 h-8 border-4 border-t-blue-500 border-bg-secondary rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium">Messages are Loding...</p>
      </div>
    );
  }

  return (
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
  )
}