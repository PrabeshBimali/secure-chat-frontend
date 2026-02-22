import type { StoreListenerType } from "../types/global.interfaces"

export interface MessageDetailForUI {
  id: string
  message: string
  isEdited: boolean
  status: "sending" | "sent" | "delivered" | "read" | "failed"
  createdAt: Date
  senderId: number
  replyId: string | null
}

class ActiveChatStore {

  state: Array<MessageDetailForUI>
  listeners: Set<StoreListenerType>

  constructor() {
    this.state = []
    this.listeners = new Set()
  }

  getSnapshot = (): Array<MessageDetailForUI> => {
    return this.state
  }

  subscribe = (callback: StoreListenerType) => {
    this.listeners.add(callback)

    return () => this.listeners.delete(callback)
  }
  
  notifyAllListeners = () => {
    this.listeners.forEach((callback) => callback())
  }

  setState = (messages: Array<MessageDetailForUI>) => {
    this.state = messages
    this.notifyAllListeners()
  }

  addNewMessage = (messsagesDetail: MessageDetailForUI) => {
    this.state = [...this.state, messsagesDetail]
    this.notifyAllListeners()
  }
}

export const activeChatStore = new ActiveChatStore()