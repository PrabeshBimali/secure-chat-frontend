class ActiveChatStore {

  state: Array<Number>
  listeners: Set<() => void>

  constructor() {
    this.state = []
    this.listeners = new Set()
  }

  getSnapshot() {
    return this.state
  }

  subscribe(callback: () => void) {
    this.listeners.add(callback)

    return () => this.listeners.delete(callback)
  }
}

export const activeChatStore = new ActiveChatStore()