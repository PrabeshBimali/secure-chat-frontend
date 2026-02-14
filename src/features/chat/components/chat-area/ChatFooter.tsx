import { IoSend } from "react-icons/io5"
import { UserRelationshipStatus } from "../../../../services/chatServices"
import type { ChatPartner } from "./ChatArea"
import { useState } from "react"

interface ChatFooterProps {
  chatPartner: ChatPartner | null
  onSendMesage: (text: string) => void
}

export default function ChatFooter({ chatPartner, onSendMesage }: ChatFooterProps) {
  const [message, setMessage] = useState("")

  if(!chatPartner) return null;

  if(chatPartner.friendshipStatus === UserRelationshipStatus.YOU_BLOCKED) {
    return <div className="p-4 text-center text-text-primary italic">You blocked this user.</div>;
  }
  
  if(chatPartner.friendshipStatus === UserRelationshipStatus.THEY_BLOCKED) {
    return <div className="p-4 text-center text-text-primary italic">User Unavailable</div>;
  }

  if(chatPartner.friendshipStatus === UserRelationshipStatus.REQUEST_SENT) {
    return <div className="p-4 text-center text-text-primary">Waiting for {chatPartner.username} to accept...</div>;
  }

  //if(chatPartner.friendshipStatus === UserRelationshipStatus.REQUEST_RECEIVED) {
    // TODO we have to add some button
  //}

  return (
    <div className="p-4 bg-bg-primary">
      <div className="flex items-end gap-2 max-w-5xl mx-auto">
        <div className="flex-1 flex items-center bg-bg-secondary/50 border border-bg-tertiary/10 rounded-3xl px-4 py-2 shadow-inner">
          <textarea 
            rows={1}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={
              chatPartner.friendshipStatus === UserRelationshipStatus.NONE 
                ? "Send a message to connect..." 
                : "Type a message..."
            }
            className="flex-1 bg-transparent border-none focus:outline-none resize-none py-1 text-[15px] text-text-primary"
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement
              target.style.height = 'auto'
              target.style.height = `${target.scrollHeight}px`
            }}
          />
        </div>

        <button 
          onClick={() => {
            onSendMesage(message)
            if (message.trim()) {
              setMessage("")
            }
          }}
          disabled={!message.trim()}
          className="p-3 bg-bg-tertiary text-white rounded-full cursor-pointer hover:brightness-110 active:scale-95 transition-all shadow-md disabled:opacity-50"
        >
          <IoSend size={20} />
        </button>
      </div>
    </div>
  );
}