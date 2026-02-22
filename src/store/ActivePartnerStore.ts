import type { UserRelationshipStatusType } from "../services/chatServices"
import type { StoreListenerType } from "../types/global.interfaces"

export interface ChatPartner {
  id: number
  username: string
  friendshipStatus: UserRelationshipStatusType
  roomId: string
  publicKey: string
}

class ActivePartnerStore {

  state: ChatPartner | null
  listeners: Set<StoreListenerType>

  constructor() {
    this.state = null
    this.listeners = new Set()
  }

  subscribe = (callback: StoreListenerType) => {
    this.listeners.add(callback)
    return () => this.listeners.delete(callback)
  }

  getSnapshot = () => {
    return this.state
  }

  notifyAllListeners = () => {
    this.listeners.forEach((callback) => callback())
  }

  setState(chatPartner: ChatPartner) {
    this.state = chatPartner
    this.notifyAllListeners()
  }
}

export const activeChatPartnerStore = new ActivePartnerStore()