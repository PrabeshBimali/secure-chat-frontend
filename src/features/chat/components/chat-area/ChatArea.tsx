import { useEffect, useState } from "react";
import { useAuth } from "../../../../context/AuthProvider";
import ChatHeader from "./ChatHeader";
import ChatFooter from "./ChatFooter";
import MessageList from "./MessageList";
import { useSelectedUserForChat } from "../../context/SelectedUserForChatProvider";
import { getRecentChatHistory, type MessageDetail, type UserRelationshipStatusType } from "../../../../services/chatServices";

export interface ChatPartner {
  id: number
  username: string
  friendshipStatus: UserRelationshipStatusType
  roomid: string
}

export default function ChatArea() {
  
  const { user, refreshUser } = useAuth()
  const { selectedUser } = useSelectedUserForChat()
  const [ chatPartner, setChatPartner ] = useState<ChatPartner | null>(null) 
  const [ messageDetails, setMessageDetails ] = useState<Array<MessageDetail>>([])
  const [ isMessagesLoading, setIsMessagesLoading ] = useState<boolean>(false)
  
  useEffect(() => {
    if(!selectedUser) {
      return
    }

    if(!user) {
      refreshUser()
      return
    }

    setIsMessagesLoading(true)
    setChatPartner(null)
    setMessageDetails([])
    
    const controller = new AbortController()
    const signal = controller.signal

    const fetchChatContext = async () => {
      try {
        const result = await getRecentChatHistory(selectedUser.id, signal)

        if(!result.success) {
          throw new Error(result.message)
        }

        const chatHistoryWithPartner = result.data

        if(!chatHistoryWithPartner) {
          //TODO maybe some eerror here on toast
          return
        }

        setChatPartner({
          id: chatHistoryWithPartner.id,
          username: chatHistoryWithPartner.username,
          friendshipStatus: chatHistoryWithPartner.friendshipStatus,
          roomid: chatHistoryWithPartner.roomid
        })

        setMessageDetails(chatHistoryWithPartner.messsages)
      } catch(error) {
        if(error instanceof DOMException && error.name === "AbortError") {
          return
        }
        console.log("Some Error: ", error)
      } finally {
        setIsMessagesLoading(false)
      }
    }
    
    fetchChatContext()

  }, [selectedUser])

  function handleSendMessage(text: string) {
    if(selectedUser === null) {
      //TODO Add some toast error
      return
    }

  }

  return (
    <main className="hidden md:flex flex-1 flex-col bg-bg-secondary/20">
      <ChatHeader/>
      <MessageList
        isMessagesLoading={isMessagesLoading}
      />
      <ChatFooter
        chatPartner={chatPartner}
        onSendMesage={handleSendMessage}
      />
    </main>
  )
}