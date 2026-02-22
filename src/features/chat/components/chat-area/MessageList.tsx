import { IoChatbubble } from "react-icons/io5"
import { useSelectedUserForChat } from "../../context/SelectedUserForChatProvider"
import { useSyncExternalStore } from "react"
import { activeChatStore } from "../../../../store/ActiveChatStore"
import MessageBox from "./MessageBox"

interface MessageListProps {
  isMessagesLoading: boolean
}

export default function MessageList(props: MessageListProps) {
  const messages = useSyncExternalStore(activeChatStore.subscribe, activeChatStore.getSnapshot)

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
      {
        messages.map((message, index) => {
          return <MessageBox messageDetail={message} key={index}/>
        })
      }
    </div>
  )
}