import { IoChatbubble } from "react-icons/io5"
import { useSelectedUserForChat } from "../../context/SelectedUserForChatProvider"
import { useEffect, useRef, useSyncExternalStore } from "react"
import { activeChatStore } from "../../../../store/ActiveChatStore"
import MessageBox from "./MessageBox"

interface MessageListProps {
  isMessagesLoading: boolean
  isLoadingHistory: boolean
  onLoadHistory: () => void
}

export default function MessageList(props: MessageListProps) {
  
  const scrollRef = useRef<HTMLDivElement>(null)
  const messages = useSyncExternalStore(activeChatStore.subscribe, activeChatStore.getSnapshot)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { isMessagesLoading, isLoadingHistory, onLoadHistory } = props
  const { selectedUser } = useSelectedUserForChat()

  /* 
    TODO: This scroll logic scrolls back user to bottom even when they are reading chat history if new message is received
    this should only be scrolled to bottom if they are close to it.
  */
  useEffect(() => {
    const endContainer = messagesEndRef.current
    if(!endContainer) return

    const scrollToBottom = () => {
      endContainer.scrollIntoView({ behavior: "smooth" })
    }
    scrollToBottom()
  }, [messages])


  useEffect(() => {
    const container = scrollRef.current
    if (!container) return
  
    const handleScroll = () => {
      const position = container.scrollTop - 100

      if(position <= 0 && !isLoadingHistory) {
        onLoadHistory()
      }
    }

    container.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [isMessagesLoading])
  
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
        <p className="text-sm font-medium">Messages are Loading...</p>
      </div>
    );
  }

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 flex flex-col">
      <div className={`flex-1 flex flex-col items-center justify-center p-5 text-bg-tertiary ${ isLoadingHistory ? "" : "invisible"}`}>
        <div className="w-4 h-4 border-3 border-t-blue-500 border-bg-secondary rounded-full animate-spin mb-4" />
        <p className="text-xs font-medium">Loading message History...</p>
      </div>

      <div className="flex-1"/>
      {
        messages.map((message) => {
          return <MessageBox messageDetail={message} key={message.id}/>
        })
      }
      <div ref={messagesEndRef}/>
    </div>
  )
}