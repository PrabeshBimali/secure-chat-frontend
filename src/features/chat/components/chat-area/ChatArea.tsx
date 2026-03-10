import { useEffect, useState, useSyncExternalStore } from "react";
import { useAuth } from "../../../../context/AuthProvider";
import ChatHeader from "./ChatHeader";
import ChatFooter from "./ChatFooter";
import MessageList from "./MessageList";
import { useSelectedUserForChat } from "../../context/SelectedUserForChatProvider";
import { decryptMessagesForUI, decryptMessagesWorker, getRecentChatHistory, sendMessage } from "../../../../services/chatServices";
import { useToast } from "../../../../context/ToastProvider";
import { encryptMessage } from "../../../../lib/crypto/msgEncDec";
import { privateKeyStore } from "../../../../store/PrivateKeyStore";
import { hexToBytes } from "@noble/curves/utils.js";
import { activeChatPartnerStore } from "../../../../store/ActivePartnerStore";
import { activeChatStore, type MessageDetailForUI } from "../../../../store/ActiveChatStore";
import { formatDate } from "../../../../lib/utils/dateFormatter";

export default function ChatArea() {
  const MAX_CHAR_LIMIT = 1500
  
  const { user, refreshUser } = useAuth()
  const { selectedUser } = useSelectedUserForChat()
  const [ isMessagesLoading, setIsMessagesLoading ] = useState<boolean>(false)

  const { addToast } = useToast()
  const activeChatPartner = useSyncExternalStore(activeChatPartnerStore.subscribe, activeChatPartnerStore.getSnapshot)
  
  useEffect(() => {
    if(!selectedUser) {
      return
    }

    if(!user) {
      refreshUser()
      return
    }

    setIsMessagesLoading(true)
    activeChatStore.setState([])
    
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
          //TODO: maybe some eerror here on toast
          return
        }
        
        activeChatPartnerStore.setState({
          id: chatHistoryWithPartner.id,
          username: chatHistoryWithPartner.username,
          friendshipStatus: chatHistoryWithPartner.friendshipStatus,
          publicKey: chatHistoryWithPartner.publicKey,
          roomId: chatHistoryWithPartner.roomid
        })

        const encryptionKey = privateKeyStore.getKey()

        // TODO: send user to pwd only login
        if(encryptionKey === null) {
          throw Error("Encryption key not set")
        }

        const decryptedMessagesDetail = await decryptMessagesWorker(chatHistoryWithPartner.messages, encryptionKey, hexToBytes(chatHistoryWithPartner.publicKey))
        activeChatStore.setState(decryptedMessagesDetail)
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

  }, [selectedUser?.id])


  async function handleSendMessage(text: string) {
    //TODO: show error and send to login page
    if(!user) {
      console.error("User doesn't exist login")
      return
    }

    const msg = text.trim()

    if(msg.length <= 0) return

    if(msg.length > MAX_CHAR_LIMIT) {
      addToast("Message Too Long!", "error", 3000)
      return
    }

    if(selectedUser === null) {
      addToast("Failed to send msg", "error", 3000)
      return
    }

    const encryptionKey = privateKeyStore.getKey()

    if(!encryptionKey) {
      console.error("Privatee key not found")
      return
    }

    if(!activeChatPartner || !activeChatPartner.publicKey) {
      console.error("Chat partner not exisst")
      return
    } 

    const encryptedData = await encryptMessage(text, encryptionKey, hexToBytes(activeChatPartner.publicKey))

    const tempUuid = crypto.randomUUID()

    const newMessage: MessageDetailForUI = {
      id: tempUuid,
      message: text,
      senderId: user.userid,
      isEdited: false,
      status: "sending",
      replyId: null,
      createdAt: formatDate((new Date()).toString())
    }

    activeChatStore.addNewMessage(newMessage)
    
    try {

      const response = await sendMessage(activeChatPartner.id, encryptedData.ciphertext, encryptedData.iv)

      if(!response.success) {
        throw Error(response.message)
      }

      const messageData = response.data
      console.log(messageData?.status)

      // update if current active chat is the same user
      if(messageData?.partnerId === activeChatPartner.id) {
        activeChatStore.updateStatusAndId(tempUuid, messageData.messageId, messageData.status)
      }

    } catch(error) {
      console.error(error)
      addToast("Fail to send Message", "error", 3000)
      activeChatStore.updateStatusAndId(tempUuid, tempUuid, "fail")
    }
  }

  return (
    <main className="hidden md:flex flex-1 flex-col bg-bg-secondary/20">
      <ChatHeader/>
      <MessageList
        isMessagesLoading={isMessagesLoading}
      />
      <ChatFooter
        chatPartner={activeChatPartner}
        onSendMesage={handleSendMessage}
      />
    </main>
  )
}