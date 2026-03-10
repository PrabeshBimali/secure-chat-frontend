import { decryptMessagesForUI } from "../../services/chatServices"

self.onmessage = async (e) => {
  if(e.data.type !== "message_decrypt") return
  const { messages, encryptionKey, publicKey } = e.data.payload

  const result = await decryptMessagesForUI(messages, encryptionKey, publicKey)

  self.postMessage(result)
}