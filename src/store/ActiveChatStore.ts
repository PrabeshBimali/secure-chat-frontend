import type { StoreListenerType } from "../types/global.interfaces"

export interface MessageDetailForUI {
  id: string
  message: string
  isEdited: boolean
  status: "sending" | "sent" | "delivered" | "read" | "fail"
  createdAt: string
  senderId: number
  replyId: string | null
}

/*
  We can use record for faster lookup when updating values
  This can be done if there are many users and app feels sluggish
*/
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

  updateStatusAndId = (tempid: string, id: string, status: "sent" | "delivered" | "read" | "fail") => {
    const updatedMessages = this.state.map((messageDetail) => {
      return messageDetail.id === tempid ? {...messageDetail, status: status, id: id} : messageDetail
    })
    this.state = updatedMessages
    this.notifyAllListeners()
  }
}

export const activeChatStore = new ActiveChatStore()