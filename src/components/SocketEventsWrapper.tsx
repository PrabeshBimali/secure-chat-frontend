import { useEffect } from "react"
import { useSocket } from "../context/SocketProvider"
import { useToast } from "../context/ToastProvider"
import { decryptMessagesForUI, type MessageDetail } from "../services/chatServices"
import { privateKeyStore } from "../store/PrivateKeyStore"
import { activeChatPartnerStore } from "../store/ActivePartnerStore"
import { activeChatStore } from "../store/ActiveChatStore"
import { hexToBytes } from "@noble/curves/utils.js"

export default function SocketEventsWrapper() {

  const { socket } = useSocket()
  const {addToast} = useToast()

  useEffect(() => {
    socket?.on("message_received", async (serverData) => {
      try {
        if(serverData.success) {
          console.log(serverData)
          const activePartnerData = activeChatPartnerStore.getSnapshot()
          const message: MessageDetail = serverData.data

          if(activePartnerData && activePartnerData.id === message.senderId) {
            const encryptionKey = privateKeyStore.getKey()

            //TODO: send back to login
            if(!encryptionKey) {
              throw new Error("Unauthorized")
            }
            const publickKeyBuffer = hexToBytes(activePartnerData.publicKey) 
            const messageForUI = await decryptMessagesForUI([message], encryptionKey, publickKeyBuffer)
            activeChatStore.addNewMessage(messageForUI[0])
          }
          addToast("New Message", "info", 3000)
        }

      } catch(error) {
        console.log("Error while receiving message: ", error)
      }
    })

    return () => {
      socket?.off("message")
    }
  }, [socket])

  return null
}